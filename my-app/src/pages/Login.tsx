import { PrimaryButton, Stack, StackItem, Text, TextField } from '@fluentui/react';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { BaseUrl } from '../utilities';

function Login() {
    const history = useNavigate();
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const handleUserNameChange = (_event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setUserName(newValue ?? "");
    }

    const handlePasswordChange = (_event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setPassword(newValue ?? "");
    }

    const onClickLogin = async () => {
        const response = await fetch(`${BaseUrl}/login`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                userName,
                password
            })
        })

        const data = await response.json();

        if (data.userToken) {
            localStorage.setItem('token', data.userToken);
            history('/dashboard');
        } else {
            alert('Login Failed');
        }
        console.log(data);
    }

    return (
        <Stack styles={{ root: { width: "100%", height: "400px", padding: "30px" } }} horizontalAlign='end' verticalAlign='center'>
            <StackItem styles={{ root: { padding: "50px", backgroundColor: "purple", width: "40%" } }}>
                <Stack tokens={{ childrenGap: "25px" }} >
                    <StackItem align='center' >
                        <Text variant='large' styles={{ root: { fontWeight: "bold", color: 'white' } }}>Welcome</Text>
                    </StackItem>
                    <TextField placeholder='UserName' required value={userName} onChange={handleUserNameChange} />
                    <TextField type="password" canRevealPassword required placeholder='Password' value={password} onChange={handlePasswordChange} />
                    <PrimaryButton style={{ backgroundColor: "green" }} text='Login' onClick={onClickLogin}></PrimaryButton>
                </Stack>
            </StackItem>
        </Stack>
    );
}

export default Login;