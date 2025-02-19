import { ApiClient, AnimationsApi, ClientsApi, ShadersApi, Layer, ClientConfig } from '../../javascript-client-generated/src/index.js';
import ClientConfigWithTracking from './clienttrack.js'
import {liveUpdate, apiClient, clientsApi} from './globals.js'

export let Clients = { "ab": ClientConfig }


export async function pullClientList() {
    Clients = await fetchClientList();
    console.log(Clients);
}
export async function fetchClientList() {
    try {
        const data = await new Promise((resolve, reject) => {
            clientsApi.apiClientListGet((error, data, response) => {
                if (error) {
                    handelError(error);
                    reject(error);
                    return;
                }
                resolve(data);
            });
        });

        const clients = data.clients;
        let newClients = {};

        // Create an array of promises for missing clients
        const fetchPromises = clients.map(async (clientID) => {
            if (Clients[clientID]) {
                newClients[clientID] = Clients[clientID]; // Use cached client
            } else {
                newClients[clientID] = await fetchClient(clientID); // Fetch in parallel
            }
        });

        // Wait for all fetches to complete in parallel
        await Promise.all(fetchPromises);
        return newClients; // Return the populated object
    } catch (error) {
        console.error("Error pulling client list:", error);
        return {};
    }
}
export async function pullClient(clientID) {
    Clients[clientID] = await fetchClient(clientID)
}

export async function fetchClient(clientID) {
    try {
        const data = await new Promise((resolve, reject) => {
            clientsApi.apiClientGetClientIDGet(clientID, (error, data, response) => {
                if (error) {
                    handelError('Error fetching client configuration:', error);
                    resolve(undefined); // Return undefined in case of an error
                } else {
                    console.log('Client configuration:', data);
                    resolve(data); // Return the fetched client data
                }
            });
        });

        // Create a new instance of ClientConfigWithTracking instead of ClientConfig
        const clientConfig = ClientConfigWithTracking.constructFromObject(data);
        clientConfig.ClientID=clientID;
        return clientConfig; // Return the tracked client config
    } catch (error) {
        console.error("Unexpected error:", error);
        return undefined;
    }
}

export async function fetchAllClients() {
    try {
        const data = await new Promise((resolve, reject) => {
            clientsApi.apiClientListGet((error, data, response) => {
                if (error) {
                    handelError(error);
                    reject(error);
                    return;
                }
                resolve(data);
            });
        });

        const clients = data.clients;
        let newClients = {};

        // Create an array of promises for missing clients
        const fetchPromises = clients.map(async (clientID) => {
            newClients[clientID] = await fetchClient(clientID);
        });

        // Wait for all fetches to complete in parallel
        await Promise.all(fetchPromises);
        return newClients; // Return the populated object
    } catch (error) {
        console.error("Error pulling client list:", error);
        return {};
    }
}

export async function pullAllClients() {
    Clients = await fetchAllClients();
}

export async function sendAllClients() {
    Object.entries(Clients).forEach(([clientID, client]) => {
        sendClientConfig(clientID, client);
    });
}

export async function sendClient(clientID) {
    await sendClientConfig(clientID, Clients[clientID]);
}

export async function sendClientConfig(clientID, clientConfig) {
    clientConfig.ClientID = clientID
    new ClientConfigWithTracking().sendClientConfig(clientConfig)
    // // Unwrap the proxy to get the original object
    // const rawConfig = getTargetFromProxy(clientConfig);

    // await new Promise((resolve, reject) => {
    //     clientsApi.apiClientSetClientIDPost(rawConfig, clientID, (error, data, response) => {
    //         if (error) {
    //             handelError(error);
    //             reject(error);
    //             return;
    //         }
    //         resolve(data);
    //     });
    // });
}

ClientConfigWithTracking.prototype.send = async function sendClient(clientID) {
    await sendClientConfig(clientID, this);
};

function handelError(error, ...parms) {
    console.error(error, parms);
}
// await pullClientList();
// // sendAllClients();
// Clients["a"].dimmer=10
// Clients["a"].layers[0].dimmer=100
// // Define a new layer
// const newLayer = new Layer(); // Or construct a new layer with its properties
// newLayer.dimmer = 0.5;
// newLayer.hueShift = 15;
// newLayer.rotate = 30;
// newLayer.pan = 10;
// newLayer.tilt = 5;
// newLayer.scale = 1;

// // Add the new layer to Clients["a"]
// Clients["a"].addLayer(newLayer); // This will automatically be tracked by the Proxy
// Clients["a"].layers[1].dimmer=100
// console.log(typeof Clients)
// debugger
// Clients["a"].sendClientConfig()
// debugger

