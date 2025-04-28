const express = require("express");
const db = require("./db");
const router = express.Router();

router.post("/signup", async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password || !role) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
        return res.status(400).json({ message: "Invalid email format!" });
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{7,}/.test(password)) {
        return res.status(400).json({ 
            message: "Password must be at least 7 characters long, include an uppercase letter, a lowercase letter, and a special character!" 
        });
    }

    let checkEmailSql, insertUserSql;

    if (role === "user") {
        checkEmailSql = "SELECT * FROM Users WHERE email = ?";
        insertUserSql = "INSERT INTO Users (username, email, password) VALUES (?, ?, ?)";
    } else if (role === "admin") {
        checkEmailSql = "SELECT * FROM Admins WHERE email = ?";
        insertUserSql = "INSERT INTO Admins (username, email, password) VALUES (?, ?, ?)";
    } else {
        return res.status(400).json({ message: "Invalid role!" });
    }

    try {
        // Check if email already exists in the database
        const [existingUser] = await db.execute(checkEmailSql, [email]);
        
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "Email is already registered!" });
        }

        // Insert the new user into the respective table
        await db.execute(insertUserSql, [username, email, password]);

        if (role === "user") {
            res.json({ message: "User registered successfully!" });
        } else {
            res.json({ message: "Admin registered successfully!" });
        }

    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error" });
    }
});

module.exports = router;
