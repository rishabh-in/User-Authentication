import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import SignIn from '../login/login';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SignUp from '../register/register';
import Dashboard from '../dashboard/dashboard';

export default function Main() {
    const theme = createTheme();
    return (
		<div>
        <Router>
          <Routes>
            <Route path="/login" exact element={<SignIn />} />
            <Route path="/register" exact element={<SignUp />} />
            <Route path="/dashboard" exact element={<Dashboard />} />
          </Routes>
        </Router>
    </div>
    )
}    
