import "./App.css";
import { Routes, BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/Auth";

function App() {
  return (
    <div>
      <AuthProvider>
        <Navbar />
        <Router>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/signup" element={<Auth signUp={true} />} />
            <Route path="/signin" element={<Auth />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
