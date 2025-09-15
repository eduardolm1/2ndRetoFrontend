import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const getAllPosts = async () => {
  const res = await axios.get(`${API_URL}/posts`);
  return res.data;
};

const getPostById = async (id) => {
  const res = await axios.get(`${API_URL}/posts/id/${id}`);
  return res.data;
};

const updatePost = async (postData) => {
  const token = JSON.parse(localStorage.getItem("token"));
  const formData = new FormData();
  formData.append('name', postData.name);
  formData.append('content', postData.content);
  
  if (postData.media) {
    formData.append('media', postData.media);
  }

  const res = await axios.put(
    `${API_URL}/posts/update/${postData._id}`,
    formData,
    {
      headers: {
        'Authorization': `${token}`,
        'Content-Type': 'multipart/form-data'
      },
    }
  );
  return res.data.post;
};

const deletePost = async (id) => {
  const token = JSON.parse(localStorage.getItem("token"));
  const res = await axios.delete(
    `${API_URL}/posts/delete/${id}`,
    {
      headers: {
        Authorization: `${token}`,
      },
    }
  );
  return res.data.id;
};

const createPost = async (postData) => {
  const token = JSON.parse(localStorage.getItem("token"));
  const formData = new FormData();
  formData.append('name', postData.name);
  formData.append('content', postData.content);
  if (postData.media) {
    formData.append('media', postData.media);
  }

  const res = await axios.post(
    `${API_URL}/posts/create`,
    formData,
    {
      headers: {
        'Authorization': `${token}`,
        'Content-Type': 'multipart/form-data'
      },
    }
  );
  return res.data.post;
};

const likePost = async (id) => {
  const token = JSON.parse(localStorage.getItem("token"));
  const res = await axios.put(
    `${API_URL}/posts/likes/${id}`,
    {},
    {
      headers: {
        Authorization: `${token}`,
      },
    }
  );
  return res.data?.post ?? res.data;
};

const dislikePost = async (id) => {
  const token = JSON.parse(localStorage.getItem("token"));
  const res = await axios.put(
    `${API_URL}/posts/dislikes/${id}`,
    {},
    {
      headers: {
        Authorization: `${token}`,
      },
    }
  );
  return res.data?.post ?? res.data;
};

const uploadMultipleMedia = async (files) => {
  const token = JSON.parse(localStorage.getItem("token"));
  const formData = new FormData();
  
  files.forEach(file => {
    formData.append('media', file);
  });
  
  const res = await axios.post(
    `${API_URL}/posts/upload-media`,
    formData,
    {
      headers: {
        'Authorization': `${token}`,
        'Content-Type': 'multipart/form-data'
      },
    }
  );
  return res.data;
};

const postService = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
  dislikePost,
  uploadMultipleMedia
};

export default postService;