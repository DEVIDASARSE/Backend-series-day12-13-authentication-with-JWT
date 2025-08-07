const express = require('express');
const UserModel = require('../models/user.model');

// auth.routes.js
const router = express.Router();


// Register route: isme ham user ko register karte hain
// isme ham username aur password ko body se lete hain
// agar username aur password nahi hai to error return karte hain
// agar username aur password hai to user ko create karte hain
// user ko create karne ke baad success message return karte hain
// isme hamko username aur password ko hash nahi karna hai isliye ye sirf demo ke liye hai
router.post('/register', async (req, res) => {
    const { username, password } = req.body;


    const user = await UserModel.create({
         username, password 
        
        });// username and password are required and new user model are created

        res.status(201).json({
            message: 'User registered successfully',
            user

        });
});

// Login route: isme ham sabse pahele username check karte hain agar user exist karta hai ya nahi than uska password check karte hain
// agar user exist nahi karta hai to invalid credentials ka message return karte hain
// agar user exist karta hai to password check karte hain agar password match nahi karta hai to invalid credentials ka message return karte hain
// agar password match karta hai to login successful ka message return karte hain
//ham isme password ko hash nahi kar rahe hain isliye ye sirf demo ke liye hai
// production me password ko hash karna chahiye
// isme ham bcrypt ka use karte hain password ko hash karne ke liye
// bcrypt ka use karne ke liye hamko bcrypt ko install karna padega
// npm install bcrypt
// iske baad ham bcrypt ka use kar sakte hain password ko hash karne ke liye
// bcrypt ka use karne ke liye hamko user model me password ko hash karna padega
// iske liye hamko user model me pre save hook ka use karna padega
// pre save hook me ham password ko hash karte hain aur uske baad user model ko save karte hain




router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const user = await UserModel.findOne({
         username: username
        // findOne is used to find a user by username  data se data lata hai
        // username is a unique field in the user model
        });

    if (!user) {
        return res.status(401).json({ 
            message: 'Invalid credentials [invalid username]' 
        });
    }

const isPasswordValid = password == user.password;

if (!isPasswordValid) {
    return res.status(401).json({
        message: 'Invalid credentials [invalid password]'
    });

}

res.status(200).json({
    message: 'Login successful',
    
});

});

module.exports = router;