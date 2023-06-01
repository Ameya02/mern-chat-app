import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from "@chakra-ui/react"
import { useState } from "react"
import {BsEye,BsEyeSlash} from "react-icons/bs"
import axios from "axios"
import { useNavigate } from "react-router-dom"
const Signup = () => {
    const [show, setShow] = useState(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmpassword, setConfirmpassword] = useState("")
    const [pic, setPic] = useState("")
    const [loading, setLoading] = useState(false)
    const toast = useToast();
    const navigate = useNavigate();

    const showPassword = () => {
        setShow((prev)=>!prev)
    }
    const postDetails = (pic) => {
        setLoading(true);
        if(pic === undefined) {
            toast({
                title: 'Please select an Image!.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
              });
              return;
        }
        if(pic.type==="image/jpeg" || pic.type==="image/png")
        {
            const data = new FormData();
            data.append("file", pic);
            data.append("upload_preset","chat-app");
            data.append("cloud_name","dtsw55x0d");
            fetch("https://api.cloudinary.com/v1_1/dtsw55x0d/image/upload",{
                method:"post",
                body: data,

            }).then((res)=> res.json())
            .then((data) => {setPic(data.url.toString())
            setLoading(false)})
            .catch((err)=> {
                console.log(err);
                setLoading(false);
            })
            
        }
        else {
            toast({
                title: 'Please select an Image!.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
              });
              setLoading(false);
              return;
        }

    }
    const signup = async() => {
        setLoading(true);
        if(!name || !email || !password || !confirmpassword) {
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
if(password !== confirmpassword)
{
    toast({
        title:"Password Do not Match",
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
            "/api/user/register",
            {
                name,email,password,profile:pic},
            config
        );
        toast({
            title: 'Registration Succesful',
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
            status: 'error',
            duration: 5000,
            isClosable: true,
            position:"bottom",
        });
        setLoading(false);
        return;

     }

    }

  return (
    <VStack spacing="5px" color="black">
        <FormControl id="Name" isRequired>
            <FormLabel>Name</FormLabel>
            <Input
            placeholder="Enter your name"
            onChange={(e)=>{setName(e.target.value);}}
            />
        </FormControl>
        <FormControl id="Email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
            placeholder="Enter your email"
            onChange={(e)=>{setEmail(e.target.value);}}
            />
        </FormControl>
        <FormControl id="Password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
            <Input
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
        <FormControl id="Confirmpassword" isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <Input
            placeholder="Confirm Your PAssword"
            onChange={(e)=>{setConfirmpassword(e.target.value);}}
            />
        </FormControl>
        <FormControl>
            <FormLabel>Upload your Picture</FormLabel>
            <Input
            type="file"
            p={1.5}
            accept="images/*"
            onChange={(e)=>{postDetails(e.target.files[0]);}} />

        </FormControl>
        <Button colorScheme="blue" width="100%" style={{marginTop:15}} isLoading={loading} onClick={signup}>
            Sign Up
        </Button>
    </VStack>
  )
}

export default Signup