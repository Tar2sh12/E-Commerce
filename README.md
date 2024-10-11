# E-Commerce Project

## Overview

This is an e-commerce application built with Express.js as the back-end framework. The application allows users to browse products, manage their carts, and make secure transactions. It includes features such as real-time updates and input validation for a smooth user experience.

## Features

- **User Management**: User registration, login, and profile management.
- **Product Management**: Categories, brands, and products with detailed descriptions.
- **Cart & Wishlist**: Users can add products to their carts and wishlists.
- **Coupons**: Support for discount codes and promotions.
- **Orders**: Users can view and manage their orders.
- **Reviews**: Users can leave reviews for products.
- **Payment Integration**: Secure payment processing using Stripe.
- **Real-Time Updates**: Product updates in real time using Socket.io.

## Technologies Used

- **Node.js**: JavaScript runtime for building the server.
- **Express.js**: Web framework for building APIs.
- **MongoDB**: NoSQL database for data storage.
- **Stripe**: Payment processing platform for handling transactions.
- **Socket.io**: Library for real-time web applications.
- **Joi**: Input validation for user inputs.
- **JWT**: JSON Web Tokens for secure user authentication.

## Schema Design

The application includes the following schemas:

- **User**: Information about users, including authentication details.
- **Categories**: Different product categories for easy browsing.
- **Brands**: Information about product brands.
- **Products**: Detailed information about products.
- **Coupons**: Discount codes applicable on purchases.
- **Wishlists**: Products that users wish to purchase later.
- **Carts**: Current items users intend to buy.
- **Orders**: Records of completed purchases.
- **Reviews**: Feedback provided by users on products.

## Getting Started

### Prerequisites

- Node.js
- MongoDB
- Stripe account (for payment processing)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/e-commerce-project.git
   cd e-commerce-project
2. Install dependencies:
   ```bash
   npm install
3. Set up your MongoDB database and update the connection string in the **.env** file.
4. Set up your Stripe account and include your API keys in the **.env** file.
5. Start the server:
   ```bash
   npm run start:dev
## Environment Variables

To run this project, you will need to set up a `.env` file in the root directory of your project with the following variables:

```plaintext
PORT=               # The port on which the server will run
MONGO_URI=         # MongoDB connection string
LOGIN_SECRET=      # Secret for JWT authentication
CONFIRM_TOKEN=     # Token used for email confirmation
SALT_ROUNDS=       # Number of rounds for password hashing
PREFIX_SECRET=     # Secret prefix for tokens
CLOUD_NAME=        # Cloud name for your cloud storage (e.g., Cloudinary)
API_KEY=           # API key for cloud storage
API_SECRET=        # API secret for cloud storage
UPLOADS_FOLDER=    # Directory for storing uploads
CITY_API_KEY=      # API key for city/location services
STRIPE_SECRET_KEY= # Stripe secret key for payment processing
SUCCESS_URL=       # URL to redirect to after successful payment
CANCEL_URL=        # URL to redirect to after canceled payment



***Usage***
- Use an API client (like Postman) to interact with the endpoints.
- Explore the available routes for user registration, product management, cart operations, and payment processing.
  
***License***
- This project is licensed under the MIT License.

## Acknowledgments
- Express.js
- MongoDB
- Stripe
- Socket.io
- Joi
 
