import axios from 'axios'

const API_URL = '/local'

const getAllPosts = async () =>{
    const res = await axios.get(`${API_URL}/posts`)
    return res.data

}
const getPostById = async (id) => {
  const res = await axios.get(API_URL + "/posts/id/" + id)
  console.log(res.data)
  return res.data
}

const postService = {
    getAllPosts,
    getPostById
}
export default postService