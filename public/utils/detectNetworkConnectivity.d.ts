import { NetworkConfig } from '../models/types';
declare const getNetworkConnectivity: ({ shouldPing, pingServerUrl, pingTimeout, httpMethod, customHeaders, }: Partial<NetworkConfig>) => Promise<boolean>;
export default getNetworkConnectivity;
