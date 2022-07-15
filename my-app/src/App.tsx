import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from './pages/Login';
import Register from './pages/Register';
import { Image, Stack, Text } from "@fluentui/react";
import logo from "./images/Grapevine_Logo.png";
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';

function App() {

  return (
    <Stack wrap={true} styles={{ root: { width: "90%", padding: "10px" } }} tokens={{ childrenGap: "50px" }}>
      <Stack key="grapevineLogo" horizontal={true} styles={{ root: { width: "50%" } }} tokens={{ childrenGap: "10px" }} verticalAlign="center">
        <Image src={logo} />
        <Text variant='large' styles={{ root: { fontWeight: "bold" } }}>Grapevine</Text>
      </Stack>
      <BrowserRouter>
        <Routes>
          <Route path='' element={<Login />} />
          <Route path='register' element={<Register />} />
          <Route path='forgotPassword' element={<ForgotPassword />} />
          <Route path='updatePassword' element={<UpdatePassword />} />
          <Route path='dashboard/*' element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </ Stack>
  );
}

export default App;
