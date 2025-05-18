import * as React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    BrowserRouter, Route, Routes,Navigate,useLocation 
} from "react-router-dom";
import { routes } from '../../containers/routes';
import BaseLayout from "../BaseLayout/BaseLayout";
import Document from '../../containers/Document/Document';
import io from 'socket.io-client';

function BaseApp(props) {
    const dispatch = useDispatch()
    const {role} = useSelector((state)=>state.login)
    const { dir, otherActionButtons } = props

    const location = useLocation();
    
    useEffect(() => {
        // Store the current path in localStorage
        localStorage.setItem('lastPath', location.pathname);
      }, [location]);

    return <BaseLayout
            dir={dir}
            otherActionButtons={otherActionButtons}
            links={routes.filter((item)=> (item.role === "Any" || item.role === role) && item?.notFor !== role).map((route) => ({ title: route.title, icon: route.icon, path: route.path }))}
            onLogoutClicked={() => {
                //dispatch(logout())
            }}>
            <Routes>
                {routes.filter((item)=> (item.role === "Any" || item.role === role) && item?.notFor !== role).map((route, index) => (
                    <Route
                        key={index}
                        path={route.path}
                        exact={route.exact}
                        element={route.component}
                    />

                ))}
                <Route path='/document/:document_id' element={<Document isMedical={false}/>} />
                <Route path='/document-doctor/:document_id' element={<Document isMedical={true}/>} />
                {role === "Admin" && <Route path="*" element={<Navigate to={localStorage.getItem('lastPath') || "/dashboard"} />} />}
                {role !== "Admin" && <Route path="*" element={<Navigate to={localStorage.getItem('lastPath') || "/profile"} />} />}

            </Routes>
        </BaseLayout>
}

export default BaseApp