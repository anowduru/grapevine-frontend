import { Link, PrimaryButton, Stack, StackItem, Text, TextField } from '@fluentui/react';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import useWindowDimensions, { BaseUrl } from '../utilities';

function ForgotPassword() {
    const history = useNavigate();
    const viewPort = useWindowDimensions();
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [userNameError, setUserNameError] = useState('');
    const [emailError, setEmailError] = useState('');

    const handleUserNameChange = (_event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setUserName(newValue ?? "");
        setUserNameError("");
    }

    const handleEmailChange = (_event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setEmail(newValue ?? "");
        setEmailError("");
    }

    const onClickForgotPassword = async () => {
        var isValid = true;
        if (userName.length === 0) {
            setUserNameError("Invalid Username")
            isValid = false;
        }

        if (email.length === 0) {
            setEmailError("Invalid Email");
            isValid = false;
        }
        if (!isValid)
            return;
        const response = await fetch(`${BaseUrl}/forgotPassword`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                userName,
                email
            })
        })

        const data = await response.json();
        console.log(data)

        if (data.userToken) {
            localStorage.setItem('token', data.userToken);
            history('/dashboard/preplist');
        } else {
            alert(data.status);
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
                    <TextField styles={{ errorMessage: { color: 'white', fontWeight: 'bold' } }} errorMessage={emailError} placeholder='Email address' value={email} onChange={handleEmailChange} />
                    <PrimaryButton style={{ backgroundColor: "green" }} text='Forgot Password' onClick={onClickForgotPassword}></PrimaryButton>
                    <Link href="/" styles={{ root: { color: "white", textAlign: 'right', fontWeight: "bold" } }} underline>Back to Login</Link>
                </Stack>
            </StackItem>
        </Stack>
    );
}

export default ForgotPassword;