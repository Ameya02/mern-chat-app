import { useChatContext } from '../context/ChatProvider'
import { Avatar, Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {  BsPlus } from 'react-icons/bs';
import ChatLoading from './ChatLoading';
import { getLatestMessageSender, getSender, getSenderAvatar } from '../config/ChatLogics';
import GroupChatModal from '../miscellaneous/GroupChatModal';

const MyChats = ({ fetchAgain }) => {
  const { selectedChat, setSelectedChat,user,chats,setChats} = useChatContext();
const [loggedUser, setLoggedUser] = useState();
const toast = useToast()
useEffect(()=> {
  setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
  fetchChats();
  
}, [fetchAgain])

const fetchChats = async () => {
  try {
    const config = {
      headers:{
          Authorization: `Bearer ${user.token}`,

      },
  };
  const { data} = await axios.get(`/api/chat`,config);
  setChats(data);
  } catch (error) {
    toast({
      title:"Error Occured!",
      description: "Failed to loads the chats",
      status:"error",
      duration:1000,
      isClosable:true,
      position:"top-left"
  })
  }

}


  return (
    <Box
    display={{base:selectedChat?"none":"flex", md:"flex"}}
    flexDir="column"
    alignItems="center"
    p={3}
    bg="white"
    w={{base:"100%", md:"31%"}}
    borderRadius="lg"
    borderWidth="1px"
    >
<Box
pb={3}
px={3}
fontSize={{base:"20px",md:"20px"}}
fontFamily="Work sans"
display="flex"
w="100%"
justifyContent="space-between"
alignItems="center"
>
My Chats
<GroupChatModal>
<Button
display="flex"
fontSize={{base:"17px", md:"10px", lg:"17px"}}
rightIcon={<BsPlus/>}
>New Group Chat</Button>
</GroupChatModal>

</Box>
<Box display="flex" 
flexDir="column"
p={3}
bg="#F8F8F8F8"
w="100%"
h="80%"
borderRadius="md"
overflowY="hidden"

>
{chats ? (
<Stack overflowY="scroll">
  {chats.map((chat)=> (
    <Box
    onClick={() => setSelectedChat(chat)}
    cursor="pointer"
    bg={selectedChat===chat?"#38B2AC":"#E8E8E8"}
    color={selectedChat===chat?"white":"black"}
    width="100%"
    height="70%"
    px={3}
    py={1}
    borderRadius="lg"
    key={chat._id}
    
    >
    <Box display="flex" flexWrap="wrap-reverse" py={2}>
    <div>
    <Avatar size="sm" src={!chat.isGroupChat?getSenderAvatar(loggedUser,chat.users):chat.chatName} />
    </div>
    <div style={{position:"relative"}}>
<Text fontSize="sm" px={2} paddingEnd={10}>{!chat.isGroupChat?getSender(loggedUser,chat.users):chat.chatName}</Text>
<Text fontSize="sm" paddingTop={1} marginLeft={2}>
{chat.isGroupChat?getLatestMessageSender(chat.latestMessage)!==user.name?getLatestMessageSender(chat.latestMessage)+": ":"You: ":""}

{chat.latestMessage.content && chat.latestMessage.content}
</Text>
</div>
</Box>

    </Box>
  ))

  }
</Stack>
): (
  <>
  <ChatLoading />

 
  
  </>
)}

</Box>
    </Box>
  )
}

export default MyChats