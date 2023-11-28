import { Box } from "@chakra-ui/react";
import SlideDrawer from "../miscellaneous/SlideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";
import { useChatContext } from "../context/ChatProvider";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const Chatpage = () => {
  const {user}  = useChatContext();
  const [fetchAgain, setFetchAgain] = useState(false)
  const navigate = useNavigate()
  useEffect(()=>{
    if(!user) navigate("/")


  },[user])
  return (
    
    <div style={{ width:"100%"}}>
    
      {user && <SlideDrawer/>}
      {user && 
      <Box
      display="flex"
      justifyContent="space-between"
      w="100%"
      h="91.5vh"
      p="10px"
      >
         {user && <MyChats fetchAgain={fetchAgain}/>}
          {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      </Box>
      }
    </div>
  )
}

export default Chatpage