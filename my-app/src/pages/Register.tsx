import { Dropdown, IDropdownOption, PrimaryButton, Stack, StackItem, Text, TextField } from '@fluentui/react';
import React, { useState } from 'react';
import { BaseUrl } from '../utilities';

function Register() {
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
        setUserType(option?.text ?? "");
    }

    const onClickRegister = async () => {
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

        console.log(data);
    }

    return (
        <Stack styles={{ root: { width: "100%", height: "400px", padding: "50px" } }} horizontalAlign='end' verticalAlign='center'>
            <StackItem styles={{ root: { padding: "50px", backgroundColor: "purple", width: "40%" } }}>
                <Stack tokens={{ childrenGap: "25px" }} >
                    <StackItem align='center' >
                        <Text variant='large' styles={{ root: { fontWeight: "bold", color: 'white' } }}>Welcome</Text>
                    </StackItem>
                    <TextField placeholder='UserName' required value={userName} onChange={handleUserNameChange} />
                    <TextField type="password" canRevealPassword required placeholder='Password' value={password} onChange={handlePasswordChange} />
                    <Dropdown
                        placeholder="Select User Type"
                        options={[
                            { key: 'admin', text: 'Admin' },
                            { key: 'chef', text: 'Chef' }
                        ]}
                        onChange={handleUserTypeChange}
                        required={true}
                    />
                    <TextField required placeholder='Full Name' value={name} onChange={handleNameChange} />
                    <PrimaryButton style={{ backgroundColor: "green" }} text='Register' onClick={onClickRegister}></PrimaryButton>
                </Stack>
            </StackItem>
        </Stack>
    );
}

export default Register;