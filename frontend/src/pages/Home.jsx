import { Box, Container, Text } from "@chakra-ui/react"
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Signup from "../components/authentication/Signup"
import Login from "../components/authentication/Login"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import axios from "axios"
const Home = () => {
  const navigate = useNavigate()
  const changeStatus = async(user) => {
   
  const config = {
    headers : {
        "Content-Type":"application/json",
        Authorization:`Bearer ${user.token}`,
    }
  } 
  const {data} = await axios.put("/api/user/status",{
    userId:user._id,
    status:true
},
config
)
}
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

     if (user) {
      changeStatus(user)
      window.location.href = "/chats"}
  }, [])
  
  return (
    <Container maxW="xl" centerContent>
        <Box
        display="flex"
        justifyContent="center"
        p={3}
        bg={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"

        >
            <Text fontSize="4xl" fontFamily="work sans" color="black">Connect with Texify</Text>
        </Box>
<Box bg="white" w="100%" p={4} borderRadius="lg" color="black" borderWidth="1px">
<Tabs variant='soft-rounded'>
  <TabList mb="1em">
    <Tab width="50%">Login</Tab>
    <Tab width="50%">Signup</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      <Login />
    </TabPanel>
    <TabPanel>
      <Signup/>
    </TabPanel>
  </TabPanels>
</Tabs>

</Box>
    </Container>
  )
}

export default Home