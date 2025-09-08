const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    console.log('Deleted existing campgrounds');
    
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const randomImageId1 = Math.floor(Math.random() * 1000);
        const randomImageId2 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 100);
        
        // ✅ 添加这一行 - 获取城市数据
        const cityData = cities[random1000];
        
        const camp = new Campground({
            author : "68b49bc08a8192b5d0cc3151",
            geometry: {
                type: "Point",
                coordinates: [
                    cityData.longitude,  // 现在 cityData 已定义
                    cityData.latitude    
                ]
            },
            location: `${cityData.city}, ${cityData.state}`, // 也可以使用 cityData
            title: `${sample(descriptors)} ${sample(places)}`,
            image: [
                {
                    url: `https://picsum.photos/id/${randomImageId1}/400/300`,
                    filename: `YelpCamp/seed_${randomImageId1}`
                },
                {
                    url: `https://picsum.photos/id/${randomImageId2}/400/300`,
                    filename: `YelpCamp/seed_${randomImageId2}`
                }
            ],
            description : "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sequi iure pariatur, corrupti excepturi iste ad consectetur praesentium nostrum dolorem ipsa nesciunt eveniet assumenda animi in porro voluptas asperiores non voluptatum.",
            price
        })
        await camp.save();
        console.log(`Created campground ${i + 1}: ${camp.title} at ${camp.location}`);
    }
    console.log('Seeding complete!');
}

seedDB().then(() => {
    mongoose.connection.close();
})