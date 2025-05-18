import React, { createContext, useContext, useEffect, useState,useRef } from 'react';
import { io } from 'socket.io-client';
import { appendSocketMessage,appendSocketMessagePatient,appendToNotificationMessage } from "../containers/Message/ChatSlice"
import { useDispatch, useSelector } from 'react-redux';
import { SOCKET_IO_ORIGIN } from '../configs';
import toast from 'react-hot-toast'; 
const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const  {role,name,id} = useSelector((state)=>state.login)
    const { selectedConversation } = useSelector((state) => state.chat)

    const selectedConversationRef = useRef(selectedConversation);

    useEffect(() => {
        selectedConversationRef.current = selectedConversation;
    }, [selectedConversation]);


    const dispatch = useDispatch()
    useEffect(() => {
      const newSocket = io(SOCKET_IO_ORIGIN);
      setSocket(newSocket);
      newSocket.emit(`register-user-${id}`);
    
      const handleNotification = (notification) => {
        console.log(notification)
      }

      const handleMessageNotification = (notification) => {
        const currentConversation = selectedConversationRef.current;
        if((role==="Admin" && notification.to === "admin") || (role==="Patient" && notification.to !== "admin"))
        {
            toast(notification.content)
            if((role==="Admin" && currentConversation?._id !==notification.patientId))
            {
                dispatch(appendToNotificationMessage(notification.patientId))
            }else if ((role==="Patient" && currentConversation===null ))
            {
                dispatch(appendToNotificationMessage(notification.patientId))
            }
        }
        };
      newSocket.on("send-notification", handleMessageNotification)
      newSocket.on("new-notification", handleNotification)
      
      return () => {
        newSocket.disconnect();
      };
    }, [dispatch,role]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    return useContext(SocketContext);
};