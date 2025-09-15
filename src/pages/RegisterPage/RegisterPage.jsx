import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { register } from '../../redux/auth/authSlice'
import { Link, useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'

const RegisterPage = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    age: '', 
    password: '', 
    password2: '' 
  })
  const { name, email, age, password, password2 } = formData
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({ ...prevState, [name]: value }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (password !== password2) {
      toast.error("Las contraseñas no coinciden")
      return
    }

    dispatch(register(formData))
      .unwrap()
      .then(() => {
        toast.success("Registro exitoso. Redirigiendo al login...")
        setTimeout(() => navigate("/login"), 1500)
      })
      .catch((err) => {
        toast.error(err.message || "Error al registrar. Intenta nuevamente.")
      })
  }

  return (
    <div className='registerPage'>
      <form onSubmit={onSubmit} className='formRegister'>
        <h2>¡Regístrate!</h2>
        <input type="text" name="name" value={name} onChange={onChange} placeholder='Escribe tu nombre' required />
        <input type="email" name="email" value={email} onChange={onChange} placeholder='Escribe tu correo' required />
        <input type="number" name="age" min={1} value={age} onChange={onChange} placeholder='Escribe tu edad' required />
        <input type="password" name="password" value={password} onChange={onChange} placeholder='Escribe tu contraseña' required />
        <input type="password" name="password2" value={password2} onChange={onChange} placeholder='Confirma tu contraseña' required />

        <button type="submit" className="btn-primary">Registrarse</button>
        <p className="redirect-text">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
      <Toaster />
    </div>
  )
}

export default RegisterPage
