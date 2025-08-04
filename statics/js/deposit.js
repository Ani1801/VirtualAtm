document.addEventListener("DOMContentLoaded", () => {
  updateDisplayedBalance() // Centralized function to fetch and display balance
})

document.getElementById("deposit-button").addEventListener("click", () => {
  const depositAmount = Number.parseFloat(document.getElementById("deposit-amount").value)
  const pinInput = document.getElementById("pin-input")

  // Validate the deposit amount
  if (Number.isNaN(depositAmount) || depositAmount <= 0) {
    showMessage("Please enter a valid deposit amount!", "error")
    return
  }

  // Show PIN input if it's not visible
  if (pinInput.style.display === "none" || pinInput.style.display === "") {
    pinInput.style.display = "block"
    pinInput.focus()
  } else {
    // Validate PIN
    const enteredPin = pinInput.value
    if (!isValidTransactionPIN(enteredPin)) {
      showMessage("Invalid Transaction PIN! Please try again.", "error")
      return
    }

    // Proceed with the deposit if the PIN is valid
    let balance = getBalance() // Fetch current balance
    balance += depositAmount // Calculate new balance
    updateBalance(balance) // Update balance in local storage

    addTransaction("Deposit", depositAmount) // Log the transaction
    showMessage(`Successfully deposited ₹${depositAmount.toFixed(2)}!`, "success")

    // Reset form fields
    document.getElementById("deposit-amount").value = "" // Clear deposit amount input
    pinInput.value = "" // Clear PIN input
    pinInput.style.display = "none" // Hide PIN input after use
  }
})

// Validate Transaction PIN function
function isValidTransactionPIN(pin) {
  const storedTransactionPin = localStorage.getItem("transactionPin")
  return pin === storedTransactionPin
}

// Display messages to the user
function showMessage(message, type) {
  const messageElement = document.getElementById("message")
  messageElement.textContent = message
  messageElement.style.color = type === "success" ? "#00ff99" : "#ff4c4c"

  // Display message for 3 seconds before hiding it
  messageElement.classList.add("show")
  setTimeout(() => {
    messageElement.classList.remove("show")
    messageElement.textContent = ""
  }, 3000)
}

// Fetch and display current balance
function updateDisplayedBalance(balance = getBalance()) {
  document.getElementById("current-balance").textContent = balance.toFixed(2)
}

// Get balance from local storage
function getBalance() {
  return Number.parseFloat(localStorage.getItem("balance")) || 50000
}

// Update balance in local storage
function updateBalance(newBalance) {
  localStorage.setItem("balance", newBalance.toFixed(2))
  updateDisplayedBalance(newBalance) // Update the displayed balance
}

// Add transaction to the list
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
}

// Initial Load of Balance
updateDisplayedBalance()
