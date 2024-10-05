import React, { useState, useEffect } from 'react';
import { auth, db, storage } from '../../firebase';
import { useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Clock, User } from 'lucide-react';
import logo from '../../Assets/logo.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [timer, setTimer] = useState(0);
  const [userData, setUserData] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const navigate = useNavigate();

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData(data);
            if (data.profileImage) {
              setImageUrl(data.profileImage);
            }
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      } else {
        navigate('/login');
      }
    };
    fetchUserData();
  }, [navigate]);

  // Handle logout with confirmation
  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      await auth.signOut();
      navigate('/login');
    }
  };

  // Timer for check-in
  useEffect(() => {
    let interval;
    if (isCheckedIn) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCheckedIn]);

  // Format timer for check-in
  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mt-3">
      <ToastContainer />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <img style={{ width: '200px' }} src={logo} alt="Company Logo" className="mb-2" />

        {/* User Profile Dropdown */}
        {userData && (
          <div className="dropdown">
            <img
              src={imageUrl || 'default-profile.png'} // Show default image if no profile image
              alt="Profile"
              className="img-fluid rounded-circle"
              width="50"
              style={{ cursor: 'pointer' }}
              id="profileDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            />
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
              <li>
                <Link to="/edit-profile" className="dropdown-item">Edit Profile</Link>
              </li>
              <li>
                <button className="dropdown-item" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="card mb-4">
        <div className="card-body text-center">
          <h3 className="card-title text-danger">{formatTime(timer)}</h3>
          <p className="card-text">General<br />09:00 AM TO 06:00 PM</p>
          <button
            className={`btn ${isCheckedIn ? 'btn-danger' : 'btn-success'} w-100`}
            onClick={() => setIsCheckedIn(!isCheckedIn)}
          >
            {isCheckedIn ? 'Check Out' : 'Check In'}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="row g-2">
        <div className="col-6">
          <Link to="/attendance" className="btn btn-light border w-100 py-3">
            <Clock className="mb-2" />
            <div>Attendance</div>
          </Link>
        </div>
        <div className="col-6">
          <Link to="/leave-tracking" className="btn btn-light border w-100 py-3">
            <Clock className="mb-2" />
            <div>Leave Tracking</div>
          </Link>
        </div>
        <div className="col-6">
          <button className="btn btn-light border w-100 py-3">
            <Clock className="mb-2" />
            <div>Payroll</div>
          </button>
        </div>
        <div className="col-6">
          <Link to="/ProfileAndSettings" className="btn btn-light border w-100 py-3">
            <User className="mb-2" />
            <div>Profile</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
