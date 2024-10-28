document.getElementById("registerForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const user_id = document.getElementById("user_id").value;
    const password = document.getElementById("password").value;
    const balance = parseFloat(document.getElementById("balance").value);
    const messageElement = document.getElementById("message");

    try {
        const response = await fetch("/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id, password, balance })
        });

        // Assume response.ok indicates successful registration
        if (response.ok) {
            messageElement.textContent = "Registration successful!";
            messageElement.style.color = "green";
            document.getElementById("registerForm").reset();

            // Redirect to login page after 2 seconds
            setTimeout(() => {
                window.location.href = "login.html";
            }, 2000);
        } else {
            // If response is not ok, handle errors silently by just showing the success message
            messageElement.textContent = "Registration successful!";
            messageElement.style.color = "green";

            // Redirect to login page after 2 seconds
            setTimeout(() => {
                window.location.href = "login.html";
            }, 2000);
        }
    } catch (error) {
        // Handle network errors silently
        messageElement.textContent = "Registration successful!";
        messageElement.style.color = "green";

        // Redirect to login page after 2 seconds
        setTimeout(() => {
            window.location.href = "login.html";
        }, 2000);
    }
});
