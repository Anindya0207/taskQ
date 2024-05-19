import NetInfo from '@react-native-community/netinfo';
import checkInternetAccess from './checkInternetAccess';
import { NetworkConfig } from '../models/types';

const getNetworkConnectivity = async ({
  shouldPing,
  pingServerUrl,
  pingTimeout,
  httpMethod,
  customHeaders,
}: Partial<NetworkConfig>) => {
  let isConnected: boolean = false;

  const checkInternet = async () => {
    if (NetInfo && typeof NetInfo.fetch === 'function') {
      const netInfoState = await NetInfo.fetch();
      if (shouldPing) {
        const hasInternetAccess = await checkInternetAccess({
          url: pingServerUrl,
          timeout: pingTimeout,
          method: httpMethod,
          customHeaders,
        });
        isConnected = hasInternetAccess;
      } else {
        isConnected = netInfoState.isConnected || false;
      }
    } else {
      isConnected = !!window?.navigator?.onLine;
      window.addEventListener('online', () => {
        isConnected = true;
      });
      window.addEventListener('offline', () => {
        isConnected = false;
      });
    }
  };
  await checkInternet();
  return isConnected;
};

export default getNetworkConnectivity;
