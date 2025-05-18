import './App.css'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import Login from './screens/Login'
import Home from './screens/Home'
import PrivateRoute from './protect/PrivateRoute'
import Register from './screens/Register'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import UserProfile from './screens/UserProfile'
import Dashboard from './screens/Dashboard'
import DashboardAdmin from './screens/DashboardAdmin'
import MyBookings from './components/MyBookings'
function App() {
  return (
    <div>
    <Router>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/' element={<Home/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/profile' element={<PrivateRoute><UserProfile/></PrivateRoute>}/>
        <Route path='/dashboard' element={<PrivateRoute><Dashboard/></PrivateRoute>}/>
        <Route path='/admin/dashboard' element={<PrivateRoute><DashboardAdmin/></PrivateRoute>}/>
        <Route path='/bookings' element={<PrivateRoute><MyBookings/></PrivateRoute>}/>
      </Routes>
    </Router> 
    <ToastContainer position="top-right" autoClose={3000} pauseOnHover />
    </div>
  )
}

export default App
