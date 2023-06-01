import { useChatContext } from '../context/ChatProvider'
import { Box, Button, FormControl, FormLabel, IconButton, Input, Spinner, Text, VisuallyHidden, VisuallyHiddenInput, useToast } from '@chakra-ui/react'
import { BsFillArrowLeftSquareFill } from 'react-icons/bs'
import { getSender, getSenderF, getSenderStatus } from '../config/ChatLogics'
import {TfiClip} from "react-icons/tfi"
import ProfileModal from '../miscellaneous/ProfileModal'
import UpdateGroupChatModal from '../miscellaneous/UpdateGroupChatModal'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Player } from "@lottiefiles/react-lottie-player"
import "../styles.css"
import ScrollableChat from './ScrollableChat'
import io  from "socket.io-client"
const ENDPOINT = "http://localhost:3001";
var socket, selectedChatCompare;
const SingleChat = ({fetchAgain, setFetchAgain}) => {
    const toast = useToast()
const [socketConnected, setSocketConnected] = useState(false)
const [typing, setTyping] = useState(false)
const [isTyping, setIsTyping] = useState(false)
window.addEventListener("beforeunload",(e)=> {
    e.preventDefault();
    const config = {
        headers : {
            "Content-Type":"application/json",
            Authorization:`Bearer ${user.token}`,
        },
    };
    axios.put("/api/user/status",{
        userId:user._id,
        status:false,
    },config)
})



    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState();
    const {user, selectedChat, setSelectedChat} = useChatContext();
    const [connectedChat, setConnectedChat] = useState("")
    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    },[selectedChat]);
    
    useEffect(()=> {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connection", () => {setSocketConnected(true)
            const config = {
                headers : {
                    "Content-Type":"application/json",
                    Authorization:`Bearer ${user.token}`,
                },
            };
            axios.put("/api/user/status",{
                userId: user._id,
                status: true
            },config);
        })
        socket.on("typing",()=> setIsTyping(true))
        socket.on("stop typing", () => setIsTyping(false));
        
    }, []);
    useEffect(()=>{
        socket.on("message recieved",(newMessage) => {
            if(!selectedChatCompare ||
            selectedChatCompare._id !== newMessage.chat._id
            )
            {
                    setFetchAgain(!fetchAgain);
            }
            else {
                setMessages([...messages,newMessage])
            }

        })
    },[newMessage])
    

    const sendMessage = async(e) => {
        if(e.key==="Enter" && newMessage)
        {
            socket.on("stop typing", () => setIsTyping(false))
            try {
                const config = {
                    headers : {
                        "Content-Type":"application/json",
                        Authorization:`Bearer ${user.token}`,
                    },
                };
                setNewMessage("")

const {data} = await axios.post("/api/message",{
    content:newMessage,
    chatId:selectedChat._id,
},
config
)
socket.emit("new message",data)
setMessages([...messages,data])


            } catch (error) {
                toast({
                    title:"Error",
                    description:"Failed to sent message",
                    status:"error",
                    duration:1000,
                    isClosable:true,
                    position:"bottom"
                })
            }
        }


    }
const typingHandler = (e) => {

    setNewMessage(e.target.value)


    if(!socketConnected) return;

    if(!typing)
    {
        if(selectedChat._id!==connectedChat._id) return;
        setTyping(true);
        socket.emit("typing", selectedChat._id)
    }

    let lastTypingTime = new Date().getTime();
    var TimeLength = 3000;
    setTimeout(()=> {
        var timeNow = new Date().getTime();
        var timeDiff = timeNow - lastTypingTime;
        if(timeDiff>= TimeLength && typing)
        {
            socket.emit("stop typing", selectedChat._id)
            setTyping(false)
        }
    }, TimeLength)


 }

const fetchMessages = async() => {
    if(!selectedChat) return;
    try {
        const config = {
            headers : {
                Authorization:`Bearer ${user.token}`,
            },
        };
setLoading(true);
const {data} = await axios.get(`/api/message/${selectedChat._id}`,
config
)

setMessages(data);
setLoading(false);

socket.emit("join", selectedChat._id)
setConnectedChat(selectedChat)


    } catch (error) {
        toast({
            title:"Error",
            description:"Failed to load Messages",
            status:"error",
            duration:1000,
            isClosable:true,
            position:"bottom"
        })
    }
}


const sendFileMessage =  async (file) => {
    if(!file) return ;
        const ext = file.name.split(".")

        console.log(ext)
        const newFile = await new File([file], "mern_"+Date.now()+"."+ext[1])
      
          console.log(newFile)
        
    
    try {
        const config = {
            headers : {
                "Content-Type":"application/json",
                Authorization:`Bearer ${user.token}`,
            },
        };

const {data} = await axios.post("/api/message/file",{
file:newFile,
chatId:selectedChat._id,
},
config
)
    }
catch (error) {
    toast({
        title:"Error",
        description:error.message,
        status:"error",
        duration:5000,
        isClosable:true,
        position:"bottom"
    })
}
}


    return (
        selectedChat ? (
            <>
    <Text
    fontSize={{base:"20px", md:"30px"}}
    pb={3}
    px={2}
    width="100%"
    fontFamily="Work sans"
    display="flex"
    justifyContent={{base:"space-between"}}
    alignItems="center">
    <IconButton
    display={{base:"flex", md:"none"}}
    icon={<BsFillArrowLeftSquareFill />}
    onClick={() => {setSelectedChat("")}}/>
    {!selectedChat.isGroupChat ? (<>
    {
    getSender(user, selectedChat.users) 
    }
    <Text colorScheme="green">{getSenderStatus(user, selectedChat.users)?"Online":"Not Seen for a long time"}</Text>
    <ProfileModal user={getSenderF(user,selectedChat.users)} />

        </>):(
    <>
    {
        selectedChat.chatName.toUpperCase()
      
    }
      {<UpdateGroupChatModal fetchAgian={fetchAgain} setFetchAgain={setFetchAgain} />}
    </>
)}
</Text>
<Box
display="flex"
flexDir="column"
justifyContent="flex-end"
p={3}
bg="#E8E8E8"
w="100%"
h="100%"
borderRadius="lg"
overflowY="hidden"

>   
<>
{loading?(
    <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />
):(
    
    <div className='messages'>

        <ScrollableChat messages={messages} />
    </div>
    
)}
<FormControl onKeyDown={(sendMessage)} isRequired mt={3}>
{isTyping ?(
    <div>
    <Player
  autoplay
  loop
  src="https://assets10.lottiefiles.com/packages/lf20_nZBVpi.json"
  style={{width:70, marginBottom:15,marginLeft:0}}
/>
    </div>
):<></>}
<Input
variant="filled"
bg="#E0E0E0"
placeholder='Enter a message.....'
onChange={typingHandler}
value={newMessage}
width="92.7%"
 />
 <label htmlFor="file-upload">
<VisuallyHidden>
<Input  bg="#E0E0E0" type='file' id='file-upload'  
onChange={(e)=>{
    sendFileMessage(e.target.files[0]);}}

/>
</VisuallyHidden>

        <Button width="0.9%" margin="0.4" padding="1" as="label" htmlFor='file-upload' bg="#E0E0E0"  leftIcon={<TfiClip />} />
      </label>

</FormControl>
</>

</Box>

            </>):(
                <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                h="100%"
                
                >
<Text fontSize="3xl" pb={3} fontFamily="Work sans">
    Click on a user or group to start chatting
</Text>
                </Box>
            )
        )
  
}

export default SingleChat