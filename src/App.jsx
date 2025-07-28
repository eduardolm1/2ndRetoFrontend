import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainPage from './pages/MainPage/MainPage'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import RegisterPage from './pages/RegisterPage/RegisterPage'
import ProfilePage from './pages/Profile/ProfilePage'
import LoginPage from './pages/LoginPage/LoginPage'
import PostDetail from './components/PostDetail/PostDetail'

function App() {

  return (
    <>
      <BrowserRouter>
      <Header/>
        <Routes>
          <Route path='/' element={<MainPage/>}/>
          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/register' element={<RegisterPage/>}/>
          <Route path='/id/:id' element={<PostDetail/>}/>
          <Route path='/profile' element={<ProfilePage/>}/>
        </Routes>
        <Footer/>
      </BrowserRouter>
    </>
  )
}

export default App
