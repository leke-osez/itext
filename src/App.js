import "./App.css";
import { Routes, BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Navbar from "./components/Navbar";
import { AuthProvider, useStateAuth } from "./context/Auth";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/Profile";
import UsersList from "./components/usersList/UsersList";
import Friends from "./pages/Friends";
import Chat from "./components/Chat";
import { useState } from "react";

function App() {
  const [ isMenu, setIsMenu] = useState(false);

  const showMenu = ()=>{
    setIsMenu(prev=> !prev)
  }

  const cancelMenu = ()=>{
    setIsMenu(false)
  }
  return (
    <div className="h-screen" >
      <Router>
        <AuthProvider>
          <Navbar isMenu = {isMenu} showMenu = {showMenu} cancelMenu = {cancelMenu}/>
          <div onClick={cancelMenu}>

          <Routes>
            <Route
              exact
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              exact
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              exact
              path="/chat/:messageid"
              element={
                <PrivateRoute>
                  <Chat />
                </PrivateRoute>
              }
            />
            <Route
              exact
              path="/friends"
              element={
                <PrivateRoute>
                  <Friends />
                </PrivateRoute>
              }
            />
            <Route path="/signup" element={<Auth signUp={true} />} />
            <Route path="/signin" element={<Auth />} />
          </Routes>
          </div>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
