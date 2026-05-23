import ExpenseContainer from "./Components/ExpenseContainer"
import {BrowserRouter,Routes,Route,Link} from 'react-router-dom'
import Home from './Home'
import Post from './Post.jsx'

function App(){
  return(
    <>
  <BrowserRouter>
  
  <Routes>
    <Route path='/' element={<Home/>}/>
     <Route path='/expense' element={<ExpenseContainer/>}/>
     <Route path='/user/:id' element={<Post/>}/>
   
  </Routes>
  
  </BrowserRouter>
    </>
  )
}
export default App