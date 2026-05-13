const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'contacts.json');

app.use(cors());
app.use(express.json());

function loadContacts() {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, '[]');
        return [];
    }
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
}

function saveContacts(contacts) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(contacts, null, 2));
}

app.get('/api/contacts', (req, res) => {
    const contacts = loadContacts();
    res.json(contacts);
});

app.post('/api/contacts', (req, res) => {
    const contacts = loadContacts();
    const contact = req.body;
    contact.id = Date.now();
    contacts.push(contact);
    saveContacts(contacts);
    res.status(201).json(contact);
});

app.put('/api/contacts/:id', (req, res) => {
    const contacts = loadContacts();
    const { id } = req.params;
    const index = contacts.findIndex(c => c.id == id);
    if (index === -1) {
        return res.status(404).json({ error: 'Contacto no encontrado' });
    }
    contacts[index] = { ...contacts[index], ...req.body };
    saveContacts(contacts);
    res.json(contacts[index]);
});

app.delete('/api/contacts/:id', (req, res) => {
    let contacts = loadContacts();
    const { id } = req.params;
    contacts = contacts.filter(c => c.id != id);
    saveContacts(contacts);
    res.json({ success: true });
});

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
