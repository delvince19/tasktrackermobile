import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './SplashScreen'; // Import your SplashScreen component
import Login from './Login';
import Dashboard from './Dashboard';
import Register from './Register';
import UpdateTask from './UpdateTask';
import AddTask from './AddTask';

const Stack = createStackNavigator();

const App = () => {
  const [isAppReady, setAppReady] = useState(false);

  useEffect(() => {
    // Simulate any asynchronous tasks (e.g., data loading) here
    // For demonstration purposes, we'll use a setTimeout
    setTimeout(() => {
      // Once tasks are completed, set AppReady to true to indicate that the app is ready to render the main screen
      setAppReady(true);
    }, 2000); // Adjust the duration as needed
  }, []);

  // Render the SplashScreen while the app is loading
  if (!isAppReady) {
    return <SplashScreen />;
  }

  // Render the NavigationContainer and your navigation stack once the app is ready
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="UpdateTask" component={UpdateTask} />
        <Stack.Screen name="AddTask" component={AddTask} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
