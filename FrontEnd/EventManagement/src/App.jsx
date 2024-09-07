import React, { useState, useEffect } from 'react';
import Navbar from './Components/Navbar';
import SignupPage from './Components/SignUpPage';
import Login from './Components/LoginPage';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Events from './Components/Home';
import OrganizerDashboard from './Components/OrganizerDashboard';
import BookedEvents from './Components/BookedEvents';
import HomePage from './Components/HomePage';



const App = () => {
  const [authState, setAuthState] = useState({
    user: JSON.parse(localStorage.getItem('User')) || null,
  });

  useEffect(() => {

    const storedUser = JSON.parse(localStorage.getItem('User'));
    setAuthState({ user: storedUser });
  }, [authState]);
  

  return (
    <Router>
      <Navbar authState={authState} setAuthState={setAuthState} />
      <Routes>
        <Route path="/" element= {<HomePage/> } />
        <Route path="/signup" element={!authState.user ? <SignupPage setAuthState={setAuthState} /> : <Navigate to="/" />} />
        <Route path="/login" element={!authState.user ? <Login setAuthState={setAuthState} /> : <Navigate to="/" />} />
        <Route path="/organizer/dashboard" element={ <OrganizerDashboard /> } />
        <Route path="/booked/events" element={ <BookedEvents /> } />
        <Route path="/events" element= {<Events/> } />
      </Routes>
      <ToastContainer
      position="top-center"
      hideProgressBar={true}
      autoClose={2000}
      />
    </Router>
  );
};

export default App;
