// committee-app/AdminDashboard.js
import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import axios from 'axios';

const AdminDashboard = ({ route }) => {
    const { token } = route.params;
    const [committeeName, setCommitteeName] = useState('');

    const createCommittee = async () => {
        try {
            await axios.post('http://192.168.1.9:5000/committees', { name: committeeName }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Committee created');
        } catch (err) {
            alert('Error creating committee');
        }
    };

    return (
        <View>
            <TextInput placeholder="Committee Name" value={committeeName} onChangeText={setCommitteeName} />
            <Button title="Create Committee" onPress={createCommittee} />
        </View>
    );
};

export default AdminDashboard;
