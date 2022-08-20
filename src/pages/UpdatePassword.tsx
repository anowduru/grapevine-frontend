import { Label, PrimaryButton, Stack, StackItem, Text, TextField } from '@fluentui/react';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useWindowDimensions, { BaseUrl } from '../utilities';

function UpdatePassword() {
    const viewPort = useWindowDimensions();
    const location = useLocation();
    const history = useNavigate();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [currentPasswordError, setCurrentPasswordError] = useState('');
    const [newPasswordError, setNewPasswordError] = useState('');
    const [confirmNewPasswordError, setConfirmNewPasswordError] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const state = location.state as any;

    console.log(state.userName);

    const handleCurrentPasswordChange = (_event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setCurrentPassword(newValue ?? "");
        setCurrentPasswordError("");
        setErrorMessage("");
    }

    const handleNewPasswordChange = (_event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setNewPassword(newValue ?? "");
        setNewPasswordError("");
        setErrorMessage("");
    }

    const handleConfirmPasswordChange = (_event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setConfirmNewPassword(newValue ?? "");
        setConfirmNewPasswordError("");
        setErrorMessage("");
    }

    const onClickUpdatePassword = async () => {
        var isValid = true;
        if (currentPassword.length === 0) {
            setCurrentPasswordError("Invalid current password");
            isValid = false;
        }

        if (newPassword.length === 0) {
            setNewPasswordError("Invalid new password");
            isValid = false;
        }

        if (confirmNewPassword.length === 0) {
            setConfirmNewPasswordError("Invalid confirm password");
            isValid = false;
        }

        if (confirmNewPassword !== newPassword) {
            setNewPasswordError("Passwords do not match");
            setConfirmNewPasswordError("Passwords do not match");
            isValid = false;
        }

        if (!isValid)
            return;

        const response = await fetch(`${BaseUrl}/updatePassword`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                userName: state.userName,
                currentPassword,
                newPassword
            })
        })

        const data = await response.json();

        if (data.status === 'ok') {
            localStorage.setItem('token', data.userToken);
            history('/dashboard/preplist');
        } else {
            setErrorMessage(data.message);
        }
    }

    const loginPanelWidth = ["s", "m", "l"].includes(viewPort) ? "250px" : "500px";

    return (
        <Stack styles={{ root: { padding: "30px" } }} horizontalAlign='end' verticalAlign='center'>
            <StackItem styles={{ root: { padding: "50px", backgroundColor: "purple", width: loginPanelWidth } }}>
                <Stack tokens={{ childrenGap: "25px" }} >
                    <StackItem align='center' >
                        <Text variant='large' styles={{ root: { fontWeight: "bold", color: 'white' } }}>Welcome</Text>
                    </StackItem>
                    <TextField type="password" canRevealPassword placeholder='current password' styles={{ errorMessage: { color: 'white', fontWeight: 'bold' } }} errorMessage={currentPasswordError} value={currentPassword} onChange={handleCurrentPasswordChange} />
                    <TextField type="password" canRevealPassword styles={{ errorMessage: { color: 'white', fontWeight: 'bold' } }} errorMessage={newPasswordError} placeholder='new password' value={newPassword} onChange={handleNewPasswordChange} />
                    <TextField type="password" canRevealPassword placeholder='confirm password' styles={{ errorMessage: { color: 'white', fontWeight: 'bold' } }} errorMessage={confirmNewPasswordError} value={confirmNewPassword} onChange={handleConfirmPasswordChange} />
                    <PrimaryButton style={{ backgroundColor: "green" }} text='Update Password' onClick={onClickUpdatePassword}></PrimaryButton>
                    <Label styles={{ root: { color: 'white', fontWeight: 'bold' } }}>{errorMessage}</Label>
                </Stack>
            </StackItem>
        </Stack>
    );
}

export default UpdatePassword;