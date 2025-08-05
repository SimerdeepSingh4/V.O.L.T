# V.O.L.T (Voice-Over Language Translator)

## 🌍 Overview

V.O.L.T is a modern web application that provides real-time translation and transcription services. Built with React for the frontend and Node.js for the backend, it offers a seamless experience for users needing language translation services.

## ✨ Features

- **User Authentication**
  - Google Sign-in
  - Facebook Sign-in
  - Apple Sign-in
  - Email/Password Registration

- **Translation Services**
  - Real-time text translation
  - Voice-to-text transcription
  - Multiple language support
  - Translation history tracking

- **Modern UI/UX**
  - Responsive design
  - Intuitive interface
  - Dark/Light mode support
  - Interactive feedback

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Cloud Platform account (for translation services)
- Firebase account (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SimerdeepSingh4/V.O.L.T.git
   cd volt
   ```

2. **Install Dependencies**
   
   Frontend:
   ```bash
   npm install
   ```

   Backend:
   ```bash
   cd backend
   npm install
   ```

3. **Environment Setup**

   Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   GOOGLE_APPLICATION_CREDENTIALS=./credentials/translate-service-account-key.json
   ```

4. **Start the Application**

   Frontend:
   ```bash
   npm start
   ```

   Backend:
   ```bash
   cd backend
   npm start
   ```

   The application will be available at `http://localhost:3000`

## 🏗️ Project Structure

```
volt/
├── src/                  # Frontend source files
│   ├── components/       # React components
│   ├── pages/           # Page components
│   └── firebase.js      # Firebase configuration
├── public/              # Static files
├── backend/             # Backend server
│   ├── app.js          # Express application
│   └── credentials/    # Service account keys
├── build/              # Production build
└── node_modules/       # Dependencies
```

## 🔧 Technologies Used

### Frontend
- React.js
- Firebase Authentication
- Material-UI/CSS
- HTML5/CSS3

### Backend
- Node.js
- Express.js
- Google Cloud Translation API
- Firebase Admin SDK

## 🔐 Security

- Environment variables for sensitive data
- Service account keys stored securely
- Authentication middleware
- CORS protection
- Rate limiting

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙋‍♂️ Author

**Simerdeep Singh Gandhi**

- Portfolio: [https://simerdeep-portfolio.vercel.app/](https://simerdeep-portfolio.vercel.app/)
- GitHub: [@SimerdeepSingh4](https://github.com/SimerdeepSingh4)
- LinkedIn: [Simerdeep Singh Gandhi](https://www.linkedin.com/in/simerdeep-singh-gandhi-5569a7279/)

---

## ✨ Show Your Support

Give a ⭐️ if this project helped you!
