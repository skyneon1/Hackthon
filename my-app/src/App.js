import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Hero from './components/Hero'
import Features from './components/Features'
import Navigation from './components/Navigation'
import Testimonials from './components/Testimonials'
import Footer from './components/Footer'
import About from './pages/About'
import HealthLibrary from './pages/HealthLibrary'
import Blog from './pages/Blog'
import FAQ from './pages/FAQ'
import Tools from './pages/Tools'
import Chat from './pages/Chat'
import AIDoctor from './pages/AIDoctor'
import GradioInterface from './pages/GradioInterface'
import ScanAnalyzer from './components/ScanAnalyzer'
import { Global, css } from '@emotion/react'
import styled from '@emotion/styled'
import { ChakraProvider } from '@chakra-ui/react'

const globalStyles = css`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  body {
    overflow-x: hidden;
  }

  html {
    scroll-behavior: smooth;
  }
`

const MainContent = styled.div`
  padding-top: 80px; /* Space for fixed navigation */
`

const Home = () => (
  <>
    <Hero />
    <Features />
    <Testimonials />
  </>
)

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Global styles={globalStyles} />
        <Navigation />
        <MainContent>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/health-library" element={<HealthLibrary />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/ai-doctor" element={<AIDoctor />} />
            <Route path="/gradio-interface" element={<GradioInterface />} />
            <Route path="/chat-docs" element={<ScanAnalyzer />} />
          </Routes>
        </MainContent>
        <Footer />
      </Router>
    </ChakraProvider>
  )
}

export default App