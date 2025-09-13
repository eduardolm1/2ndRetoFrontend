import axios from "axios";

const API_URL = "/api";

const getAllPosts = async () => {
  const res = await axios.get(`${API_URL}/posts`);
  return res.data;
};

const getPostById = async (id) => {
  const res = await axios.get(`${API_URL}/posts/id/${id}`);
  return res.data;
};

const createPost = async () => {
  const res = await axios.post(`${API_URL}/posts/create`);
  return res.data;
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

const postService = {
  getAllPosts,
  getPostById,
  createPost,
  likePost,
  dislikePost,
};
export default postService;
