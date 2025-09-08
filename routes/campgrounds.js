const express = require('express');
const router = express.Router();
const mongoose = require("mongoose")
const multer = require('multer');

const {storage} = require('../cloudinary');
const upload = multer({storage})

const catchAsync = require('../utils/catchAsync.js');
const { campgroundSchema } = require('../schemas.js');
const ExpressError = require('../utils/ExpressError.js');
const Campground = require('../models/campground.js');
const {isLoggedIn, isAuther, validateCampground} = require('../middleware.js');


//controllers
const campgrounds = require('../controllers/campgrounds.js');

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array("image"), validateCampground, catchAsync(campgrounds.createCampground));




router.route('/new')
    .get(isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuther, upload.array("image"), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuther, catchAsync(campgrounds.deleteCampground));

router.route('/:id/edit')
    .get(isLoggedIn, isAuther, catchAsync(campgrounds.renderEditForm));

module.exports = router;