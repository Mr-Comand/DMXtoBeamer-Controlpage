import { pullClientList, Clients } from './apihandler.js';
import { pullStaticData } from './staticData.js';
import { getClient, setClientConfig } from './api.js';

let selectedClients = new Set();
let toggleState = false;

document.addEventListener('DOMContentLoaded', async () => {
    await pullStaticData();
    await loadClientList();
    setupButtons();
});

async function loadClientList() {
    const clientItems = document.getElementById('client-items');
    clientItems.innerHTML = ''; // Clear existing items
    await pullClientList();

    const clients = Object.keys(Clients);

    if (clients.length === 0) {
        const noClientElement = document.createElement('div');
        noClientElement.classList.add('no-client');
        noClientElement.textContent = 'No client connected';
        clientItems.appendChild(noClientElement);
        return;
    }

    clients.forEach(client => {
        const clientElement = document.createElement('div');
        clientElement.classList.add('item');
        clientElement.classList.add('selected');
        clientElement.textContent = client;
        clientElement.dataset.clientID = client;
        clientElement.onclick = () => selectItem(clientElement);
        clientItems.appendChild(clientElement);
        selectedClients.add(client);
    });
}

function selectItem(clientElement) {
    const clientID = clientElement.dataset.clientID;

    if (selectedClients.has(clientID)) {
        selectedClients.delete(clientID);
        clientElement.classList.remove("selected");
    } else {
        selectedClients.add(clientID);
        clientElement.classList.add("selected");
    }
    console.log([...selectedClients]);
}

function setupButtons() {
    const holdButton = document.querySelector('.hold-button');
    const toggleButton = document.querySelector('.toggle-button');

    holdButton.addEventListener('mousedown', () => {
        setDimmer([...selectedClients], 0);
        holdButton.classList.add('active');
    });

    holdButton.addEventListener('mouseup', () => {
        setDimmer([...selectedClients], 100);
        holdButton.classList.remove('active');
        if (toggleState) {
            toggleState = false;
            toggleButton.classList.remove('active');
        }
    });

    // Keep the dimmer at zero while the button is held
    holdButton.addEventListener('mouseleave', () => {
        if (holdButton.classList.contains('active')) {
            holdButton.classList.remove('active');
            setDimmer([...selectedClients], 100);
            if (toggleState) {
                toggleState = false;
                toggleButton.classList.remove('active');
            }
        }
    });

    toggleButton.addEventListener('click', () => {
        toggleState = !toggleState;
        const newState = toggleState ? 0 : 100;
        setDimmer([...selectedClients], newState);
        toggleButton.classList.toggle('active', toggleState);
    });
}

async function setDimmer(clientIDs, value) {
    console.log(`Setting dimmer for ${clientIDs.join(', ')} to ${value}`);
    clientIDs.forEach(clientID => {
        setDimmerForClient(clientID, value);
    });
}

async function setDimmerForClient(clientID, value) {
    try {
        const config = await getClient(clientID);
        if (!config) {
            throw new Error(`No configuration received for client ${clientID}`);
        }
        config.dimmer = value;
        await setClientConfig(clientID, config);
        console.log(`Dimmer set for client ${clientID}:`, value);
    } catch (error) {
        console.error(`Error setting dimmer for client ${clientID}:`, error);
    }
}
