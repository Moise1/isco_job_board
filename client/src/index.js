import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import Root from './Root';
import { Provider, useSelector } from "react-redux";
import { store } from "./redux/store";
import TopBar from './components/Topbar';


const AppWrapper = () => {
  const {user} = useSelector((state) => state.users);

  return (
    <>
      {user && <TopBar />}
      <Root />
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <AppWrapper />
    </React.StrictMode>
  </Provider>
);



