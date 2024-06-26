import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const SplashScreen = () => {
  return (
    <LinearGradient
      colors={['#ffde59', '#ff914d']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <Image
        source={require('./img/Splash.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
    </LinearGradient>
  );
};

const { height, width } = Dimensions.get('window'); // Get screen dimensions

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    width: width,
    height: height,
  },
});

export default SplashScreen;
