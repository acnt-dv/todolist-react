import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css';
import './style/custom.css';
import Home from './components/Home'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>,
)