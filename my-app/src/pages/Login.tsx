import { Label, Link, PrimaryButton, Stack, StackItem, Text, TextField } from '@fluentui/react';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import useWindowDimensions, { BaseUrl } from '../utilities';

function Login() {
    const history = useNavigate();
    const viewPort = useWindowDimensions();
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [userNameError, setUserNameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleUserNameChange = (_event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setUserName(newValue ?? "");
        setUserNameError("");
        setErrorMessage("");
    }

    const handlePasswordChange = (_event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setPassword(newValue ?? "");
        setPasswordError("");
        setErrorMessage("");
    }

    const onClickLogin = async () => {
        var isValid = true;
        if (userName.length === 0) {
            setUserNameError("Invalid Username")
            isValid = false;
        }

        if (password.length === 0) {
            setPasswordError("Invalid Password");
            isValid = false;
        }
        if (!isValid)
            return;
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
        console.log(data);
        if (data.status === 'ok') {
            localStorage.setItem('token', data.userToken);
            if (data.resetPasswordNeeded) {
                history('/updatePassword', { state: { userName: userName } });
            } else {
                history('/dashboard/preplist');
            }
        } else {
            setErrorMessage(data.message);
        }
    }

    const loginPanelWidth = ["s", "m", "l"].includes(viewPort) ? "250px" : "500px";

    return (
        <Stack styles={{ root: { height: "400px", padding: "30px" } }} horizontalAlign='end' verticalAlign='center'>
            <StackItem styles={{ root: { padding: "50px", backgroundColor: "purple", width: loginPanelWidth } }}>
                <Stack tokens={{ childrenGap: "25px" }} >
                    <StackItem align='center' >
                        <Text variant='large' styles={{ root: { fontWeight: "bold", color: 'white' } }}>Welcome</Text>
                    </StackItem>
                    <TextField placeholder='UserName' styles={{ errorMessage: { color: 'white', fontWeight: 'bold' } }} errorMessage={userNameError} value={userName} onChange={handleUserNameChange} />
                    <TextField type="password" styles={{ errorMessage: { color: 'white', fontWeight: 'bold' } }} errorMessage={passwordError} canRevealPassword required placeholder='Password' value={password} onChange={handlePasswordChange} />
                    <Link href="/register" styles={{ root: { color: "white", textAlign: 'right', fontWeight: "bold" } }} underline>New User? Register</Link>
                    <Link href="/forgotPassword" styles={{ root: { color: "white", textAlign: 'right', fontWeight: "bold" } }} underline>Forgot Password?</Link>
                    <PrimaryButton style={{ backgroundColor: "green" }} text='Login' onClick={onClickLogin}></PrimaryButton>
                    <Label styles={{ root: { color: 'white', fontWeight: 'bold' } }}>{errorMessage}</Label>
                </Stack>
            </StackItem>
        </Stack>
    );
}

export default Login;