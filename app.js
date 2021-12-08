'use strict';
let xhttp = new XMLHttpRequest();

//CRUD
const getClients = () => {
    resetTable();
    xhttp.onload = function() {
        const listaClientes = JSON.parse(this.responseText);

        listaClientes.forEach((client) => {
            const newRow = document.createElement('tr');

            newRow.innerHTML = `
                <td>${client.registration_number}</td>
                <td>${client.name}</td>
                <td>${client.cellphone}</td>
                <td>
                    <button class="button edit" id="edit-${client.registration_number}">Edit</button>
                    <button class="button delete" id="delete-${client.registration_number}">Delete</button>
                </td>
            `;
            document.querySelector('tbody').appendChild(newRow);
        });
    };
    xhttp.open("GET", "http://library-app-pp2.herokuapp.com/clients", true);
    xhttp.send();
};

const saveNewClient = () => {
    const client = {
        name: document.getElementById('name').value,
        cellphone: document.getElementById('cellphone').value
    };
    const registration = document.getElementById('name').dataset.registration;

    xhttp.onload = function() {
        getClients();
        closeModal();
    };
    registration == 'new' ? 
        (xhttp.open("POST", "https://library-app-pp2.herokuapp.com/clients", true)) : 
        (xhttp.open("PUT", `https://library-app-pp2.herokuapp.com/clients/${registration}`, true));
    xhttp.setRequestHeader('Content-type', 'application/json;charset=UTF-8');
    xhttp.send(JSON.stringify(client));
};

const updateClient = (registration_number) => {
    xhttp.onload = function() {
        const client = JSON.parse(this.responseText);
        
        document.getElementById('name').value = client[0].name;
        document.getElementById('cellphone').value = client[0].cellphone;
        document.getElementById('name').dataset.registration = registration_number;
        openModal();
    };
    xhttp.open("GET", `https://library-app-pp2.herokuapp.com/clients/${registration_number}`, true);
    xhttp.send();
};

const checkDeleteClient = (registration_number) => {
    xhttp.onload = function() {
        const client = JSON.parse(this.responseText);
        const response = confirm(`Are you sure you want to delete the client: ${client[0].name}`);

        if (response) deleteClient(registration_number);
    };
    xhttp.open("GET", `https://library-app-pp2.herokuapp.com/clients/${registration_number}`, true);
    xhttp.send();
};

const deleteClient = (registration_number) => {
    xhttp.onload = function() {getClients()};
    xhttp.open("DELETE", `https://library-app-pp2.herokuapp.com/clients/${registration_number}`, true);
    xhttp.send();
};

const editOrDeleteButton = (event) => {
    const [button, registration_number] = event.target.id.split('-');
    if (button == 'edit') updateClient(registration_number);
    if (button == 'delete') checkDeleteClient(registration_number);
};

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field');
    fields.forEach(field => field.value = "");
    document.getElementById('name').dataset.registration = 'new';
};

const resetTable = () => {
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach(row => row.parentNode.removeChild(row));
};

//modal
const openModal = () => {
    document.getElementById('modal').classList.add('active');
};

const closeModal = () => {
    clearFields();
    document.getElementById('modal').classList.remove('active');
};

//call function
getClients();

//we need to wait DOM load complety to not return null
window.onload=function(){
    document.getElementById('register').addEventListener('click', openModal);
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('save').addEventListener('click', saveNewClient);
    document.querySelector('tbody').addEventListener('click', editOrDeleteButton);
    document.getElementById('cancel').addEventListener('click', closeModal);
};



