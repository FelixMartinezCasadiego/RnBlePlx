import {atob} from 'react-native-quick-base64';

export const convertBase64ToBytesArray = (value: string) =>
  Uint8Array.from(atob(value), c => c.charCodeAt(0));

export const byteArrayToStringHex = (byteArray: Uint8Array) => {
  let result = '';

  byteArray.forEach((macNumber: number, index: number) => {
    result += macNumber.toString(16).padStart(2, '0');
    if (index < byteArray.length - 1) {
      result += ':';
    }
  });

  return result;
};
