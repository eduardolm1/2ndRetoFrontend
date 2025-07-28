import { useState } from 'react'
import './LoginPage.scss'
import { useDispatch } from 'react-redux'
import { login } from '../../redux/auth/authSlice'
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' })
    const { email, password } = formData
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }))
    }

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const onSubmit = (e) => {
        e.preventDefault()
        console.log('formData', formData)
        dispatch(login(formData))
        setTimeout(() => {
            navigate('/')
        }, 1000);

    }
    return (
        <form onSubmit={onSubmit} className='formLogin'>
            <h2>Inicia sesión!</h2>
            <input type="email" name="email" value={email} onChange={onChange} placeholder='Escribe tu nombre' />
            <input type="password" name="password" value={password} onChange={onChange} placeholder='Escriba su contraseña' />
            <button type="submit">Login</button>
        </form>
    )
}


export default LoginPage