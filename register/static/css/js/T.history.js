// Function to Display Transactions
function displayTransactions(transactionsToShow) {
    const transactionList = document.getElementById('transaction-list');
    transactionList.innerHTML = '';

    transactionsToShow.forEach(transaction => {
        const transactionItem = document.createElement('div');
        transactionItem.classList.add('transaction-item');
        
        transactionItem.innerHTML = `
            <div class="transaction-details">
                <div class="transaction-type">${transaction.type}</div>
                <div>${transaction.date}</div>
                <div>Balance: ₹${transaction.balance.toFixed(2)}</div>
            </div>
            <div class="transaction-amount ${transaction.type.toLowerCase()}">
                ${transaction.type === 'Withdrawal' ? '-' : '+'}₹${transaction.amount.toFixed(2)}
            </div>
        `;

        transactionList.appendChild(transactionItem);
    });
}

// Function to Load Transactions from localStorage
function loadTransactions() {
    const transactionHistory = JSON.parse(localStorage.getItem('transactions')) || [];
    displayTransactions(transactionHistory);
}

// Watch for updates in localStorage and refresh the transaction list
window.addEventListener('storage', (event) => {
    if (event.key === 'transactions') {
        loadTransactions(); // Update the transaction list if 'transactions' data changes
    }
});

// Initial Load of All Transactions
loadTransactions();
