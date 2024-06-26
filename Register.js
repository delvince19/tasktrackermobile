import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';

const API_URL = [
  'http://192.168.210.178:8081'
];

const Register = ({ navigation }) => {
  const [studentId, setStudentId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRepassword] = useState('');
  const [error, setError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isrePasswordVisible, setIsrePasswordVisible] = useState(false);
  
  const handleRegister = async () => {
    if (password !== repassword) {
      setError('Password does not match');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/register`, {
        student_id: studentId,
        password: password,
        repassword: repassword,
        firstname: firstName,
        middlename: middleName,
        lastname: lastName,
        email: email,
      });
      if (response.status === 200) {
        navigation.navigate('Dashboard');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error registering:', error);
      setError('An error occurred. Please try again later.');
    }
  };

  const handleLoginNavigation = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign up</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Enter your student id"
        value={studentId}
        onChangeText={setStudentId}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your first name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your middle name (Optional)"
        value={middleName}
        onChangeText={setMiddleName}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your last name"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
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
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Repeat password"
          value={repassword}
          onChangeText={setRepassword}
          secureTextEntry={!isrePasswordVisible}
        />
        <TouchableOpacity onPress={() => setIsrePasswordVisible(!isrePasswordVisible)}>
          <Icon name={isrePasswordVisible ? 'visibility' : 'visibility-off'} size={24} color="gray" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <Text style={styles.registerText}>
        Already have an account?{' '}
        <TouchableOpacity onPress={handleLoginNavigation}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 50,
    width: '80%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
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
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  registerText: {
    marginTop: 20,
  },
  link: {
    color: '#007bff',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});

export default Register;
