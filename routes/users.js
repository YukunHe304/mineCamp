const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync.js');
const User = require('../models/user');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');

//controllers
const users = require('../controllers/users');

router.route('/register')
    .get(users.renderRegisterForm)
    .post(catchAsync(users.registerUser));

router.route('/login')
    .get(users.renderLoginForm)
    .post(storeReturnTo, passport.authenticate("local", {
        failureFlash: true, 
        failureRedirect: "/login"
    }), users.loginUser);

router.route('/logout')
    .get(users.logoutUser);

module.exports = router;