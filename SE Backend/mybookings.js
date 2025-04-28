const express = require("express");
const router = express.Router();
const db = require("./db");

router.get("/bookings", async (req, res) => {
    const email = req.query.email;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    const query = `
        SELECT Bookings.id, Slots.slot_time, Bookings.booking_time 
        FROM Bookings
        JOIN Slots ON Bookings.slot_id = Slots.id
        JOIN Users ON Bookings.user_id = Users.id
        WHERE Users.email = ?
    `;

    try {
        const [results] = await db.execute(query, [email]);
        res.json(results);
    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error" });
    }
});

router.delete("/bookings/:id", async (req, res) => {
    const bookingId = req.params.id;

    try {
        const [results] = await db.execute("SELECT slot_id FROM Bookings WHERE id = ?", [bookingId]);

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        const slotId = results[0].slot_id;

        // Delete the booking
        await db.execute("DELETE FROM Bookings WHERE id = ?", [bookingId]);

        // Update the slot status
        await db.execute("UPDATE Slots SET status = 'available' WHERE id = ?", [slotId]);

        res.json({ success: true, message: "Booking canceled and slot updated to available" });

    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({ success: false, message: "Database error" });
    }
});

module.exports = router;
