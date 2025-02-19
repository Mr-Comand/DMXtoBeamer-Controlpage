import { ApiClient, AnimationsApi, ClientsApi, ShadersApi, Layer, ClientConfig } from '../../javascript-client-generated/src/index.js';

export let liveUpdate = true;
export let rePullInterval = 1;

export function setLiveUpdate(status){
    liveUpdate = status;
}

export const apiClient = new ApiClient();
export const animationsApi = new AnimationsApi(apiClient);
export const clientsApi = new ClientsApi(apiClient);
export const shadersApi = new ShadersApi(apiClient);