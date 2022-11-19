import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { myProfileAsync } from "../../Store/User/userReducer"

const Mypofile = () => {
    const dispatch =  useDispatch()
    const data  = useSelector(state => state.user)
    console.log(data);

    let name = ""
    let email = ""
    if(data.user){
        name = data.user.user.name
        email = data.user.user.email
    }

  return (
    <div>
        <h1 className='title' >My Profile </h1>
        <h2>name :  {name}</h2>
        <h2>email : {email}</h2>
    </div>
  )
}

export default Mypofile