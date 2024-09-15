import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import axios from 'axios';

const RegisterScreen = ({ navigation }) => {
    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');  // Include the name field
    const [error, setError] = useState('');

    const handleRegister = async () => {
        // Validation for mobile number and password
        if (!name || password.length < 3) {
            setError('Name must be at least 3 characters');
            return;
        }
        if (!mobileNumber || mobileNumber.length !== 10 || !/^\d+$/.test(mobileNumber)) {
            setError('Mobile Number must be exactly 10 digits');
            return;
        }
        if (!password || password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        try {
            // Make the POST request to register the user
            const response = await axios.post('http://192.168.1.9:5000/users/register', {
                name,
                mobileNumber,
                password
            });

            if (response.status === 200) {
                Alert.alert('Success', 'User registered successfully');
                navigation.navigate('Login');
            }
            // else {
            //     setError('Registration failed. Try again.');
            // }
        } catch (err) {
            // setError('Registration failed. Try again.');
            if (err.response && err.response.data && err.response.data.message) {
                // Display the specific error message returned from the backend
                setError(err.response.data.message);
            } else {
                setError('Registration failed. Try again.');
            }

        }
    };

    return (
        <View style={{ padding: 20 }}>
            <TextInput
                placeholder="Name"
                value={name}
                onChangeText={setName}
                style={{ marginBottom: 10 }}
            />
            <TextInput
                placeholder="Mobile Number"
                value={mobileNumber}
                onChangeText={setMobileNumber}
                keyboardType="numeric"
                maxLength={10}  // Restrict input to 10 characters
                style={{ marginBottom: 10 }}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{ marginBottom: 10 }}
            />
            <Button title="Register" onPress={handleRegister} />
            {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
        </View>
    );
};

export default RegisterScreen;
