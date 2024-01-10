// client-management/app.js
document.addEventListener('DOMContentLoaded', async () => {
  // Fetch and display clients
  const clientsList = document.getElementById('clients-list');
  const clients = await fetchClients();
  displayAccounts(clients);

  // Set up form submission
  const createClientForm = document.getElementById('create-client-form');
  createClientForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('clientName').value;
    const email = document.getElementById('clientEmail').value;
    await createAccount(name, email);
    // Refresh clients list after creating a new client
    const updatedClients = await fetchClients();
    displayAccounts(updatedClients);
  });
});

async function fetchClients() {
  try {
    const response = await axios.get('http://localhost:3001/clients');
    return response.data;
  } catch (error) {
    console.error('Error fetching clients:', error);
  }
}

async function createAccount(name, email) {
  try {
    await axios.post('http://localhost:3001/clients', { name, email });
  } catch (error) {
    console.error('Error creating client:', error);
  }
}

// Set up update client form submission
const updateClientForm = document.getElementById('update-client-form');
updateClientForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const clientId = document.getElementById('updateClientId').value;
  const newName = document.getElementById('updateClientName').value;
  const newEmail = document.getElementById('updateClientEmail').value;
  await updateClient(clientId, newName, newEmail);
  // Refresh clients list after updating a client
  const updatedClientsAfterUpdate = await fetchClients();
  displayAccounts(updatedClientsAfterUpdate);
});

// Set up delete client form submission
const deleteClientForm = document.getElementById('delete-client-form');
deleteClientForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const clientId = document.getElementById('deleteClientId').value;
  await deleteClient(clientId);
  // Refresh clients list after deleting a client
  const updatedClientsAfterDelete = await fetchClients();
  displayAccounts(updatedClientsAfterDelete);
});

async function updateClient(clientId, newName, newEmail) {
  try {
    await axios.put(`http://localhost:3001/clients/${clientId}`, { name: newName, email: newEmail });
  } catch (error) {
    console.error('Error updating client:', error);
  }
}

async function deleteClient(clientId) {
  try {
    await axios.delete(`http://localhost:3001/clients/${clientId}`);
  } catch (error) {
    console.error('Error deleting client:', error);
  }
}

function displayAccounts(clients) {
  const clientsTable = document.getElementById('clients-table');
  const clientsList = document.getElementById('clients-list');
  clientsList.innerHTML = '';

  clients.forEach((client) => {
    const row = clientsTable.insertRow(-1);
    const cellId = row.insertCell(0);
    const cellName = row.insertCell(1);
    const cellEmail = row.insertCell(2);
    const cellAccount = row.insertCell(3);

    cellId.textContent = client.id;
    cellName.textContent = client.name;
    cellEmail.textContent = client.email;
    cellAccount.innerHTML = `<button class="button-blue" role="button" onclick="window.location.href='http://localhost:3002/clients/${client.id}'">Accounts</button>`;

  });}

