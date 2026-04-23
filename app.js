
const contactForm = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const lastnameInput = document.getElementById('lastname');
const phoneInput = document.getElementById('phone');
const cityInput = document.getElementById('city');
const addressInput = document.getElementById('address');
const genderInputs = document.querySelectorAll('input[name="gender"]');
const addBtn = document.getElementById('addBtn');
const contactsList = document.getElementById('contactsList');
const spinner = document.getElementById('spinner');


const STORAGE_KEY = 'contactsList';




function getContacts() {
    const contacts = localStorage.getItem(STORAGE_KEY);
    return contacts ? JSON.parse(contacts) : [];
}

function saveContacts(contacts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
}


function createContact(contact) {
    return new Promise((resolve) => {
        showSpinner();
        setTimeout(() => {
            const contacts = getContacts();
            contact.id = Date.now();
            contacts.push(contact);
            saveContacts(contacts);
            hideSpinner();
            resolve(contact);
        }, 1500); 
    });
}


function readContacts() {
    return getContacts();
}


function updateContact(id, updatedContact) {
    return new Promise((resolve) => {
        showSpinner();
        setTimeout(() => {
            const contacts = getContacts();
            const index = contacts.findIndex(c => c.id === id);
            if (index !== -1) {
                contacts[index] = { ...contacts[index], ...updatedContact };
                saveContacts(contacts);
            }
            hideSpinner();
            resolve();
        }, 1500);
    });
}

 
function deleteContact(id) {
    return new Promise((resolve) => {
        showSpinner();
        setTimeout(() => {
            const contacts = getContacts();
            const filteredContacts = contacts.filter(c => c.id !== id);
            saveContacts(filteredContacts);
            hideSpinner();
            resolve();
        }, 1500);
    });
}


function validateForm() {
    const name = nameInput.value.trim();
    const lastname = lastnameInput.value.trim();
    const phone = phoneInput.value.trim();
    const city = cityInput.value.trim();
    const address = addressInput.value.trim();
    const gender = document.querySelector('input[name="gender"]:checked');

    if (!name) {
        alert('Por favor, ingresa tu nombre');
        nameInput.focus();
        return false;
    }

    if (!lastname) {
        alert('Por favor, ingresa tu apellido');
        lastnameInput.focus();
        return false;
    }

    if (!phone) {
        alert('Por favor, ingresa tu teléfono');
        phoneInput.focus();
        return false;
    }

    if (!city) {
        alert('Por favor, ingresa tu ciudad');
        cityInput.focus();
        return false;
    }

    if (!address) {
        alert('Por favor, ingresa tu dirección');
        addressInput.focus();
        return false;
    }

    if (!gender) {
        alert('Por favor, selecciona un género');
        return false;
    }

    return true;
}


function showSpinner() {
    spinner.classList.remove('hidden');
}

function hideSpinner() {
    spinner.classList.add('hidden');
}

function getGenderIcon(gender) {
    return gender === 'Female' ? '👩' : '👨';
}

function renderContacts() {
    const contacts = readContacts();
    contactsList.innerHTML = '';

    if (contacts.length === 0) {
        contactsList.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No hay contactos registrados</p>';
        return;
    }

    contacts.forEach(contact => {
        const contactElement = document.createElement('div');
        contactElement.className = 'contact-item';
        contactElement.innerHTML = `
            <div class="contact-info">
                <div class="gender-icon">${getGenderIcon(contact.gender)}</div>
                <div class="contact-details">
                    <span class="contact-name">${contact.name} ${contact.lastname}</span>
                    <span class="contact-meta"> ${contact.phone} •  ${contact.city}</span>
                    <span class="contact-meta"> ${contact.address}</span>
                </div>
            </div>
            <div class="contact-actions">
                <button class="edit-btn" data-id="${contact.id}">✏️</button>
                <button class="delete-btn" data-id="${contact.id}">🗑️</button>
            </div>
        `;

        contactsList.appendChild(contactElement);
    });

    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', handleEdit);
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', handleDelete);
    });
}

function clearForm() {
    contactForm.reset();
    nameInput.focus();
}



async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    const contact = {
        name: nameInput.value.trim(),
        lastname: lastnameInput.value.trim(),
        phone: phoneInput.value.trim(),
        city: cityInput.value.trim(),
        address: addressInput.value.trim(),
        gender: document.querySelector('input[name="gender"]:checked').value
    };

    await createContact(contact);
    clearForm();
    renderContacts();
}

