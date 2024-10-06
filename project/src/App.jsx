import React from "react";
import NavBar from "./component/NavBar";
import { BrowserRouter, Route, Routes, Navigate, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import LogIn from "./pages/LogIn";
import Register from "./pages/Register";
import PostDetails from "./pages/postDetails";
import CrudPost from "./pages/CrudPost";
import Footer from "./component/footer";
import { AuthProvider, useAuth } from "../Hooks/AuthContext";
import Chat from "./pages/Chat";

const Layout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <NavBar />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

const ProtectedRoute = () => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

const PublicRoute = () => {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/home" replace />;
  }
  return <Outlet />;
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate replace to="/login" />} />

          <Route element={<PublicRoute />}>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<LogIn />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route
              path="/home"
              element={
                <Layout>
                  <Home />
                </Layout>
              }
            />
            <Route
              path="/modify"
              element={
                <Layout>
                  <CrudPost />
                </Layout>
              }
            />
            <Route
              path="/postdetails/:id"
              element={
                <Layout>
                  <PostDetails />
                </Layout>
              }
            />
            <Route
              path="/chat"
              element={
                <Layout>
                  <Chat />
                </Layout>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
