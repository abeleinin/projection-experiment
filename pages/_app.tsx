import { ChakraProvider } from '@chakra-ui/provider'

import Layout from '../components/layouts/main'
import VisualMemory from '.'
import theme from '../lib/theme'

const Website = () => {
  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <VisualMemory />
      </Layout>
    </ChakraProvider>
  )
}

export default Website
