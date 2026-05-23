import React, { useState, useEffect } from "react"
import ExpenseContainer from "./Components/ExpenseContainer"
import {BrowserRouter,Routes,Route,Link,Navigate} from 'react-router-dom'
import Home from './Home'
import Post from './Post.jsx'
import AuthPage from './AuthPage'

function App(){
  const [user, setUser] = useState(localStorage.getItem('currentUser'));

  const handleLogin = (username) => {
    localStorage.setItem('currentUser', username);
    setUser(username);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  return(
    <>
  <BrowserRouter>
  {user && <button className="logout-btn" onClick={handleLogout} style={{position: 'absolute', top: 10, right: 10, width: 'auto', padding: '10px 20px'}}>Logout ({user})</button>}
  <Routes>
     <Route path='/' element={user ? <Navigate to="/expense" /> : <AuthPage onLogin={handleLogin} />}/>
     <Route path='/expense' element={user ? <ExpenseContainer user={user}/> : <Navigate to="/" />}/>
     <Route path='/user/:id' element={<Post/>}/>
   
  </Routes>
  
  </BrowserRouter>
    </>
  )
}
export default App