function handleEdit(e) {
    const id = parseInt(e.target.dataset.id);
    const contacts = readContacts();
    const contact = contacts.find(c => c.id === id);

    if (!contact) return;

    showEditForm(id, contact);
}

function showEditForm(id, contact) {
    const editContainer = document.createElement('div');
    editContainer.className = 'edit-form-container';
    editContainer.id = `edit-form-${id}`;
    editContainer.innerHTML = `
        <h2>Editar Contacto</h2>
        <form>
            <input type="text" class="edit-name" value="${contact.name}" placeholder="Nombre" required>
            <input type="text" class="edit-lastname" value="${contact.lastname}" placeholder="Apellido" required>
            <input type="tel" class="edit-phone" value="${contact.phone}" placeholder="Teléfono" required>
            <input type="text" class="edit-city" value="${contact.city}" placeholder="Ciudad" required>
            <input type="text" class="edit-address" value="${contact.address}" placeholder="Dirección" required>
            
            <div class="gender-group">
                <label>
                    <input type="radio" name="edit-gender" value="Female" ${contact.gender === 'Female' ? 'checked' : ''} required>
                    Female
                </label>
                <label>
                    <input type="radio" name="edit-gender" value="Male" ${contact.gender === 'Male' ? 'checked' : ''} required>
                    Male
                </label>
            </div>

            <div style="display: flex; gap: 10px;">
                <button type="button" class="save-btn" style="flex: 1;">Guardar</button>
                <button type="button" class="cancel-btn" style="flex: 1;">Cancelar</button>
            </div>
        </form>
    `;

    contactsList.insertBefore(editContainer, contactsList.firstChild);

    const saveBtn = editContainer.querySelector('.save-btn');
    const cancelBtn = editContainer.querySelector('.cancel-btn');

    saveBtn.addEventListener('click', async () => {
        const editName = editContainer.querySelector('.edit-name').value.trim();
        const editLastname = editContainer.querySelector('.edit-lastname').value.trim();
        const editPhone = editContainer.querySelector('.edit-phone').value.trim();
        const editCity = editContainer.querySelector('.edit-city').value.trim();
        const editAddress = editContainer.querySelector('.edit-address').value.trim();
        const editGender = document.querySelector('input[name="edit-gender"]:checked');

        
        if (!editName || !editLastname || !editPhone || !editCity || !editAddress || !editGender) {
            alert('Por favor, completa todos los campos');
            return;
        }

        const updatedContact = {
            name: editName,
            lastname: editLastname,
            phone: editPhone,
            city: editCity,
            address: editAddress,
            gender: editGender.value
        };

        await updateContact(id, updatedContact);
        editContainer.remove();
        renderContacts();
    });

    cancelBtn.addEventListener('click', () => {
        editContainer.remove();
    });
}

async function handleDelete(e) {
    const id = parseInt(e.target.dataset.id);
    const contacts = readContacts();
    const contact = contacts.find(c => c.id === id);

    if (confirm(`¿Estás seguro de que deseas eliminar a ${contact.name} ${contact.lastname}?`)) {
        await deleteContact(id);
        renderContacts();
    }
}


contactForm.addEventListener('submit', handleSubmit);

nameInput.addEventListener('blur', () => {
    if (nameInput.value.trim() === '') {
        nameInput.style.borderBottom = '2px solid red';
    } else {
        nameInput.style.borderBottom = 'none';
    }
});

lastnameInput.addEventListener('blur', () => {
    if (lastnameInput.value.trim() === '') {
        lastnameInput.style.borderBottom = '2px solid red';
    } else {
        lastnameInput.style.borderBottom = 'none';
    }
});

phoneInput.addEventListener('blur', () => {
    if (phoneInput.value.trim() === '') {
        phoneInput.style.borderBottom = '2px solid red';
    } else {
        phoneInput.style.borderBottom = 'none';
    }
});

cityInput.addEventListener('blur', () => {
    if (cityInput.value.trim() === '') {
        cityInput.style.borderBottom = '2px solid red';
    } else {
        cityInput.style.borderBottom = 'none';
    }
});

addressInput.addEventListener('blur', () => {
    if (addressInput.value.trim() === '') {
        addressInput.style.borderBottom = '2px solid red';
    } else {
        addressInput.style.borderBottom = 'none';
    }
});


document.addEventListener('DOMContentLoaded', () => {
    renderContacts();
    nameInput.focus();
});