import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    useToast,
    FormControl,
    Input,
    Spinner,
    Box,
  } from '@chakra-ui/react'
import { useChatContext } from '../context/ChatProvider';
import axios from 'axios';
import { useState } from 'react';
import UserListItem from '../components/User Avatar/UserListItem';
import UserBadgeItem from '../components/User Avatar/UserBadgeItem';
const GroupChatModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);

    const [search, setSearch] = useState("");

    const [searchResult, setsearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const toast = useToast();
    const { user, chats, setChats} = useChatContext();

    const handleSearch = async(query) => {
        setSearch(query);
        if(!query)
        {
            return;
        }
        try {
            setLoading(true);
            const config = {
                headers:{
                    Authorization: `Bearer ${user.token}`,

                },
            };
            const { data } = await axios.get(`/api/user/getAllUsers?search=${search}`,config);
            setLoading(false);
            setsearchResult(data);
        } catch (error) {
            toast({
                title:"Error Occured!",
                description: error.message,
                status:"error",
                duration:1000,
                isClosable:true,
                position:"top==-left"
            })
        setLoading(false);
        return;
            
        }

    }
    const handleSubmit = async() => {
      if(!groupChatName || !selectedUsers) {
        toast({
          title:"Please entrer all the fields",
          status:"warning",
          duration:5000,
          isClosable:true,
          position:"top",
        });

        return;
      }
      try {
         const config = {
                headers:{
                    Authorization: `Bearer ${user.token}`,

                },
            };
            const {data} = await axios.post("/api/chat/group",
            {
              name: groupChatName,
              users:JSON.stringify(selectedUsers.map((user) => user._id))
            },
            config
            );
            console.log(data)
            setChats([...chats,data]);
            onClose();
            toast({
              title:"Group Chat Created",
              status:"success",
              duration:5000,
              isClosable:true,
              position:"top",
            });
            return;
      } catch (error) {
        toast({
          title:"Error Occured",
          status:"error",
          description:error.message,
          duration:5000,
          isClosable:true,
          position:"top",
        });
        return;
      }
    }
    const handleDelete = (delUser) => {
setSelectedUsers(selectedUsers.filter((suser) => suser._id !== delUser._id))

    }
    const handleGroup = (userToAdd) => {
      if(selectedUsers.includes(userToAdd))
{
  toast({
    title:"Usera already added",
    status:"warning",
    duration:5000,
    isClosable:true,
    position:"top",
  });
  return;
}
setSelectedUsers([...selectedUsers,userToAdd])
    }


    return (
      <>
        <span onClick={onOpen}>{children}</span>
  
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader
            display="flex"
            fontFamily="Work sans"
            fontSize="35px"
            justifyContent="center"
            >Create Group Chats</ModalHeader>
            <ModalCloseButton />
            <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center">
            <FormControl>
                <Input placeholder='Chat Name' mb={4} onChange={(e) => {setGroupChatName(e.target.value)}} />
            </FormControl>
            <FormControl>
                <Input placeholder='Add Users to Group' mb={4} onChange={(e) => {handleSearch(e.target.value)}} />
            </FormControl>
            <Box display="flex" w="100%" flexWrap="wrap">
            {selectedUsers?.map((suser) => (
              <UserBadgeItem key={user._id} user={suser} handleFunction={()=>handleDelete(suser)} />
            ))}
            </Box>
            {loading?(<Spinner/>):(
                searchResult?.slice(0,4).map((user) => <UserListItem key={user._id} user={user} handleFunction={()=>{handleGroup(user)}}/>)

            )}
            </ModalBody>
  
            <ModalFooter>
            <Button onClick={handleSubmit} colorScheme="blue">
              Create Chat
            </Button>
              
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
}

export default GroupChatModal