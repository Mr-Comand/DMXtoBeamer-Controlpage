export function openShaderSettingsPopup(layer, shaderID, clientID) {
    const settings = {
        "BallCount": {
            "type": "number",
            "min": 1,
            "max": 50,
            "default": layer.parameters.BallCount || 5,
            "stepSize": 1
        },
        "Color": {
            "type": "color",
            "default": layer.parameters.Color || "#000000", // Default color
            "stepSize": 1
        },
        "Shape": {
            "type": "enum",
            "min": 1,
            "max": 50,
            "default": layer.parameters.Shape || 5,
            "stepSize": 1
        },
        "Hollow": {
            "type": "bool",
            "default": layer.parameters.Hollow || false, // Default boolean
            "stepSize": 1
        },
        "LineWidth": {
            "type": "number",
            "min": 1,
            "max": 50,
            "default": layer.parameters.LineWidth || 5,
            "stepSize": 1
        },
        "Rotation": {
            "type": "number",
            "min": 1,
            "max": 50,
            "default": layer.parameters.Rotation || 5,
            "stepSize": 1
        },
        "AverageSpeed": {
            "type": "number",
            "min": 1,
            "max": 5000,
            "default": layer.parameters.AverageSpeed || 1000,
            "stepSize": 0.1
        }
    };

    // Open the popup with settings specific to this layer
    openPopup(Object.entries(settings).map(([key, value]) => ({
        name: key,
        description: key,
        type: value.type,
        min: value.min,
        max: value.max,
        stepSize: value.stepSize,
        default: value.default,
        value: layer[key] || value.default // Load current layer value
    })), shaderID);

    // Update the layer's property immediately as the user adjusts sliders/input fields
    document.querySelectorAll('.popup input').forEach(input => {
        input.addEventListener('input', (event) => {
            const fieldName = event.target.name;
            const newValue = event.target.value;
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

        let input;
        if (element.type === 'range') {
            input = document.createElement('input');
            input.type = 'range';
            input.min = element.min;
            input.max = element.max;
            input.step = element.stepSize;
            input.value = element.default;
        } else if (element.type === 'color') {
            input = document.createElement('input');
            input.type = 'color';
            input.value = element.default;
        } else if (element.type === 'enum') {
            input = document.createElement('select');
            if (element.options)
                element.options.forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option;
                    optionElement.textContent = option;
                    if (option === element.default) {
                        optionElement.selected = true;
                    }
                    input.appendChild(optionElement);
                });
        } else if (element.type === 'checkbox') {
            input = document.createElement('input');
            input.type = 'checkbox';
            input.checked = element.default;
        } else {
            input = document.createElement('input');
            input.type = 'number';
            input.min = element.min;
            input.max = element.max;
            input.step = element.stepSize;
            input.value = element.default;
        }

        input.name = element.name;
        container.appendChild(input);
        form.appendChild(container);
    });

}

export function closeShaderPopup() {
    document.querySelector('.popup-content.shader').style.display = 'none';
}
window.closeShaderPopup = closeShaderPopup