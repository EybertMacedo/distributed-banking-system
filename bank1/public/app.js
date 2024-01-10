// bank1/public/app.js
document.addEventListener('DOMContentLoaded', async () => {
    const loginForm = document.getElementById('login-form');
    const depositForm = document.getElementById('deposit-form');
    const transferForm = document.getElementById('transfer-form');
    const withdrawForm = document.getElementById('withdraw-form');
  
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
  
      try {
        const response = await axios.post('http://localhost:3004/login', { username, password });
        const { role } = response.data;
  
        if (role === 'admin') {
          // Redirect to http://localhost:3000 for admins
          window.location.href = 'http://localhost:3000';
        } else if (role === 'client') {
          // Redirect to user's accounts page in Bank 1   
          const { clientId } = response.data;
          window.location.href = `http://localhost:4001/clients/${clientId}`;
        } else {
          console.error('Invalid role');
        }
      } catch (error) {
        console.error('Error during login:', error);
      }
    });
  
    depositForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const accountId = document.getElementById('depositAccountId').value;
      const amount = document.getElementById('depositAmount').value;
  
      try {
        await axios.post(`http://localhost:4001/accounts/${accountId}/deposit`, { amount });
        alert('Deposit successful!');
        // Refresh the accounts table after the operation
        await refreshAccounts();
      } catch (error) {
        console.error('Error during deposit:', error);
        alert('Error during deposit. Please try again.');
      }
    });
  
    transferForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const fromAccountId = document.getElementById('transferFromAccountId').value;
      const toAccountId = document.getElementById('transferToAccountId').value;
      const amount = document.getElementById('transferAmount').value;
  
      try {
        await axios.post('http://localhost:4001/accounts/${fromAccountId}/transfer/${toAccountId}', { amount });
        alert('Transfer successful!');
        // Refresh the accounts table after the operation
        await refreshAccounts();
      } catch (error) {
        console.error('Error during transfer:', error);
        alert('Error during transfer. Please try again.');
      }
    });
  
    withdrawForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const accountId = document.getElementById('withdrawAccountId').value;
      const amount = document.getElementById('withdrawAmount').value;
  
      try {
        await axios.post(`http://localhost:4001/accounts/${accountId}/withdraw`, { amount });
        alert('Withdrawal successful!');
        // Refresh the accounts table after the operation
        await refreshAccounts();
      } catch (error) {
        console.error('Error during withdrawal:', error);
        alert('Error during withdrawal. Please try again.');
      }
    });
  
    // Fetch and display accounts initially
    await refreshAccounts();
  });
  
  async function refreshAccounts() {
    const currentUrl = window.location.href;
    const accounts = await fetchAccounts(currentUrl);
    displayAccounts(accounts);
  }
  
  async function fetchAccounts(url) {
    try {
      let apiUrl;    
      const clientId = url.split('/clients/')[1];
      apiUrl = `http://localhost:3002/clients/${clientId}`;   
  
      const response = await axios.get(apiUrl);
      return response.data;
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }  
  }
  
  function displayAccounts(accounts) {
    const accountsTable = document.getElementById('accounts-table');
    const accountsList = document.getElementById('accounts-list');
    accountsList.innerHTML = '';
  
    accounts.forEach((account) => {
      const row = accountsTable.insertRow(-1);
      const cellId = row.insertCell(0);
      const cellBankId = row.insertCell(1);
      const cellBalance = row.insertCell(2);
      const cellDescription = row.insertCell(3);
  
      cellId.textContent = account.id;
      cellBankId.textContent = account.bank_id;
      cellBalance.textContent = account.balance;
      cellDescription.textContent = account.description;
    });     
  }
  