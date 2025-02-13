document.addEventListener('DOMContentLoaded', () => {
    // Select the first item by default
    const firstItem = document.querySelector('.item');
    if (firstItem) {
        selectItem(firstItem);
    }

    loadOptions();

    // Close popup when clicking outside of it
    document.addEventListener('mousedown', (event) => {
        const popup = document.getElementById('popup');
        const popupContent = document.querySelector('.popup-content');
        if (popup.style.display === 'flex' && !popupContent.contains(event.target)) {
            closePopup();
        }
    });
});

function selectItem(element) {
    document.querySelectorAll('.item').forEach(item => item.classList.remove('selected'));
    element.classList.add('selected');
    // Load options based on the selected item
    loadOptions();
}

function loadOptions() {
    const content = document.querySelector('.content');
    content.innerHTML = ''; // Clear existing options

    // Fetch options from the API (replace with actual API call)
    const options = [
        { title: 'Animation 1', image: 'https://picsum.photos/175/175',formElements: [{ type: 'checkbox', name: 'option1', label: 'Option 1' }, { type: 'range', name: 'slider', min: 0, max: 100 }] },
        { title: 'Animation 2', image: 'https://picsum.photos/75/75',formElements: [{ type: 'text', name: 'textInput', placeholder: 'Text input' }] },
        { title: 'Animation 3', image: 'https://picsum.photos/200/200',formElements: [{ type: 'checkbox', name: 'option2', label: 'Option 2' }] }
    ];

    options.forEach(option => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('option');
        optionElement.draggable = true;
        optionElement.addEventListener('dragstart', handleDragStart);
        optionElement.addEventListener('dragover', handleDragOver);
        optionElement.addEventListener('drop', handleDrop);
        optionElement.addEventListener('touchstart', handleTouchStart);
        optionElement.addEventListener('touchmove', handleTouchMove);
        optionElement.addEventListener('touchend', handleTouchEnd);

        const img = document.createElement('img');
        img.src = option.image;

        const title = document.createElement('div');
        title.classList.add('title');
        title.textContent = option.title;

        const settings = document.createElement('div');
        settings.classList.add('settings');
        settings.textContent = '⚙️';
        settings.onclick = () => openPopup(option.formElements);

        optionElement.appendChild(img);
        optionElement.appendChild(title);
        optionElement.appendChild(settings);

        content.appendChild(optionElement);
    });

    // Add option to add a new animation
    const addOptionElement = document.createElement('div');
    addOptionElement.classList.add('option', 'add');
    addOptionElement.textContent = '+';
    addOptionElement.style.textAlign = 'center';
    addOptionElement.style.fontSize = '24px';
    addOptionElement.style.cursor = 'pointer';
    addOptionElement.onclick = () => {
        // Logic to add a new animation
        alert('Add new animation');
    };
    content.appendChild(addOptionElement);
}

function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.dataset.index);
    event.target.classList.add('dragging');
}

function handleDragOver(event) {
    event.preventDefault();
    const draggingElement = document.querySelector('.dragging');
    const targetElement = event.target.closest('.option');
    if (targetElement && targetElement !== draggingElement) {
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
        label.textContent = element.label || element.name;
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