// Import the necessary API client modules
import { ApiClient, AnimationsApi, ClientsApi, ShadersApi } from '../../javascript-client-generated/src/index.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the API clients
    const apiClient = new ApiClient();
    const animationsApi = new AnimationsApi(apiClient);
    const clientsApi = new ClientsApi(apiClient);
    const shadersApi = new ShadersApi(apiClient);

    // Load the client list
    loadClientList(clientsApi, animationsApi);

    // Select the first item by default
    const firstItem = document.querySelector('.item');
    if (firstItem) {
        selectItem(firstItem, clientsApi, animationsApi);
    }

    // Close popup when clicking outside of it
    document.addEventListener('mousedown', (event) => {
        const popup = document.getElementById('popup');
        const popupContent = document.querySelector('.popup-content');
        if (popup.style.display === 'flex' && !popupContent.contains(event.target)) {
            closePopup();
        }
    });
});

function loadClientList(clientsApi, animationsApi) {
    const topBar = document.querySelector('.top-bar');
    topBar.innerHTML = ''; // Clear existing items

    // Fetch the client list from the API
    clientsApi.apiClientListGet((error, data, response) => {
        if (error) {
            console.error(error);
            return;
        }

        const clients = data.clients;

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
                clientElement.onclick = () => selectItem(clientElement, clientsApi, animationsApi);
                topBar.appendChild(clientElement);
            });
        }
    });
}

function selectItem(element, clientsApi, animationsApi) {
    document.querySelectorAll('.item').forEach(item => item.classList.remove('selected'));
    element.classList.add('selected');

    // Fetch the client configuration
    const clientID = element.textContent;
    console.log('Selected client ID:', clientID); // Debugging log
    clientsApi.apiClientGetClientIDGet(clientID, (error, data, response) => {
        if (error) {
            console.error('Error fetching client configuration:', error);
            return;
        }
        console.log('Client configuration:', data); // Debugging log

        // Load options based on the client configuration
        loadLayers(data, clientID, clientsApi, animationsApi);
    });
}

function loadLayers(clientConfig, clientID, clientsApi, animationsApi) {
    const content = document.querySelector('.content');
    content.innerHTML = ''; // Clear existing options

    const layers = clientConfig.layers;

    if (layers.length === 0) {
        const noLayerElement = document.createElement('div');
        noLayerElement.classList.add('no-layer');
        noLayerElement.textContent = 'No layers added';
        content.appendChild(noLayerElement);
    } else {
        layers.forEach(layer => {
            const layerElement = document.createElement('div');
            layerElement.classList.add('option');
            layerElement.draggable = true;
            layerElement.addEventListener('dragstart', handleDragStart);
            layerElement.addEventListener('dragover', handleDragOver);
            layerElement.addEventListener('drop', handleDrop);
            layerElement.addEventListener('touchstart', handleTouchStart);
            layerElement.addEventListener('touchmove', handleTouchMove);
            layerElement.addEventListener('touchend', handleTouchEnd);

            const img = document.createElement('img');
            img.src = layer.image;

            const title = document.createElement('div');
            title.classList.add('title');
            title.textContent = layer.animationID;

            const settings = document.createElement('div');
            settings.classList.add('settings');
            settings.textContent = '⚙️';
            settings.onclick = () => openPopup(layer.parameters);

            layerElement.appendChild(img);
            layerElement.appendChild(title);
            layerElement.appendChild(settings);

            content.appendChild(layerElement);
        });
    }

    // Add option to add a new layer
    const addLayerElement = document.createElement('div');
    addLayerElement.classList.add('option', 'add');
    addLayerElement.style.display = 'none'; // Hide the '+' element
    content.appendChild(addLayerElement);

    // Show the animation select dropdown
    const addLayerContainer = document.querySelector('.add-layer-container');
    addLayerContainer.style.display = 'block';
    openAddLayerMenu(clientID, animationsApi, clientsApi);
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

function handleDrop(event) {
    event.preventDefault();
    const draggingElement = document.querySelector('.dragging');
    draggingElement.classList.remove('dragging');
    const content = document.querySelector('.content');
    const options = Array.from(content.querySelectorAll('.option'));
    const order = options
        .filter(option => option.querySelector('.title')) // Filter out elements without a title
        .map(option => option.querySelector('.title').textContent);
    console.log('New order:', order);
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

function handleTouchEnd(event) {
    touchDraggingElement.classList.remove('dragging');
    const content = document.querySelector('.content');
    const options = Array.from(content.querySelectorAll('.option'));
    const order = options
        .filter(option => option.querySelector('.title')) // Filter out elements without a title
        .map(option => option.querySelector('.title').textContent);
    console.log('New order:', order);
    touchDraggingElement = null;
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

function openAddLayerMenu(clientID, animationsApi, clientsApi) {
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
        submitAddLayerForm(clientID, selectedAnimation, clientsApi, animationsApi);
    });
}

function submitAddLayerForm(clientID, selectedAnimation, clientsApi, animationsApi) {
    // Fetch the current client configuration
    clientsApi.apiClientGetClientIDGet(clientID, (error, data, response) => {
        if (error) {
            console.error('Error fetching client configuration:', error);
            return;
        }

        // Add the new layer to the existing layers
        const newLayer = {
            animationID: selectedAnimation,
            dimmer: 0,
            hueShift: 0,
            rotate: 0,
            pan: 0,
            tilt: 0,
            scale: 0
        };
        const updatedLayers = data.layers.concat(newLayer);

        // Update the client configuration with the new layer
        clientsApi.apiClientSetClientIDPost({ layers: updatedLayers }, clientID, (error, data, response) => {
            if (error) {
                console.error('Error adding new layer:', error);
                return;
            }
            console.log('New layer added successfully:', data);
            // Reload the client configuration to reflect the new layer
            clientsApi.apiClientGetClientIDGet(clientID, (error, data, response) => {
                if (error) {
                    console.error('Error re-fetching client configuration:', error);
                    return;
                }
                loadLayers(data, clientID, clientsApi, animationsApi);
            });
        });
    });
}