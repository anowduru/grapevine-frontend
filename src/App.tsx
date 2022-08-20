import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from './pages/Login';
import Register from './pages/Register';
import { Image, Stack, StackItem, Text } from "@fluentui/react";
import logo from "./images/Grapevine_Logo.png";
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';

function App() {

  return (
    <Stack styles={{ root: { padding: "10px" } }} tokens={{ childrenGap: "50px" }}>
      <Stack key="grapevineLogo" horizontal={true} styles={{ root: { width: "50%" } }} tokens={{ childrenGap: "10px" }} verticalAlign="center">
        <Image src={logo} />
        <Text variant='large' styles={{ root: { fontWeight: "bold" } }}>Grapevine</Text>
      </Stack>
      <StackItem>
        <BrowserRouter>
          <Routes>
            <Route path='' element={<Login />} />
            <Route path='register' element={<Register />} />
            <Route path='forgotPassword' element={<ForgotPassword />} />
            <Route path='updatePassword' element={<UpdatePassword />} />
            <Route path='dashboard/*' element={<Dashboard />} />
          </Routes>
        </BrowserRouter>
      </StackItem>
    </ Stack>
  );
}

export default App;
