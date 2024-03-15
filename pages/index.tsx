import { Heading, Box } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useDB } from '../contexts/DatabaseContext'
import Board from '../components/board'
import Titlescreen from '../components/titlescreen'
import timeout from '../components/util'
import RandomLayout from '../components/layout/random_layout'
import GridLayout from '../components/layout/grid_layout'
import Navbar from '../components/navbar'
// import Level from '../components/level'

function VisualMemory() {
  const [isOn, setIsOn] = useState(false)
  const [isOver, setIsOver] = useState(false)
  const numberTiles = 25
  const numberList = Array.from(Array(numberTiles).keys()).map(i =>
    i.toString()
  )

  const [test] = useState(false)
  const [enableFlash, setEnableFlash] = useState(false)
  const [enableInvisible, setEnableInvisible] = useState(false)
  const [enableMovement, setEnableMovement] = useState(false)

  const [grid, setGrid] = useState(false)
  const [shuffle, setShuffle] = useState(false)

  const initPlay = {
    isDisplay: false,
    userTurn: false,
    score: 7,
    correct: 0,
    tilePattern: [],
    userGuess: [],
    mask: [],
    userCorrect: []
  }

  const [play, setPlay] = useState(initPlay)
  const [flashTile, setFlashTile] = useState([])
  const [wrongTile, setWrongTile] = useState([])
  const [rewardTile, setRewardTile] = useState([])
  const [playerScore, setPlayerScore] = useState(0)
  const [playerTrial, setPlayerTrial] = useState(0)

  const [currFlashIntensity, setCurrFlashIntensity] = useState('1')

  const [buttonPositions, setButtonPositions] = useState([])
  const [shuffleArangement, setShuffleArangement] = useState([])

  const [userData, setUserData] = useState({
    correct: [],
    mask: [],
    Date: new Date()
  })

  const { currentUser } = useAuth()
  const { getData, updateData } = useDB()

  useEffect(() => {
    if (restartGame) {
      setIsOn(false)
      setPlay(initPlay)
      setShuffle(false)
      setGrid(false)
      setButtonPositions([])
      setEnableFlash(false)
      setEnableInvisible(false)
      setEnableMovement(false)
      setRestartGame(false)
    }
  }, [restartGame])

  // Turn on game
  useEffect(() => {
    if (isOn) {
      if (shuffle) {
        shuffleTiles()
      }
      setPlay({ ...initPlay, isDisplay: true })
    } else if (currentUser !== null) {
      getData()
        .then(userGameHistory => {
          if (userGameHistory) {
            if (!userGameHistory.visual) {
              userGameHistory.visual = new Array()
            }

            if (userData.correct.length > 1) {
              userGameHistory.visual.push(userData)
              updateData(currentUser.uid, 'visual', userGameHistory.visual)
            }
          } else {
            console.error('Failed to get user game history')
          }
        })
        .catch(error => {
          console.error('Error fetching user game history:', error.message)
        })
      setPlay(initPlay)
    }
  }, [isOn])

  // Select next tile in sequence
  useEffect(() => {
    if (isOn && play.isDisplay) {
      let patternIdsSet = new Set()

      let maskType = ['no-mask', 'energy-mask', 'remove-board']

      setUserData({ correct: [], mask: [], Date: new Date() })

      while (patternIdsSet.size < play.score) {
        patternIdsSet.add(Math.floor(Math.random() * numberTiles).toString())
      }

      let patternIds = Array.from(patternIdsSet)

      setPlay({ ...play, tilePattern: patternIds, mask: maskType })
    }
  }, [isOn, play.isDisplay])

  // Display sequence of tiles
  useEffect(() => {
    if (playerTrial > 49) {
      setUserData({
        correct: play.userCorrect,
        mask: play.mask,
        Date: new Date()
      })
      setIsOver(true)
      setIsOn(false)
    } else if (isOn && play.isDisplay && play.tilePattern.length) {
      displayTiles()
    }
  }, [isOn, play.isDisplay, play.tilePattern.length])

  const checkOverlap = (newPos, existingPositions) => {
    for (let pos of existingPositions) {
      if (
        newPos.left < pos.right &&
        newPos.right > pos.left &&
        newPos.top < pos.bottom &&
        newPos.bottom > pos.top
      ) {
        return true
      }
    }
    return false
  }

  async function shuffleTiles() {
    let positions = []
    numberList.forEach(() => {
      let newPos, overlap
      do {
        newPos = {
          left: Math.floor(Math.random() * 40),
          top: Math.floor(Math.random() * 40)
        }
        newPos.right = newPos.left + 5.5
        newPos.bottom = newPos.top + 5.5
        overlap = checkOverlap(newPos, positions)
      } while (overlap)
      positions.push(newPos)
    })
    setButtonPositions(positions)
    setShuffleArangement(positions)
  }

  async function displayTiles() {
    await timeout(1000)
    setFlashTile(play.tilePattern)
    let positions

    // Apply mask effect here
    if (enableFlash) {
      await timeout(1000)
      setFlashTile(numberList)
    }
    if (enableInvisible) {
      await timeout(1000)
      setCurrFlashIntensity('0')
      setFlashTile(numberList)
    }
    if (enableMovement && shuffle) {
      positions = []
      buttonPositions.forEach((pos, _) => {
        let newPos, overlap
        do {
          let sign = Math.random() < 0.5 ? -1 : 1
          let val = Math.random() * 1.5 * sign
          newPos = {
            top: pos.top + val,
            left: pos.left + val
          }
          newPos.right = newPos.left + 4.5
          newPos.bottom = newPos.top + 4.5
          overlap = checkOverlap(newPos, positions)
        } while (overlap)
        positions.push(newPos)
      })
    }

    await timeout(1000)
    setFlashTile([])
    setCurrFlashIntensity('1')
    if (enableMovement && shuffle) {
      await timeout(500)
      setButtonPositions(positions)
    }
    setPlay({ ...play, isDisplay: false, userTurn: true })
  }

  async function tileClickHandle(number) {
    if (!play.isDisplay && play.userTurn) {
      let userGuess = number.toString()
      play.userGuess.push(userGuess)
      if (play.tilePattern.includes(userGuess)) {
        let correct = play.userGuess.filter(guess =>
          play.tilePattern.includes(guess)
        )
        setFlashTile(correct)
        if (play.tilePattern.length === new Set(play.userGuess).size) {
          await timeout(500)
          setRewardTile(play.tilePattern)
          await timeout(500)
          setRewardTile([])
          setFlashTile(numberList)
          await timeout(500)
          setFlashTile([])

          // Update correct answer in database here
          setPlayerTrial(playerTrial + 1)
          setPlayerScore(playerScore + 1)

          await timeout(1000)
          if (shuffle) {
            setButtonPositions(shuffleArangement)
          }

          // await timeout(500)
          setPlay({
            ...play,
            isDisplay: true,
            userTurn: false,
            userCorrect: [...play.userCorrect, 1],
            tilePattern: [],
            userGuess: []
          })
        }
      } else {
        setFlashTile([userGuess])
        setWrongTile([userGuess])
        await timeout(500)
        setWrongTile([])
        setFlashTile(numberList)
        await timeout(500)
        setFlashTile([])

        // Update incorrect answer in database here
        setPlayerTrial(playerTrial + 1)

        await timeout(1000)
        if (shuffle) {
          setButtonPositions(shuffleArangement)
        }

        // await timeout(500)
        setPlay({
          ...play,
          isDisplay: true,
          userTurn: false,
          userCorrect: [...play.userCorrect, 0],
          tilePattern: [],
          userGuess: []
        })

        // If you want to allow a couple wrong guesses
        // let wrong = play.userGuess.filter(guess => !play.tilePattern.includes(guess));
        // setWrongTile(wrong)
      }
    }
  }

  if (isOn) {
    if (shuffle) {
      return (
        <Board>
          <Box>
            {/* <Level>{play.score}</Level> */}
            <Navbar
              play={play}
              setplay={setPlay}
              resetToggle={setRestartGame}
              onFeatureToggle={{
                Flash: setEnableFlash,
                Invisible: setEnableInvisible,
                Movement: setEnableMovement
              }}
            />
            <RandomLayout
              numberList={numberList}
              tileClickHandle={tileClickHandle}
              rewardTile={rewardTile}
              wrongTile={wrongTile}
              flashTile={flashTile}
              buttonPositions={buttonPositions}
              flashIntensity={currFlashIntensity}
            />
          </Box>
        </Board>
      )
    } else if (grid) {
      return (
        <Board>
          <Box>
            {/* <Level>{play.score}</Level> */}
            <Navbar
              play={play}
              setplay={setPlay}
              resetToggle={setRestartGame}
              onFeatureToggle={{
                Flash: setEnableFlash,
                Invisible: setEnableInvisible
              }}
            />
            <GridLayout
              numberList={numberList}
              tileClickHandle={tileClickHandle}
              rewardTile={rewardTile}
              wrongTile={wrongTile}
              flashTile={flashTile}
              flashIntensity={currFlashIntensity}
            />
          </Box>
        </Board>
      )
    }
  } else if (isOver) {
    return (
      <Board>
        <Box>
          <Heading size="xl" color="#fff" p={4}>
            Visual Memory
          </Heading>
          <Heading size="xl" color="#fff" p={2}>
            Score: {playerScore} / 50
          </Heading>
          <Heading size="2xl" color="#fff">
            Thank you for playing!
          </Heading>
        </Box>
      </Board>
    )
  } else {
    return (
      <Board>
        <Titlescreen
          title="Visual-Spatial Memory"
          symbol="🧠"
          button={['Grid', 'Random']}
          onStatusChange={{ grid: setGrid, shuffle: setShuffle, on: setIsOn }}
        >
          Welcome to the <b>Projection Experiment Playground</b>! Try either the
          <br />
          Grid or Random layouts to determine the tile structure. Each layout
          <br />
          features different masks, which can be enabled independently or in
          <br />
          combination to alter the visual experience. Also, an incrementer
          <br />
          is provided to add or reduce the number of stimuli. Enjoy!
        </Titlescreen>
      </Board>
    )
  }
}

export default VisualMemory
