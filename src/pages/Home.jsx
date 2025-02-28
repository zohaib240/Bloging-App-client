import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [blogData, setBlogData] = useState([]);


  // ✅ API Se Blogs Fetch Karna (Public Blogs)
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("https://bloging-app-server.vercel.app/api/v1/allBlogs");
        setBlogData(response.data.allBlogs);
        
      } catch (error) {
      }
    };
    fetchBlogs();
  }, []);

  // ✅ Date Formatting Function
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <div className="bg-blue-50 min-h-screen p-4">
        {/* ✅ Navbar */}
        <div className="bg-white text-black navbar p-4">
          <h1 className="font-bold text-xl">Good Morning! Readers</h1>
        </div>

        {/* ✅ Blogs List */}
        <h1 className="font-bold text-xl m-3">All Blogs</h1>
        <div className="bg-white min-h-screen pb-8 overflow-auto">
          {blogData.length > 0 ? (
            blogData.map((item, index) => (
              <div key={index} className="flex ml-5 mt-2 border-b pb-3">
                {/* Blog Image */}
                <div className="w-[80px] h-[80px] mt-5 rounded-full overflow-hidden flex-shrink-0">
                  <img src={item.blogPicture} alt="Blog" className="w-full h-full object-cover" />
                </div>

                {/* Blog Title and Description */}
                <div className="ml-3 mt-7">
                  <div className="flex items-center">
                    <div className="m-3">
                      <h1 className="font-bold">{item.title}</h1>
                      <p className="text-black text-sm">
                        {item.fullName} <span>{formatDate(item.createdAt)}</span>
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-gray-600">{item.description}</h3>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="m-5">No blogs available.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
