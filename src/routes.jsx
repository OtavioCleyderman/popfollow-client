import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header/Header";
import Nav from "./components/Nav/Nav";
import ButtonCreate from "./components/ButtonCreate/ButtonCreate";
import SignUp from "./pages/Auth/SignUp";
import SignIn from "./pages/Auth/SignIn";
import Home from "./pages/Home/Home";
import Favorites from "./pages/Favorites/Favorites";
import Account from "./pages/Account/Account";
import ProtectedRoute from "./ProtectedRoute";
import Details from "./pages/Details/Details";

const AppRoutes = () => {
  const location = useLocation();
  const showHeaderAndNav = !(
    location.pathname.includes("/signin") ||
    location.pathname.includes("/signup") ||
    location.pathname.startsWith("/details/")
  );
 
  const [searchValue, setSearchValue] = useState("");

  function handleFilter(value) {
    setSearchValue(value);
  }

  return (
    <>
      {showHeaderAndNav && <Header onFilter={handleFilter} />}
      {showHeaderAndNav && <ButtonCreate />}
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route index element={ <ProtectedRoute><Home searchValue={searchValue} onFilter={handleFilter}/></ProtectedRoute>} />
        <Route path="/favorites" element={<ProtectedRoute><Favorites searchValue={searchValue} onFilter={handleFilter}/></ProtectedRoute>} />
        <Route path="/details/:id" element={<ProtectedRoute><Details /></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
      </Routes>
      {showHeaderAndNav && <Nav />}
    </>
  );
};

export default AppRoutes;







