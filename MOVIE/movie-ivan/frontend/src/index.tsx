import { GeminiProvider } from '@gemini/core';
import { AVIV_THEME } from '@gemini/tokens';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import App from './App';
import store, { persistor } from './config/store';
import reportWebVitals from './reportWebVitals';

import './index.css';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <GeminiProvider theme={AVIV_THEME}>
            <App />
          </GeminiProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();