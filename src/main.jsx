import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css';
import './style/custom.css';
import Home from './components/Home'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Home />
    <ToastContainer position="top-right" autoClose={1500} closeButton={true} closeOnClick={true} rtl={true} />
  </React.StrictMode>,
)