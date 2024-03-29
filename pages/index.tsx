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

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setLoading(true)
      const uid = await anonymouslySignIn()
      await setData(uid)
      navigate('/')
    } catch (e) {
      console.log('Error:', e)
    }
    setLoading(false)
  }
  return <ConsentFrom onStatusChange={handleSubmit} />
}

export default Home
