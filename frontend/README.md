# Women Safety Web Application

A comprehensive web application dedicated to women's safety, empowerment, and awareness of their rights. Features user profiles, live location mapping, admin dashboard, and extensive safety resources.

## Features

- **Home Page**: Welcome screen with mission statement and quick access to key features
- **About Page**: Information about the organization, mission, vision, and values
- **Know Your Rights**: Comprehensive guide to constitutional, workplace, personal safety, health, and education rights
- **Login Form**: User authentication with email and password
- **Registration Form**: Complete user registration with email verification
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Built with React and styled with CSS for a professional look

## Tech Stack

- **Frontend Framework**: React 18.2.0
- **Routing**: React Router DOM 6.20.0
- **HTTP Client**: Axios
- **Styling**: CSS3 with responsive design
- **Build Tool**: React Scripts 5.0.1

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.js
│   │   └── Footer.js
│   ├── pages/
│   │   ├── Home.js
│   │   ├── About.js
│   │   ├── KnowYourRights.js
│   │   ├── Login.js
│   │   ├── Register.js
│   │   └── Pages.css
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── .gitignore
```

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Steps

1. **Navigate to the frontend directory**:
   ```bash
   cd "Women Safety\frontend"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

## Available Scripts

In the project directory, you can run:

### `npm start`
- Runs the app in development mode
- Open [http://localhost:3000](http://localhost:3000) to view it in the browser
- The page will reload when you make changes

### `npm build`
- Builds the app for production to the `build` folder
- Correctly bundles React in production mode and optimizes the build

### `npm test`
- Launches the test runner in interactive watch mode

## Pages Overview

### Home Page (`/`)
- Welcome message and mission statement
- Quick links to key features
- Call-to-action buttons for registration and login

### About Page (`/about`)
- Organization mission and vision
- Core values
- Services offered
- Contact information

### Know Your Rights (`/know-your-rights`)
- Constitutional rights
- Workplace rights
- Personal safety rights
- Health rights
- Education rights
- Emergency resources and hotline numbers
- Legal options and support services

### Login Page (`/login`)
- Email and password authentication
- Remember me option
- Forgot password link
- Link to registration page

### Register Page (`/register`)
- Comprehensive registration form with:
  - Full name
  - Email address
  - Phone number
  - Date of birth
  - City
  - Password creation
  - Terms and conditions agreement
- Form validation
- Link to login page for existing users

## Features Highlights

### 1. User Authentication
- Secure login and registration forms
- Form validation for all fields
- Password confirmation matching
- Terms and conditions acceptance

### 2. Responsive Design
- Mobile-first approach
- Adapts to all screen sizes (320px to 4K)
- Touch-friendly interface

### 3. Navigation
- Sticky navigation bar with logo
- Easy access to all pages
- Clean and intuitive layout

### 4. Educational Content
- Comprehensive information about women's rights
- Emergency hotline numbers
- Support resources

### 5. Modern UI/UX
- Purple gradient theme (professional and empowering)
- Smooth animations and transitions
- Accessible color schemes
- Clear typography

## API Integration

The forms are currently set up to connect to backend APIs:

- **Login API**: `POST /api/auth/login`
  - Expected request body: `{ email, password }`
  - Expected response: `{ token }`

- **Register API**: `POST /api/auth/register`
  - Expected request body: `{ fullName, email, phone, password, dateOfBirth, city }`
  - Expected response: `{ token }`

To integrate with your backend:

1. Replace the API endpoints in `Login.js` and `Register.js`
2. Update the fetch requests with your actual backend URL
3. Handle tokens and user data as per your backend requirements

## Customization

### Colors
The primary color is purple (#9c27b0). To change it:
- Update `--primary-color` variable in CSS files
- Search for `#9c27b0` and replace with your desired color

### Content
- Edit component text directly in the respective `.js` files
- Update links and routing as needed
- Modify hotline numbers and contact information

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- Backend API integration
- User profiles and dashboard
- Community forum
- Resource library
- Mobile app version
- Multi-language support
- Video tutorials
- Counseling appointment booking
- Emergency alert system

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For questions or support, please contact:
- Email: info@womensafety.com
- Hotline: 1-800-SAFETY (24/7)

---

**Last Updated**: January 2026

Made with ❤️ for women's safety and empowerment
