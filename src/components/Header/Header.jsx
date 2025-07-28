import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Header.scss'
import { logout } from '../../redux/auth/authSlice'
import { useDispatch, useSelector } from 'react-redux'

const Header = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)

    const onLogout = (event) => {
        event.preventDefault()
        dispatch(logout())
        navigate('/login')
    }
    return (
        <>
            <header >
                <nav >
                    <ul className='header'>
                        {user && user ? (
                            <button onClick={onLogout}>Logout</button>) : (
                            <>
                                <Link to="/login">Login</Link>
                                <Link to="/register">Register</Link>
                            </>
                        )}
                        <li><Link to='/'>Home</Link></li>
                        {user && user?(<li><Link to='/profile'>Profile</Link></li>):(<></>)}
                    </ul>
                </nav>
            </header>
        </>
    )
}

export default Header