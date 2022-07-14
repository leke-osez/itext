import "./App.css";
import { Routes, BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/Auth";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/Profile";

function App() {
  return (
    <div>
      <Router>
        <AuthProvider>
          <Navbar />
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
            <Route path="/signup" element={<Auth signUp={true} />} />
            <Route path="/signin" element={<Auth />} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
