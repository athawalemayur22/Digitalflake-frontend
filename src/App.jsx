import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useState } from "react";
import RefreshHandler from "./RefreshHandler";


import {Home,Login, City, State, Warehouse, Error, Navbar, Sidebar} from "./pages/index"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const PrivateRoute = ({element}) => {
    return isAuthenticated ? element : <Navigate to="/login"/>
  }

  const location = useLocation();
  const isLoginPage = location.pathname === "/login"; 

  return (
    <div className="App">
      <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
      {/* <Navbar /> */}
      {!isLoginPage && <Navbar />}
      <Sidebar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/state" element={<State />} />
        <Route path="/city" element={<City />} />
        <Route path="/warehouse" element={<Warehouse />} />
        <Route path="/home" element={<PrivateRoute element={<Home />} />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );

}

export default App;
