import React, { useRef, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../Config/redux/reducer/userSlice';

const Login = () => {
  const email = useRef();
  const password = useRef();
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleLogin = async (event) => {
    event.preventDefault();
  
    try {
      const response = await axios.post(
        "https://bloging-app-server.vercel.app/api/v1/auth/login",
        {
          email: email.current.value,
          password: password.current.value,
        },
        { withCredentials: true } // ✅ Cookie send karne ke liye zaroori hai
      );


      if (response.data && response.data.accessToken) {
        const { accessToken, user } = response.data;

        dispatch(setUser({ userId: user.id, accessToken }));
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("userId", user.id);}
  
    console.log(response);
  
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Login successful!",
      }).then(() => {
        navigate("/");
      });
  
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Login failed. Please check your email and password!",
      });
    }finally {
          setLoading(false);
        }
  };
  

  return (
    <>
      <h1 className="text-center mt-8 text-4xl font-bold">Login</h1>
      <div className="flex justify-center items-center mt-9">
        <form
          className="w-full max-w-md bg-white p-8 rounded-lg shadow-md"
          onSubmit={handleLogin}
        >
          <div className="mb-4">
            <input type="email" placeholder="Enter your email" ref={email} className="input input-bordered w-full" required />
          </div>
          <div className="mb-4">
            <input type="password" placeholder="Enter your password" ref={password} className="input input-bordered w-full" required />
          </div>
          <div className="flex justify-center">
          <button type="submit" className={`btn bg-blue-700 text-white w-32 ${loading ? "btn-disabled" : ""}`} disabled={loading}>
        {loading ? <span className="loading loading-spinner"></span> : "Login"}
      </button>
          </div>
          <div className="mt-2 text-center">
            <a href="/register" className="text-blue-700">Not a user? Register here.</a>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
