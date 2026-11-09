import { createInputElement } from "./settingsPopup.js";
import { TextureShaders } from "./staticData.js";

export function openShaderSettingsPopup(layer, shaderID, clientID) {
    if (!TextureShaders[shaderID] || !TextureShaders[shaderID].parameters) {
        console.error('Shader metadata missing for', shaderID);
        return;
    }
    const settings = TextureShaders[shaderID].parameters;
    if (!layer.textureShaders[shaderID]) {
        layer.textureShaders[shaderID] = {};
    }
    // Open the popup with settings specific to this layer
    const defaultValue = (value) => value.default !== undefined ? value.default : value._default;
    openPopup(Object.entries(settings).map(([key, value]) => ({
        name: key,
        description: key,
        type: value.type || "number",
        min: value.min,
        max: value.max,
        stepSize: value.stepSize,
        default: defaultValue(value),
        options: value.enumElements,
        value: layer.textureShaders[shaderID][key] !== undefined ? layer.textureShaders[shaderID][key] : defaultValue(value) // Load current layer value
    })), TextureShaders[shaderID].shaderName || shaderID);

    // Update the layer's property immediately as the user adjusts sliders/input fields.
    // Range inputs are wrapped together with a number field; use the number field's value.
    document.querySelectorAll('.popup input, .popup select, .popup textarea').forEach(input => {
        input.addEventListener('input', (event) => {
            const fieldName = event.target.name;
            const source = event.target.closest('.range-input-wrapper')?.querySelector('.value-input') || event.target;
            let newValue;

            switch (source.type) {
                case 'checkbox':
                    newValue = event.target.checked;
                    break;
                case 'range':
                case 'number':
                    newValue = parseFloat(source.value);
                    if (!Number.isNaN(newValue)) {
                        newValue = Math.min(Math.max(newValue, parseFloat(source.min)), parseFloat(source.max));
                    }
                    break;
                case 'select-one':
                    newValue = parseFloat(source.value);
                    break;
                case 'color':
                case 'text':
                case 'textarea':
                    newValue = source.value;
                    break;
                default:
                    newValue = source.value;
            }
            if (newValue === undefined || Number.isNaN(newValue)) {
                const def = TextureShaders[shaderID].parameters[fieldName];
                newValue = def.default !== undefined ? def.default : def._default;
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

        // Set name on the actual input elements (the range wrapper is a div, which ignores .name)
        if (input.classList.contains('range-input-wrapper')) {
            input.querySelectorAll('input').forEach(el => { el.name = element.name; });
        } else {
            input.name = element.name;
        }
        container.appendChild(input);
        form.appendChild(container);
    });

}

export function closeShaderPopup() {
    document.querySelector('.popup-content.shader').style.display = 'none';
}
window.closeShaderPopup = closeShaderPopup