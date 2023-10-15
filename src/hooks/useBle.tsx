import {useState} from 'react';
import {
  BleError,
  BleManager,
  Characteristic,
  Device,
} from 'react-native-ble-plx';
import {
  byteArrayToStringHex,
  convertBase64ToBytesArray,
} from '../utils/helpers';
import {DEVICE_NAME} from '@env';

const useBle = () => {
  const manager = new BleManager();
  const [allDevices, setAllDevices] = useState<Device[]>([]);

  const isDuplicateDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex(device => nextDevice.id === device.id) > -1;

  const scanForDevices = () => {
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log('scanForDevices error:', error);
      }
      if (device) {
        if (device.name === DEVICE_NAME || device.localName === DEVICE_NAME) {
          setAllDevices(prevState => {
            if (!isDuplicateDevice(prevState, device)) {
              return [...prevState, device];
            }
            return prevState;
          });
        }
      }
    });
  };

  const connectToDevice = async (deviceId: string) => {
    try {
      const deviceConnection = await manager.connectToDevice(deviceId);
      await deviceConnection.discoverAllServicesAndCharacteristics();
      console.log('CONNECTED');
      return true;
    } catch (error) {
      console.log('Failure to connect', error);
      return false;
    }
  };

  const disconnectDevice = async (deviceId: string) => {
    try {
      await manager.cancelDeviceConnection(deviceId);
      console.log('Disconnected');
    } catch (error) {
      console.log('disconnectDevice error --> ', error);
    }
  };

  const services = async (deviceId: string) => {
    try {
      const servicesForDevice = await manager.servicesForDevice(deviceId);
      console.log('servicesForDevice --> ', JSON.stringify(servicesForDevice));
    } catch (error) {
      console.log('servicesForDevice error --> ', error);
    }
  };

  const characteristics = async (deviceId: string, serviceUUID: string) => {
    try {
      const characteristicsForDevice = await manager.characteristicsForDevice(
        deviceId,
        serviceUUID,
      );
      console.log(
        'characteristicsForDevice --> ',
        console.log(JSON.stringify(characteristicsForDevice)),
      );
    } catch (error) {
      console.log('characteristics --> ', error);
    }
  };

  const descriptors = async (
    deviceId: string,
    serviceUUID: string,
    characteristicUUID: string,
  ) => {
    try {
      const descriptorsForDevice = await manager.descriptorsForDevice(
        deviceId,
        serviceUUID,
        characteristicUUID,
      );
      console.log(
        'descriptorsForDevice --> ',
        JSON.stringify(descriptorsForDevice),
      );
    } catch (error) {
      console.log('descriptors --> ', error);
    }
  };

  const monitor = async (deviceId: string, serviceUUID: string) => {
    try {
      console.log('WE ARE IN MONITOR');
      const characteristicsForDevice = await manager.characteristicsForDevice(
        deviceId,
        serviceUUID,
      );

      // TODO --> SELBA characteristic
      const characteristic = characteristicsForDevice[0];
      // TODO --> SIMON characteristic
      //const characteristic = characteristicsForDevice[1];

      characteristic.monitor(
        async (
          error: BleError | null,
          characteristic: Characteristic | null,
        ) => {
          if (error) {
            console.log('error valuesMonitor:', error);
            return;
          } else if (!characteristic?.value) {
            console.log('No charactheristic found');
            return;
          }

          const bytesArray: Uint8Array = convertBase64ToBytesArray(
            characteristic.value,
          );

          console.log('bytesArray --> ', bytesArray);
        },
      );
    } catch (error) {
      console.log('monitor --> ', error);
    }
  };

  const readCharacteristic = async (
    deviceId: string,
    serviceUUID: string,
    characteristicUUID: string,
  ) => {
    try {
      const readCharacteristicForDevice =
        await manager.readCharacteristicForDevice(
          deviceId,
          serviceUUID,
          characteristicUUID,
        );

      if (readCharacteristicForDevice.value !== null) {
        const byteArray: Uint8Array = convertBase64ToBytesArray(
          readCharacteristicForDevice.value,
        );

        const macWifi = byteArrayToStringHex(byteArray);
        console.log(
          'readCharacteristicForDevice --> ',
          readCharacteristicForDevice,
        );
        console.log('byteArray --> ', byteArray);
        console.log('macWifi --> ', macWifi);
      }
    } catch (error) {
      console.log('readCharacteristic --> ', error);
    }
  };

  return {
    allDevices,
    scanForDevices,
    connectToDevice,
    disconnectDevice,
    services,
    characteristics,
    descriptors,
    monitor,
    readCharacteristic,
  };
};

export default useBle;
