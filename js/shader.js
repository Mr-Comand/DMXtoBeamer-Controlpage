import { createInputElement } from "./settingsPopup.js";
import { TextureShaders } from "./staticData.js";

export function openShaderSettingsPopup(layer, shaderID, clientID) {
    const settings = TextureShaders[shaderID].parameters
    if (!layer.textureShaders[shaderID]) {
        layer.textureShaders[shaderID] = {};
    }
    // Open the popup with settings specific to this layer
    openPopup(Object.entries(settings).map(([key, value]) => ({
        name: key,
        description: key,
        type: value.type || "number",
        min: value.min,
        max: value.max,
        stepSize: value.stepSize,
        default: value.default,
        options: value.enumElements,
        value: layer.textureShaders[shaderID][key] || value._default // Load current layer value
    })), TextureShaders[shaderID].shaderName || shaderID);

    // Update the layer's property immediately as the user adjusts sliders/input fields
    document.querySelectorAll('.popup input, .popup select, .popup textarea').forEach(input => {
        input.addEventListener('input', (event) => {
            const fieldName = event.target.name;
            let newValue;

            switch (event.target.type) {
                case 'checkbox':
                    newValue = event.target.checked;
                    break;
                case 'range':
                case 'number':
                case 'select-one':
                    newValue = parseFloat(event.target.value);
                    break;
                case 'color':
                case 'text':
                case 'textarea':
                    newValue = event.target.value;
                    break;
                default:
                    newValue = event.target.value;
            }
            if (newValue === undefined || Number.isNaN(newValue)) {
                newValue = Animations[layer.animationID].parameters[fieldName]._default;
            }
            if (!layer.textureShaders[shaderID]) {
                layer.textureShaders[shaderID] = {};
            }
            layer.textureShaders[shaderID][fieldName] = newValue;  // Update the layer property
        });
    });

}

function openPopup(formElements, name) {
    const popup = document.getElementById('popup');
    const shaderPopup = document.querySelector('.popup-content.shader');
    const heading = document.querySelector('.popup-content.shader > h2');
    heading.innerHTML = name;
    const form = document.getElementById('shader-settings-form');
    shaderPopup.style.display = "unset"
    form.innerHTML = ''; // Clear existing form elements

    formElements.forEach(element => {
        const container = document.createElement('div');
        container.classList.add('form-element');

        const label = document.createElement('label');
        label.textContent = element.description || element.name;
        container.appendChild(label);

        let input = createInputElement(element);

        input.name = element.name;
        container.appendChild(input);
        form.appendChild(container);
    });

}

export function closeShaderPopup() {
    document.querySelector('.popup-content.shader').style.display = 'none';
}
window.closeShaderPopup = closeShaderPopup