import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import OTPVerification from './pages/OTPVerification';
import VaultPage from './pages/VaultPage';
import LandingPage from './pages/LandingPage';
import { Signin } from './pages/Signin';
import { Signup } from './pages/Signup';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Router>
          <Routes>
            <Route path="/" element={<LandingPage children={undefined}/>} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/otp-verification" element={<OTPVerification />} />
            <Route path="/access-vault" element={<VaultPage />} />
          </Routes>
      </Router>
    </div>
  );
};

export default App;