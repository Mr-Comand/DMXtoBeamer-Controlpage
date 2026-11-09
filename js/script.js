import { pullClientList, Clients, pullAllClients, sendAllClients } from './apihandler.js'
import { liveUpdate, setLiveUpdate } from './globals.js'
import { openAnimationSettingsPopup, closePopup } from './animationsettings.js'
import { openShaderOrderPopup } from './shaderOrder.js';
import { Animations, pullStaticData } from './staticData.js';

function timeBasedUint64() {
    const startYear = new Date("2000-01-01T00:00:00Z").getTime();
    const now = Date.now();
    const secondsSince2000 = Math.floor((now - startYear) / 1000);
    return secondsSince2000 % 9007199254740991;
}

let clientID = undefined;

document.addEventListener('DOMContentLoaded', async () => {
    // Load the client list
    await loadClientList();
    await pullStaticData();

    // Select the first client by default
    const firstItem = document.querySelector('#client-items .item');
    if (firstItem) {
        selectItem(firstItem);
    }

    // Close popup when clicking outside of it
    document.addEventListener('mousedown', (event) => {
        const popup = document.getElementById('popup');
        const popupContent = document.querySelectorAll('.popup-content');
        let contains = false;
        popupContent.forEach((element) => {
            if (element.contains(event.target)) {
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
        await loadClientList();
        const item = findClientItem(clientID);
        if (item) {
            selectItem(item);
        }
    });

    document.getElementById('push-data').addEventListener('click', async function () {
        console.log("Pushing data...");
        await sendAllClients();
    });

    // Show the animation select dropdown
    openAddLayerMenu();

    // Add a new layer with the selected animation
    document.getElementById('send-button').addEventListener('click', () => {
        const selectedAnimation = document.getElementById('animation-select').value;
        if (!selectedAnimation) {
            console.error('No animation selected');
            return;
        }
        console.log('Selected animation:', selectedAnimation);
        submitAddLayerForm(selectedAnimation);
    });
});

function findClientItem(clientID) {
    return Array.from(document.querySelectorAll('#client-items .item'))
        .find(item => item.dataset.clientID === clientID);
}

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
        clientElement.textContent = client;
        clientElement.dataset.clientID = client;
        clientElement.onclick = () => selectItem(clientElement);
        clientItems.appendChild(clientElement);
    });
}

function selectItem(element) {
    document.querySelectorAll('#client-items .item').forEach(item => item.classList.remove('selected'));
    element.classList.add('selected');

    clientID = element.dataset.clientID || element.textContent;
    console.log('Selected client ID:', clientID);

    // Load layers based on the client configuration
    loadLayers(Clients[clientID], clientID);
}

function loadLayers(clientConfig, clientID) {
    const content = document.querySelector('.content');
    content.innerHTML = ''; // Clear existing layers

    if (!clientConfig) {
        const noLayerElement = document.createElement('div');
        noLayerElement.classList.add('no-layer');
        noLayerElement.textContent = 'No configuration available for this client';
        content.appendChild(noLayerElement);
        return;
    }

    const layers = clientConfig.layers;

    if (layers.length === 0) {
        const noLayerElement = document.createElement('div');
        noLayerElement.classList.add('no-layer');
        noLayerElement.textContent = 'No layers added';
        content.appendChild(noLayerElement);
        return;
    }

    layers.forEach((layer, index) => {
        const layerElement = document.createElement('div');
        layerElement.classList.add('option');
        layerElement.dataset.layerID = layer.layerID;

        const dragHandle = document.createElement('div');
        dragHandle.draggable = true;
        dragHandle.classList.add('drag-handle');
        dragHandle.textContent = "⠿"; // Drag icon
        dragHandle.addEventListener('dragstart', handleDragStart);
        layerElement.addEventListener('dragover', handleDragOver);
        layerElement.addEventListener('drop', handleDrop);
        dragHandle.addEventListener('touchstart', handleTouchStart);
        layerElement.addEventListener('touchmove', handleTouchMove);
        layerElement.addEventListener('touchend', handleTouchEnd);
        layerElement.appendChild(dragHandle);

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

        // Function to create sliders with an editable number field for manual input
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

            const number = document.createElement('input');
            number.type = 'number';
            number.min = min;
            number.max = max;
            number.step = step;
            number.value = layer[prop];
            number.classList.add('value-input');

            const applyValue = (value) => {
                value = parseFloat(value);
                if (Number.isNaN(value)) {
                    value = layer[prop];
                }
                value = Math.min(max, Math.max(min, value));
                layer[prop] = value;
                slider.value = value;
                number.value = value;
            };

            slider.addEventListener('input', (event) => {
                event.stopPropagation(); // Prevent drag interference
                applyValue(slider.value);
            });
            number.addEventListener('input', (event) => {
                event.stopPropagation(); // Prevent drag interference
                if (number.value === '') {
                    return;
                }
                applyValue(number.value);
            });

            container.appendChild(label);
            container.appendChild(slider);
            container.appendChild(number);
            return container;
        }

        // Create sliders for properties and add to wrapper
        sliderWrapper.appendChild(createSlider("Dimmer", "dimmer", 0, 100));
        sliderWrapper.appendChild(createSlider("Hue Shift", "hueShift", 0, 360));
        sliderWrapper.appendChild(createSlider("Rotate", "rotate", 0, 360));
        sliderWrapper.appendChild(createSlider("Pan", "pan", -1000, 1000));
        sliderWrapper.appendChild(createSlider("Tilt", "tilt", -1000, 1000));
        sliderWrapper.appendChild(createSlider("Scale", "scale", 1, 200));
        sliderWrapper.appendChild(createSlider("Volume", "volume", 1, 10));
        sliderWrapper.appendChild(createSlider("StretchX", "stretchX", 0, 100));
        sliderWrapper.appendChild(createSlider("StretchY", "stretchY", 0, 100));

        // Additional settings button
        const additionalSettingsButton = document.createElement('button');
        additionalSettingsButton.textContent = 'Additional Settings';
        additionalSettingsButton.addEventListener('click', () => {
            openAnimationSettingsPopup(layer, clientID);
        });
        layerElement.appendChild(additionalSettingsButton);

        // Shader order button
        const shaderOrderButton = document.createElement('button');
        shaderOrderButton.textContent = 'Shaders';
        shaderOrderButton.addEventListener('click', () => {
            openShaderOrderPopup(layer, clientID);
        });
        layerElement.appendChild(shaderOrderButton);

        // Delete button
        const deleteButton = document.createElement('div');
        deleteButton.classList.add('delete');
        deleteButton.textContent = '🗑️';
        deleteButton.style.cursor = 'pointer';
        deleteButton.onclick = (event) => {
            event.stopPropagation(); // Prevent drag interference
            deleteLayer(index);
        };

        // Append elements
        layerElement.appendChild(img);
        layerElement.appendChild(title);
        layerElement.appendChild(switchContainer);
        layerElement.appendChild(sliderWrapper);
        layerElement.appendChild(deleteButton);

        content.appendChild(layerElement);
    });
}

