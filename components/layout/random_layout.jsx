import { Box, Button } from '@chakra-ui/react'
import { memo } from 'react'

const RandomLayout = memo(function RandomLayout({
  numberList,
  tileClickHandle,
  rewardTile,
  wrongTile,
  flashTile,
  buttonPositions,
  flashIntensity
}) {
  if (buttonPositions.length == 0) {
    return <Box></Box>
  } else {
    return (
      <Box position="relative" width="40vw" height="80vh">
        {numberList.map((v, index) => (
          <Button
            key={v}
            position="absolute"
            left={`${buttonPositions[index]?.left}em`}
            top={`${buttonPositions[index]?.top}em`}
            bg={
              rewardTile.includes(v)
                ? '#38DC35'
                : wrongTile.includes(v)
                  ? 'red'
                  : 'white'
            }
            p="2em"
            rounded="md"
            opacity={flashTile.includes(v) ? flashIntensity : '0.2'}
            _hover={{}}
            onClick={() => tileClickHandle(v)}
          />
        ))}
      </Box>
    )
  }
})

export default RandomLayout
