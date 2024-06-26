import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';

const API_URL = 'http://192.168.210.178:8081';

const Login = ({ navigation }) => {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        student_id: studentId,
        password: password,
      });

      if (response.data.user) {
        await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
        navigation.replace('Dashboard');
      } else {
        setError('Invalid Username/Password');
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        displayBanAlert();
      } else {
        console.error('Error logging in:', error);
        setError('An error occurred while logging in');
      }
    }
  };

  const displayBanAlert = (banEndTime) => {
    let message = 'You are banned.';
    if (banEndTime) {
      const currentTime = new Date();
      const endTime = new Date(banEndTime);
      const remainingTimeMs = endTime - currentTime;
  
      const days = Math.floor(remainingTimeMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remainingTimeMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((remainingTimeMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remainingTimeMs % (1000 * 60)) / 1000);
  
      message += `\nRemaining ban time: ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
    }
    Alert.alert('Banned', message);
  };
  
  

  const handleRegisterNavigation = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Task Tracker</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="Enter your student id"
          value={studentId}
          onChangeText={setStudentId}
          autoCapitalize="none"
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
          />
          <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
            <Icon name={isPasswordVisible ? 'visibility' : 'visibility-off'} size={24} color="gray" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <Text style={styles.registerText}>
          Don't have an account?{' '}
          <TouchableOpacity onPress={handleRegisterNavigation}>
            <Text style={[styles.link, styles.noUnderline]}>Register</Text>
          </TouchableOpacity>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  formContainer: {
    width: '80%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    height: 50,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  registerText: {
    textAlign: 'center',
    marginTop: 20,
  },
  link: {
    color: '#007bff',
  },
  noUnderline: {
    textDecorationLine: 'none',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default Login;