function layerOrderFromDOM() {
    const content = document.querySelector('.content');
    const options = Array.from(content.querySelectorAll('.option'));
    const layerIDs = options
        .map(option => option.dataset.layerID)
        .filter(id => id !== undefined);

    const layers = Clients[clientID].layers;
    return layerIDs.map(id => layers.findIndex(layer => String(layer.layerID) === id));
}

function handleDragStart(event) {
    event.target.closest('.option').classList.add('dragging');
}

function handleDragOver(event) {
    event.preventDefault();
    const draggingElement = document.querySelector('.option.dragging');
    const targetElement = event.target.closest('.option');
    if (targetElement && targetElement !== draggingElement && draggingElement) {
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
    const draggingElement = document.querySelector('.option.dragging');
    if (!draggingElement) {
        return;
    }
    draggingElement.classList.remove('dragging');
    Clients[clientID].reorderLayers(layerOrderFromDOM());
}

let touchDraggingElement = null;

function handleTouchStart(event) {
    touchDraggingElement = event.target.closest('.option');
    if (touchDraggingElement) {
        touchDraggingElement.classList.add('dragging');
    }
}

function handleTouchMove(event) {
    event.preventDefault();
    if (!touchDraggingElement) {
        return;
    }
    const touchCurrentY = event.touches[0].clientY;
    const content = document.querySelector('.content');
    const options = Array.from(content.querySelectorAll('.option'));
    const hitElement = document.elementFromPoint(event.touches[0].clientX, touchCurrentY);
    const targetElement = hitElement ? hitElement.closest('.option') : null;
    if (targetElement && targetElement !== touchDraggingElement) {
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
    if (!touchDraggingElement) {
        return;
    }
    touchDraggingElement.classList.remove('dragging');
    touchDraggingElement = null;
    Clients[clientID].reorderLayers(layerOrderFromDOM());
}

function openAddLayerMenu() {
    // Fill the list of available animations
    const animationSelect = document.getElementById('animation-select');
    animationSelect.innerHTML = ''; // Clear existing options

    Object.entries(Animations).forEach(([key, value]) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = value.animationName;
        animationSelect.appendChild(option);
    });
}

function submitAddLayerForm(selectedAnimation) {
    // Add the new layer to the existing layers
    const newLayer = {
        layerID: timeBasedUint64(), // Unique ID
        animationID: selectedAnimation,
        enabled: true,
        dimmer: 100,
        hueShift: 0,
        rotate: 0,
        pan: 0,
        tilt: 0,
        scale: 25,
        volume: 1,
        shader: '',
        stretchX: 100,
        stretchY: 100,
        parameters: {},
        shaderParameters: {},
        textureShaders: {},
        textureShaderOrder: [],
    };
    Clients[clientID].addLayer(newLayer);
    loadLayers(Clients[clientID], clientID);
}

function deleteLayer(layerIndex) {
    Clients[clientID].removeLayer(layerIndex);
    loadLayers(Clients[clientID], clientID);
}
