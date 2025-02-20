import '@mantine/core/styles.css';

import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import LandingPage from './pages/Landing.jsx'
import Films from './pages/Films.jsx'
import Customer from './pages/Customer.jsx'
import { MantineProvider } from '@mantine/core'

createRoot(document.getElementById('root')).render(
  <MantineProvider>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={
          <App>
            <LandingPage />
          </App>
        } />
        <Route path='/films' element={
          <App>
            <Films />
          </App>
        } />
        <Route path='/customer' element={
          <App>
            <Customer />
          </App>
        } />
      </Routes>
    </BrowserRouter>
  </MantineProvider>
)
