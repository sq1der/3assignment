# Programming Courses Platform

## Overview
This platform provides an interactive environment for learning programming. It includes:
- **Online Compiler**: Execute code in various programming languages directly in the browser.
- **Book Search**: Find books related to programming and coding.
- **Admin Panel**: Manage users by adding, deleting, and editing their information.

## Features
- 📚 **Programming Courses** with structured lessons.
- 💻 **Online Compiler** for hands-on coding experience.
- 🔍 **Book Search** integrated with APIs for finding relevant coding books.
- 🔧 **Admin Panel** for user management.

## Setup Instructions

### Prerequisites
- Node.js (>= 16.x)
- MongoDB (cloud instance)
- Git
- NPM

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/sq1der/3assignment.git
   cd 3assignment
   ```
2. Install dependencies:
   ```sh
   npm install 
   ```
3. Start the development server:
   ```sh
   node server.js
   ```
4. Open `http://localhost:3000` in your browser.

## Project Structure

```
project-directory
├── public
│   └── style.css             # Main stylesheet
├── routes
│   ├── bmiRoutes.js          # Handles BMI calculator routes
│   └── courseRoutes.js       # Handles course-related routes
├── views
│   ├── index.ejs             # Homepage template
│   ├── courses.ejs           # Courses page template
│   ├── about.ejs             # About page
│   ├── contact.ejs           # Contact page with API
│   ├── footer.ejs            # Footer for pages
│   ├── weather.ejs           # Weather page with API
│   └── bmi.ejs               # BMI calculator template
└── server.js                 # Main server setup file
```

## Dependencies
The project uses the following npm packages:

- **express**: A web framework for Node.js.
- **ejs**: Template engine for rendering dynamic HTML.
- **body-parser**: Middleware for parsing request bodies.

Install these dependencies automatically during `npm install`.

## License
MIT License © 2025 Programming Courses