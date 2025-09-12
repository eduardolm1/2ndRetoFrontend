import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { login } from '../../redux/auth/authSlice'
import { useNavigate, Link } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const { email, password } = formData
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onSubmit = (e) => {
    e.preventDefault()

    dispatch(login(formData))
      .unwrap()
      .then(() => {
        toast.success("Inicio de sesión exitoso")
        setTimeout(() => navigate('/'), 1000)
      })
      .catch((err) => {
        toast.error(err.message || "Credenciales incorrectas. Inténtalo de nuevo.")
      })
  }

  return (
    <div className="loginPage">
      <form onSubmit={onSubmit} className='formLogin'>
        <h2>¡Inicia sesión!</h2>
        <input 
          type="email" 
          name="email" 
          value={email} 
          onChange={onChange} 
          placeholder='Escribe tu correo' 
          required 
        />
        <input 
          type="password" 
          name="password" 
          value={password} 
          onChange={onChange} 
          placeholder='Escribe tu contraseña' 
          required 
        />

        <button type="submit" className="btn-primary">Login</button>
        <p className="redirect-text">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </form>
      <p>Para el backend se esta usando Render puede ser que tarde medio minuto la primera vez en encenderse</p>
      <Toaster />
    </div>
  )
}

export default LoginPage
