import { Dropdown, IDropdownOption, Link, PrimaryButton, Stack, StackItem, Text, TextField } from '@fluentui/react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useWindowDimensions, { BaseUrl } from '../utilities';

function Register() {
    const history = useNavigate();
    const viewPort = useWindowDimensions();

    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [userType, setUserType] = useState('');

    const handleUserNameChange = (_event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setUserName(newValue ?? "");
    }

    const handlePasswordChange = (_event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setPassword(newValue ?? "");
    }

    const handleNameChange = (_event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setName(newValue ?? "");
    }

    const handleUserTypeChange = (_event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
        setUserType(option?.key.toString() ?? "");
    }

    const onClickRegister = async () => {

        if (userName.length === 0 || password.length === 0 || name.length === 0 || userType.length === 0) {
            return;
        }

        const response = await fetch(`${BaseUrl}/register`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                userName,
                password,
                name,
                userType
            })
        })

        const data = await response.json();
        if (data.userToken) {
            localStorage.setItem('token', data.userToken);
            history('/dashboard');
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
                    <TextField placeholder='UserName' required value={userName} onChange={handleUserNameChange} />
                    <TextField type="password" canRevealPassword required placeholder='Password' value={password} onChange={handlePasswordChange} />
                    <Dropdown
                        placeholder="Select User Type"
                        options={[
                            { key: 'Admin', text: 'Admin/Chef' },
                            { key: 'Chef', text: 'Sous Chef' }
                        ]}
                        onChange={handleUserTypeChange}
                        required={true}
                    />
                    <TextField required placeholder='Full Name' value={name} onChange={handleNameChange} />
                    <PrimaryButton style={{ backgroundColor: "green" }} text='Register' onClick={onClickRegister}></PrimaryButton>
                    <Link href="/" styles={{ root: { color: "white", textAlign: 'right', fontWeight: "bold" } }} underline>Login</Link>
                </Stack>
            </StackItem>
        </Stack>
    );
}

export default Register;