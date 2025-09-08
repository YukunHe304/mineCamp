const Campground = require('./models/campground');
const Review = require('./models/review.js');
const { campgroundSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError.js');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You have to login")
        return res.redirect("/login")
    }
    next()
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
};

module.exports.isAuther = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if (!campground.author.equals(req.user.id)) {
        req.flash('error', 'You donot have permission');
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports.isReviewAuther = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId); // 修改这里：使用 reviewId 而不是 id
    if (!review) {
        req.flash('error', 'Review not found');
        return res.redirect(`/campgrounds/${id}`)
    }
    if (!review.author.equals(req.user.id)) {
        req.flash('error', 'You donot have permission');
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}