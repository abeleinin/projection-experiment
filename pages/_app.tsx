import { ChakraProvider } from '@chakra-ui/provider'
import Layout from '../components/layouts/main'
import { AuthProvider } from '../contexts/AuthContext'
import { DatabaseProvider } from '../contexts/DatabaseContext'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import theme from '../lib/theme'
import Home from './index'

const Website = () => {
  return (
    <AuthProvider>
      <DatabaseProvider>
        <ChakraProvider theme={theme}>
          <Router>
            <Layout>
              <Routes>
                <Route index element={<Home />}></Route>
              </Routes>
            </Layout>
          </Router>
        </ChakraProvider>
      </DatabaseProvider>
    </AuthProvider>
  )
}

export default Website
