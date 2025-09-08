# MineCamp

A full-stack web application for discovering and reviewing campgrounds, built with Node.js, Express, MongoDB, and Mapbox.

## Features

- User authentication and authorization
- CRUD operations for campgrounds and reviews
- Interactive maps with Mapbox integration
- Image upload and management with Cloudinary
- Responsive design with Bootstrap
- Star rating system for reviews

## Technologies Used

- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Frontend:** React, HTML5, CSS3, JavaScript, Bootstrap, EJS
- **Authentication:** Passport.js
- **Maps:** Mapbox API
- **Image Storage:** Cloudinary
- **Deployment:** Heroku (if deployed)

## Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/yelpcamp.git
cd yelpcamp
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables
   Create a .env file in the root directory:

DATABASE_URL=your_mongodb_connection_string
MAPBOX_TOKEN=your_mapbox_token
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret
SECRET=your_session_secret

4. Start the application

```bash
npm start
```
