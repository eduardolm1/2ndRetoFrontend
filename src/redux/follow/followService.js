import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const followUser = async (id) => {
  const token = JSON.parse(localStorage.getItem("token"));
  const res = await axios.post(
    `${API_URL}/follow/follow/${id}`,
    {},
    {
      headers: {
        Authorization: `${token}`,
      },
    }
  );
  return res.data?.user ?? res.data;
};

const unfollowUser = async (id) => {
  const token = JSON.parse(localStorage.getItem("token"));
  const res = await axios.post(
    `${API_URL}/follow/unfollow/${id}`,
    {},
    {
      headers: {
        Authorization: `${token}`,
      },
    }
  );
  return res.data?.user ?? res.data;
};

const followService = {
  followUser,
  unfollowUser,
};

export default followService;
