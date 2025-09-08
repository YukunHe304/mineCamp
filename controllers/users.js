const User = require('../models/user');

module.exports.renderRegisterForm = (req, res) => {
    res.render("users/register");
}

module.exports.registerUser = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash("success", "Successfully registered user");
            res.redirect("/campgrounds");
        });
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/register");
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login");
}

module.exports.loginUser = (req, res) => {
    req.flash("success", "Welcome Back");
    const redirectUrl = res.locals.returnTo || "/campgrounds";
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}