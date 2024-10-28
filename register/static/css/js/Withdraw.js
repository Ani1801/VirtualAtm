let withdrawalAmount = 0;

// Fetch and display the current balance when the page loads
document.addEventListener("DOMContentLoaded", () => {
    updateDisplayedBalance(); // Fetch and display the balance on load
});

// Function to handle predefined amount selection
function selectAmount(amount) {
    withdrawalAmount = amount;
    let balance = getBalance();
    if (balance >= withdrawalAmount) {
        showPinInput();
    } else {
        showMessage("Insufficient funds!");
    }
}

// Function to show the custom amount input
function showCustomInput() {
    const customInput = document.getElementById("custom-amount");
    customInput.style.display = "block";
    document.getElementById("custom-amount-input").focus();
}

// Append numbers to custom input
function appendNumber(num) {
    const input = document.getElementById("custom-amount-input");
    input.value += num;
    showCustomInput();
}

// Clear custom amount input
function clearInput() {
    document.getElementById("custom-amount-input").value = '';
}

// Show PIN input
function showPinInput() {
    const pinSection = document.getElementById("pin-section");
    pinSection.style.display = "block";
}

// Verify the PIN
function verifyPin() {
    const correctPin = "1234";
    const enteredPin = document.getElementById("pin-input").value;

    if (enteredPin === correctPin) {
        processWithdrawal(withdrawalAmount);
    } else {
        showMessage("Incorrect PIN. Please try again.");
        clearPinInput();
    }
}

// Clear PIN input
function clearPinInput() {
    document.getElementById("pin-input").value = '';
}

// Process withdrawal
function processWithdrawal(amount) {
    let balance = getBalance();
    if (balance >= amount) {
        balance -= amount;
        updateBalance(balance);
        document.getElementById("balance").textContent = `₹${balance.toFixed(2)}`;
        showMessage(`Successfully withdrew ₹${amount.toFixed(2)}`);

        const newTransaction = {
            date: new Date().toLocaleString(),
            type: 'Withdrawal',
            amount: amount,
            balance: balance
        };

        const transactionHistory = JSON.parse(localStorage.getItem('transactions')) || [];
        transactionHistory.push(newTransaction);
        localStorage.setItem('transactions', JSON.stringify(transactionHistory));

        setTimeout(() => {
            clearInput();
            hideAllInputs();
        }, 3000);
    } else {
        showMessage("Insufficient funds!");
    }
}

// Confirm custom withdrawal amount
function confirmWithdrawal() {
    const customAmount = parseFloat(document.getElementById("custom-amount-input").value) || 0;

    if (customAmount <= 0) {
        showMessage("Please enter a valid amount!");
        return;
    }

    let balance = getBalance();
    if (balance >= customAmount) {
        withdrawalAmount = customAmount;
        showPinInput();
    } else {
        showMessage("Insufficient funds!");
    }
}

// Display a message
function showMessage(message, type) {
    const messageElement = document.getElementById("message");
    messageElement.textContent = message;
    messageElement.style.color = type === "success" ? "#00ff99" : "#ff4c4c"; // Green for success, red for error

    // Display message for 3 seconds before hiding it
    messageElement.classList.add("show");
    setTimeout(() => {
        messageElement.classList.remove("show");
        messageElement.textContent = ""; // Clear the message after the timeout
    }, 3000);
}

// Example usage:
// showMessage("Withdrawal successful", "success");
// showMessage("Withdrawal failed", "error");


// Hide all inputs
function hideAllInputs() {
    document.getElementById("custom-amount").style.display = "none";
    document.getElementById("pin-section").style.display = "none";
}

// Get balance from local storage
function getBalance() {
    return parseFloat(localStorage.getItem("balance") || "50000.00"); // Default balance
}

// Update balance in local storage
function updateBalance(newBalance) {
    localStorage.setItem("balance", newBalance.toFixed(2));
}

// Update the displayed balance
function updateDisplayedBalance() {
    const balance = getBalance();
    document.getElementById("balance").textContent = `₹${balance.toFixed(2)}`; // Update balance display
}
