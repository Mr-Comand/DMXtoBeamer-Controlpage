import ClientConfigWithTracking from './clienttrack.js'
import { getClientList, getClient } from './api.js'

export let Clients = {}


export async function pullClientList() {
    Clients = await fetchClientList();
    console.log(Clients);
}
export async function fetchClientList() {
    try {
        const data = await getClientList();
        const clients = Array.isArray(data.clients) ? data.clients : [];
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
        const data = await getClient(clientID);
        if (!data) {
            return undefined;
        }

        const clientConfig = ClientConfigWithTracking.fromObject(data);
        clientConfig.ClientID = clientID;
        return clientConfig;
    } catch (error) {
        console.error("Unexpected error:", error);
        return undefined;
    }
}

export async function fetchAllClients() {
    try {
        const data = await getClientList();
        const clients = Array.isArray(data.clients) ? data.clients : [];
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
        client.sendClientConfig();
    });
}

function handelError(error, ...parms) {
    console.error(error, parms);
}