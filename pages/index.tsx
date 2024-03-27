import { Heading, Box } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useDB } from '../contexts/DatabaseContext'
import Board from '../components/board'
import timeout from '../components/util'
import RandomLayout from '../components/layout/random_layout'
import ConsentFrom from './consent'
import { time } from 'console'

const PAD = 5

function VisualMemory() {
  const [isOn, setIsOn] = useState(false)
  const [isOver, setIsOver] = useState(false)
  const numberTiles = 36
  const numberList = Array.from(Array(numberTiles).keys()).map(i =>
    i.toString()
  )
  const maskType = ['noMask', 'shuffleMask', 'invisibleMask', 'flashMask']
  const trialCount = 30

  const [restartGame, setRestartGame] = useState(false)

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  const initMaskData = {
    score: 6,
    successCount: 0,
    correct: 0
  }

  const initResponseData = {
    userGuess: [],
    userReactionTime: []
  }

  const initBoardData = {
    tilePattern: [],
    tilePosition: []
  }

  const initPlay = {
    isDisplay: false,
    userTurn: false,
    noMaskData: { ...initMaskData },
    shuffleData: { ...initMaskData },
    invisibleData: { ...initMaskData },
    flashData: { ...initMaskData },
    userResponse: { ...initResponseData },
    boardData: { ...initBoardData },
    currTilePattern: [],
    mask: [],
    userCorrect: [] // TODO: Remove
  }

  const [play, setPlay] = useState(initPlay)
  const [flashTile, setFlashTile] = useState([])
  const [wrongTile, setWrongTile] = useState([])
  const [rewardTile, setRewardTile] = useState([])
  const [playerTrial, setPlayerTrial] = useState(0)

  const [currFlashIntensity, setCurrFlashIntensity] = useState('1')

  const [buttonPositions, setButtonPositions] = useState([])
  const [shuffleArangement, setShuffleArangement] = useState([])

  const [userData, setUserData] = useState({
    responseData: [],
    noMaskData: {},
    shuffleData: {},
    invisibleData: {},
    flashData: {},
    boardData: [],
    // tilePattern: {},
    // tilePositions: [],
    mask: [],
    Date: new Date()
  })

  const { currentUser } = useAuth()
  const { getData, updateData } = useDB()

  useEffect(() => {
    if (restartGame) {
      setIsOn(false)
      setPlay(initPlay)
      setButtonPositions([])
      setRestartGame(false)
    }
  }, [restartGame])

  // Turn on game
  useEffect(() => {
    if (isOn) {
      shuffleTiles()

      let maskDistribution = []
      maskType.forEach(m => {
        for (let i = 0; i < trialCount; i++) {
          maskDistribution.push(m)
        }
      })
      // Randomize possible masks
      let mask = maskDistribution.sort(() => 0.5 - Math.random())
      setPlay({ ...initPlay, mask: mask, isDisplay: true })
    } else if (currentUser !== null) {
      getData()
        .then(userGameHistory => {
          if (userGameHistory) {
            if (!userGameHistory.visual) {
              userGameHistory.visual = new Array()
            }

            if (Object.keys(userData.mask).length > 0) {
              userGameHistory.visual.push(userData)
              updateData(currentUser.uid, 'projection', userGameHistory.visual)
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

      shuffleTiles()
      setUserData({ ...userData, mask: play.mask, Date: new Date() })

      // Select pattern size based on mask
      let patternSize
      switch (play.mask[playerTrial]) {
        case 'noMask':
          patternSize = play.noMaskData.score
          // console.log('No Mask')
          // console.log(play.noMaskData.score)
          // console.log(play.noMaskData.successCount)
          // console.log(play.noMaskData.correct)
          break
        case 'shuffleMask':
          patternSize = play.shuffleData.score
          // console.log('Shuffle Mask')
          // console.log(play.shuffleData.score)
          // console.log(play.shuffleData.successCount)
          // console.log(play.shuffleData.correct)
          break
        case 'invisibleMask':
          patternSize = play.invisibleData.score
          // console.log('Invisible Mask')
          // console.log(play.invisibleData.score)
          // console.log(play.invisibleData.successCount)
          // console.log(play.invisibleData.correct)
          break
        case 'flashMask':
          patternSize = play.flashData.score
          // console.log('Flash Mask')
          // console.log(play.flashData.score)
          // console.log(play.flashData.successCount)
          // console.log(play.flashData.correct)
          break
      }

      // Generate random tile pattern of keys associated with tiles
      while (patternIdsSet.size < patternSize) {
        patternIdsSet.add(Math.floor(Math.random() * numberTiles).toString())
      }

      let patternIds = Array.from(patternIdsSet)

      let data = initBoardData
      data.tilePattern = patternIds
      data.tilePosition = buttonPositions

      setUserData({ ...userData, boardData: [...userData.boardData, data] })
      setPlay({ ...play, currTilePattern: patternIds })
    }
  }, [isOn, play.isDisplay])

  // Display sequence of tiles
  useEffect(() => {
    // Calculate the number of trials to run
    let numTrials = maskType.length * trialCount - 1
    if (playerTrial > numTrials) {
      setUserData({
        ...userData,
        noMaskData: play.noMaskData,
        shuffleData: play.shuffleData,
        invisibleData: play.invisibleData,
        flashData: play.flashData,
        mask: play.mask,
        Date: new Date()
      })
      setIsOver(true)
      setIsOn(false)
    } else if (isOn && play.isDisplay && play.currTilePattern.length) {
      displayTiles()
    }
  }, [isOn, play.isDisplay, play.currTilePattern.length])

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
    let maxLeft, maxTop, maxRight, maxBottom
    numberList.forEach(() => {
      let newPos, overlap
      do {
        newPos = {
          left: Math.floor(40 * Math.random()),
          top: Math.floor(40 * Math.random())
        }
        newPos.right = newPos.left + PAD
        newPos.bottom = newPos.top + PAD
        overlap = checkOverlap(newPos, positions)
      } while (overlap)
      Math.max(newPos.right, maxRight)
      Math.min(newPos.left, maxLeft)
      Math.max(newPos.bottom, maxBottom)
      Math.min(newPos.top, maxTop)
      positions.push(newPos)
    })
    setDimensions({ width: maxRight - maxLeft, height: maxBottom - maxTop })
    setButtonPositions(positions)
    setShuffleArangement(positions)
  }

  async function displayTiles() {
    await timeout(1000)
    setFlashTile(play.currTilePattern)
    let positions = []

    // Set mask effect duration in milliseconds
    let maskEffectDuration = 2000

    // Select current mask to apply
    switch (play.mask[playerTrial]) {
      case 'noMask':
        break
      case 'flashMask':
        await timeout(maskEffectDuration)
        setFlashTile(numberList)
        break
      case 'invisibleMask':
        await timeout(maskEffectDuration)
        setCurrFlashIntensity('0')
        setFlashTile(numberList)
        break
      case 'shuffleMask':
        positions = shuffleArangement
        await timeout(maskEffectDuration)
        setFlashTile([])
        await timeout(500)
        shuffleTiles()
        break
    }

    await timeout(1000)
    setFlashTile([])
    setCurrFlashIntensity('1')
    if (positions.length > 0) {
      setButtonPositions(positions)
      setShuffleArangement(positions)
    }
    setPlay({ ...play, isDisplay: false, userTurn: true })
  }

  let [prevTime, setPrevTime] = useState(null)

  async function tileClickHandle(number) {
    if (!play.isDisplay && play.userTurn) {
      let currTime = performance.now()

      let reactionTime = prevTime ? currTime - prevTime : 0

      setPrevTime(currTime)

      let userGuess = number.toString()
      play.userResponse.userGuess = [...play.userResponse.userGuess, userGuess]
      play.userResponse.userReactionTime = [
        ...play.userResponse.userReactionTime,
        reactionTime
      ]
      if (play.currTilePattern.includes(userGuess)) {
        let correct = play.userResponse.userGuess.filter(guess =>
          play.currTilePattern.includes(guess)
        )
        setFlashTile(correct)
        if (
          play.currTilePattern.length ===
          new Set(play.userResponse.userGuess).size
        ) {
          await timeout(500)
          setRewardTile(play.currTilePattern)
          await timeout(500)
          setRewardTile([])
          setFlashTile(numberList)
          await timeout(500)
          setFlashTile([])

          // Update correct answer in database here
          setPlayerTrial(playerTrial + 1)

          setUserData({
            ...userData,
            responseData: [...userData.responseData, play.userResponse]
          })

          switch (play.mask[playerTrial]) {
            case 'noMask':
              play.noMaskData.correct += 1
              if (play.noMaskData.successCount == 2) {
                play.noMaskData.score += 1
                play.noMaskData.successCount = 0
              } else {
                play.noMaskData.successCount += 1
              }
              break
            case 'shuffleMask':
              play.shuffleData.correct += 1
              if (play.shuffleData.successCount == 2) {
                play.shuffleData.score += 1
                play.shuffleData.successCount = 0
              } else {
                play.shuffleData.successCount += 1
              }
              break
            case 'invisibleMask':
              play.invisibleData.correct += 1
              if (play.invisibleData.successCount == 2) {
                play.invisibleData.score += 1
                play.invisibleData.successCount = 0
              } else {
                play.invisibleData.successCount += 1
              }
              break
            case 'flashMask':
              play.flashData.correct += 1
              if (play.flashData.successCount == 2) {
                play.flashData.score += 1
                play.flashData.successCount = 0
              } else {
                play.flashData.successCount += 1
              }
              break
          }

          await timeout(1000)
          setButtonPositions(shuffleArangement)

          // await timeout(500)
          setPlay({
            ...play,
            isDisplay: true,
            userTurn: false,
            userCorrect: [...play.userCorrect, 1],
            userResponse: { ...initResponseData },
            currTilePattern: []
          })
        }
      } else {
        setPlay({ ...play, userTurn: false })
        setFlashTile([userGuess])
        setWrongTile([userGuess])
        await timeout(500)
        setWrongTile([])
        setFlashTile(numberList)
        await timeout(500)
        setFlashTile([])

        setPlayerTrial(playerTrial + 1)

        setUserData({
          ...userData,
          responseData: [...userData.responseData, play.userResponse]
        })

        switch (play.mask[playerTrial]) {
          case 'noMask':
            play.noMaskData.score -= 1
            play.noMaskData.successCount = 0
            break
          case 'shuffleMask':
            play.shuffleData.score -= 1
            play.shuffleData.successCount = 0
            break
          case 'invisibleMask':
            play.invisibleData.score -= 1
            play.invisibleData.successCount = 0
            break
          case 'flashMask':
            play.flashData.score -= 1
            play.flashData.successCount = 0
            break
        }

        await timeout(1000)
        setButtonPositions(shuffleArangement)

        setPlay({
          ...play,
          isDisplay: true,
          userTurn: false,
          userCorrect: [...play.userCorrect, 0],
          userResponse: { ...initResponseData },
          currTilePattern: []
        })
      }
    }
  }

  if (isOn) {
    return (
      <Board>
        <Box>
          {' '}
          <RandomLayout
            numberList={numberList}
            tileClickHandle={tileClickHandle}
            rewardTile={rewardTile}
            wrongTile={wrongTile}
            flashTile={flashTile}
            buttonPositions={buttonPositions}
            flashIntensity={currFlashIntensity}
            width={dimensions.width}
            height={dimensions.height}
          />
        </Box>
      </Board>
    )
  } else if (isOver) {
    return (
      <Board>
        <Box>
          {/* TODO: Rename for study */}
          <Heading size="2xl" color="#fff">
            Indiana University
          </Heading>
          <Heading size="xl" color="#fff" p={4}>
            Cognition and Decision Making Experiment
          </Heading>
          <Heading size="lg" color="#fff">
            Thank you for participating!
          </Heading>
        </Box>
      </Board>
    )
  } else {
    return <ConsentFrom onStatusChange={{ on: setIsOn }} />
  }
}

export default VisualMemory
