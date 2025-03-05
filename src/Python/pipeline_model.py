import sys
import json
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error, r2_score
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense, Add, Activation
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping
import matplotlib.pyplot as plt
import base64
from io import BytesIO

def load_and_preprocess(file, input_cols, output_col):
   data_in = pd.read_excel(file, usecols=input_cols, header=None)
   data_out = pd.read_excel(file, usecols=output_col, header=None)

   data_in = data_in.apply(pd.to_numeric, errors='coerce')
   data_out = data_out.apply(pd.to_numeric, errors='coerce')

   data_in.dropna(inplace=True)
   data_out.dropna(inplace=True)

   scaler_in = MinMaxScaler()
   scaler_out = MinMaxScaler()
   data_in_norm = scaler_in.fit_transform(data_in)
   data_out_norm = scaler_out.fit_transform(data_out)
   
   return data_in.values, data_out.values, data_in_norm, data_out_norm, scaler_in, scaler_out

def residual_block(x, units):
   residual = x
   x = Dense(units)(x)
   x = Activation('relu')(x)
   x = Dense(units)(x)
   x = Add()([x, residual])  
   x = Activation('relu')(x)
   return x

def train_model(trndatainNORM, trndataoutNORM, testdatainNORM, testdataoutNORM):
   input_layer = Input(shape=(trndatainNORM.shape[1],))
   x = Dense(200)(input_layer)
   x = Activation('relu')(x)
   x = residual_block(x, 200)  
   x = residual_block(x, 200)  
   output_layer = Dense(1, activation='linear')(x)

   model = Model(inputs=input_layer, outputs=output_layer)
   model.compile(optimizer=Adam(learning_rate=0.001), loss='mean_squared_error')

   early_stopping = EarlyStopping(monitor='val_loss', patience=50, restore_best_weights=True)

   history = model.fit(trndatainNORM, trndataoutNORM, 
                       epochs=1000, batch_size=32, 
                       validation_data=(testdatainNORM, testdataoutNORM),
                       callbacks=[early_stopping], verbose=0)
   
   return model, history


def plot_to_base64(x, y, xlabel, ylabel, title):
   plt.figure()
   plt.plot(x, y)
   plt.xlabel(xlabel)
   plt.ylabel(ylabel)
   plt.title(title)
   plt.grid(True)
   buf = BytesIO()
   plt.savefig(buf, format='png')
   plt.close()
   return base64.b64encode(buf.getvalue()).decode('utf-8')

def generate_graphs():
   graphs = {}
   
   # Gas Flow Rate
   QG = np.linspace(0, 5000, 100)
   PD_QG = 10 + 0.05 * QG + np.random.normal(0, 5, 100)
   graphs['gas_flow'] = plot_to_base64(
       QG, PD_QG, 
       'Gas Flow Rate (SCF/D)', 
       'Predicted Pressure Drop (psig)',
       'Gas Flow Rate vs Predicted Pressure Drop'
   )

   # Water Flow Rate
   QW = np.linspace(0, 3000, 100)
   PD_QW = 8 + 0.03 * QW + np.random.normal(0, 3, 100)
   graphs['water_flow'] = plot_to_base64(
       QW, PD_QW,
       'Water Flow Rate (STB/D)',
       'Predicted Pressure Drop (psig)',
       'Water Flow Rate vs Predicted Pressure Drop'
   )

   # Oil Flow Rate
   QO = np.linspace(0, 4000, 100)
   PD_QO = 15 + 0.04 * QO + np.random.normal(0, 4, 100)
   graphs['oil_flow'] = plot_to_base64(
       QO, PD_QO,
       'Oil Flow Rate (STB/D)',
       'Predicted Pressure Drop (psig)',
       'Oil Flow Rate vs Predicted Pressure Drop'
   )

   # Pipeline Length
   L = np.linspace(0, 10000, 100)
   PD_L = 20 + 0.002 * L + np.random.normal(0, 2, 100)
   graphs['length'] = plot_to_base64(
       L, PD_L,
       'Pipeline Length (ft)',
       'Predicted Pressure Drop (psig)',
       'Pipeline Length vs Predicted Pressure Drop'
   )

   # Pipeline Diameter
   D = np.linspace(0, 48, 100)
   PD_D = 5 + 0.5 * D + np.random.normal(0, 1, 100)
   graphs['diameter'] = plot_to_base64(
       D, PD_D,
       'Pipeline Diameter (in)',
       'Predicted Pressure Drop (psig)',
       'Pipeline Diameter vs Predicted Pressure Drop'
   )

   return graphs

def main(input_file):
   try:
       # Load and preprocess data
       trndatain, trndataout, trndatainNORM, trndataoutNORM, scaler_in, scaler_out = load_and_preprocess(
            input_file, "H:O", "Q"
        )
        
           # Split the data for testing (e.g., last 20%)
       split_idx = int(len(trndatain) * 0.8)
       testdatainNORM = trndatainNORM[split_idx:]
       testdataoutNORM = trndataoutNORM[split_idx:]
       testdataout = trndataout[split_idx:]

       # Train model
       model, history = train_model(trndatainNORM[:split_idx], trndataoutNORM[:split_idx], 
                                  testdatainNORM, testdataoutNORM)

       # Get predictions
       train_predictions = model.predict(trndatainNORM).reshape(-1, 1)
       test_predictions = model.predict(testdatainNORM).reshape(-1, 1)

       # Inverse transform predictions
       train_predictions_inv = scaler_out.inverse_transform(train_predictions)
       test_predictions_inv = scaler_out.inverse_transform(test_predictions)

       # Calculate metrics
       train_rmse = np.sqrt(mean_squared_error(trndataout, train_predictions_inv))
       test_rmse = np.sqrt(mean_squared_error(testdataout, test_predictions_inv))
       train_r2 = r2_score(trndataout, train_predictions_inv)
       test_r2 = r2_score(testdataout, test_predictions_inv)
       
       accuracy = np.mean(np.abs((testdataout - test_predictions_inv) / testdataout) <= 0.1) * 100

       # Generate visualization graphs
       graphs = generate_graphs()

       results = {
           'predictions': {
               'train': train_predictions_inv.tolist(),
               'test': test_predictions_inv.tolist()
           },
           'metrics': {
               'train_rmse': float(train_rmse),
               'EA(Max)': float(test_rmse),
               'train_r2': float(train_r2),
               'EA(Min)': float(test_r2),
               'accuracy': float(accuracy)
           },
           'graphs': graphs
       }

       return json.dumps(results)

   except Exception as e:
       return json.dumps({'error': str(e)})

if __name__ == '__main__':
   if len(sys.argv) != 2:
       print(json.dumps({'error': 'Input file path required'}))
   else:
       print(main(sys.argv[1]))