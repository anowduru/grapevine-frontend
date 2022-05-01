import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from './pages/Login';
import Register from './pages/Register';
import { Image, Stack, Text } from "@fluentui/react";
import logo from "./images/Grapevine_Logo.png";
import Dashboard from './pages/Dashboard';
import PrepList from './pages/PrepList';
import Tasks from './pages/Tasks';
import Archived from './pages/Archived';

function App() {

  console.log("in App");
  return (
    <Stack wrap={true} styles={{ root: { width: "100%", padding: "30px" } }} tokens={{ childrenGap: "50px" }}>
      <Stack key="grapevineLogo" horizontal={true} styles={{ root: { width: "50%" } }} tokens={{ childrenGap: "10px" }} verticalAlign="center">
        <Image src={logo} />
        <Text variant='large' styles={{ root: { fontWeight: "bold" } }}>Grapevine</Text>
      </Stack>
      <BrowserRouter>
        <Routes>
          <Route path='' element={<Login />} />
          <Route path='register' element={<Register />} />
          <Route path='dashboard' element={<Dashboard />} >
            <Route path='prepList' element={<PrepList />} />
            <Route path='tasks' element={<Tasks />} />
            <Route path='archivedTasks' element={<Archived />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ Stack>
  );
}

export default App;
