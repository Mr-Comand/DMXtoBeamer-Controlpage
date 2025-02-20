// Import the necessary API client modules
import { ApiClient, AnimationsApi, ClientsApi, ShadersApi, Layer } from '../javascript-client-generated/src/index.js';
import { pullClientList, Clients, pullAllClients, sendAllClients } from './apihandler.js'
import { animationsApi, liveUpdate, setLiveUpdate } from './globals.js'
import { openAnimationSettingsPopup } from './animationsettings.js'
import { openShaderOrderPopup } from './shaderOrder.js';
import { Animations, pullStaticData } from './staticData.js';
function timeBasedUint64() {
    const startYear = new Date("2000-01-01T00:00:00Z").getTime();
    const now = Date.now();
    const secondsSince2000 = Math.floor((now - startYear) / 1000);
    return secondsSince2000 % 9007199254740991; // Ensure it fits in uint16
}
let clientID
document.addEventListener('DOMContentLoaded', async () => {
    // Load the client list
    await loadClientList();
    await pullStaticData();
    // Select the first item by default
    const firstItem = document.querySelector('.item');
    if (firstItem) {
        selectItem(firstItem);
    }

    // Close popup when clicking outside of it
    document.addEventListener('mousedown', (event) => {
        const popup = document.getElementById('popup');
        const popupContent = document.querySelectorAll('.popup-content');
        let contains = false;
        popupContent.forEach((popupContent) => {
            if (popupContent.contains(event.target)) {
                contains = true;
            }
        });
        if (popup.style.display === 'flex' && !contains) {
            closePopup();
        }
    });
    document.getElementById('live-update-toggle').addEventListener('change', function () {
        setLiveUpdate(this.checked);
        console.log("Live Update:", liveUpdate);
    });
    document.getElementById('live-update-toggle').checked = liveUpdate;
    document.getElementById('pull-data').addEventListener('click', async function () {
        console.log("Pulling data...");
        await pullAllClients();
        await loadClientList()
        loadLayers(Clients[clientID], clientID);
    });

    document.getElementById('push-data').addEventListener('click', async function () {
        console.log("Pushing data...");
        await sendAllClients();
    });
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
            layerElement.setAttribute('layerID', layer.layerID);
            layerElement.setAttribute('animationID', layer.animationID);
            const dragHandle = document.createElement('div');
            dragHandle.draggable = true;
            dragHandle.classList.add('drag-handle');
            dragHandle.textContent = "⠿"; // Drag icon
            dragHandle.style.cursor = "grab";
            layerElement.appendChild(dragHandle);
            // Drag event only when clicking the main element, not controls
            dragHandle.addEventListener('dragstart', (event) => {
                handleDragStart(event);
            });
            layerElement.addEventListener('dragover', handleDragOver);
            layerElement.addEventListener('drop', handleDrop);
            dragHandle.addEventListener('touchstart', handleTouchStart);
            layerElement.addEventListener('touchmove', handleTouchMove);
            layerElement.addEventListener('touchend', (event) => handleTouchEnd(event));
            const img = document.createElement('img');
            img.alt = "No img";
            img.src = `/api/animation/image/${layer.animationID}`;

            const title = document.createElement('div');
            title.classList.add('title');
            if (Animations[layer.animationID] && Animations[layer.animationID].animationName) {
                title.textContent = Animations[layer.animationID].animationName;
            } else {
                title.textContent = layer.animationID;
            }

            // Enable/Disable Switch
            const switchContainer = document.createElement('div');
            switchContainer.classList.add('switch-container');

            const enableLabel = document.createElement('label');
            enableLabel.textContent = 'Enabled:';

            const enableSwitch = document.createElement('input');
            enableSwitch.type = 'checkbox';
            enableSwitch.checked = layer.enabled;
            enableSwitch.addEventListener('change', (event) => {
                event.stopPropagation(); // Prevent drag interference
                layer.enabled = enableSwitch.checked;
                console.log(`Layer ${layer.layerID} enabled:`, layer.enabled);
            });

            switchContainer.appendChild(enableLabel);
            switchContainer.appendChild(enableSwitch);

            // Slider Wrapper (Non-Draggable)
            const sliderWrapper = document.createElement('div');
            sliderWrapper.classList.add('slider-wrapper');

            // Function to create sliders
            function createSlider(labelText, prop, min, max, step = 1) {
                const container = document.createElement('div');
                container.classList.add('slider-container');

                const label = document.createElement('label');
                label.textContent = labelText;

                const slider = document.createElement('input');
                slider.type = 'range';
                slider.min = min;
                slider.max = max;
                slider.step = step;
                slider.value = layer[prop];
                slider.addEventListener('input', (event) => {
                    event.stopPropagation(); // Prevent drag interference
                    layer[prop] = parseFloat(slider.value);
                    console.log(`Layer ${layer.layerID} ${prop}:`, layer[prop]);
                });

                container.appendChild(label);
                container.appendChild(slider);
                return container;
            }

            // Create sliders for properties and add to wrapper
            sliderWrapper.appendChild(createSlider("Dimmer", "dimmer", 0, 100));
            sliderWrapper.appendChild(createSlider("Hue Shift", "hueShift", 0, 360));
            sliderWrapper.appendChild(createSlider("Rotate", "rotate", 0, 360));
            sliderWrapper.appendChild(createSlider("Pan", "pan", -180, 180));
            sliderWrapper.appendChild(createSlider("Tilt", "tilt", -180, 180));
            sliderWrapper.appendChild(createSlider("Scale", "scale", 1, 200));
            // Additional settings button
            const additionalSettingsButton = document.createElement('button');
            additionalSettingsButton.textContent = 'Additional Settings';
            additionalSettingsButton.addEventListener('click', () => {
                openAnimationSettingsPopup(layer, clientID);
            });
            layerElement.appendChild(additionalSettingsButton);
            // Additional settings button
            const ShaderorderButton = document.createElement('button');
            ShaderorderButton.textContent = 'Layer order';
            ShaderorderButton.addEventListener('click', () => {
                openShaderOrderPopup(layer, clientID);
            });
            layerElement.appendChild(ShaderorderButton);
            // Delete button
            const deleteButton = document.createElement('div');
            deleteButton.classList.add('delete');
            deleteButton.textContent = '🗑️';
            deleteButton.style.cursor = 'pointer';
            deleteButton.onclick = (event) => {
                event.stopPropagation(); // Prevent drag interference
                deleteLayer(clientID, index);
            };

            // Append elements
            layerElement.appendChild(img);
            layerElement.appendChild(title);
            layerElement.appendChild(switchContainer);
            layerElement.appendChild(sliderWrapper); // Add the non-draggable wrapper
            layerElement.appendChild(deleteButton);

            content.appendChild(layerElement);
        });
    }
}


