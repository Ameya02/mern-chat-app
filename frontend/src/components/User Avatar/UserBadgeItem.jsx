import { Box } from '@chakra-ui/react'
import { GrClose } from "react-icons/gr"
const UserBadgeItem = ({user, handleFunction}) => {

  return (
    <Box
    px={2}
    py={2}
    borderRadius="md"
    m={1}
    mb={2}
    variant="solid"
    fontSize={12}
    color="purple"
    backgroundColor="cyan"
    cursor="pointer"
    onClick={handleFunction}
    >
    {user.name}
<GrClose pl={1} />
    </Box>
  )
}

export default UserBadgeItem