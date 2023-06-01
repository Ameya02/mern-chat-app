import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useTab, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useChatContext } from '../context/ChatProvider';
import { RiEyeFill } from 'react-icons/ri';
import UserBadgeItem from '../components/User Avatar/UserBadgeItem';
import axios from 'axios';
import UserListItem from '../components/User Avatar/UserListItem';

const UpdateGroupChatModal = ({fetchAgain, setFetchAgain}) => {
    const { isOpen, onOpen, onClose} = useDisclosure();
    const {user, selectedChat, setSelectedChat} = useChatContext()
    const [groupChatName, setGroupChatName] = useState()
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState()
    const [loading, setLoading] = useState(false)
    const [renameLoading, setRenameLoading] = useState(false)
  const toast = useToast()

    const handleRemove = async(suser) => {
      if (selectedChat.groupAdmin._id !== user._id && suser._id !== user._id) {
        toast({
          title: "Only admins can remove someone!",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }
  
      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.put(
          `/api/chat/removegroup`,
          {
            chatId: selectedChat._id,
            userId: suser._id,
          },
          config
        );
  
        suser._id === user._id ? setSelectedChat() : setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        setLoading(false);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
      }
      setGroupChatName("");
    };

    const handleAddUser = async (suser) => {
      if(selectedChat.users.find((us)=> us._id===suser._id)){
          toast({
            title:"User is already in the group",
            status:"error",
            duration:1000,
            isClosable:true,
            position:"bottom"
          });
          return;
      }
if(selectedChat.groupAdmin._id !== user._id){
  toast({
    title:"Admin is allowed to add in group",
    status:"error",
    duration:1000,
    isClosable:true,
    position:"bottom"
  });
  return;
}
try {
  setLoading(true);
  const config = {
    headers:{
        Authorization: `Bearer ${user.token}`,

    },
};

const { data } = await axios.put("/api/chat/groupAdd",{
  chatId:selectedChat._id,
  userId:suser._id
},config
)
setSelectedChat(data);
setFetchAgain(!fetchAgain)
setLoading(false)
} catch (error) {
  toast({
    title:"Something happed ud=sers cannot be added to group",
    status:"error",
    duration:1000,
    isClosable:true,
    position:"bottom"
  });
  setLoading(false)
}


    }

    const handleRename = async() => {
        if(!groupChatName) return
        try{
          setRenameLoading(true)
          const config = {
            headers:{
                Authorization: `Bearer ${user.token}`,

            },
        };
            const { data} = await axios.put("/api/chat/renamegroup",
            {
              chatId:selectedChat._id,
              chatName: groupChatName
            },
            config
            );
            setSelectedChat(data);
            setFetchAgain(!fetchAgain)
            setRenameLoading(false);

        }
        catch ( error) {
          toast({
            title:"Error Occured!",
            description: error.message,
            status:"error",
            duration:1000,
            isClosable:true,
            position:"top-left"
        })
        }
        setGroupChatName("")
        setRenameLoading(false)
    }

    const handleSearch = async(search) => {
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
    
    return (

<>
<IconButton display={{base:"flex"}} icon={<RiEyeFill/>} onClick={onOpen} />
<Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >{selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
        <Box>
        <FormControl display="flex">
          <Input
          placeholder="Chat Name"
          mb={13}
          value={groupChatName}
          onChange={(e) => setGroupChatName(e.target.value)}
/>
<Button
variant="solid"
colorScheme='teal'
ml={1}
isLoading={renameLoading}
onClick={handleRename}

>
Update
</Button>
        </FormControl>
        
        <FormControl display="flex">
          <Input
          placeholder="Add user to the group"
          mb={13}
        onChange={(e)=> handleSearch(e.target.value)}
/>
        </FormControl>
        {loading ? (
                <Spinner />
          ):(
            searchResult?.map((user) => (
                <UserListItem
                key={user._id}
                user={user}
                handleFunction ={() => handleAddUser(user)}
                />
            ))
          )}
            {selectedChat.users.map((suser) => (
              <UserBadgeItem key={user._id} user={suser} handleFunction={()=>handleRemove(suser)} />
            ))}
        </Box>
            </ModalBody>
          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={() => handleRemove(user)} >
              Close
            </Button>
          </ModalFooter>
          </ModalContent>
          </Modal>
</>
  )
}

export default UpdateGroupChatModal