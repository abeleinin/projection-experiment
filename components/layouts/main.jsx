import Head from 'next/head'
import { Box, Container } from '@chakra-ui/react'

const Main = ({ children }) => {
  return (
    <Box as="main">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href="favicon.ico" />
        <title>Projection Experiment</title>
      </Head>

      <Container maxWidth="100%" h="100vh" px={0}>
        {children}
      </Container>
    </Box>
  )
}

export default Main
