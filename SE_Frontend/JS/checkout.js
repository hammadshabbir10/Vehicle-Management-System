document.addEventListener("DOMContentLoaded", function() {
    // Back button
    document.getElementById("backButton").addEventListener("click", function() {
        window.location.href = "mainpage.html";
    });

    // Check-out form
    document.getElementById("checkOutForm").addEventListener("submit", async function(event) {
        event.preventDefault();
        
        const vehicleNumber = document.getElementById("checkOutVehicleNumber").value.toUpperCase();
        const userEmail = localStorage.getItem("userEmail") || document.getElementById("userEmail").value;
        const messageEl = document.getElementById("message");

        // Validate vehicle number format
        const vehicleRegex = /^[A-Za-z]{3}-\d{3,4}$/;
        if (!vehicleRegex.test(vehicleNumber)) {
            showMessage("Invalid format. Please use ABC-123 format", false);
            return;
        }

        try {
            const response = await fetch("http://localhost:8081/api/vehicle/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    user_email: userEmail, 
                    vehicle_number: vehicleNumber 
                }),
            });
            
            const data = await response.json();
            
            if (data.success) {
                showMessage(data.message + ` (Fee: Rs. ${data.fee})`, true);
                // Clear form
                document.getElementById("checkOutVehicleNumber").value = "";
            } else {
                showMessage(data.message, false);
            }
        } catch (error) {
            console.error("Error:", error);
            showMessage("Network error. Please try again.", false);
        }
    });

    // Show message with color coding
    function showMessage(text, isSuccess) {
        const messageEl = document.getElementById("message");
        messageEl.textContent = text;
        messageEl.style.color = isSuccess ? "#2ecc71" : "#e74c3c";
        messageEl.style.display = "block";
        
        // Hide after 5 seconds
        setTimeout(() => {
            messageEl.style.display = "none";
        }, 9000);
    }
});
