import React from "react";
import NavBar from "./component/NavBar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import LogIn from "./pages/LogIn";
import Register from "./pages/Register";
import PostDetails from "./pages/postDetails";
import CrudPost from "./pages/CrudPost";
import Footer from "./component/footer";

const App = () => {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/modify" element={<CrudPost />} />
        <Route path="/postdetails/:id" element={<PostDetails />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
