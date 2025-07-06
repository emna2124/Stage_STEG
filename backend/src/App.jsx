import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'

import Signup from './user/Signup'
import Login from './user/Login'
import { Navigation } from './dashboard/Navigation'
//import Home from './Home'


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigation/>}/>
        <Route path='/register' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App