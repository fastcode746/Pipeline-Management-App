import { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  FormControl, 
  Select, 
  MenuItem, 
  IconButton,
  Tooltip,
  Card,
  CardContent
} from '@mui/material';
import {
  InfoOutlined as InfoIcon,
  GetApp as DownloadIcon,
  BarChart as BarChartIcon,
  ShowChart as LineChartIcon,
  PieChart as PieChartIcon,
  Fullscreen as FullscreenIcon
} from '@mui/icons-material';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

// Sample data for chart
const sampleData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6565', '#74B9FF'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Card sx={{ boxShadow: 2, p: 1, bgcolor: 'rgba(255, 255, 255, 0.9)' }}>
        <CardContent sx={{ p: 1 }}>
          <Typography variant="body2" color="text.secondary">{label}</Typography>
          <Typography variant="body1" color="text.primary" fontWeight="bold">
            {payload[0].value.toLocaleString()}
          </Typography>
        </CardContent>
      </Card>
    );
  }
  return null;
};

const PieCustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <Card sx={{ boxShadow: 2, p: 1, bgcolor: 'rgba(255, 255, 255, 0.9)' }}>
        <CardContent sx={{ p: 1 }}>
          <Typography variant="body2" color="text.secondary">{payload[0].name}</Typography>
          <Typography variant="body1" color="text.primary" fontWeight="bold">
            {payload[0].value.toLocaleString()}
          </Typography>
        </CardContent>
      </Card>
    );
  }
  return null;
};

const Chart = ({ 
  title = 'Chart Title',
  description = 'Chart description goes here',
  data = sampleData,
  dataKey = 'value',
  xAxisKey = 'name',
  height = 300,
  colors = COLORS
}) => {
  const [chartType, setChartType] = useState('bar');
  const [showInfo, setShowInfo] = useState(false);

  const handleChartTypeChange = (event) => {
    setChartType(event.target.value);
  };

  const handleDownload = () => {
    // In a real implementation, this would generate and download 
    // an image of the chart using html-to-image or similar library
    alert('Chart download functionality would be implemented here');
  };

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey={xAxisKey} />
              <YAxis />
              <RechartsTooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey={dataKey} 
                stroke={colors[0]} 
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={height / 3}
                fill="#8884d8"
                dataKey={dataKey}
                nameKey={xAxisKey}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <RechartsTooltip content={<PieCustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      case 'bar':
      default:
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey={xAxisKey} />
              <YAxis />
              <RechartsTooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey={dataKey} fill={colors[0]} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  const getChartTypeIcon = () => {
    switch (chartType) {
      case 'line': return <LineChartIcon />;
      case 'pie': return <PieChartIcon />;
      case 'bar': default: return <BarChartIcon />;
    }
  };

  return (
    <Paper 
      elevation={1} 
      sx={{ 
        borderRadius: 2, 
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {getChartTypeIcon()}
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={chartType}
              onChange={handleChartTypeChange}
              displayEmpty
              variant="outlined"
            >
              <MenuItem value="bar">Bar Chart</MenuItem>
              <MenuItem value="line">Line Chart</MenuItem>
              <MenuItem value="pie">Pie Chart</MenuItem>
            </Select>
          </FormControl>
          <Tooltip title="Chart Info">
            <IconButton 
              size="small" 
              onClick={() => setShowInfo(!showInfo)}
              color={showInfo ? "primary" : "default"}
            >
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download Chart">
            <IconButton size="small" onClick={handleDownload}>
              <DownloadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Fullscreen">
            <IconButton size="small">
              <FullscreenIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      {showInfo && (
        <Box sx={{ px: 2, py: 1, bgcolor: 'info.light', color: 'info.contrastText' }}>
          <Typography variant="body2">{description}</Typography>
        </Box>
      )}
      
      <Box sx={{ p: 2, flexGrow: 1, display: 'flex', alignItems: 'center' }}>
        {renderChart()}
      </Box>
    </Paper>
  );
};

export default Chart;