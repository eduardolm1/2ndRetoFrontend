import React from 'react'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'


const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    console.log(user)
  }, [])
  
  return (
    <>
      <h1>Profile</h1>
      <p>{user.name}</p>
      <p>{user.age}</p>
      <p>{user.email}</p>
    </>
  )
}

export default ProfilePage