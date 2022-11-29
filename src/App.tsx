import React from 'react';
import './assets/reset.css';
import './assets/common.css';
import { Provider } from 'react-redux'
import store from './store';
import ToastContainer from './components/toast';
import Accounts from './components/account';

import Home from './views/home';

function App() {
  
  return (
    <React.StrictMode>
      <Provider store={ store }>
        <Home></Home>
        <ToastContainer></ToastContainer>
        <Accounts></Accounts>
      </Provider>
    </React.StrictMode>
  )
}

export default App
