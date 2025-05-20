import './App.css'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'
import Login from './screens/Login'
import PrivateRoute from './protect/PrivateRoute'
import Register from './screens/Register'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import UserProfile from './screens/UserProfile'
import Dashboard from './screens/Dashboard'
import DashboardAdmin from './screens/DashboardAdmin'
import MyBookings from './components/MyBookings'
import ParkingLots from './components/ParkingLots'
import CreateParkingLot from './components/CreateParkingLot'
import ParkingSpot from './components/ParkingSpot'
import CreateBooking from './components/CreateBooking'
import CreateBookingForm from './components/CreateBookingForm'
import ResetPasswordPage from './components/ResetPasswordPage'
import ErrorBoundary from './errors/ErrorBoundary'
import Vehicles from './components/Vehicles'
import CreateVehicleForm from './components/CreateVehicleForm'

function App() {
  return (
    <div>
    <Router>
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/profile' element={<PrivateRoute><UserProfile/></PrivateRoute>}/>
        <Route path='/dashboard' element={<PrivateRoute><Dashboard/></PrivateRoute>}/>
        <Route path='/admin/dashboard' element={<PrivateRoute><DashboardAdmin/></PrivateRoute>}/>
        <Route path='/bookings' element={<PrivateRoute><MyBookings/></PrivateRoute>}/>
        <Route path='/parking-lots' element={<PrivateRoute><ParkingLots/></PrivateRoute>}/>
        <Route path='/admin/create-parking-lot' element={<PrivateRoute><CreateParkingLot/></PrivateRoute>}/>
        <Route path='/parking-spots' element={<PrivateRoute><ParkingSpot/></PrivateRoute>}/>
        <Route path='/book' element={<PrivateRoute><CreateBooking/></PrivateRoute>}/>
        <Route path='/create-booking-form' element={<PrivateRoute><CreateBookingForm/></PrivateRoute>}/>
        <Route path='/vehicle' element={<PrivateRoute><Vehicles/></PrivateRoute>}/>
        <Route path='/reset-password/:resetToken' element={<ErrorBoundary><ResetPasswordPage/></ErrorBoundary>}/>
        <Route path='/create-vehicle' element={<PrivateRoute><CreateVehicleForm/></PrivateRoute>}/>
      </Routes>
    </Router> 
    <ToastContainer position="top-right" autoClose={3000} pauseOnHover />
    </div>
  )
}

export default App
