import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"

export const ChatContext =  createContext("");

export const ChatProvider = ({ children }) => {

const [user, setUser] = useState({});
const [selectedChat, setSelectedChat] = useState();
const [chats, setChats] = useState()
const [notification, setNotification] = useState([])
const navigate = useNavigate();
const [onlineChats, setOnlineChats] = useState([])
useEffect(() => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"))||{};
setUser(userInfo);
  if (!userInfo) {
    navigate("/")
  }
}, []);

return (<ChatContext.Provider value={{ user, setUser,selectedChat,setSelectedChat,chats,setChats, notification, setNotification, onlineChats, setOnlineChats }}>

        {children}

    </ChatContext.Provider>)

};

export const useChatContext = () => useContext(ChatContext);



