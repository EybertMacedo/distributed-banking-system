// account-management/public/app.js
document.addEventListener('DOMContentLoaded', async () => {
  // Fetch and display accounts
  const currentUrl = window.location.href;
  console.log(currentUrl);
  const accounts = await fetchAccounts(currentUrl);
  displayAccounts(accounts);

  // Set up form submission
  const createAccountForm = document.getElementById('create-account-form');
  createAccountForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const clientId = document.getElementById('clientId').value;
    const cashierId = document.getElementById('cashierId').value;
    const balance = document.getElementById('balance').value;
    const description = document.getElementById('description').value;
    await createAccount(clientId, cashierId, balance, description);
    // Refresh accounts list after creating a new account
    const updatedAccounts = await fetchAccounts(currentUrl);
    displayAccounts(updatedAccounts);
  });
});

async function fetchAccounts(url) {  
  try {
    let apiUrl;

    if (url.includes('/cashiers/')) {
      // If the URL contains '/cashiers/', fetch accounts based on cashier ID
      const cashierId = url.split('/cashiers/')[1];
      apiUrl = `http://localhost:3002/cashiers/${cashierId}`;
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



async function createAccount(clientId, cashierId, balance, description) {
  try {
    await axios.post('http://localhost:3002/accounts', { clientId, cashierId, balance, description});
  } catch (error) {
    console.error('Error creating account:', error);
  }
}

async function updateClient(newClientId, newcashierId, newBalance, newDescription) {
  try {
    await axios.put(`http://localhost:3002/accounts/${accountId}`, { client_id: newClientId, cashier_id: newcashierId, balance: newBalance, description:newDescription });
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
  const updatedAccountsAfterDelete = await fetchAccounts();
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
    const cellcashierId = row.insertCell(2);
    const cellBalance = row.insertCell(3);
    const cellDescription = row.insertCell(4);

    cellId.textContent = account.id;
    cellClientId.textContent = account.client_id;
    cellcashierId.textContent = account.cashier_id;
    cellBalance.textContent = account.balance;
    cellDescription.textContent = account.description;
  });     
}