function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.parentElement.dataset.index);
    event.target.parentElement.classList.add('dragging');
    console.log(event.target.parentElement)
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
    let layerIDs = options.map(option => option.getAttribute('layerid'));
    layerIDs = layerIDs.filter(Lid => Lid != undefined);

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

function handleTouchEnd(event) {
    // event.preventDefault();
    touchDraggingElement.classList.remove('dragging');
    const content = document.querySelector('.content');
    const options = Array.from(content.querySelectorAll('.option'));
    let layerIDs = options.map(option => option.getAttribute('layerid'));
    layerIDs = layerIDs.filter(Lid => Lid != undefined);

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


function openAddLayerMenu(clientID) {
    // Fetch the list of available animations
    const animationSelect = document.getElementById('animation-select');
    animationSelect.innerHTML = ''; // Clear existing options

    Object.entries(Animations).forEach(([key, value]) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = value.animationName;
        animationSelect.appendChild(option);
    })
    // Add event listener to handle the selection of an animation
    document.getElementById('send-button').addEventListener('click', () => {
        const selectedAnimation = document.getElementById('animation-select').value;
        console.log('Selected animation:', selectedAnimation); // Debugging log
        // Logic to add a new layer with the selected animation
        submitAddLayerForm(selectedAnimation);
    });
}

function submitAddLayerForm(selectedAnimation) {
    // Add the new layer to the existing layers
    const newLayer = Object.assign(new Layer(), {
        layerID: timeBasedUint64(), // Unique ID //TODO: FIX ID
        animationID: selectedAnimation,
        enabled: true,
        dimmer: 100,
        hueShift: 0,
        rotate: 0,
        pan: 0,
        tilt: 0,
        scale: 25,
    });
    Clients[clientID].addLayer(newLayer)
    loadLayers(Clients[clientID], clientID); //TODO: only change no full reload
}

function deleteLayer(clientID, layerIndex) {
    Clients[clientID].removeLayer(layerIndex);
    loadLayers(Clients[clientID], clientID);
}