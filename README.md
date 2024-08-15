# Real-Time Chat Application

This is a real-time chat application built using modern web technologies. The application allows users to communicate instantly in different chat rooms, supporting both text messaging and other real-time interactions.

## Features

- **Real-Time Messaging:** Instant communication between users in different chat rooms.
- **User Authentication:** Secure login and registration using JWT (JSON Web Tokens).
- **Multiple Chat Rooms:** Users can join different rooms to chat with different groups.
- **Typing Indicators:** Shows when a user is typing.
- **Message Read Receipts:** Visual indicators when a message is read.
- **Responsive Design:** Optimized for both desktop and mobile devices.

## Technologies Used

- **Backend:**
  - **Node.js:** JavaScript runtime environment.
  - **Express.js:** Web framework for Node.js.
  - **Socket.io:** Enables real-time, bidirectional communication between web clients and servers.
  - **MongoDB:** NoSQL database for storing user data and messages.
  - **JWT:** JSON Web Tokens for secure authentication.

- **Frontend:**
  - **React:** JavaScript library for building user interfaces.
  - **zustand:** State management library for React applications.
  - **Socket.io-client:** Client-side library for connecting to the Socket.io server.
  - **tailwind-css:** utility-first CSS framework that allows developers to build custom designs quickly using pre-defined classes.
  - **shadcn:** modern design system and component library for React that provides a set of customizable UI components with a focus on accessibility and performance.

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/samdem-ai/real-time-chat.git
   cd real-time-chat
   ```

2. **Backend Setup:**
   - Navigate to the backend directory:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Set up environment variables:
     - Create a `.env` file in the backend directory and configure the following:
       ```env
       PORT=5000
       MONGO_URI=your_mongodb_connection_string
       JWT_SECRET=your_jwt_secret
       ```
   - Start the backend server:
     ```bash
     npm run dev
     ```

3. **Frontend Setup:**
   - Navigate to the frontend directory:
     ```bash
     cd ../frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the frontend development server:
     ```bash
     npm start
     ```

4. **Access the Application:**
   - Open your browser and navigate to `http://localhost:5173` to use the chat application.

## Usage

- **User Registration:** Users can sign up with their email and password.
- **Login:** Registered users can log in using their credentials.
- **Join Chat Rooms:** After logging in, users can join any available chat rooms.
- **Send Messages:** Users can send messages in real-time to all members of the chat room.
- **File Exchange:** Users can share securely between them all kinds of files.
- **Message Read Receipts (to be implemented):** Check when messages have been read by other users.



## Future Plans

- **Audio Messaging:** Users can send messages using their voice.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## Contact

For any questions or feedback, feel free to reach out:

- **GitHub:** [samdem-ai](https://github.com/samdem-ai)
- **Email:** m_debaili@estin.dz

---
