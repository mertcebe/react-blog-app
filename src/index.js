import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import AppRouter from './routers/AppRouter';


const root = ReactDOM.createRoot(document.getElementById('root'));

const result = (
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);

const renderApp = () => {
  return result;
}

root.render(
  renderApp()
);


reportWebVitals();
