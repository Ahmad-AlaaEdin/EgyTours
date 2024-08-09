

<h1>Description</h1>
<p>The Natours API is a RESTful service designed for managing tour bookings, built with Node.js, Express, and MongoDB. It includes comprehensive authentication and authorization using JWT, ensuring secure access to user accounts, tour management, and review features. The API supports various user roles, allowing for detailed control over who can create, update, or delete tours and reviews.</p>

<h1>Technologies</h1>
<ul>
<li>Node.js</li>
<li>Express</li>
<li>MongoDB</li>
<li>Mongoose</li>
<li>Nodemailer</li>
</ul>



<h1>Installiation</h1>

<h4>1- Clone the Repository and Install Dependencies</h4>

```
git clone 
cd Natours
npm i
```
<h4>2- Set Up Environment Variables:</h4>
Create a config.env file in the root directory and add the following environment variables:

```
NODE_ENV = developpment
PORT=3000
DATABASE=<your_mongodb_connection_string>
DATABASE_PASSWORD = 
JWT_SECRET=<your_jwt_secret>
JWT_EXPIRES_IN=30d
JWT_COOKIE_EXPIRES_IN=30
EMAIL_HOST=<your_email_host>
EMAIL_PORT=587   
EMAIL_USERNAME=
EMAIL_PASSWORD=
```
<h4>3- Start the Development Server:</h4>

```
npm start
```
