document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");

    if (!loginForm) {
        console.error("Login form not found!");
        return;
    }

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        console.log("Attempting login with:", { email, password });

        if (!email || !password) {
            alert("Please enter both email and password!");
            return;
        }

        fetch("http://localhost:8081/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.user) {
                localStorage.setItem("userId", data.user.id);
                localStorage.setItem("userEmail", data.user.email);
                localStorage.setItem("userRole", data.user.role);
        
                alert(data.message);
        
                // Redirect based on role
                if (data.user.role === "admin") {
                    window.location.href = "admin.html";
                } else {
                    window.location.href = "mainpage.html";
                }
            } else {
                alert("Login failed: " + data.message);
            }
        })
        .catch(error => {
            console.error("Login error:", error);
        });
        
    });
});

