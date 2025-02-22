import { useCallback, useState } from 'react'
import { Heading } from '@chakra-ui/react'
import { Box, Button } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { Text } from '@chakra-ui/react'

const Titlescreen = ({ children, title, onStatusChange, delay = 0.2 }) => {
  const [localState, setLocalState] = useState({
    on: false,
    shuffle: false,
    grid: false
  })

  const changeGame = useCallback(() => {
    onStatusChange.on(true)
  }, [onStatusChange.on])

  const chooseGrid = useCallback(() => {
    setLocalState({ ...localState, grid: !localState.grid })
    onStatusChange.grid(!localState.grid)
  }, [onStatusChange.grid])

  const handleGridStart = () => {
    changeGame()
    chooseGrid()
  }

  const handleShuffleStart = () => {
    changeGame()
  }

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: delay }}
    >
      <Box fontSize="24px" color="#fff">
        <Heading size="2xl" my={4}>
          {title}
        </Heading>
        <Text fontSize="xl">{children}</Text>
        <br />
        <Button
          bg="yellow.400"
          _hover={{ bg: 'yellow.300' }}
          my={4}
          color="#000"
          fontSize="14pt"
          marginRight="1rem"
          onClick={handleShuffleStart}
        >
          Start
        </Button>
      </Box>
    </motion.div>
  )
}

export default Titlescreen
