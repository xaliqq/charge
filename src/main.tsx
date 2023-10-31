import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ChakraProvider, ColorModeProvider } from '@chakra-ui/react';
import { ToastContainer } from 'react-toastify';
import App from './App';
import globalTheme from './configs/globalTheme';
import { store } from './redux/store'; import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
  <Provider store={store}>
    <ChakraProvider theme={globalTheme}>
      <ColorModeProvider
        options={{
          initialColorMode: 'light',
          useSystemColorMode: false
        }}
      >
        <BrowserRouter>
          <App />
          <ToastContainer />

        </BrowserRouter>
      </ColorModeProvider>
    </ChakraProvider>
  </Provider>
  // </React.StrictMode>,
);
