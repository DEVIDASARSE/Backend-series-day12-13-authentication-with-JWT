const express = require('express');
const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
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

    const token = jwt.sign({
        // object ke ander user ka unique data dena hota hai jo ki user ko identify kare
        id: user._id,
        // username: user.username

    }, process.env.JWT_SECRET)


     res.cookie("token", token)
    res.status(201).json({
        message: 'User registered successfully',
        user,
       // token // token is returned to the user

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


router.get("/user", async (req, res) => {
    // const { token } = req.body;// ab body me nhi cookies me data jayenga
    const { token } = req.cookies;// cookies se token lete hain kyuki hamne cookie me token store kiya tha

    if (!token) {
        return res.status(401).json({
            message: 'Unauthorized access'
        });
    }

// jwt.verify me verify karne ke baad decoded object milta hai jo token ko use karte time use ker rahe the data user ki id use ker rahe the aur ham is id ki help se user findd karenge hamare model me uske baad jo bhi data hame milenga ham usko response me bhej denge

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET)//verify method bas check karti hai sahi hai nhi
       // res.send(decoded);// decoded object me user ka unique data hota hai jo ki user ko identify karta hai

       const user = await UserModel.findOne({
        _id: decoded.id// decoded.id is the user id from the token
       }).select("-password").lean()
       //select method me jo bhi likhenge usme vo nhi aayenge
       res.status(200).json({
           message: 'User data retrieved successfully',
           user 
        })

    } catch (err) {
        return res.status(401).json({
            message: "Unauthorized - Invalid token"
        })
    }
});


module.exports = router;