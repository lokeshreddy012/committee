import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import axios from 'axios';

const LoginScreen = ({ navigation }) => {
    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        // Validate mobile number and password length
        if (mobileNumber.length !== 10) {
            setError('Mobile number must be 10 digits');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        try {
            const response = await axios.post('http://192.168.1.9:5000/users/login', { mobileNumber, password });
            const { token, role } = response.data;
            if (role === 'admin') {
                navigation.navigate('AdminDashboard', { token });
            } else {
                navigation.navigate('UserDashboard', { token });
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                // Display the specific error message returned from the backend
                setError(err.response.data.message);
            } else {
                setError('Registration failed. Try again.');
            }
            // console.error('Login error:', err);
            // setError('Login failed. Check credentials.');
        }
    };

    const handleRegister = () => {
        navigation.navigate('RegisterScreen');
    };

    return (
        <View style={{ padding: 20 }}>
            <TextInput
                placeholder="Mobile Number"
                value={mobileNumber}
                onChangeText={setMobileNumber}
                keyboardType="numeric"
                maxLength={10}  // Enforce 10 digits input
                style={{ marginBottom: 10 }}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{ marginBottom: 10 }}
            />
            <Button title="Login" onPress={handleLogin} />
            <Button title="New Registration" onPress={handleRegister} />
            {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
        </View>
    );
};

export default LoginScreen;
