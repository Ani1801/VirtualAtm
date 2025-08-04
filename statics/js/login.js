const users = {
  1234567890: { pin: "Ani@1801", transaction_pin: "1234", balance: 50000 },
  67890: { pin: "1234", transaction_pin: "5678", balance: 10000 },
}

// Get registered users from localStorage and merge with default users
function getUsers() {
  const defaultUsers = {
    1234567890: { pin: "Ani@1801", transaction_pin: "1234", balance: 50000 },
    67890: { pin: "1234", transaction_pin: "5678", balance: 10000 },
  }

  const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || {}

  return { ...defaultUsers, ...registeredUsers }
}

function handleLogin(event) {
  event.preventDefault()

  const username = document.getElementById("username").value.trim()
  const pin = document.getElementById("pin").value.trim()
  const messageElement = document.getElementById("message")

  // Clear previous messages
  messageElement.className = "message"
  messageElement.textContent = ""

  // Validate inputs
  if (!username || !pin) {
    showMessage("Please fill in all fields", "error")
    return
  }

  if (pin.length !== 4) {
    showMessage("PIN must be 4 digits", "error")
    return
  }

  // Get all users (default + registered)
  const users = getUsers()

  // Check credentials
  if (users[username] && users[username].pin === pin) {
    showMessage("Login successful! Redirecting...", "success")

    // Store user data
    localStorage.setItem("accountNumber", username)
    localStorage.setItem("balance", users[username].balance)
    localStorage.setItem("transactionPin", users[username].transaction_pin)

    // Redirect after a short delay
    setTimeout(() => {
      window.location.href = "/pages/dashboard.html"
    }, 1500)
  } else {
    showMessage("Invalid Account Number or PIN. Please try again.", "error")

    // Clear the form after error
    setTimeout(() => {
      document.getElementById("pin").value = ""
    }, 2000)
  }
}

function showMessage(text, type) {
  const messageElement = document.getElementById("message")
  messageElement.textContent = text
  messageElement.className = `message show ${type}`

  // Hide message after 4 seconds
  setTimeout(() => {
    messageElement.className = "message"
  }, 4000)
}

// Add input validation and formatting
document.getElementById("pin").addEventListener("input", function (e) {
  // Only allow numbers
  this.value = this.value.replace(/[^0-9]/g, "")

  // Limit to 4 digits
  if (this.value.length > 4) {
    this.value = this.value.slice(0, 4)
  }
})

document.getElementById("username").addEventListener("input", function (e) {
  // Only allow numbers for account number
  this.value = this.value.replace(/[^0-9]/g, "")
})

// Add Enter key support
document.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    document.getElementById("login-form").dispatchEvent(new Event("submit"))
  }
})
