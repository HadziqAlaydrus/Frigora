import React from 'react'
import NavigationBar from './components/NavigationBar'
import Home from './pages/Home'
import Footer from './components/Footer'

const Layout = ({children}) => {
  return (
    <div>
      <NavigationBar/>
      <Home/>
      {children}
      <Footer/>
    </div>
  )
}

export default Layout
