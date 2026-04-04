import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Explore from './pages/Explore';
import PincodeDetails from './pages/PincodeDetails';
import About from './pages/About';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-background relative overflow-hidden selection:bg-primary/20 selection:text-primary transition-colors duration-500">
        {/* Futuristic Background Accents */}
        <div className="bg-glow-primary w-[500px] h-[500px] top-[-10%] right-[-10%]" />
        <div className="bg-glow-primary w-[400px] h-[400px] bottom-[-5%] left-[-5%] opacity-30" />
        
        <Navbar />
        <main className="transition-all duration-500 pt-20">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/pincode/:pincode" element={<PincodeDetails />} />
            <Route path="/pincode" element={<Explore />} /> 
            <Route path="/about" element={<About />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
        
        <footer className="py-20 text-center border-t border-white/5 mx-auto max-w-7xl mt-20 opacity-40">
            <p className="text-text-muted font-bold tracking-widest text-[10px] uppercase mb-2">Designed by Antigravity Assistant</p>
            <p className="text-text-muted/60 font-medium text-xs">© 2026 IndiaPin Ecosystem. Powered by Aqua Intelligence.</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
