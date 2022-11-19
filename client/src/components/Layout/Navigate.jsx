import React from 'react'
import { BrowserRouter, Route, Routes  } from 'react-router-dom'
import LoginSignup from './User/LoginSignup'
import Mypofile from './User/Mypofile'
const Navigate = () => {
  return (
   <>
   <BrowserRouter>


    <Routes>
        <Route path='/myprofile' element={<Mypofile />} />
        <Route path='/' element={<LoginSignup/>} />
    </Routes>

   </BrowserRouter>
   </>
  )
}

export default Navigate