import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import { useState } from 'react'
import {BsEye,BsEyeSlash} from "react-icons/bs"
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import { useChatContext } from '../../context/ChatProvider'
const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const toast = useToast();
    const {onlineChats, setOnlineChats} = useChatContext();
    const showPassword = () => {
        setShow((prev)=>!prev)
    }
    const login = async () => {
        setLoading(true);
        if(!email || !password) {
            toast({
                title:"Please fill all the Fields",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:"bottom",
            });
            setLoading(false);
            return;
        }

try {
    const config = {
        headers: {
            "Context-type":"application/json",

        },
    };
        const { data } = await axios.post(
            "/api/user/login",
            {
                email,password},
            config
        );
        toast({
            title: 'login Succesful',
            status: 'success',
            duration: 2000,
            isClosable: true,
            position:"bottom"
          });

          localStorage.setItem("userInfo",JSON.stringify(data));
          
          setLoading(false);
         navigate("/chats")
     }
     catch(error) {
        toast({
            title:"Error Occured!",
            description: error.response.data.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
            position:"bottom",
        });
        setLoading(false);
        return;

     }
    }
    const guestLogin = () => {
        setEmail("guest@guestLogin.com")
        setPassword("Guest123")
    }
  return (
    <VStack spacing="5px">
         <FormControl id="Email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
            value={email}
            placeholder="Enter your email"
            onChange={(e)=>{setEmail(e.target.value);}}
            />
        </FormControl>
        <FormControl id="Password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
            <Input
            value={password}
            type={show?"text":"password"}
            placeholder="Enter your Password"
            onChange={(e)=>{setPassword(e.target.value);}}
            />
            <InputRightElement>
            {show? 
            <Button leftIcon={<BsEye />} h="1.75rem" size="sm" onClick={showPassword}/>:
            <Button leftIcon={<BsEyeSlash />} h="1.75rem" size="sm" onClick={showPassword}/>
            }
            </InputRightElement>
            </InputGroup>
        </FormControl>
        <Button colorScheme='blue' width="100%" style={{marginTop:15}} onClick={login}>
            Login
        </Button>
        <Button colorScheme='red' width="100%" style={{marginTop:15}} onClick={guestLogin}>
Guest Login
        </Button>
    </VStack>
  )
}

export default Login