import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter } from 'react-router-dom';

// import { AxiosProvider } from './context/AxiosProvider';
// import { AuthProvider } from './context/AuthContext';
import { AppRoutes } from './flows/routes';
import { WSProvider } from './context/WsContext';

const App: React.FC = function () {
  const theme = createTheme();

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <WSProvider>
          <AppRoutes />
        </WSProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
