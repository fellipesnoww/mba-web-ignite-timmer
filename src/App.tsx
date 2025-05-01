import { ThemeProvider } from 'styled-components';
import { defaultTheme } from './styles/themes/default';
import { GlobalStyle } from './styles/themes/global';
import { Router } from './Router';
import { BrowserRouter } from 'react-router-dom';
import { CycleContextProvider } from './context/CycleContext';

export function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      
        <BrowserRouter>
          <GlobalStyle />
          <CycleContextProvider>
            <Router />
          </CycleContextProvider>
        </BrowserRouter>
    </ThemeProvider>
  );
}
