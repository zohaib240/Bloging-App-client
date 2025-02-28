import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, setUser } from "../Config/redux/reducer/userSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux se user & token lo
  const user = useSelector((state) => state.user.user);
  const accessToken = useSelector((state) => state.user.accessToken);

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    const storedUserId = localStorage.getItem("userId");

    if (storedToken && storedUserId) {
      fetchUser(storedToken);
    }
  }, [accessToken]);


  const fetchUser = async (token) => {
    try {
      const response = await axios.get(
        "https://bloging-app-server.vercel.app/api/v1/auth/single-user",
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      dispatch(setUser({
        user: response.data,  // ✅ Pure user data Redux me bhejo
        accessToken: token
      }));
    } catch (error) {
         console.log(error);  
    }
  };

  const userLogout = async () => {
    try {
      console.log("Logging out...");
      
      await axios.post(
        "https://bloging-app-server.vercel.app/api/v1/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Pass access token
          },
          withCredentials: true, // Cookies send karne ke liye
        }
      );
      
      dispatch(logoutUser()); // Redux se user hatao
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userId");
      
      Swal.fire({
        title: "Success!",
        text: "You have been logged out successfully.",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#234e94",
      });
      
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error);
      Swal.fire({
        title: "Error!",
        text: "Something went wrong while logging out.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="navbar bg-blue-700">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl text-white">
          Blogging App
        </Link>
      </div>
      <div className="flex-none gap-2">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-300">
              <img
                src={ user?.user?.profilePicture || "https://www.shutterstock.com/image-vector/avatar-gender-neutral-silhouette-vector-600nw-2470054311.jpg"}
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            {user ? (
              <>
                <li className="text-center">
                  <Link to="/">Home</Link>
                </li>
                <li className="text-center">
                  <Link to="/Profile">Profile</Link>
                </li>
                <li className="text-center">
                  <Link to="/Dashboard">Dashboard</Link>
                </li>
                <li className="text-center">
                  <button onClick={userLogout}>Logout</button>
                </li>
              </>
            ) : (
              <li className="text-center">
                <Link to="/Login">Login</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
