import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { register } from '../../redux/auth/authSlice'
import './RegisterPage.scss'

const RegisterPage = () => {

    const [formData, setFormData] = useState({ name: '', email: '',age: '', password: '', password2: '' })
    const { name, email,age, password, password2 } = formData
    const dispatch = useDispatch()

    const onChange = (e) => {
        const { name, value } = e.target
        setFormData((prevState) => ({ ...prevState, [name]: value }))
    }

    const onSubmit = (e) => {
        e.preventDefault()
        dispatch(register(formData))
        console.log('formData', formData)
    }


    return (
        <div className='registerPage'>
           
            <form onSubmit={onSubmit} className='formRegister'>
                 <h2>Registrate!</h2>
                <input type="text" name="name" value={name} onChange={onChange} placeholder='Escribe tu nombre' />
                <input type="email" name="email" value={email} onChange={onChange} placeholder='Escribe tu correo'/>
                <input type="age" name="age" value={age} onChange={onChange} placeholder='Escribe tu edad'/>
                <input type="password" name="password" value={password} onChange={onChange} placeholder='Escribe tu contraseña' />
                <input type="password" name="password2" value={password2} onChange={onChange} placeholder='Escribe la confirmacion de contraseña'/>
                <button type="submit">Register</button>
            </form>
        </div>
    )
}

export default RegisterPage