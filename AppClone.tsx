/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {
  ScreenCapturePickerView,
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  registerGlobals,
  RTCRtpReceiver,
  RTCRtpSender,
} from 'react-native-webrtc';
import negotiateConnectionWithClientOffer from './src/utils/livestream/negotiateConnectionWithClientOffer';

const Section: React.FC<{
  title: string;
}> = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const [remote, setRemote] = useState();
  let peerConstraints = {
    iceServers: [
      {
        urls: 'stun:stun.cloudflare.com:3478',
      },
    ],
    bundlePolicy: 'max-bundle',
  };
  const peerConnection = useRef(new RTCPeerConnection(peerConstraints));
  const remoteStream = useRef(null);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const endpoint =
    'https://customer-uxkj6baef2fselfy.cloudflarestream.com/25635cad214050e88ac319e6b14a985c/webRTC/play';
  useEffect(() => {
    peerConnection.current.addTransceiver('video', {
      direction: 'recvonly',
    });
    peerConnection.current.addTransceiver('audio', {
      direction: 'recvonly',
    });
    /**
     * When new tracks are received in the connection, store local references,
     * so that they can be added to a MediaStream, and to the <video> element.
     *
     * https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/track_event
     */
    remoteStream.current = new MediaStream(undefined);
    peerConnection.current.ontrack = event => {
      const track = event.track;
      console.log(
        'capa',
        RTCRtpReceiver.getCapabilities('video'),
        'hello',
        RTCRtpSender.getCapabilities(),
      );
      const currentTracks = remoteStream.current.getTracks();
      const streamAlreadyHasVideoTrack = currentTracks.some(
        track => track.kind === 'video',
      );
      const streamAlreadyHasAudioTrack = currentTracks.some(
        track => track.kind === 'audio',
      );
      switch (track.kind) {
        case 'video':
          if (streamAlreadyHasVideoTrack) {
            break;
          }
          console.log('track', track);
          remoteStream?.current.addTrack(track);
          break;
        case 'audio':
          if (streamAlreadyHasAudioTrack) {
            break;
          }
          remoteStream?.current.addTrack(track);

          break;
        default:
          console.log('got unknown track ' + track);
      }
    };
    peerConnection.current.addEventListener('connectionstatechange', ev => {
      if (peerConnection.connectionState !== 'connected') {
        return;
      }
    });

    peerConnection.current.addEventListener('negotiationneeded', ev => {
      negotiateConnectionWithClientOffer(peerConnection.current, endpoint);
    });
    peerConnection.current?.addEventListener(
      'iceconnectionstatechange',
      event => {
        switch (peerConnection.current?.iceConnectionState) {
          case 'connected':
          case 'completed':
            setRemote(remoteStream.current?.toURL());
            break;
        }
      },
    );
  }, []);

  console.log('remote', remote);
  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {remoteStream.current?.toURL() && (
        <RTCView
          objectFit="cover"
          mirror={true}
          streamURL={remote}
          style={styles.stream}
        />
      )}
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
