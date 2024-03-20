import { useCallback, useState } from 'react'
import { Heading } from '@chakra-ui/react'
import { Box, Button } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { Text } from '@chakra-ui/react'

const Titlescreen = ({
  children,
  title,
  symbol,
  button,
  onStatusChange,
  delay = 0.2
}) => {
  const [localState, setLocalState] = useState({
    on: false,
    shuffle: false
  })

  const changeGame = useCallback(() => {
    onStatusChange.on(true)
  }, [onStatusChange.on])

  const chooseShuffle = useCallback(() => {
    setLocalState({ ...localState, shuffle: !localState.shuffle })
    onStatusChange.shuffle(!localState.shuffle)
  }, [onStatusChange.shuffle])

  const handleGridStart = () => {
    changeGame()
  }

  const handleShuffleStart = () => {
    changeGame()
    chooseShuffle()
  }

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: delay }}
    >
      <Box fontSize="24px" color="#fff">
        <Heading size="4xl" my={4}>
          {symbol}
        </Heading>
        <Heading size="4xl" my={4}>
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
          {button}
        </Button>
      </Box>
    </motion.div>
  )
}

export default Titlescreen
