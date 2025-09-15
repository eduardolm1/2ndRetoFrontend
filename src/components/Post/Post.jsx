import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { likePost, dislikePost } from "../../redux/posts/postSlice";
import { followUser, unfollowUser } from "../../redux/follow/followSlice";
import { formatRelativeDate } from "../../utils/dateUtils";
import LikeIcon from "../svg/LikeIcon";
import CommentsIcon from "../svg/CommentsIcon";

const getOwnerId = (userId) => {
  if (!userId) return null;
  return typeof userId === "object" ? userId._id : userId;
};

const Post = ({ post }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { posts } = useSelector((state) => state.posts);
  const { comments } = useSelector((state) => state.comments);
  const { user: authUser } = useSelector((state) => state.auth);
  const { following } = useSelector((state) => state.follow);

  const updatedPost = posts.find((p) => p._id === post._id) || post;

  const getPostOwner = () => {
    if (typeof updatedPost.userId === "object") {
      return updatedPost.userId;
    }

    return null;
  };

  const postOwner = getPostOwner();
  const ownerId = getOwnerId(updatedPost.userId);
  const hasLiked = updatedPost.likes?.includes(authUser._id);
  const isFollowing = following.includes(ownerId);

  const isProfilePage = location.pathname.startsWith("/profile/");

  const toggleLike = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(hasLiked ? dislikePost(id) : likePost(id));
  };

  const toggleFollow = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(isFollowing ? unfollowUser(id) : followUser(id));
  };

  const handlePostClick = (e) => {
    e.preventDefault();
    if (isProfilePage) {
      navigate(`?post=${updatedPost._id}`);
    } else {
      navigate(`/id/${updatedPost._id}`, {
        state: { backgroundLocation: location },
      });
    }
  };

  const postComments = comments.filter((c) => c.postId === updatedPost._id);

  return (
    <div className="__post-link" onClick={handlePostClick}>
      <div className="__post">
        <div className="__post-header">
          <img 
            src={postOwner?.profileImage || "/img/image.png"} 
            alt="user avatar" 
            onError={(e) => {
              e.target.src = "/img/image.png";
            }}
          />
          <div className="__post-user-info">
            <div>
              <button
                type="button"
                className="user-link"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigate(`/profile/${ownerId}`);
                }}
              >
                {postOwner ? (
                  postOwner._id === authUser._id ? "Yo" : postOwner.name
                ) : (
                  "Usuario"
                )}
              </button>
              <span>
                {" "}
                {postOwner?.followers?.length || 0} seguidores
              </span>
            </div>
            {formatRelativeDate(updatedPost.createdAt)}
          </div>

          {authUser._id !== ownerId && (
            <button
              className="follow-btn"
              onClick={(e) => toggleFollow(e, ownerId)}
            >
              {isFollowing ? "Siguiendo" : "Seguir"}
            </button>
          )}
        </div>

        <div className="__post-body">
          <h2>{updatedPost.name}</h2>
          <p>{updatedPost.content}</p>
        </div>

        {updatedPost.images?.length > 0 && (
          <div className="__post-content">
            {updatedPost.images.map(
              (img, index) =>
                img && <img key={index} src={img} alt={`post ${index}`} />
            )}
          </div>
        )}

        <div className="__post-footer">
          <button
            onClick={(e) => toggleLike(e, updatedPost._id)}
            className={hasLiked ? "text-red-500" : ""}
          >
            <LikeIcon
              className={hasLiked ? "text-red-500" : "text-gray-500"}
            />{" "}
            {updatedPost.likes?.length || 0} Me gusta
          </button>
          <button>
            <CommentsIcon /> {postComments.length} Comentarios
          </button>
        </div>
      </div>
    </div>
  );
};

export default Post;
