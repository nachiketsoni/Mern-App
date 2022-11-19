import {useState} from 'react'
import axios from '../AxiosConfig/axios'
// import axios from 'axios'
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css"
const Signup = () => {

    const [Signup, setSignup] = useState({
        name: "",
        password: "",
        email: "",

    });
    const SubmitHandler = async (e) => {
        e.preventDefault();
        console.log(Signup);
        try {
            const {data} = await axios.post("/register", Signup);
            console.log(data);
        } catch (error) {   
            console.log(error);
        }
    
    }

    const changeHandler = (e) => {
        setSignup({...Signup, [e.target.name]: e.target.value})
    }
  return (
    <div>
      <form className='container m-5' onSubmit={SubmitHandler} >
            <input className='form-control' onChange={changeHandler} type="text" placeholder='name'  name='name' />
            <input className='form-control' onChange={changeHandler} type="email" placeholder='email' name="email"  />
            <input className='form-control' onChange={changeHandler} type="password" placeholder='password' name='password'  />
            <input className='form-control btn btn-primary' type="submit" />
      </form>
    </div>
  )
}

export default Signup
