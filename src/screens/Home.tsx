import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {requestLocationPermissions} from '../utils/permissions/requestLocationPermissions';
import useBle from '../hooks/useBle';
import {DEVICE_ID_FOR_ANDROID, DEVICE_ID_FOR_IOS, SERVICE_UUID} from '@env';

const Home = () => {
  const {
    connectToDevice,
    disconnectDevice,
    readCharacteristic,
    scanForDevices,
    allDevices,
    services,
    characteristics,
  } = useBle();

  useEffect(() => {
    requestLocationPermissions(isGranted => {
      if (isGranted) {
      }
    });
  }, []);

  return (
    <View>
      <View style={styles.container}>
        <Text>Test buletooth app</Text>
        <Pressable
          style={styles.botonStyle}
          onPress={async () => {
            // TODO for Android
            await connectToDevice(DEVICE_ID_FOR_ANDROID);
            // TODO for iOS
            //await connectToDevice(DEVICE_ID_FOR_IOS);
          }}>
          <Text style={styles.TextStyle}>Connect</Text>
        </Pressable>
        <Pressable
          style={styles.botonStyle}
          onPress={() => {
            // TODO for Android
            disconnectDevice(DEVICE_ID_FOR_ANDROID);
            // TODO for iOS
            //disconnectDevice(DEVICE_ID_FOR_IOS);
          }}>
          <Text style={styles.TextStyle}>Disconnect</Text>
        </Pressable>
        <Pressable
          style={{...styles.botonStyle, marginTop: 70}}
          onPress={async () => {
            scanForDevices();
            console.log('allDevices --> ', allDevices);

            // TODO for Android
            // await readCharacteristic(
            //   DEVICE_ID_FOR_ANDROID,
            //   SERVICE_UUID,
            //   CHARACTHERISTIC_UUID,
            // );
            //await services(DEVICE_ID_FOR_ANDROID);
            // await characteristics(
            //   DEVICE_ID_FOR_ANDROID,
            //   SERVICE_UUID,
            // );
            // TODO for iOS
            // await readCharacteristic(
            //   DEVICE_ID_FOR_IOS,
            //   SERVICE_UUID,
            //   CHARACTHERISTIC_UUID,
            // );
          }}>
          <Text style={styles.TextStyle}>Do something</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  botonStyle: {
    backgroundColor: '#DC143C',
    justifyContent: 'center',
    alignItems: 'center',
    width: 120,
    borderRadius: 10,
    marginTop: 10,
    height: 50,
  },
  TextStyle: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
