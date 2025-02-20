import { openShaderSettingsPopup, closeShaderPopup } from "./shader.js";
import { TextureShaders } from "./staticData.js";

export function openShaderOrderPopup(layer, clientID) {
    // Open the popup with settings specific to this layer
    openPopup(layer.textureShaderOrder, layer);
}
let settingsIndex = undefined;
function openPopup(shaders, layer) {
    const popup = document.getElementById('popup');
    const form = document.getElementById('settings-form');
    form.innerHTML = ''; // Clear existing form elements

    shaders.forEach((shader, index) => {
        const container = document.createElement('div');
        container.classList.add('form-element');
        container.classList.add('shader');

        const shaderElement = document.createElement('div');
        shaderElement.classList.add('option');
        shaderElement.setAttribute('shaderID', shader);
        shaderElement.setAttribute('index', index);
        const dragHandle = document.createElement('div');
        dragHandle.draggable = true;
        dragHandle.classList.add('drag-handle');
        dragHandle.textContent = "⠿"; // Drag icon
        dragHandle.style.cursor = "grab";
        shaderElement.appendChild(dragHandle);

        dragHandle.addEventListener('dragstart', (event) => {
            console.log(event.target)
            handleDragStart(event);
        });
        shaderElement.addEventListener('dragover', handleDragOver);
        shaderElement.addEventListener('drop', (event) => handleDrop(event, layer));
        const label = document.createElement('div');
        label.innerText = shader
        shaderElement.appendChild(label);

        const settingsButton = document.createElement('div');
        settingsButton.classList.add('delete');
        settingsButton.textContent = '⚙️';
        settingsButton.style.cursor = 'pointer';
        settingsButton.onclick = (event) => {
            event.stopPropagation();
            openShaderSettingsPopup(layer, shader, index);
            settingsIndex = index;
        };

        shaderElement.appendChild(settingsButton);


        const deleteButton = document.createElement('div');
        deleteButton.classList.add('delete');
        deleteButton.textContent = '🗑️';
        deleteButton.style.cursor = 'pointer';
        deleteButton.onclick = (event) => {
            event.stopPropagation();
            layer.removeTextureShader(index);
            openPopup(layer.textureShaderOrder, layer);
            if (index == settingsIndex) {
                closeShaderPopup()
            }
        };

        shaderElement.appendChild(deleteButton);

        container.appendChild(shaderElement);
        form.appendChild(container);
    });

    // Add dropdown and button to add shader
    const container = document.createElement('div');
    container.classList.add('form-element');
    container.classList.add('add-shader');

    const dropdown = document.createElement('select');
    dropdown.id = 'shader-dropdown';

    Object.keys(TextureShaders).forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.innerText = TextureShaders[option].shaderName || option;
        dropdown.appendChild(optionElement);
    });

    const addShaderButton = document.createElement('button');
    addShaderButton.innerText = 'Add Shader';
    addShaderButton.addEventListener('click', () => {
        const selectedShader = dropdown.value;
        layer.addTextureShader(selectedShader);
        openPopup(layer.textureShaderOrder, layer);
    });

    container.appendChild(dropdown);
    container.appendChild(addShaderButton);
    form.appendChild(container);

    form.appendChild(container);
    popup.style.display = 'flex';
}

function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.parentElement.dataset.index);
    event.target.parentElement.classList.add('dragging');
}

function handleDragOver(event) {
    event.preventDefault();
    const targetElement = event.target.closest('.option');
    const draggedElement = document.querySelector('.dragging');

    if (targetElement && draggedElement !== targetElement) {
        const form = document.getElementById('settings-form');
        const children = Array.from(form.children);
        const draggingIndex = children.indexOf(draggedElement.parentElement);
        const targetIndex = children.indexOf(targetElement.parentElement);

        if (draggingIndex < targetIndex) {
            form.insertBefore(draggedElement.parentElement, targetElement.parentElement.nextSibling);
        } else {
            form.insertBefore(draggedElement.parentElement, targetElement.parentElement);
        }
    }
}

function handleDrop(event, layer) {
    event.preventDefault();
    const draggedElement = document.querySelector('.dragging');

    if (draggedElement) {
        draggedElement.classList.remove('dragging');

        const form = document.getElementById('settings-form');
        const children = Array.from(form.querySelectorAll(".shader > .option"));

        const newOrder = Array.from(children).map(container =>
            container.getAttribute("index") - 0
        );

        layer.reorderTextureShader(newOrder);
    }
}

