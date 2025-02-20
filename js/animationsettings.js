import { createInputElement } from "./settingsPopup.js";
import { Animations } from "./staticData.js";

export function openAnimationSettingsPopup(layer, clientID) {
    const settings = Animations[layer.animationID].parameters

    // Open the popup with settings specific to this layer
    openPopup(Object.entries(settings).map(([key, value]) => ({
        name: key,
        description: key,
        type: value.type,
        min: value.min,
        max: value.max,
        stepSize: value.stepSize,
        value: layer.parameters[key] || value._default
    })));
    
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
                    newValue = parseFloat(event.target.value);
                    break;
                case 'color':
                case 'text':
                case 'textarea':
                case 'select-one':
                    newValue = event.target.value;
                    break;
                default:
                    newValue = event.target.value;
            }
            layer.parameters[fieldName] = newValue;  // Update the layer property
        });
    });
    
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

        let input = createInputElement(element);

        input.name = element.name;
        container.appendChild(input);
        form.appendChild(container);
    });


    popup.style.display = 'flex';
}

export function closePopup() {
    document.getElementById('popup').style.display = 'none';
    document.querySelector('.popup-content.shader').style.display = 'none';

}
window.closePopup = closePopup