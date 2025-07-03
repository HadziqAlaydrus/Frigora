import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import NavigationBar from './components/NavigationBar'
import Footer from './components/Footer'
import Home from './pages/Home'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import FormStorage from './pages/FormStorage'
import Storage from './pages/StoragePage'
import UpdatePage from './pages/UpdatePage'
import Report from './pages/Report'
import ProtectedRoute from './components/ProtectedRoute'

function Layout({children}) {
  const [searchResult, setSearchResult] = useState([]);
  return (
    <>
      <NavigationBar onSearchResult={setSearchResult}/>
      {children}
      <Footer/>
    </>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Layout><Home/></Layout>} />
        <Route path='/login' element={<Layout><LoginPage/></Layout>} />
        <Route path='/signup' element={<Layout><SignupPage/></Layout>} />
        
        {/* ⛔ Protected Routes */}
        <Route 
          path='/form' 
          element={
            <ProtectedRoute>
              <Layout><FormStorage/></Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path='/report' 
          element={
            <ProtectedRoute>
              <Layout><Report/></Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path='/storage' 
          element={
            <ProtectedRoute>
              <Layout><Storage/></Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path='/update/:id' 
          element={
            <ProtectedRoute>
              <Layout><UpdatePage/></Layout>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  )
}

export default App
