function handleRegistration(event) {
  event.preventDefault()

  const user_id = document.getElementById("user_id").value.trim()
  const password = document.getElementById("password").value.trim()
  const transaction_pin = document.getElementById("transaction_pin").value.trim()
  const balance = Number.parseFloat(document.getElementById("balance").value)
  const messageElement = document.getElementById("message")

  // Clear previous messages
  messageElement.className = "message"
  messageElement.textContent = ""

  // Validate inputs
  if (!user_id || !password || !transaction_pin) {
    showMessage("Please fill in all fields", "error")
    return
  }

  if (password.length !== 4) {
    showMessage("Login PIN must be 4 digits", "error")
    return
  }

  if (!/^\d{4}$/.test(password)) {
    showMessage("Login PIN must contain only numbers", "error")
    return
  }

  if (transaction_pin.length !== 4) {
    showMessage("Transaction PIN must be 4 digits", "error")
    return
  }

  if (!/^\d{4}$/.test(transaction_pin)) {
    showMessage("Transaction PIN must contain only numbers", "error")
    return
  }

  if (password === transaction_pin) {
    showMessage("Login PIN and Transaction PIN must be different", "error")
    return
  }

  if (isNaN(balance) || balance < 0) {
    showMessage("Please enter a valid balance", "error")
    return
  }

  // Check if user already exists
  const existingUsers = JSON.parse(localStorage.getItem("registeredUsers")) || {}
  if (existingUsers[user_id]) {
    showMessage("Account number already exists. Please choose a different one.", "error")
    return
  }

  // Show success message
  showMessage("Registration successful! Redirecting to login...", "success")

  // Store user data in localStorage
  existingUsers[user_id] = {
    pin: password,
    transaction_pin: transaction_pin,
    balance: balance,
  }
  localStorage.setItem("registeredUsers", JSON.stringify(existingUsers))

  // Reset form
  document.getElementById("registerForm").reset()
  document.getElementById("balance").value = "50000" // Reset to default

  // Redirect to login page (index.html) after 2 seconds
  setTimeout(() => {
    window.location.href = "/index.html"
  }, 2000)
}

function showMessage(text, type) {
  const messageElement = document.getElementById("message")
  messageElement.textContent = text
  messageElement.className = `message show ${type}`

  // Hide message after 5 seconds
  setTimeout(() => {
    messageElement.className = "message"
  }, 5000)
}

// Add input validation and formatting
document.getElementById("password").addEventListener("input", function (e) {
  // Only allow numbers
  this.value = this.value.replace(/[^0-9]/g, "")

  // Limit to 4 digits
  if (this.value.length > 4) {
    this.value = this.value.slice(0, 4)
  }
})

document.getElementById("transaction_pin").addEventListener("input", function (e) {
  // Only allow numbers
  this.value = this.value.replace(/[^0-9]/g, "")

  // Limit to 4 digits
  if (this.value.length > 4) {
    this.value = this.value.slice(0, 4)
  }
})

document.getElementById("user_id").addEventListener("input", function (e) {
  // Only allow numbers for account number
  this.value = this.value.replace(/[^0-9]/g, "")
})

// Add Enter key support
document.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    document.getElementById("registerForm").dispatchEvent(new Event("submit"))
  }
})

// Add visual feedback for form validation
document.getElementById("user_id").addEventListener("blur", function () {
  if (this.value.length < 4) {
    this.style.borderColor = "#dc3545"
  } else {
    this.style.borderColor = "#28a745"
  }
})

document.getElementById("password").addEventListener("blur", function () {
  if (this.value.length !== 4) {
    this.style.borderColor = "#dc3545"
  } else {
    this.style.borderColor = "#28a745"
  }
})

document.getElementById("transaction_pin").addEventListener("blur", function () {
  const loginPin = document.getElementById("password").value
  if (this.value.length !== 4) {
    this.style.borderColor = "#dc3545"
  } else if (this.value === loginPin) {
    this.style.borderColor = "#dc3545"
    showMessage("Transaction PIN must be different from Login PIN", "error")
  } else {
    this.style.borderColor = "#28a745"
  }
})
