import { Dropdown, IDropdownOption, Link, PrimaryButton, Stack, StackItem, Text, TextField } from '@fluentui/react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useWindowDimensions, { BaseUrl } from '../utilities';

function Register() {
    const history = useNavigate();
    const viewPort = useWindowDimensions();

    const [userName, setUserName] = useState('');
    const [userNameError, setUserNameError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');
    const [userType, setUserType] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    const handleUserNameChange = (_event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setUserName(newValue ?? "");
        setUserNameError("")
    }

    const handlePasswordChange = (_event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setPassword(newValue ?? "");
        setPasswordError("")
    }

    const handleNameChange = (_event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setName(newValue ?? "");
        setNameError("")
    }

    const handleEmailChange = (_event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setEmail(newValue ?? "");
        setEmailError("")
    }

    const handleUserTypeChange = (_event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
        setUserType(option?.key.toString() ?? "");
    }

    const onClickRegister = async () => {

        var isValid = true;
        if (userName.length === 0) {
            setUserNameError("Username must be provided")
            isValid = false;
        }

        if (password.length === 0) {
            setPasswordError("Password must be provided")
            isValid = false;
        }

        if (email.length === 0) {
            setEmailError("Email must be provided")
            isValid = false;
        }

        if (name.length === 0) {
            setNameError("Name must be provided")
            isValid = false;
        }

        if (!isValid)
            return;

        const response = await fetch(`${BaseUrl}/register`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                userName,
                password,
                name,
                userType,
                email
            })
        })

        const data = await response.json();
        if (data.userToken) {
            localStorage.setItem('token', data.userToken);
            history('/dashboard/preplist');
        } else {
            alert('Login Failed');
        }
    }

    const registerPanelWidth = ["s", "m", "l"].includes(viewPort) ? "250px" : "500px";

    return (
        <Stack styles={{ root: { width: "100%", height: "400px", padding: "50px" } }} horizontalAlign='end' verticalAlign='center'>
            <StackItem styles={{ root: { padding: "50px", backgroundColor: "purple", width: registerPanelWidth } }}>
                <Stack tokens={{ childrenGap: "25px" }} >
                    <StackItem align='center' >
                        <Text variant='large' styles={{ root: { fontWeight: "bold", color: 'white' } }}>Welcome</Text>
                    </StackItem>
                    <TextField placeholder='UserName' required value={userName} errorMessage={userNameError} onChange={handleUserNameChange} styles={{ errorMessage: { color: 'white', fontWeight: 'bold' } }} />
                    <TextField type="password" canRevealPassword required placeholder='Password' value={password} errorMessage={passwordError} onChange={handlePasswordChange} styles={{ errorMessage: { color: 'white', fontWeight: 'bold' } }} />
                    <Dropdown
                        placeholder="Select User Type"
                        options={[
                            { key: 'Admin', text: 'Admin/Chef' },
                            { key: 'Chef', text: 'Sous Chef' }
                        ]}
                        onChange={handleUserTypeChange}
                        required={true}
                    />
                    <TextField required placeholder='Full Name' value={name} errorMessage={nameError} onChange={handleNameChange} styles={{ errorMessage: { color: 'white', fontWeight: 'bold' } }} />
                    <TextField required placeholder='Email address' value={email} errorMessage={emailError} onChange={handleEmailChange} styles={{ errorMessage: { color: 'white', fontWeight: 'bold' } }} />
                    <PrimaryButton style={{ backgroundColor: "green" }} text='Register' onClick={onClickRegister}></PrimaryButton>
                    <Link href="/" styles={{ root: { color: "white", textAlign: 'right', fontWeight: "bold" } }} underline>Login</Link>
                </Stack>
            </StackItem>
        </Stack>
    );
}

export default Register;