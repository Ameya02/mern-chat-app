import { Avatar, Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react';
import  { useState } from 'react'
import { BsBell, BsChevronDown } from 'react-icons/bs';
import {ImSearch} from "react-icons/im"
import { useChatContext } from '../context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import ChatLoading from '../components/ChatLoading';
import UserListItem from '../components/User Avatar/UserListItem';
import {getSender} from "../config/ChatLogics"

const SlideDrawer = () => {
    const { user, setSelectedChat, chats, setChats } = useChatContext();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState();
    const toast = useToast();
    const logout = () => {
        localStorage.removeItem("userInfo");
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
        navigate("/");
    }
    const handleSearch = async() => {
        if(!search) {
            toast({
                title:"Please enter something in search",
                status:"warning",
                duration:1000,
                isClosable:true,
                position:"top-left"
            })
            return;

        }
        try { 
            setLoading(true);

            const config = {
                headers:{
                    Authorization: `Bearer ${user.token}`,

                },
            };
            const { data } = await axios.get(`/api/user/getAllUsers?search=${search}`,config)
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title:"Error Occured!",
                description: error.message,
                status:"error",
                duration:1000,
                isClosable:true,
                position:"top-left"
            })
        setLoading(false);
        return;
            
        }

       
    }
    const accessChat =async (userId) =>{
        try {
            setLoadingChat(true)
            const config = {
                headers:{
                    "Content-type":"application/json",
                    Authorization: `Bearer ${user.token}`,

                },
            };
            const { data } = await axios.post("/api/chat",{userId}, config);

            if(!chats.find((c)=> c._id === data._id)) setChats([...chats,data]);
            setSelectedChat(data);
            setLoadingChat(false);
            onClose();
        } catch (error) {
            toast({
                title:"Error Fetching data",
                description: error.message,
                status:"error",
                duration:1000,
                isClosable:true,
                position:"top-left"
            })
        setLoading(false);
        return;
        }
    }
  return (
   <Box
   display="flex"
   justifyContent="space-between"
   alignItems="center"
   bg="white"
   w="100%"
   p="5px 10px 5px 10px"

   borderWidth="5px"
   >
    <Tooltip label="Search Users to Chat" hasArrow placement='bottom-end'>
        <Button variant="ghost" onClick={onOpen}>
            <ImSearch/>
            <Text display={{ base:"none" , md:"flex"}} px="4">Search Users</Text>
        </Button>
    </Tooltip>
    <Text fontSize="2xl" fontFamily="Work sans">
        Texify
    </Text>
    <div>
        
        <Menu>
        <Tooltip label="Profile" hasArrow placement='bottom-end'>
            <MenuButton as={Button} rightIcon={<BsChevronDown />}>
<Avatar size="sm" cursor="pointer" name={user.name}
    src={user.profile}
/>
            </MenuButton>
            </Tooltip>
            <MenuList><ProfileModal user={user}>
                <MenuItem>
                    My Profile
                </MenuItem>
                </ProfileModal>
                <MenuDivider />
                <MenuItem onClick={logout}>
                    Logout
                </MenuItem>
            </MenuList>
            
        </Menu>
        <Drawer
        isOpen={isOpen}
        placement='left'
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />

          <DrawerBody>
          <Box display="flex" pb={2}>
          <Input placeholder='Search by email or name' 
            mr={2}
            value={search}
            onChange={(e)=> setSearch(e.target.value)}
            />
            <Button onClick={handleSearch}>
                Go
            </Button>
          </Box>
          {loading ? (
                <ChatLoading />
          ):(
            searchResult?.map((user) => (
                <UserListItem
                key={user._id}
                user={user}
                handleFunction ={() => accessChat(user._id)}
                />
            ))
          )}
          {loadingChat && <Spinner display="flex" ml="auto" />}
          </DrawerBody>

          <DrawerFooter>
            <Button variant='outline' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme='blue'>Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
   </Box>
  )
}

export default SlideDrawer