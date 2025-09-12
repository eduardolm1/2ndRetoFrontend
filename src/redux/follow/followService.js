import axios from "axios";

const API_URL = "/local/follow";

const followUser = async (id) => {
  const token = JSON.parse(localStorage.getItem("token"));
  const res = await axios.post(
    `${API_URL}/follow/${id}`,
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
    `${API_URL}/unfollow/${id}`,
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
