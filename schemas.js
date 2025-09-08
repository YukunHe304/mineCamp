const Joi = require("joi")

// schemas.js
module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required(),
    deleteImages: Joi.array()  // 添加这行，允许 deleteImages 数组
});

module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        body : Joi.string().required(),
        rating : Joi.number().required()
    }).required()
})