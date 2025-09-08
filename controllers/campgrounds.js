const mongoose = require("mongoose");
const Campground = require('../models/campground.js');

// cloudinary
const { cloudinary } = require('../cloudinary'); 

// mapbox
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });



module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query : req.body.campground.location, // 要查找的地址
        limit : 1 // 返回多少个结果
    }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.author = req.user.id
    campground.image = req.files.map(f => ({url : f.path, filename: f.filename}))
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.showCampground = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    const campground = await Campground.findById(id).populate({
        path : "reviews",
        populate : {
            path : "author"
        }
    }).populate("author");
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }

    res.render('campgrounds/show', { campground });
}

module.exports.renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    if (!campground) {
        req.flash('error', 'Cannot find and edit campground!');
        return res.redirect('/campgrounds');
    }
    req.flash("success", "Successfully updated campground")
    res.render('campgrounds/edit', { campground });
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    
    // 添加新图片
    if (req.files && req.files.length > 0) {
        const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
        campground.image.push(...imgs);
    }
    
    // 删除选中的图片
    if (req.body.deleteImages) {
        await cloudinary.uploader.destroy(req.body.deleteImages); // 从Cloudinary删除
        await campground.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } }); // 从数据库删除
    }
    
    await campground.save();
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground')
    res.redirect('/campgrounds');
}