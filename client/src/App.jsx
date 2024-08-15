import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Auth from "./pages/auth";
import Chat from "./pages/chat";
import Profile from "./pages/profile";
import { useAppStore } from "@/store";
import { useEffect, useState } from "react";
import { apiClient } from "./lib/api-client";
import { GET_USER_INFO } from "./utils/constants";

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};
const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return !isAuthenticated ? children : <Navigate to="/chat" />;
};

function App() {
  const { userInfo, setUserInfo } = useAppStore()
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await apiClient.get(GET_USER_INFO, { withCredentials: true })
        if (response.status === 200 && response.data.user.id) {
          setUserInfo(response.data.user)
        } else {
          setUserInfo(undefined)
        }
      } catch (e) {
        setUserInfo(undefined)
        console.log(e)
      } finally {
        setLoading(false)
      }
    }

    if (!userInfo) {
      getUserData()
    } else {
      setLoading(false)
    }

  }, [userInfo, setUserInfo])

  if (loading) {
    return <div class="flex justify-center items-center h-screen">
      <div class="relative inline-flex">
        <div class="w-8 h-8 bg-blue-500 rounded-full"></div>
        <div class="w-8 h-8 bg-blue-500 rounded-full absolute top-0 left-0 animate-ping"></div>
        <div class="w-8 h-8 bg-blue-500 rounded-full absolute top-0 left-0 animate-pulse"></div>
      </div>
    </div>
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={
            <AuthRoute>
              <Auth />
            </AuthRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/auth" replace={true} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
