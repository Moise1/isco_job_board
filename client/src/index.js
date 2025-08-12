import React from 'react';
import ReactDOM from 'react-dom/client';
import Root from './Root';
import { Provider, useSelector } from "react-redux";
import { store } from "./redux/store";
import TopBar from './components/Topbar';
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './index.css';



const AppWrapper = () => {

  const {user} = useSelector((state) => state.users);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {user && <TopBar />}
      <Root />
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <BrowserRouter>
        <AppWrapper />
      </BrowserRouter>
    </React.StrictMode>
  </Provider>
);



