// Function to Display Transactions
function displayTransactions(transactionsToShow) {
  const transactionList = document.getElementById("transaction-list")
  transactionList.innerHTML = ""

  if (transactionsToShow.length === 0) {
    transactionList.innerHTML = `
      <div class="no-transactions">
        <div class="no-transactions-icon">📝</div>
        <h3>No Transactions Found</h3>
        <p>You haven't made any transactions yet.</p>
        <a href="/pages/dashboard.html" class="start-transaction-btn">Start Banking →</a>
      </div>
    `
    return
  }

  transactionsToShow.forEach((transaction) => {
    const transactionItem = document.createElement("div")
    transactionItem.classList.add("transaction-item")

    transactionItem.innerHTML = `
      <div class="transaction-details">
        <div class="transaction-type">${transaction.type}</div>
        <div>${transaction.date}</div>
        <div>Balance: ₹${transaction.balance.toFixed(2)}</div>
      </div>
      <div class="transaction-amount ${transaction.type.toLowerCase()}">
        ${transaction.type === "Withdrawal" ? "-" : "+"}₹${transaction.amount.toFixed(2)}
      </div>
    `

    transactionList.appendChild(transactionItem)
  })

  // Update summary cards
  updateSummaryCards(transactionsToShow)
}

// Function to update summary cards
function updateSummaryCards(transactions) {
  let totalDeposits = 0
  let totalWithdrawals = 0
  const transactionCount = transactions.length

  transactions.forEach((transaction) => {
    if (transaction.type === "Deposit") {
      totalDeposits += transaction.amount
    } else if (transaction.type === "Withdrawal") {
      totalWithdrawals += transaction.amount
    }
  })

  document.getElementById("total-deposits").textContent = `₹${totalDeposits.toFixed(2)}`
  document.getElementById("total-withdrawals").textContent = `₹${totalWithdrawals.toFixed(2)}`
  document.getElementById("transaction-count").textContent = transactionCount
}

// Function to Load Transactions from localStorage
function loadTransactions() {
  const transactionHistory = JSON.parse(localStorage.getItem("transactions")) || []
  displayTransactions(transactionHistory)
}

// Function to filter transactions
function filterTransactions() {
  const transactionType = document.getElementById("transaction-type").value
  const dateFilter = document.getElementById("date-filter").value
  const allTransactions = JSON.parse(localStorage.getItem("transactions")) || []

  let filteredTransactions = allTransactions

  // Filter by transaction type
  if (transactionType !== "all") {
    filteredTransactions = filteredTransactions.filter(
      (transaction) => transaction.type.toLowerCase() === transactionType,
    )
  }

  // Filter by date
  if (dateFilter !== "all") {
    const now = new Date()
    filteredTransactions = filteredTransactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date)
      switch (dateFilter) {
        case "today":
          return transactionDate.toDateString() === now.toDateString()
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          return transactionDate >= weekAgo
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          return transactionDate >= monthAgo
        default:
          return true
      }
    })
  }

  displayTransactions(filteredTransactions)
}

// Function to sort transactions
function sortTransactions(order) {
  const allTransactions = JSON.parse(localStorage.getItem("transactions")) || []

  const sortedTransactions = allTransactions.sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return order === "newest" ? dateB - dateA : dateA - dateB
  })

  displayTransactions(sortedTransactions)

  // Update active sort button
  document.querySelectorAll(".sort-btn").forEach((btn) => btn.classList.remove("active"))
  document.querySelector(`[onclick="sortTransactions('${order}')"]`).classList.add("active")
}

// Watch for updates in localStorage and refresh the transaction list
window.addEventListener("storage", (event) => {
  if (event.key === "transactions") {
    loadTransactions() // Update the transaction list if 'transactions' data changes
  }
})

// Initial Load of All Transactions
loadTransactions()
