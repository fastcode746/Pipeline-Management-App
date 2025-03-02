/**
 * This service provides a JavaScript implementation of the Python model functionality.
 * For a frontend-only application, we're simulating the model's behavior rather than
 * calling a Python backend.
 */

// Simulate analyzing an uploaded file
export const analyzeUploadedFile = async (filename) => {
    // In a real app, this would send the file to a backend API
    // Here we'll just return mock results based on the filename
    
    // Create a deterministic but seemingly random result based on the filename
    const hash = simpleHash(filename);
    
    return {
      predictions: {
        train: generateMockData(10, hash, 5, 15),
        test: generateMockData(5, hash + 1, 5, 15)
      },
      metrics: {
        train_rmse: (2 + (hash % 5)) / 10,
        EA: {
          Max: 0.7 + (hash % 30) / 100,
          Min: 0.6 + (hash % 40) / 100
        },
        train_r2: 0.8 + (hash % 20) / 100,
        accuracy: 85 + (hash % 15)
      },
      graphs: {
        gas_flow: "base64_encoded_image_data_would_be_here_in_real_app",
        water_flow: "base64_encoded_image_data_would_be_here_in_real_app",
        oil_flow: "base64_encoded_image_data_would_be_here_in_real_app",
        length: "base64_encoded_image_data_would_be_here_in_real_app",
        diameter: "base64_encoded_image_data_would_be_here_in_real_app"
      }
    };
  };
  
  // Simulate analyzing manually entered data
  export const analyzeManualData = async (data) => {
    // In a real app, this would send the data to a backend API
    // Here we'll just return mock results based on the input data
    
    // Create a deterministic but seemingly random result based on the input values
    const hash = Math.floor(
      Object.values(data).reduce((acc, val) => acc + Number(val), 0) * 100
    );
    
    return {
      predictions: {
        train: generateMockData(10, hash, 5, 15),
        test: generateMockData(5, hash + 1, 5, 15)
      },
      metrics: {
        train_rmse: (2 + (hash % 5)) / 10,
        EA: {
          Max: 0.7 + (hash % 30) / 100,
          Min: 0.6 + (hash % 40) / 100
        },
        train_r2: 0.8 + (hash % 20) / 100,
        accuracy: 85 + (hash % 15)
      },
      graphs: {
        gas_flow: "base64_encoded_image_data_would_be_here_in_real_app",
        water_flow: "base64_encoded_image_data_would_be_here_in_real_app",
        oil_flow: "base64_encoded_image_data_would_be_here_in_real_app",
        length: "base64_encoded_image_data_would_be_here_in_real_app",
        diameter: "base64_encoded_image_data_would_be_here_in_real_app"
      }
    };
  };
  
  // Get all analysis records from localStorage
  export const getAllAnalysisRecords = () => {
    try {
      const records = JSON.parse(localStorage.getItem('analysisRecords') || '[]');
      return records;
    } catch (error) {
      console.error('Error getting analysis records:', error);
      return [];
    }
  };
  
  // Get a specific analysis record by ID
  export const getAnalysisById = (id) => {
    try {
      const records = getAllAnalysisRecords();
      return records.find(record => record.id === id) || null;
    } catch (error) {
      console.error('Error getting analysis record:', error);
      return null;
    }
  };
  
  // Delete an analysis record
  export const deleteAnalysisRecord = (id) => {
    try {
      const records = getAllAnalysisRecords();
      const updatedRecords = records.filter(record => record.id !== id);
      localStorage.setItem('analysisRecords', JSON.stringify(updatedRecords));
      return true;
    } catch (error) {
      console.error('Error deleting analysis record:', error);
      return false;
    }
  };
  
  // Helper function: Simple string hash function for generating deterministic random values
  function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }
  
  // Helper function: Generate mock array data
  function generateMockData(length, seed, min, max) {
    const result = [];
    for (let i = 0; i < length; i++) {
      // Create a deterministic but seemingly random number
      const randomValue = min + ((seed + i) % (max - min));
      result.push([randomValue]);
    }
    return result;
  }