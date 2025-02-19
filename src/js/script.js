// Import the necessary API client modules
import { ApiClient, AnimationsApi, ClientsApi, ShadersApi, Layer } from '../../javascript-client-generated/src/index.js';
import { pullClientList, Clients, pullAllClients, sendAllClients } from './apihandler.js'
import { animationsApi,liveUpdate,setLiveUpdate } from './globals.js'
let clientID
document.addEventListener('DOMContentLoaded', async () => {
    // Load the client list
    await loadClientList();

    // Select the first item by default
    const firstItem = document.querySelector('.item');
    if (firstItem) {
        selectItem(firstItem);
    }

    // Close popup when clicking outside of it
    document.addEventListener('mousedown', (event) => {
        const popup = document.getElementById('popup');
        const popupContent = document.querySelector('.popup-content');
        if (popup.style.display === 'flex' && !popupContent.contains(event.target)) {
            closePopup();
        }
    });
    document.getElementById('live-update-toggle').addEventListener('change', function() {
        setLiveUpdate(this.checked);
        console.log("Live Update:", liveUpdate);
    });
    document.getElementById('live-update-toggle').checked = liveUpdate;
    document.getElementById('pull-data').addEventListener('click', async function() {
        console.log("Pulling data...");
        await pullAllClients();
        await loadClientList()
        loadLayers(Clients[clientID], clientID);
    });
    
    document.getElementById('push-data').addEventListener('click', async function() {
        console.log("Pushing data...");
        await sendAllClients();
    });
    
});

async function loadClientList() {
    const topBar = document.querySelector('.top-bar');
    topBar.innerHTML = ''; // Clear existing items
    await pullClientList()
    // Fetch the client list from the API

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
            clientElement.textContent = client;
            clientElement.onclick = () => selectItem(clientElement);
            topBar.appendChild(clientElement);
        });
    }

}

function selectItem(element) {
    document.querySelectorAll('.item').forEach(item => item.classList.remove('selected'));
    element.classList.add('selected');

    // Fetch the client configuration
    clientID = element.textContent;
    console.log('Selected client ID:', clientID); // Debugging log

    console.log('Client configuration:', Clients[clientID]); // Debugging log

    // Load options based on the client configuration
    loadLayers(Clients[clientID], clientID);
    const content = document.querySelector('.content');

    // Add option to add a new layer
    const addLayerElement = document.createElement('div');
    addLayerElement.classList.add('option', 'add');
    addLayerElement.style.display = 'none'; // Hide the '+' element
    content.appendChild(addLayerElement);

    // Show the animation select dropdown
    const addLayerContainer = document.querySelector('.add-layer-container');
    addLayerContainer.style.display = 'block';
    openAddLayerMenu(clientID);
}

function loadLayers(clientConfig, clientID) {
    const content = document.querySelector('.content');
    content.innerHTML = ''; // Clear existing options

    const layers = clientConfig.layers;

    if (layers.length === 0) {
        const noLayerElement = document.createElement('div');
        noLayerElement.classList.add('no-layer');
        noLayerElement.textContent = 'No layers added';
        content.appendChild(noLayerElement);
    } else {
        layers.forEach((layer, index) => {
            const layerElement = document.createElement('div');
            layerElement.classList.add('option');
            layerElement.draggable = true;
            layerElement.addEventListener('dragstart', handleDragStart);
            layerElement.addEventListener('dragover', handleDragOver);
            layerElement.addEventListener('drop', (event) => handleDrop(event, clientID));
            layerElement.addEventListener('touchstart', handleTouchStart);
            layerElement.addEventListener('touchmove', handleTouchMove);
            layerElement.addEventListener('touchend', (event) => handleTouchEnd(event, clientID));
            layerElement.setAttribute('layerID', layer.layerID)
            const img = document.createElement('img');
            img.alt="No img"
            img.src = "http://127.0.0.1:8080/api/animation/image/"+layer.animationID;

            const title = document.createElement('div');
            title.classList.add('title');
            title.textContent = layer.animationID;

            const deleteButton = document.createElement('div');
            deleteButton.classList.add('delete');
            deleteButton.textContent = '🗑️';
            deleteButton.style.cursor = 'pointer'; // Set cursor to pointer
            deleteButton.onclick = () => deleteLayer(clientID, index);

            layerElement.appendChild(img);
            layerElement.appendChild(title);
            layerElement.appendChild(deleteButton);

            content.appendChild(layerElement);
        });
    }
}

function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.dataset.index);
    event.target.classList.add('dragging');
}

function handleDragOver(event) {
    event.preventDefault();
    const draggingElement = document.querySelector('.dragging');
    const targetElement = event.target.closest('.option');
    if (targetElement && targetElement !== draggingElement && !targetElement.classList.contains('add')) {
        const content = document.querySelector('.content');
        const options = Array.from(content.querySelectorAll('.option'));
        const draggingIndex = options.indexOf(draggingElement);
        const targetIndex = options.indexOf(targetElement);
        if (draggingIndex < targetIndex) {
            content.insertBefore(draggingElement, targetElement.nextSibling);
        } else {
            content.insertBefore(draggingElement, targetElement);
        }
    }
}

