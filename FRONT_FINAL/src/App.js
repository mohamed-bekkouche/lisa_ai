import {  useSelector } from "react-redux";


import logo from './logo.svg';

import './App.css';

import Login from './containers/Login/Login';
import Signup from "./containers/Login/SignUp";
import ActivateAcount from "./containers/Login/ActivateAcount";
import ForgetPassword from "./containers/Login/ForgetPassword";
import ResetPassword from "./containers/Login/ResetPassword";
import BaseApp from "./components/BaseApp/BaseApp";
import Home from "./containers/Login/Home";
import Contact from "./containers/Login/Contact";

import {Notification} from "./containers/Notification/Notification";
import ChatBadge from "./containers/Message/Components/ChatBadge/ChatBadge";
import i18n from "./helpers/i18n";
import { Toaster } from "react-hot-toast";
import {
    BrowserRouter, Route, Routes,Redirect,
    useNavigate,Navigate
} from "react-router-dom";
import { useEffect, useState } from "react";
import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import theme from "./theme"

import { autoLogin } from "./containers/Login/LoginSlice";
import { useDispatch } from "react-redux";

import { SocketProvider } from "./helpers/socket";

function NotFound()
{
  const navigate = useNavigate()

  return(
    navigate("/login")
  )
}

function App() {
  const {mode,isAuthenticated,} = useSelector((state) => state.login)

    const dispatch = useDispatch()
    const [loginPage,setLoginPage]  = useState(false)
    useEffect(() => {
      i18n.changeLanguage(localStorage.getItem("locale"))
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
    
      if (token){
        dispatch(autoLogin(token,user))
        setLoginPage(false)
      }else{
        setLoginPage(true)
      }

  }, [])

  return (

    <div className="App">
      <ThemeProvider theme={theme}>
        <SocketProvider>
          <BrowserRouter>
              {!isAuthenticated &&
                <Routes>
                    <Route path="/activate-account/:token" Component={ActivateAcount} />
                    <Route path="/login" Component={Login} />
                    <Route path="/home" Component={Home} />
                    <Route path="/contact" Component={Contact} />
                    <Route path="/signup" Component={Signup} />
                    <Route path="/forget-password" Component={ForgetPassword} />
                    <Route path="/reset-password/:token" Component={ResetPassword}/>
                    {loginPage &&
                    <Route path="*" element={<Navigate to="/home"/>}/>
                    }
                </Routes>
              }
            {isAuthenticated && <BaseApp otherActionButtons={[<Notification/>,<ChatBadge/>]}/>}
          </BrowserRouter>

          <Toaster position="botton-left" />
        </SocketProvider>

      </ThemeProvider>
    </div>
  );
}

export default App;
