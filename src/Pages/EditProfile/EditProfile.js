import React, { useEffect, useState } from 'react';
import { auth, db, storage } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EditProfile = ({ onProfileImageChange }) => {
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        gender: '',
        dateOfBirth: '',
        profileImage: ''
    });
    const [imageUpload, setImageUpload] = useState(null);
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
                        setProfile(data);
                        setImageUrl(data.profileImage || 'default-profile.png'); // Set default image if not exists
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

    // Handle input change for profile fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value
        }));
    };

    // Handle file input change
    const handleFileChange = (event) => {
        if (event.target.files[0]) {
            setImageUpload(event.target.files[0]);
            uploadImage(event.target.files[0]); // Call the upload function after file selection
        }
    };

    // Upload image to Firebase Storage and update Firestore
    const uploadImage = async (file) => {
        const user = auth.currentUser;
        const imageRef = ref(storage, `profileImages/${user.uid}`);
        try {
            await uploadBytes(imageRef, file);
            const downloadURL = await getDownloadURL(imageRef);
            setImageUrl(downloadURL); // Update image URL in state
            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, { profileImage: downloadURL });
            onProfileImageChange(downloadURL); // Inform parent about the change
            toast.success('Profile image updated successfully!');
        } catch (error) {
            console.error("Error uploading image: ", error);
            toast.error("Failed to update profile image.");
        }
    };

    // Handle form submission to update user profile
    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = auth.currentUser;
        const userDocRef = doc(db, 'users', user.uid);

        try {
            await updateDoc(userDocRef, profile);
            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error("Error updating profile: ", error);
            toast.error("Failed to update profile.");
        }
    };

    return (
        <div className="container mt-3">
            <ToastContainer />
            <h2>Edit Profile</h2>
            <div className="mb-3 text-center">
                <img
                    src={imageUrl || 'default-profile.png'}
                    alt="Profile"
                    className="img-fluid rounded-circle"
                    style={{ width: '100px', height: '100px', backgroundColor: '#e9ecef' }}
                />
                <div className="position-relative d-inline-block mt-2">
                    <label htmlFor="profile-picture" className="btn btn-primary rounded-circle">
                        <Upload size={16} />
                    </label>
                    <input id="profile-picture" type="file" className="d-none" onChange={handleFileChange} />
                </div>
                <p className="mt-2 text-muted">Choose Profile Picture</p>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={profile.name}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={profile.email}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Phone</label>
                    <input
                        type="tel"
                        className="form-control"
                        id="phone"
                        name="phone"
                        value={profile.phone}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="gender" className="form-label">Gender</label>
                    <input
                        type="text"
                        className="form-control"
                        id="gender"
                        name="gender"
                        value={profile.gender}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
                    <input
                        type="date"
                        className="form-control"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={profile.dateOfBirth}
                        onChange={handleInputChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100 mt-4">Save Changes</button>
            </form>
        </div>
    );
};

export default EditProfile;
