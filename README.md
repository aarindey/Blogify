# Blogify - Secure User-Authenticated Blog Application

Blogify is a robust blog application featuring secure user authentication, user and tag following functionalities, and integration with AWS S3 for image posting, retrieval, and deletion. It is deployed on Cloudflare Workers with a PostgreSQL database utilizing connection pooling.

## Features:

1. **User Authentication:**
   - Secure authentication system for users to sign up, log in, and log out.
   - Passwords are securely hashed and stored.

2. **User-Authenticated Blogging:**
   - Authenticated users can create, edit, and delete their blog posts.
   - Users have their own personalized dashboard for managing their posts.

3. **User and Tag Following:**
   - Users can follow other users to receive updates on their posts.
   - Users can also follow specific tags to see posts related to those tags in their feed.

4. **AWS S3 Integration:**
   - Integration with AWS S3 enables users to upload images for their blog posts.
   - Images are securely stored and can be retrieved and deleted as needed.

5. **Cloudflare Workers Deployment:**
   - Deployed on Cloudflare Workers for scalability, reliability, and global distribution.
   - Utilizes Cloudflare's edge network for fast response times.

6. **PostgreSQL Database with Connection Pooling:**
   - Utilizes PostgreSQL database for data storage.
   - Connection pooling optimizes database connections for improved performance.

## Folder Structure:

1. **Frontend:**
   - Contains the frontend codebase built with modern JavaScript frameworks like React.js or Vue.js.
   - Responsible for the user interface and interaction with the backend.

2. **Cloudflare Backend:**
   - Houses the backend logic implemented using Cloudflare Workers.
   - Handles user authentication, blog post management, user interactions, and integration with AWS S3.

3. **Common:**
   - Contains shared code and types used across both frontend and backend.
   - Includes Zod validation schemas for ensuring data integrity and consistency.

4. **Image Upload Service:**
   - Manages the image upload functionality, integrating with AWS S3 for storing and retrieving images.
   - Ensures secure handling of image files and provides endpoints for frontend integration.

## Setup Instructions:

1. Clone the repository.
2. Set up AWS S3 bucket for image storage and obtain necessary credentials.
3. Configure Cloudflare Workers with your account and obtain API tokens.
4. Set up a PostgreSQL database and configure connection pooling settings.
5. Install dependencies for frontend and backend.
6. Configure environment variables for AWS S3, Cloudflare Workers, and PostgreSQL database.
7. Run the frontend and backend servers.
8. Access the application through the provided URL.

## Contributors:
aarindey

![img_integration](https://github.com/aarindey/Blogify/assets/77115128/1afef786-1bf7-44ff-ab4d-3b8a0916cd32)
![feed](https://github.com/aarindey/Blogify/assets/77115128/4bd8c893-e0c2-44f6-9bae-56a161a491b8)
![Blog](https://github.com/aarindey/Storify/assets/77115128/550004fd-fd06-4570-bff1-8dc8f798ba04)
![Author](https://github.com/aarindey/Storify/assets/77115128/78b4d14a-dfb9-463d-b50b-271b018e4cf0)
![Topic](https://github.com/aarindey/Storify/assets/77115128/f78623e8-a5ab-4c5d-980c-e313c93ec685)
![SignIn](https://github.com/aarindey/Storify/assets/77115128/345aa0a5-3c72-4155-9fe4-73641249cefe)
![SignUp](https://github.com/aarindey/Storify/assets/77115128/4aefa3be-4393-46f2-8836-9d185376eb9e)
![publish](https://github.com/aarindey/Blogify/assets/77115128/e1f4a919-10f4-4c40-a8fc-18bc98286898)





