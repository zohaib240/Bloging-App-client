import React, { useEffect, useState } from 'react';
import axios from 'axios';


const Profile = () => {
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('https://bloging-app-server.vercel.app/api/v1/auth/single-user', {
          withCredentials: true,  // 🔥 Cookies send karne ke liye
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
          console.log(response.data)
        setUserData(response.data);

      } catch (error) {
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 md:p-12 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 flex items-center space-x-6">
        <img
          className="w-48 h-48 object-cover object-center border-2 border-black rounded-full"
          alt="profile"
          src={userData?.user?.profilePicture || 'https://www.shutterstock.com/image-vector/avatar-gender-neutral-silhouette-vector-600nw-2470054311.jpg'}
        />
        <div>
          <h1 className="title-font text-xl font-medium text-gray-900">
            Name: {userData?.user?.fullName}
          </h1>
          <h1 className="title-font text-xl font-medium text-gray-900">
            Email: {userData?.user?.email}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Profile;
