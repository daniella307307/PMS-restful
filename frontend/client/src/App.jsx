import './App.css'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import Login from './screens/Login'
import Home from './screens/Home'
import PrivateRoute from './protect/PrivateRoute'
import Register from './screens/Register'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import UserProfile from './screens/UserProfile'
function App() {
  return (
    <div>
    <Router>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/' element={<Home/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/profile' element={<PrivateRoute><UserProfile/></PrivateRoute>}/>
      </Routes>
    </Router> 
    <ToastContainer position="top-right" autoClose={3000} pauseOnHover />
    </div>
  )
}

export default App
