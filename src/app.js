const express = require('express');
const authRoutes = require('./routes/auth.routes');

const app = express();
app.use(express.json());

/*

post:/auth/register
post:/auth/login    
get:/auth/user 
get:/auth/logout




*/

app.use('/auth', authRoutes);




module.exports = app;