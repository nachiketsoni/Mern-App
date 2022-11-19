import React, { useEffect, useState } from 'react'
import { registerAsync , loginAsync, myProfileAsync, isLoggedInAsync  } from "../../Store/User/userReducer"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../../../../node_modules/bootstrap/dist/css/bootstrap.min.css"
// import Cookies from 'js-cookie';
// import Cookies from 'universal-cookie';
// import { useEffect } from "react";
const LoginSignup = () => {
    const cookies = new Cookies();
    const dispatch = useDispatch();
    const Navigate = useNavigate();
    const {user , isAuthenticatedUser , error} = useSelector(state => state.user);

    useEffect(() => {
        // console.log(cookies.get('token'))
        // if(Cookies.get("token")){
        //     dispatch(isLoggedInAsync())
        // }
    }, [isAuthenticatedUser]);
    
    // if(error){
    //     alert(error)
    // }
    // if(isAuthenticatedUser){
    //     console.log(user);
    //     Navigate("/myprofile")
    // }else{
    //     console.log(isAuthenticatedUser);
    //     console.log("nah ho paya")
    // }

    console.log(isAuthenticatedUser);
    const [Details, setDetails] = useState({
        name: "",
        password: "",
        email: "",

    });
    
    const changeHandler = (e) => {
        setDetails({...Details, [e.target.name]: e.target.value})
        console.log(Details);
    }


    
    const RegistersubmitHandler = (e) => {
        e.preventDefault();
        console.log(Details , user , isAuthenticatedUser , error) ;
        dispatch(registerAsync(Details));
    }

    const LoginsubmitHandler = (e) => {
        e.preventDefault();
        console.log(Details , user , isAuthenticatedUser , error) ;
        dispatch(loginAsync(Details));
        Navigate('/myprofile');
    }


  return (
    <>  
        <h1 className='text container' >Register </h1>
        <form  className='container mt-5' onSubmit={RegistersubmitHandler} >
            <input onChange={changeHandler} className='form-control mt-2' name='name'  type="text" placeholder="name" />
            <input onChange={changeHandler} className='form-control mt-2' name='email'  type="text" placeholder="email" />
            <input onChange={changeHandler} className='form-control mt-2' name='password'  type="password" placeholder="password" />
            <button className='form-control btn btn-primary mt-2' type="submit">Register</button>
        </form>
        <hr />
        <hr />
        <h1 className='text container' >Login </h1>
        <form  className='container mt-5' onSubmit={LoginsubmitHandler} >
            <input onChange={changeHandler} className='form-control mt-2' name='email'  type="text" placeholder="email" />
            <input onChange={changeHandler} className='form-control mt-2' name='password'  type="password" placeholder="password" />
            <button className='form-control btn btn-primary mt-2' type="submit">Register</button>
        </form>
        
    </>  
  )
}

export default LoginSignup