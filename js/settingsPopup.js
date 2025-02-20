export function createInputElement(element) {
    let input;

    switch (element.type) {
        case 'bool':
            input = document.createElement('input');
            input.type = 'checkbox';
            input.checked = element.value;
            break;
        case 'slider':
            input = document.createElement('input');
            input.type = 'range';
            input.min = element.min;
            input.max = element.max;
            input.step = element.stepSize;
            input.value = element.value;
            break;
        case 'string':
            input = document.createElement('input');
            input.type = 'text';
            input.value = element.value;
            break;
        case 'textarea':
            input = document.createElement('textarea');
            input.value = element.value;
            break;
        case 'number':
            input = document.createElement('input');
            input.type = 'number';
            input.min = element.min;
            input.max = element.max;
            input.step = element.stepSize;
            input.value = element.value;
            break;
        case 'color':
            input = document.createElement('input');
            input.type = 'color';
            input.value = element.value;
            break;
        case 'enum':
            input = document.createElement('select');
            if (element.options) {
                element.options.forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option;
                    optionElement.textContent = option;
                    if (option === element.value) {
                        optionElement.selected = true;
                    }
                    input.appendChild(optionElement);
                });
            }
            break;
        default:
            input = document.createElement('input');
            input.type = 'text';
            input.value = element.value;
    }

    return input;
}
