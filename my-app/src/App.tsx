import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from './pages/Login';
import Register from './pages/Register';
import { Image, Stack, Text } from "@fluentui/react";
import logo from "./images/Grapevine_Logo.png";
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Stack wrap={true} styles={{ root: { width: "100%", padding: "30px 0 0" } }} tokens={{ childrenGap: "20px" }}>
      <Stack key="grapevineLogo" horizontal={true} tokens={{ childrenGap: "10px" }} verticalAlign="center">
        <Image src={logo} />
        <Text variant='large' styles={{ root: { fontWeight: "bold", } }}>Grapevine</Text>
      </Stack>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/dashboard/*' element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </ Stack>
  );
}

export default App;
