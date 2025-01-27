# Programming Courses Website with BMI Calculator

This project is a web application for programming courses and a BMI (Body Mass Index) calculator. It is structured into different routes and views for seamless navigation and user interaction.

## Features
- Home page showcasing the website.
- Programming courses overview page.
- A BMI calculator tool.
- API

## Prerequisites
- **Node.js** (version 16 or higher recommended)
- **npm** (comes with Node.js)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd <project-directory>
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

## Running the Application

1. Start the server:
   ```bash
   npm start
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

   The server will run on **port 3000** by default.

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
This project is licensed under the MIT License.
