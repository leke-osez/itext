import "./App.css";
import { Routes, BrowserRouter as Router, Route } from "react-router-dom";
import Messages from "./pages/Messages";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Friends from "./pages/Friends";
import Profile from "./pages/Profile";

import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/Auth";
import PrivateRoute from "./components/PrivateRoute";
import Chat from "./components/chat/Chat";
import Layout from "./components/Layout";
import { useState } from "react";
import Drops from "./pages/Drops";
import DropPage from "./pages/DropPage";
import ProfileContents from "./components/profile/ProfileContents";
import ProfileContentsHome from "./components/profile/profileContentHome";
import Settings from "./pages/Settings";

function App() {
  const [isMenu, setIsMenu] = useState(false);

  const showMenu = () => {
    setIsMenu((prev) => !prev);
  };

  const cancelMenu = () => {
    setIsMenu(false);
  };
  return (
    <div className="h-screen">
      <Router>
        <AuthProvider>
          <div onClick={cancelMenu}>
            <Routes>
              {/* LAYOUT ROUTE */}
              <Route path="/" element={<Layout />}>

                {/* MESSAGES ROUTE */}
                <Route
                  exact
                  path="/chat/"
                  element={
                    <PrivateRoute>
                      <Messages />
                    </PrivateRoute>
                  }
                >
                  {/* <Route
                  exact
                  path=":messageid"
                  element={
                    <PrivateRoute>
                      <Chat />
                    </PrivateRoute>
                  }
                /> */}
                </Route>
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
                  path="settings"
                  element={
                    <PrivateRoute>
                      <Settings />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/profile/:userId"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                >
                  
                  <Route
                  exact
                  path=':location'
                  element={
                    <PrivateRoute>
                      <ProfileContents />
                    </PrivateRoute>
                  }
                />
                
                
                </Route>
                
                <Route
                  exact
                  path="/drops"
                  element={
                    <PrivateRoute>
                      <Drops />
                    </PrivateRoute>
                  }
                />
                <Route
                  exact
                  path={`/drop/:id`}
                  element={
                    <PrivateRoute>
                      <DropPage />
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
                
              </Route>
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
