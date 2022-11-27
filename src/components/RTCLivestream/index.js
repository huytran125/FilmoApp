import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import {RTCPeerConnection, RTCView, MediaStream} from 'react-native-webrtc';
import negotiateConnectionWithClientOffer from '../../utils/livestream/negotiateConnectionWithClientOffer';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const RTCLivestream = props => {
  const {style, endpoint} = props;
  const [remote, setRemote] = useState();
  // stun server provide by cloudflare
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

  useEffect(() => {
    //  addTransceiver() creates a new RTCRtpTransceiver and adds it to the set of transceivers associated with the RTCPeerConnection. Each transceiver represents a bidirectional stream, with both an RTCRtpSender and an RTCRtpReceiver associated with it.
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
      const currentTracks = remoteStream.current.getTracks();
      // add track from server to local stream when not have track, return if track exists
      const streamAlreadyHasVideoTrack = currentTracks.some(
        newTrack => newTrack.kind === 'video',
      );
      const streamAlreadyHasAudioTrack = currentTracks.some(
        newTrack => newTrack.kind === 'audio',
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

    // The negotiationneeded event is first dispatched to the RTCPeerConnection when media is first added to the connection.
    peerConnection.current.addEventListener('negotiationneeded', ev => {
      negotiateConnectionWithClientOffer(peerConnection.current, endpoint);
    });
    peerConnection.current?.addEventListener(
      'iceconnectionstatechange',
      event => {
        switch (peerConnection.current?.iceConnectionState) {
          case 'connected':
          case 'completed':
            // start to set the remote stream url when the connection completed
            setRemote(remoteStream.current?.toURL());
            break;
        }
      },
    );
  }, [endpoint]);

  return (
    <View style={[styles.container, style]}>
      {remoteStream.current?.toURL() && (
        <RTCView {...props} streamURL={remote} style={styles.stream} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: windowWidth,
    height: windowHeight,
  },
  stream: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
    position: 'absolute',
  },
});

export default RTCLivestream;
