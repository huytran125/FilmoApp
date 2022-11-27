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
import RTCLivestream from './src/components/RTCLivestream';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const endpoint =
    'https://customer-uxkj6baef2fselfy.cloudflarestream.com/0d9c4be618f76bc3066df6a3426c54bb/webRTC/play';
  return <RTCLivestream objectFit="cover" mirror={true} endpoint={endpoint} />;
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
