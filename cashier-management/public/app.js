// app.js

document.addEventListener('DOMContentLoaded', async () => {
    // Fetch and display banks
    const banks = await fetchBanks();
    displaybanks(banks);
      
  });
  
async function fetchBanks() {
  try {
    const response = await axios.get('http://localhost:3000/banks');
    return response.data;
  } catch (error) {
    console.error('Error fetching banks:', error);
  }
}
  
function displaybanks(banks) {
  const banksTable = document.getElementById('banks-table');
  const banksList = document.getElementById('banks-list');
  banksList.innerHTML = '';

  banks.forEach((Bank) => {
    const row = banksTable.insertRow(-1);
    const cellId = row.insertCell(0);
    const cellName = row.insertCell(1);
    const cellAccount = row.insertCell(2);

    cellId.textContent = Bank.id;
    cellName.textContent = Bank.name;
    cellAccount.innerHTML = `<button class="button-blue" role="button" onclick="window.location.href='http://localhost:3002/banks/${Bank.id}'">Accounts</button>`; 
  });    
}