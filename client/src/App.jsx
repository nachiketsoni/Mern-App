import React from 'react'
import Navbar from './Components/Navbar' 
import ProductList from './Components/ProductList'
import { Routes ,Route} from 'react-router-dom'
import SingleProduct from './Components/SingleProduct'
const App = () => {
  return (
    
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProductList/>}/>
        <Route path="/product" element={<SingleProduct/>}/>
      </Routes>

    </div>
  )
}

export default App
