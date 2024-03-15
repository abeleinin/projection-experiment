import { useState, useCallback } from 'react'
import { ArrowBackIcon } from '@chakra-ui/icons'
import {
  Heading,
  Button,
  Flex,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper
} from '@chakra-ui/react'

const Navbar = ({ play, setplay, resetToggle, onFeatureToggle }) => {
  const initialFeaturesState = Object.keys(onFeatureToggle).reduce(
    (acc, feature) => {
      acc[feature] = false
      return acc
    },
    {}
  )

  const [features, setFeatures] = useState(initialFeaturesState)

  const [numberOfTiles, setNumberOfTiles] = useState(7)

  const handleValueChange = (_, valueAsNumber) => {
    setNumberOfTiles(valueAsNumber)
    setplay({ ...play, score: numberOfTiles })
  }

  const backFunction = useCallback(() => {
    resetToggle(true)
  }, [resetToggle])

  const toggleFeature = useCallback(
    featureName => {
      const newFeatures = { ...features, [featureName]: !features[featureName] }
      setFeatures(newFeatures)
      onFeatureToggle[featureName](newFeatures[featureName])
    },
    [features, onFeatureToggle]
  )

  return (
    <Flex
      as="nav"
      position="absolute"
      top="0"
      left="0"
      padding="1rem"
      bg="transparent"
      align="center"
      justify="flex-start"
    >
      <Button
        leftIcon={<ArrowBackIcon />}
        bg="yellow.400"
        _hover={{ bg: 'yellow.300' }}
        color="#000"
        fontSize="14pt"
        marginRight="1rem"
        onClick={backFunction}
      >
        Back
      </Button>
      {Object.keys(features).map(featureName => (
        <Button
          key={featureName}
          bg={features[featureName] ? 'blue.400' : 'yellow.400'}
          _hover={{ bg: 'yellow.300' }}
          color="#000"
          fontSize="14pt"
          marginRight="1rem"
          onClick={() => toggleFeature(featureName)}
        >
          {featureName}
        </Button>
      ))}
      <Flex bg="yellow.400" alignItems={'center'} p={1} borderRadius="md">
        <Heading size="sm" pr={2}>
          Stimuli:
        </Heading>
        <NumberInput
          size="md"
          maxW={20}
          value={numberOfTiles}
          onChange={handleValueChange}
          min={1}
          bg="whiteAlpha.400"
          borderRadius="md"
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Flex>
    </Flex>
  )
}

export default Navbar
