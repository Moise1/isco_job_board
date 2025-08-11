import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import Root from './Root';
import { Provider } from "react-redux";
import { store } from "./redux/store";
import TopBar from './components/Topbar';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <TopBar />
      <Root />
    </React.StrictMode>
  </Provider>
);



