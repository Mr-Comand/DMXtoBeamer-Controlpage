export function createInputElement(element) {
    let input;

    switch (element.type) {
        case 'bool':
            input = document.createElement('input');
            input.type = 'checkbox';
            input.checked = element.value;
            break;
        case 'slider':
            input = createRangeInput(element);
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
                element.options.forEach((option, index) => {
                    const optionElement = document.createElement('option');
                    optionElement.value = index; // Set value as index
                    optionElement.textContent = option;
                    if (index == element.value) {
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

// Range slider with an editable number field, so values can also be entered manually
export function createRangeInput(element) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('range-input-wrapper');

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = element.min;
    slider.max = element.max;
    slider.step = element.stepSize;
    slider.value = element.value;

    const number = document.createElement('input');
    number.type = 'number';
    number.min = element.min;
    number.max = element.max;
    number.step = element.stepSize;
    number.value = element.value;
    number.classList.add('value-input');

    slider.addEventListener('input', () => {
        number.value = slider.value;
    });
    number.addEventListener('input', () => {
        if (number.value !== '') {
            slider.value = number.value;
        }
    });

    wrapper.appendChild(slider);
    wrapper.appendChild(number);
    return wrapper;
}
