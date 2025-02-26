import { pullClientList, Clients, pullAllClients, sendAllClients } from './apihandler.js';
import { Animations, pullStaticData } from './staticData.js';

let selectedClients = new Set();
let toggleState = false;

document.addEventListener('DOMContentLoaded', async () => {
    await pullStaticData();
    await loadClientList();
    setupButtons();
});

async function loadClientList() {
    const topBar = document.querySelector('.top-bar');
    topBar.innerHTML = ''; // Clear existing items
    await pullClientList();
    
    const clients = Object.keys(Clients);
    
    if (clients.length === 0) {
        const noClientElement = document.createElement('div');
        noClientElement.classList.add('no-client');
        noClientElement.textContent = 'No client connected';
        topBar.appendChild(noClientElement);
    } else {
        clients.forEach(client => {
            const clientElement = document.createElement('div');
            clientElement.classList.add('item');
            clientElement.classList.add('selected');
            clientElement.textContent = client;
            clientElement.onclick = () => selectItem(clientElement);
            topBar.appendChild(clientElement);
            selectedClients.add(client);

        });
    }
}

function selectItem(clientElement) {
    const clientName = clientElement.textContent;

    if (selectedClients.has(clientName)) {
        selectedClients.delete(clientName);
        clientElement.classList.remove("selected");
    } else {
        selectedClients.add(clientName);
        clientElement.classList.add("selected");
    }
    console.log([...selectedClients]);
}

function setupButtons() {
    const container = document.createElement('div');
    container.classList.add('button-container');
    
    const holdButton = document.createElement('button');
    holdButton.textContent = 'Hold Dim';
    holdButton.classList.add('hold-button');
    
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Toggle Dim';
    toggleButton.classList.add('toggle-button');

    holdButton.onmousedown = () => {
        setDimmer([...selectedClients], 0);
        holdButton.style.backgroundColor = '#ff4d4d'; // Soft red
    };

    holdButton.onmouseup = () => {
        setDimmer([...selectedClients], 100);
        holdButton.style.backgroundColor = '#4CAF50'; // Soft green
        if (toggleState) {
            toggleState = false;
            toggleButton.style.backgroundColor = '#4CAF50';
        }
    };
    
    toggleButton.onclick = () => {
        toggleState = !toggleState;
        const newState = toggleState ? 0 : 100;
        setDimmer([...selectedClients], newState);
        toggleButton.style.backgroundColor = toggleState ? '#ff4d4d' : '#4CAF50';
    };
    
    container.appendChild(holdButton);
    container.appendChild(toggleButton);
    document.body.appendChild(container);
}

function setDimmer(clients, value) {
    console.log(`Setting dimmer for ${clients} to ${value}`);
    clients.forEach(client => {
        fetch(`http://127.0.0.1:8080/api/client/get/${client}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to get configuration for client ${client}`);
                }
                return response.json();
            })
            .then(config => {
                config.dimmer = value;
                return fetch(`http://127.0.0.1:8080/api/client/set/${client}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(config)
                });
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to set dimmer for client ${client}`);
                }
                return response.json();
            })
            .then(data => {
                console.log(`Dimmer set for client ${client}:`, data);
            })
            .catch(error => {
                console.error(`Error setting dimmer for client ${client}:`, error);
            });
    });
}