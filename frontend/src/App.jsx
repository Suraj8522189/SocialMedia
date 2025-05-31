import { Loader } from "lucide-react";
import { useEffect } from 'react';
import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import { Navbar } from './components/Navbar';
import ChatPage from "./Pages/ChatPage.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import ProfilePage from "./Pages/ProfilePage.jsx";
import SettingPage from "./Pages/SettingPage.jsx";
import SignUpPage from "./Pages/SignUpPage.jsx";
import { useAuthStore } from './store/useAuthStore.js';
import { useThemeStore } from "./store/useThemeStore.js";
import PostPage from "./Pages/PostPage.jsx";
const App = () => {
  const {authUser,checkAuth,isCheckingAuth}=useAuthStore();
  const {theme} = useThemeStore();
  
  
  useEffect(() => {
    checkAuth();
    
  }, [checkAuth])
  

  if(isCheckingAuth && !authUser){
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader className="size-10 animate-spin"/>
      </div>
    )
  }

  return (

      <div data-theme={theme}>
        <Navbar/>
        <Routes>
          <Route path='/' element={authUser ? <PostPage/>:<Navigate to="/login"/>}/>
          <Route path='/chat' element={authUser ? <ChatPage/>:<Navigate to="/login"/>}/>
          <Route path='/signup' element={!authUser ? <SignUpPage/>:<Navigate to="/"/>}/>
          <Route path='/login' element={!authUser ? <LoginPage/>:<Navigate to="/login"/>}/>
          <Route path='/settings' element={<SettingPage/>}/>
          <Route path='/profile' element={authUser?<ProfilePage/>:<Navigate to="/login"/>}/>
        </Routes>

        <Toaster />
      </div>
  )
}

export default App
