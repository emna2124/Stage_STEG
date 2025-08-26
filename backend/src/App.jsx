import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'

import Signup from './user/Signup'
import Login from './user/Login'
import { Navigation } from './dashboard/Navigation'
import Home from './dashboard/Home'
import Forgetpass from './user/forgetpass'
import DossierForm from './dashboard/DossierForm'
import DossierList from './dashboard/DossierList'
import { NavigationAgent } from './frontEnd/navigationAgent'
import ResetPass from './user/resetpass'
import FactoryAuth from './user/2FactorAuth'
import DossierHistory from './dashboard/DossierHistory'
import DossierEdit from './dashboard/DossierEdit'
import DossierDetails from './dashboard/DossierDetails'
import Acceuil from './frontEnd/Acceuil'
import ShowProfile from './user/showProfile'
//import Home from './Home'


function App() {

  return (
    <div className="app-wrapper">
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/register' element={<Signup/>}/>
        <Route path='/dashboard' element={<Navigation/>}/>
        <Route path='/agentDashboard' element={<NavigationAgent/>}/>
        <Route path='/codeAuth' element={<FactoryAuth/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/acceuil' element={<Acceuil/>}/>
        <Route path='/forgot-password' element={<Forgetpass/>}/>
        <Route path='/reset-password/:id/:token' element={<ResetPass />} />
        <Route path="/dossiers/new" element={<DossierForm />} />
        <Route path='/dossierList' element={<DossierList/>}/>
        <Route path="/profile/:id" element={<ShowProfile />} />
        <Route path='*' element={<h1>Page not found</h1>}/> 
        <Route path="/dossiers/:id/edit" element={<DossierEdit />} />
        <Route path="/dossiers/:id/history" element={<DossierHistory />} />
        <Route path="/dossiers/:id/details" element={<DossierDetails />} />
        
      </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App