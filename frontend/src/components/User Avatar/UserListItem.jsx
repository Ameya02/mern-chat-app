import { Avatar, Box, Text } from '@chakra-ui/react'
import React from 'react'

const UserListItem = ({user, handleFunction}) => {
  return (
    <Box
        onClick={handleFunction}
        cursor= 'pointer'
        bg="#E8E8E8E8"
        _hover = {{
            background:"338824c",
            color:"#FFFFFF",
        }}
        w="100%"
        display="flex"
        alignItems="center"
        color="black"
        px={3}
        py={2}
        mb={2}
        borderRadius="lg"
        
        >
        <Avatar
mr={2}
size="sm"
cursor="position"
name={user.name}
src={user.src}
        />
<Box>
    <Text>{user.name}</Text>
    <Text fontSize="xs">
        <b>{user.email}</b>
    </Text>
</Box>    </Box>
  )
}

export default UserListItem