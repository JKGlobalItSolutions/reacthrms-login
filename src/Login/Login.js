import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase'; // Firebase config
import './Login.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, collection } from 'firebase/firestore'; // Import Firestore modular functions
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); 

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      // Firebase authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user data in Firestore using modular API
      await setDoc(doc(collection(db, 'users'), user.uid), {
        email: user.email,
        lastLogin: new Date(),
      }, { merge: true });

      // Show success notification
      toast.success('Login successful!', {
        position: "top-right",
        autoClose: 2000,  // Close after 3 seconds
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      setMessage('Login successful!');
      navigate('/profile'); // Redirect to profile page after login
    } catch (error) {
      setMessage(error.message);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Redirect if user is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/profile'); // Redirect to profile if user is authenticated
      }
    });

    return () => unsubscribe(); // Clean up the listener on component unmount
  }, [navigate]);

  return (
    <div className="login-container">
      <ToastContainer /> {/* Toast container for displaying notifications */}
      <form onSubmit={handleLogin} className="login-form">
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="input-group">
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span onClick={togglePasswordVisibility} className="password-icon">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div><br />
        {message && <div className="alert alert-info">{message}</div>}
        <button type="submit" className="btn btn-primary btn-block">
          Login
        </button>
      </form>
    </div>
 );
};

export default Login;