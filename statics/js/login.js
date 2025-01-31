const users = {
    "1234567890": { pin: "Ani@1801", balance: 50000 },
    "67890": { pin: "1234", balance: 10000 }
};

function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const pin = document.getElementById("pin").value.trim();

    if (users[username] && users[username].pin === pin) {
        localStorage.setItem("accountNumber", username);
        localStorage.setItem("balance", users[username].balance); // Store balance to use in dashboard
        // Redirect to the dashboard page inside the Dashboard folder
        window.location.href = "/templates/dashboard.html";
    } else {
        alert("Invalid Account Number or PIN.");
    }
}
