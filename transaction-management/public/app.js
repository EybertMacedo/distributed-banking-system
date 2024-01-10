// account-management/public/app.js
document.addEventListener('DOMContentLoaded', async () => {
  // Fetch and display accounts
  const currentUrl = window.location.href;
  console.log(currentUrl);
  const accounts = await fetchClients(currentUrl);
  displayAccounts(accounts);

  // Set up form submission
  const createAccountForm = document.getElementById('create-account-form');
  createAccountForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const clientId = document.getElementById('clientId').value;
    const bankId = document.getElementById('bankId').value;
    const balance = document.getElementById('balance').value;
    await createAccount(clientId, bankId, balance);
    // Refresh accounts list after creating a new account
    const updatedAccounts = await fetchClients(currentUrl);
    displayAccounts(updatedAccounts);
  });
});

async function fetchClients(url) {  
  try {
    let apiUrl;

    if (url.includes('/banks/')) {
      // If the URL contains '/banks/', fetch accounts based on bank ID
      const bankId = url.split('/banks/')[1];
      apiUrl = `http://localhost:3002/banks/${bankId}`;
    } else if (url.includes('/clients/')) {
      // If the URL contains '/clients/', fetch accounts based on client ID
      const clientId = url.split('/clients/')[1];
      apiUrl = `http://localhost:3002/clients/${clientId}`;
    } else {
      apiUrl = 'http://localhost:3002/accounts';
    }

    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error('Error fetching accounts:', error);
  }  
}



async function createAccount(clientId, bankId, balance) {
  try {
    await axios.post('http://localhost:3002/accounts', { clientId, bankId, balance });
  } catch (error) {
    console.error('Error creating account:', error);
  }
}

async function updateClient(newClientId, newBankId, newBalance) {
  try {
    await axios.put(`http://localhost:3002/accounts/${accountId}`, { client_id: newClientId, bank_id: newBankId, balance: newBalance });
  } catch (error) {
    console.error('Error updating client:', error);
  }
}

async function deleteAccount(accountId) {
  try {
    await axios.delete(`http://localhost:3002/accounts/${accountId}`);
  } catch (error) {
    console.error('Error deleting client:', error);
  }
}

const deleteAccountForm = document.getElementById('delete-account-form');
deleteAccountForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const accountId = document.getElementById('deleteAccountId').value;
  await deleteAccount(accountId);
  // Refresh account list after deleting an account
  const updatedAccountsAfterDelete = await fetchClients();
  displayAccounts(updatedAccountsAfterDelete);
});

function displayAccounts(accounts) {
  console.log('Displaying accounts:', accounts);

  const accountsTable = document.getElementById('accounts-table');
  const accountsList = document.getElementById('accounts-list');
  accountsList.innerHTML = '';

  accounts.forEach((account) => {
    const row = accountsTable.insertRow(-1);
    const cellId = row.insertCell(0);
    const cellClientId = row.insertCell(1);
    const cellBankId = row.insertCell(2);
    const cellBalance = row.insertCell(3);

    cellId.textContent = account.id;
    cellClientId.textContent = account.client_id;
    cellBankId.textContent = account.bank_id;
    cellBalance.textContent = account.balance;
  });     
}

