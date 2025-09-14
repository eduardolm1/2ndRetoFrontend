import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || "/api";

const register = async (userData) => {
 const res = await axios.post(`${API_URL}/users/register`,userData)
 return res.data
}

const login = async (userData) => {
 const res = await axios.post(`${API_URL}/users/login`, userData)
 if (res.data) {
   localStorage.setItem('user', JSON.stringify(res.data.user))
   localStorage.setItem('token', JSON.stringify(res.data.token))
 }
 return res.data
}
const logout = async (userData) => {
const token = JSON.parse(localStorage.getItem('token'))
 const res = await axios.post(`${API_URL}/users/logout`, userData,{
   headers: {
     "Authorization": token,
   }
 })
  if (res.data) localStorage.clear()
 return res.data
}

const getInfo = async (id) => {
  const token = JSON.parse(localStorage.getItem('token'));
  const res = await axios.get(`${API_URL}/users/getInfo/${id}`, {
    headers: {
      "Authorization": `${token}`
    }
  })
  return res.data
}
const getUsers = async () => {
  const token = JSON.parse(localStorage.getItem("token"));
  const res = await axios.get(`${API_URL}/users/`, {
    headers: { Authorization: `${token}` },
  });
  return res.data;
};

const authService = {
 register,
 login,
 logout,
 getUsers,
 getInfo
}

export default authService