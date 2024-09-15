import React from "react";
import NavBar from "./component/NavBar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import LogIn from "./pages/LogIn";
import Register from "./pages/Register";
import PostDetails from "./pages/postDetails";
import CrudPost from "./pages/CrudPost";
import Footer from "./component/footer";
import { AuthProvider } from "../Hooks/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <NavBar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LogIn />} />
              <Route path="/register" element={<Register />} />
              <Route path="/modify" element={<CrudPost />} />
              <Route path="/postdetails/:id" element={<PostDetails />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