function handleDrop(event, clientID) {
    event.preventDefault();
    const draggingElement = document.querySelector('.dragging');
    draggingElement.classList.remove('dragging');
    const content = document.querySelector('.content');
    const options = Array.from(content.querySelectorAll('.option'));
    const layerIDs = options.map(option => option.getAttribute('layerid'));
    layerIDs.pop(-1)
    let order = [];
    const layers = Clients[clientID].layers
    layerIDs.forEach(Lid => {
        order.push(layers.findIndex(item => item.layerID == Lid))
    });
    Clients[clientID].reorderLayers(order)
}

let touchStartY = 0;
let touchDraggingElement = null;

function handleTouchStart(event) {
    touchStartY = event.touches[0].clientY;
    touchDraggingElement = event.target.closest('.option');
    touchDraggingElement.classList.add('dragging');
}

function handleTouchMove(event) {
    event.preventDefault();
    const touchCurrentY = event.touches[0].clientY;
    const content = document.querySelector('.content');
    const options = Array.from(content.querySelectorAll('.option'));
    const targetElement = document.elementFromPoint(event.touches[0].clientX, touchCurrentY).closest('.option');
    if (targetElement && targetElement !== touchDraggingElement && !targetElement.classList.contains('add')) {
        const draggingIndex = options.indexOf(touchDraggingElement);
        const targetIndex = options.indexOf(targetElement);
        if (draggingIndex < targetIndex) {
            content.insertBefore(touchDraggingElement, targetElement.nextSibling);
        } else {
            content.insertBefore(touchDraggingElement, targetElement);
        }
    }
}

function handleTouchEnd(event, clientID) {
    touchDraggingElement.classList.remove('dragging');
    const content = document.querySelector('.content');
    const options = Array.from(content.querySelectorAll('.option'));
    const layerIDs = options.map(option => option.getAttribute('layerid'));
    layerIDs.pop(-1)
    let order = [];
    const layers = Clients[clientID].layers
    layerIDs.forEach(Lid => {
        order.push(layers.findIndex(item => item.layerID == Lid))
    });
    Clients[clientID].reorderLayers(order)
}

function openPopup(formElements) {
    const popup = document.getElementById('popup');
    const form = document.getElementById('settings-form');
    form.innerHTML = ''; // Clear existing form elements

    formElements.forEach(element => {
        const container = document.createElement('div');
        container.classList.add('form-element');

        const label = document.createElement('label');
        label.textContent = element.description || element.name;
        container.appendChild(label);

        const input = document.createElement('input');
        input.type = element.type;
        input.name = element.name;

        if (element.type === 'range') {
            input.min = element.min;
            input.max = element.max;
        }

        if (element.type === 'text') {
            input.placeholder = element.placeholder;
        }

        container.appendChild(input);
        form.appendChild(container);
    });

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Send';
    form.appendChild(submitButton);

    popup.style.display = 'flex';
}

function closePopup() {
    document.getElementById('popup').style.display = 'none';
}

function openAddLayerMenu(clientID) {
    // Fetch the list of available animations
    animationsApi.apiAnimationListGet((error, data, response) => {
        if (error) {
            console.error('Error fetching animations:', error);
            return;
        }

        const animationSelect = document.getElementById('animation-select');
        animationSelect.innerHTML = ''; // Clear existing options

        const animations = Object.values(data);
        animations.forEach(animation => {
            const option = document.createElement('option');
            option.value = animation.animationName;
            option.textContent = animation.animationName;
            animationSelect.appendChild(option);
        });
    });

    // Add event listener to handle the selection of an animation
    document.getElementById('send-button').addEventListener('click', () => {
        const selectedAnimation = document.getElementById('animation-select').value;
        console.log('Selected animation:', selectedAnimation); // Debugging log
        // Logic to add a new layer with the selected animation
        submitAddLayerForm(clientID, selectedAnimation);
    });
}

function submitAddLayerForm(clientID, selectedAnimation) {
    // Fetch the current client configuration


    // Add the new layer to the existing layers

    const newLayer = Object.assign(new Layer(), {
        layerID: Clients[clientID].layers.length + 1, // Unique ID //TODO: FIX ID
        animationID: selectedAnimation,
        enabled: true,
        dimmer: 100,
        hueShift: 0,
        rotate: 0,
        pan: 0,
        tilt: 0,
        scale: 125,
    });
    Clients[clientID].addLayer(newLayer)
    loadLayers(Clients[clientID], clientID); //TODO: only change no full reload
}

function deleteLayer(clientID, layerIndex) {
    Clients[clientID].removeLayer(layerIndex);
    loadLayers(Clients[clientID], clientID);
}