import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainPage from './pages/MainPage/MainPage'
import Header from './components/Header/Header'
import RegisterPage from './pages/RegisterPage/RegisterPage'
import ProfilePage from './pages/ProfilePage/ProfilePage'
import LoginPage from './pages/LoginPage/LoginPage'
import ConnectPage from './pages/ConnectPage/ConnectPage'
import CreatePostPage from "./pages/CreatePostPage/CreatePostPage"
import PrivateZone from './guards/PrivateZone'
import PublicZone from './guards/PublicZone'
import NotFound from './guards/NotFound'

import './styles/main.scss';

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="layout">
          <Header />
          <main>
            <Routes>
              <Route path='/login' element={
                <PublicZone>
                  <LoginPage />
                </PublicZone>
              } />
              <Route path='/register' element={
                <PublicZone>
                  <RegisterPage />
                </PublicZone>
              } />
              
              <Route path='/' element={
                <PrivateZone>
                  <MainPage />
                </PrivateZone>
              } />
              <Route path='/id/:id' element={
                <PrivateZone>
                  <MainPage />
                </PrivateZone>
              } />
              <Route path='/connect' element={
                <PrivateZone>
                  <ConnectPage />
                </PrivateZone>
              } />
              <Route path='/profile/:id' element={
                <PrivateZone>
                  <ProfilePage />
                </PrivateZone>
              } />
              
              <Route path='/id/:id?post=:postId' element={
                <PrivateZone>
                  <ProfilePage />
                </PrivateZone>
              } />
              <Route path="/create" element={<CreatePostPage />} />
              <Route path='*' element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </>
  )
}

export default App;