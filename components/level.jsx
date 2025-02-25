import { Heading } from '@chakra-ui/react'

const Level = ({ children }) => {
  return (
    <Heading size="xl" py={4} color="white">
      Level: {children}
    </Heading>
  )
}

export default Level
