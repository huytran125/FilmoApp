/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import RCTLivestream from './src/components/RTCLivestream';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const endpoint =
    'https://customer-uxkj6baef2fselfy.cloudflarestream.com/25635cad214050e88ac319e6b14a985c/webRTC/play';

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <RCTLivestream endpoint={endpoint} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  stream: {
    flex: 1,
    width: 500,
    height: 500,
    position: 'absolute',
  },
});

export default App;
