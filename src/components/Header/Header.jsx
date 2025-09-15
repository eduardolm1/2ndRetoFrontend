import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../../redux/auth/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import CompassIcon from '../svg/CompassIcon'
import ConfigureIcon from '../svg/ConfigureIcon'
import PeopleIcon from '../svg/PeopleIcon'

const Header = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)

  useEffect(() => {
    document.body.classList.remove('light', 'dark')
    document.body.classList.add(theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'))

  const toggleSidebar = () => setSidebarOpen(prev => !prev)

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      setSidebarOpen(!mobile)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const onLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  useEffect(() => {
    const publicRoutes = ['/login', '/register'];
    const currentPath = window.location.pathname;

    if (!user && !publicRoutes.includes(currentPath)) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <>

      <header className={`sidebar ${isMobile ? 'mobile' : 'desktop'} ${sidebarOpen ? 'open' : ''}`}>
        <nav>
          {isMobile && (
            <button className="sidebar-toggle" onClick={toggleSidebar}>
              ☰
            </button>
          )}
          <ul className="header">
            <li>
              <div>
                <img
                  className="logo"
                  src={theme === 'dark' ? '/img/logo-dark.png' : '/img/logo-light.png'}
                  alt="logo"
                />
              </div>

            </li>




            <li>
              <Link to="/">
                <CompassIcon />
                {!isMobile || sidebarOpen ? <span>Explorar</span> : null}
              </Link>
            </li>
            <li>
              <Link to="/connect">
                <PeopleIcon />
                {!isMobile || sidebarOpen ? <span>Conectar</span> : null}
              </Link>
            </li>


            {user && (
              <li>
                <Link to={`/profile/${user._id}`}>
                  <img src="/img/image.png" alt="" />
                  {!isMobile || sidebarOpen ? <span>{user.name}</span> : ''}
                </Link>
              </li>
            )}


            <li>
              <button onClick={toggleTheme}>
                {!isMobile || sidebarOpen ? <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span> : null}
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {isMobile && sidebarOpen && <div className="overlay show" onClick={toggleSidebar}></div>}
    </>
  )
}

export default Header
