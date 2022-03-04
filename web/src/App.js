import React from 'react';
import "./App.css"
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './pages';
import About from './pages/About';
import Services from './pages/Services';

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Services/>} />
        <Route path='/lottery' element={<Services/>} />
        <Route path='/about' element={<About/>} />
      </Routes>
    </Router>
  );
}

export default App;
