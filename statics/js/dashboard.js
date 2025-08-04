// Initialize balance in local storage if it doesn't exist
if (!localStorage.getItem("balance")) {
  localStorage.setItem("balance", "50000") // Setting default balance to 50,000
}

// Load account number from local storage or display "Unknown" if it doesn't exist
document.getElementById("account-number").textContent = localStorage.getItem("accountNumber") || "Unknown"

// Fetch balance from backend when the page loads
fetch("/account_info")
  .then((response) => response.json())
  .then((data) => {
    // Set balance from backend response if available, otherwise use local storage balance
    const balance = data.balance || Number.parseFloat(localStorage.getItem("balance"))
    updateBalance(balance) // Update balance display and local storage
  })
  .catch((error) => {
    console.error("Error fetching balance:", error)
    // If there's an error fetching, fallback to localStorage balance
    const balance = Number.parseFloat(localStorage.getItem("balance"))
    updateBalance(balance) // Update balance display and local storage
  })

// Centralized function to get the current balance
function getBalance() {
  return Number.parseFloat(localStorage.getItem("balance")) || 50000 // Fallback to 50,000 if not found
}

// Centralized function to update the balance and display it
function updateBalance(newBalance) {
  localStorage.setItem("balance", newBalance.toFixed(2))
  document.getElementById("balance").textContent = newBalance.toFixed(2)
}

// Toggle sidebar menu using class-based approach
function toggleMenu() {
  const sidebar = document.getElementById("sidebar")
  const content = document.querySelector(".content")

  // Toggle class to shift content and show/hide sidebar
  sidebar.classList.toggle("sidebar-open")
  content.classList.toggle("sidebar-open")
}

// Logout functionality - redirect to index.html
function logout() {
  localStorage.removeItem("accountNumber")
  localStorage.removeItem("transactionPin")
  localStorage.removeItem("transactions") // Clear transactions on logout
  window.location.href = "/index.html"
}

// Deposit function with balance update and transaction recording
function deposit(amount) {
  let balance = getBalance() // Use centralized function
  balance += amount
  updateBalance(balance) // Update balance display and local storage
  addTransaction("Deposit", amount) // Log the transaction
  displayMessage("Deposit Successful!") // Display success message
}

// Withdraw function with balance check, update, and transaction recording
function withdraw(amount) {
  let balance = getBalance() // Use centralized function
  if (balance >= amount) {
    balance -= amount
    updateBalance(balance) // Update balance display and local storage
    addTransaction("Withdrawal", amount) // Log the transaction
    displayMessage("Withdrawal Successful!") // Display success message
  } else {
    alert("Insufficient funds!")
  }
}

// Add transaction to the list with a fade-in effect
function addTransaction(type, amount) {
  const transactionTime = new Date().toLocaleString() // Get the current time in a readable format

  const newTransaction = {
    date: transactionTime,
    type: type,
    amount: amount,
    balance: getBalance(), // Use centralized function
  }

  // Update transaction history in localStorage
  const existingTransactions = JSON.parse(localStorage.getItem("transactions")) || []
  existingTransactions.push(newTransaction)
  localStorage.setItem("transactions", JSON.stringify(existingTransactions))

  // Load recent transactions to reflect the new transaction
  loadRecentTransactions()
}

// Load recent transactions from local storage on page load
function loadRecentTransactions() {
  const existingTransactions = JSON.parse(localStorage.getItem("transactions")) || []

  // Get the last 4 transactions and reverse the order for recent-first display
  const recentTransactions = existingTransactions.slice(-4).reverse()

  // Clear the current transaction history display
  const transactionHistory = document.getElementById("transaction-history")
  transactionHistory.innerHTML = "" // Clear previous entries

  if (recentTransactions.length === 0) {
    const li = document.createElement("li")
    li.className = "no-transactions"
    li.textContent = "No recent transactions"
    transactionHistory.appendChild(li)
  } else {
    recentTransactions.forEach((transaction) => {
      const li = document.createElement("li")
      li.textContent = `${transaction.type} of ₹${transaction.amount.toFixed(2)} on ${transaction.date}`
      transactionHistory.appendChild(li)
    })
  }
}

// Function to display messages to the user
function displayMessage(message) {
  const messageContainer = document.getElementById("message-container")
  messageContainer.textContent = message
  messageContainer.classList.add("visible")

  // Remove the message after a few seconds
  setTimeout(() => {
    messageContainer.classList.remove("visible")
  }, 3000) // Message displays for 3 seconds
}

// Initial Load of Recent Transactions
loadRecentTransactions()
