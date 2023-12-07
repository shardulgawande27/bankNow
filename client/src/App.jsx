import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Account from "./pages/Account";
import BLogin from "./pages/BLogin";
import Navbar from "./components/Navbar";
import Customers from "./pages/Customers";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const isUserSignedIn = !!localStorage.getItem("token");

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/bankerlogin" element={<BLogin />} />
          {/* {isUserSignedIn && <Route path="/account" element={<Account />} />} */}
          {/* {isUserSignedIn && (
            <Route path="/customers" element={<Customers />} />
          )} */}
          <Route
            path="/customers"
            element={
              <ProtectedRoute>
                <Customers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
