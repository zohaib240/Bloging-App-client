import { createSlice } from "@reduxjs/toolkit";

export const allblogsSlice = createSlice({
name : "blogs",
initialState : {
    blogs : []
},
reducers : {
    addAllblogs : (state , action) =>{
        state.blogs = action.payload.response
    },
    addSingleBlog: (state, action) => {
        state.blogs = [action.payload, ...state.blogs];  // ✅ Naya blog upar aayega
    },
    deleteSingleBlog : (state,action) =>{
        state.blogs = state.blogs.filter(blog => blog._id !== action.payload)
    }
}
})

export const {addAllblogs,addSingleBlog,deleteSingleBlog} = allblogsSlice.actions
export default allblogsSlice.reducer