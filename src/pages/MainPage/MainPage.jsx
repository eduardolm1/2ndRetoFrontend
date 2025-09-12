
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts, reset, getPostById } from "../../redux/posts/postSlice";
import { getPostComments } from "../../redux/comments/commentSlice";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Post from "../../components/Post/Post";
import PostModal from "../../components/PostModal/PostModal";

const MainPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const { posts, isLoading, post: selectedPost } = useSelector(
    (state) => state.posts
  );
  const { comments } = useSelector((state) => state.comments);

  useEffect(() => {
    const fetchPosts = async () => {
      await dispatch(getAllPosts());
      await dispatch(reset());
    };
    fetchPosts();
  }, [dispatch]);

  useEffect(() => {
    if (params.id) {
      dispatch(getPostById(params.id));
      dispatch(getPostComments(params.id));
    }
  }, [dispatch, params.id]);

  const handleCloseModal = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className="main-page">
      {isLoading ? (
        "Cargando..."
      ) : (
        <div className="posts">
          {posts &&
            posts.map((post) => <Post key={post._id} post={post} />)}
        </div>
      )}

      {params.id && selectedPost && (
        <PostModal
          post={selectedPost}
          comments={comments}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default MainPage;
