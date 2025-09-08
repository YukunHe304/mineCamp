const express = require("express");
const catchAsync = require("../utils/catchAsync")
const router = express.Router({mergeParams : true})
const ExpressError = require("../utils/ExpressError")
const Campground = require("../models/campground")
const Review = require("../models/review")
const {campgroundSchema, reviewSchema} = require("../schemas")
const {validateReview, isLoggedIn, isReviewAuther} = require('../middleware');

//controllers
const reviews = require('../controllers/reviews');

// Reviews route

// create a new review
router.route("/")
    .post(isLoggedIn, validateReview, catchAsync(reviews.createReview));

// delete a review
router.route("/:reviewId")
    .delete(isLoggedIn, isReviewAuther, catchAsync(reviews.deleteReview));

module.exports = router;