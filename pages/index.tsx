import { useState } from 'react'

import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useDB } from '../contexts/DatabaseContext'

import ConsentFrom from './consent'

function Home() {
  const { anonymouslySignIn } = useAuth()
  const { setData } = useDB()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
      sURLVariables = sPageURL.split('&'),
      sParameterName,
      i

    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=')

      if (sParameterName[0] === sParam) {
        return sParameterName[1] === undefined ? true : sParameterName[1]
      }
    }
  }

  function generateRandomID() {
    const randomNumber = Math.floor(Math.random() * 100000000)
    const randomID = randomNumber.toString().padStart(8, '0')
    return randomID
  }

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setLoading(true)
      const uid = await anonymouslySignIn()
      var SONAID = getUrlParameter('id')
      var subjectID = SONAID
      if (subjectID === undefined) {
        subjectID = generateRandomID()
      }
      await setData(uid, subjectID)
    } catch (e) {
      console.log('Error:', e)
    }
    setLoading(false)
    navigate('/game')
  }
  return <ConsentFrom onStatusChange={handleSubmit} />
}

export default Home
