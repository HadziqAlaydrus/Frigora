import React from 'react'
import NavigationBar from './components/NavigationBar'
import Home from './pages/Home'

const Layout = ({children}) => {
  return (
    <div>
      <NavigationBar/>
      <Home/>
    </div>
  )
}

export default Layout
