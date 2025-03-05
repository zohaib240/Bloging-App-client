import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAllblogs } from "../Config/redux/reducer/allblogsSlice.js";
import axios from "axios";
import Swal from "sweetalert2";

const Dashboard = () => {

const Title = useRef()
const Description = useRef()
const [blogImage,setblogImage] = useState(null)
const [loading, setloading] = useState(false)


  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs.blogs); // ✅ Redux se blogs lena
  const user = useSelector((state) => state.user.user?.user); // ✅ Redux se user lena
  

// blog fetch ------>>>>>

  useEffect(() => {
    if (!user) return; // ✅ Agar user null hai to fetch mat karo
    console.log("Redux user:", user);
    console.log("Redux Blogs:", blogs);

    const fetchUserBlogs = async () => {
      // try {
      //   const response = await fetch(`https://bloging-app-server.vercel.app/api/v1/singleuserBlogs/${user._id}`);
      //   const data = await response.json();
      //   console.log(data);

      //   dispatch(addAllblogs({ response: data })); // ✅ Redux store me sirf user ke blogs save karo

      //   console.log("API Response Data:", data);
      // } catch (error) {
      //   console.error("Error fetching user blogs:", error);
      // }

      try {
        const response = await axios.get(
            `https://bloging-app-server.vercel.app/api/v1/singleuserBlogs/${user._id}`
        );

        console.log("API Response Data:", response.data);
        dispatch(addAllblogs({ response: response.data })); 

    } catch (error) {
        console.error("Error fetching user blogs:", error);
    }

    };

    fetchUserBlogs();
  }, [user,dispatch]); // ✅ User change hone pe bhi chalega


// blog Add ------>>>>>

  const handleImageChange = (event) => {
    setblogImage(event.target.files[0]);
  };

const addBlog = async (event) => {
  event.preventDefault();
  setloading(true);

  try {
    const formData = new FormData();
    formData.append("title", Title.current?.value || "");
    formData.append("description", Description.current?.value || "");
    formData.append("postedBy", user?._id || "");  // ✅ Fix: postedBy Add Karo

    if (blogImage) {
      formData.append("image", blogImage);
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("Token missing in localStorage");
      return Swal.fire({ icon: "error", title: "Oops...", text: "User not logged in!" });
    }

    const response = await axios.post(
      "https://bloging-app-server.vercel.app/api/v1/addBlog",
      formData,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    dispatch(addAllblogs({ response: [...blogs, response.data.data] }));

    Title.current.value = "";
    Description.current.value = "";
    setblogImage(null);

    Swal.fire({
      icon: "success",
      title: "Success!",
      text: "Blog posted successfully!",
    });
  } catch (error) {
    console.error("Error:", error.response?.data || error);

    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error.response?.data?.error || "Blog post failed. Please try again.",
    });
  } finally {
    setloading(false);
  }
};


// delete blog ------->>>>>>>

const deleteBlog = async (id) => {

  // get access token from localStorage ----->>>>
const token = localStorage.getItem("accessToken");

  try {
    const response = await axios.delete(
      `https://bloging-app-server.vercel.app/api/v1/deleteBlog/${id}`,
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      Swal.fire("Deleted!", response.data.message, "success");

      // ✅ Redux se blogs update karo
      dispatch(addAllblogs({ response: blogs.filter((blog) => blog._id !== id) }));
    } else {
      Swal.fire("Error!", response.data.message, "error");
    }
  } catch (error) {
    console.error("Error deleting blog:", error);
    Swal.fire("Error!", "Something went wrong while deleting.", "error");
  }
};

// Edit blog ------->>>>>>>

const editBlog = async (id) => {
  const description = prompt("Update Description");

  if (!description) {
    return Swal.fire("Cancelled", "thanks for no editing.", "info");
  }

  const token = localStorage.getItem("accessToken");

  try {
    const response = await axios.put(
      `https://bloging-app-server.vercel.app/api/v1/editBlog/${id}`,
      { description }, // ✅ Fix: Yeh object me bhejna
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      Swal.fire("Edited!", response.data.message, "success");

    const updatedBlogs = blogs.map((blog) =>
        blog._id === id ? { ...blog, description: response.data.blog.description} : blog);
      
      dispatch(addAllblogs({ response: updatedBlogs }));
      
    } else {
      Swal.fire("Error!", response.data.message, "error");
    }
  } catch (error) {
    console.error("Error editing blog:", error);
    Swal.fire("Error!", "Something went wrong while editing.", "error");
  }
};

  return (
  
  <div className="max-w-2xl mx-auto p-4">
  <h1 className="text-2xl font-bold text-center my-4">My Blogs</h1>

  {/* 🔥 Blog Form */}
  <form className="bg-white p-6 rounded-lg shadow-md" onSubmit={addBlog}>
    <div className="mb-4">
      <input type="text" placeholder="Enter Title" ref={Title} className="input input-bordered w-full" />
    </div>
    <div className="mb-4">
      <input type="text" placeholder="Enter Description" ref={Description} className="input input-bordered w-full" />
    </div>
    <div className="mb-4">
      <input type="file" accept="image/*" onChange={handleImageChange} className="file-input file-input-bordered w-full" />
    </div>
    <div className="flex justify-center">
      <button type="submit" className={`btn bg-blue-700 text-white w-32 ${loading ? "btn-disabled" : ""}`} disabled={loading}>
        {loading ? <span className="loading loading-spinner"></span> : "Post Blog"}
      </button>
    </div>
  </form>

  
  <div className="mt-6 grid grid-cols-1 md:grid-cols-1 gap-8 ">
    {blogs.length > 0 ? (
      blogs.map((blog) => (
        <div key={blog._id} className="p-4 border rounded-lg shadow-lg flex gap-4 relative">
          {/* ✅ Image ko round shape dena */}
          <img
            src={blog.blogPicture}
            alt="Blog"
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h2 className="text-lg font-semibold">{blog.title}</h2>
            <p className="text-gray-600">{blog.description}</p>
          </div>

        {/* 🛠️ Edit & Delete Buttons (Properly Positioned) */}
        <div className=" flex items-end justify-end ml-auto  gap-2">
          <button className="btn btn-sm bg-yellow-500 text-white" onClick={()=>editBlog(blog._id)}>Edit</button>
          <button className="btn btn-sm bg-red-600 text-white" onClick={()=>deleteBlog(blog._id) }>Delete</button>
        </div>

        </div>
      ))
    ) : (
      <p className="text-center text-gray-500">No blogs found</p>
    )}
  </div>
  
</div>
);
};

export default Dashboard;
