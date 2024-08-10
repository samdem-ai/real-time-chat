import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Auth from './pages/auth'
import Chat from './pages/chat'
import Profile from './pages/profile'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/auth' element={<Auth/>}/>
        <Route path='/chat' element={<Chat/>}/>
        <Route path='/profile' element={<Profile/>}/>

        <Route path="*" element={<Navigate to="/auth" replace={true}/>}/>


      </Routes>
   </BrowserRouter>
  )
}

export default App
