import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // You aliased BrowserRouter as Router
import Login from './Login/Login';
import Profile from './Pages/Profile/Profile';
import EditProfile from './Pages/EditProfile/EditProfile';

const App = () => {
  return (
    <Router> {/* Use Router instead of BrowserRouter */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Login />} /> {/* Default Route */}
        <Route path="/edit-profile" element={<EditProfile />} />
      </Routes>
    </Router>
  );
};

export default App;
