import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import NavigationBar from './components/NavigationBar'
import Footer from './components/Footer'
import Home from './pages/Home'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import FormStorage from './pages/FormStorage'
import Storage from './pages/Storage'
import UpdatePage from './pages/UpdatePage'
import Report from './pages/Report'


function Layout({children}) {
  return (
    <>
      <NavigationBar/>
      {children}
      <Footer/>
    </>
  )
}

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Layout><Home/></Layout>}></Route>
          <Route path='/login' element={<Layout><LoginPage/></Layout>}></Route>
          <Route path='/signup' element={<Layout><SignupPage/></Layout>}></Route>
          <Route path='/form' element={<Layout><FormStorage/></Layout>}></Route>
          <Route path='/report' element={<Layout><Report/></Layout>}></Route>
          <Route path='/storage' element={<Layout><Storage/></Layout>}></Route>
          <Route path='/:id/update' element={<Layout><UpdatePage/></Layout>}></Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
