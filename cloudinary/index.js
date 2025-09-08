const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary'); // 修正：CloudinaryStorage

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({ // 修正：CloudinaryStorage
    cloudinary,
    params: { // 修正：需要 params 包装
        folder: "YelpCamp",
        allowedFormats: ['jpeg', 'png', 'jpg'] // 修正：allowedFormats
    }
});

module.exports = {
    cloudinary,
    storage
}