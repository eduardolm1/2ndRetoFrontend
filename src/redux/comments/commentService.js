import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const createComment = async ({ text, id }) => {
    const token = JSON.parse(localStorage.getItem('token'));
    const res = await axios.post(
        `${API_URL}/comments/create/${id}`,
        { content: text },
        {
            headers: { "Authorization": `${token}` }
        }
    );
    return res.data;
};

const getPostComments = async (id) => {
    const res = await axios.get(`${API_URL}/comments/id/${id}`);
    return res.data;
};

const updateComment = async ({ updateText, id }) => {
    const token = JSON.parse(localStorage.getItem('token'));
    const res = await axios.put(`${API_URL}/comments/${id}`, {
        content: updateText
    }, {
        headers: { 'Authorization': `${token}` }
    });
    return res.data;
};

const deleteComment = async ({ id }) => {
    const token = JSON.parse(localStorage.getItem('token'));
    const res = await axios.delete(`${API_URL}/comments/${id}`, {
        headers: { "Authorization": `${token}` }
    });
    return res.data;
};

const likeComment = async (id) =>{
    const token = JSON.parse(localStorage.getItem('token'));
    const res = await axios.post(`${API_URL}/comments/like/${id}`, {}, {
        headers: { 'Authorization': `${token}` }
    });
    return res.data.comment;
};

const dislikeComment = async (id) =>{
    const token = JSON.parse(localStorage.getItem('token'));
    const res = await axios.post(`${API_URL}/comments/dislike/${id}`, {}, {
        headers: { 'Authorization': `${token}` }
    });
    return res.data.comment;
};

const commentService = {
    createComment,
    getPostComments,
    likeComment,
    dislikeComment,
    updateComment,
    deleteComment
};
export default commentService;