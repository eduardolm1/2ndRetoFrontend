import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import Post from "../../components/Post/Post";
import { followUser, unfollowUser } from "../../redux/follow/followSlice";
import { getPostComments } from "../../redux/comments/commentSlice";
import { likePost, dislikePost } from "../../redux/posts/postSlice";
import { getInfo } from "../../redux/auth/authSlice"; 
import ChartIcon from "../../components/svg/ChartIcon";
import LikeIcon from "../../components/svg/LikeIcon";
import MultimediaIcon from "../../components/svg/MultimediaIcon";
import PostModal from "../../components/PostModal/PostModal";

const ProfilePage = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  const { user: authUser, userInfo, isLoading: authLoading } = useSelector(
    (state) => state.auth
  );
  const { following } = useSelector((state) => state.follow);
  const { comments } = useSelector((state) => state.comments);

  const [activeTab, setActiveTab] = useState("posts");
  const postId = searchParams.get("post");

  useEffect(() => {
    if (id) {
      dispatch(getInfo(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (postId) {
      dispatch(getPostComments(postId));
    }
  }, [dispatch, postId]);

  if (authLoading) return <div>Cargando...</div>;
  if (!userInfo) return <div>Usuario no encontrado</div>;

  const profilePosts = userInfo.posts || [];

  const multimediaPosts = profilePosts.filter(
    (p) => p.images && p.images.length > 0
  );

  const likedPosts = profilePosts.filter(
    (post) => post.likes && post.likes.length > 0
  );

  let postsToRender = [];
  if (activeTab === "posts") postsToRender = profilePosts;
  else if (activeTab === "multimedia") postsToRender = multimediaPosts;
  else if (activeTab === "likes") postsToRender = likedPosts;

  const isFollowing = following.includes(userInfo._id);

  const toggleFollow = () => {
    if (isFollowing) {
      dispatch(unfollowUser(userInfo._id));
    } else {
      dispatch(followUser(userInfo._id));
    }
  };

  const closeModal = () => {
    searchParams.delete("post");
    setSearchParams(searchParams);
  };

  const selectedPost = postId
    ? profilePosts.find((p) => p._id === postId)
    : null;

  return (
    <section className="section-data-container">
      <div className="user-data-container">
        <div className="user-img-container">
          <img src="/img/image.png" alt="user" />
        </div>

        <div className="user-data-info-container">
          <div className="title-follow-more-container">
            <h2 className="user-name-title">{userInfo.name}</h2>
            {authUser._id !== userInfo._id && (
              <button className="follow-btn" onClick={toggleFollow}>
                {isFollowing ? "Dejar de seguir" : "Seguir"}
              </button>
            )}
            <button className="btn-more">⋮</button>
          </div>

          <div className="user-numbers-container">
            <p>
              <strong>{profilePosts.length}</strong> publicaciones
            </p>
            <p>
              <strong>{userInfo.followers?.length || 0}</strong> seguidores
            </p>
            <p>
              <strong>{userInfo.following?.length || 0}</strong> seguidos
            </p>
          </div>

          <div>
            <p>
              <strong>{userInfo.name}</strong>
            </p>
            <p>{userInfo.email}</p>
            <p>Edad: {userInfo.age}</p>
          </div>
        </div>
      </div>

      <div className="menu-posts-container">
        <button
          onClick={() => setActiveTab("posts")}
          className={activeTab === "posts" ? "active" : ""}
        >
          <ChartIcon />
          <span>Publicaciones</span>
        </button>
        <button
          onClick={() => setActiveTab("multimedia")}
          className={activeTab === "multimedia" ? "active" : ""}
        >
          <MultimediaIcon />
          <span>Multimedia</span>
        </button>
        <button
          onClick={() => setActiveTab("likes")}
          className={activeTab === "likes" ? "active" : ""}
        >
          <LikeIcon />
          <span>Me gusta</span>
        </button>
      </div>

      <div className="posts">
        {postsToRender.length > 0 ? (
          postsToRender.map((post) => (
            <Post
              key={post._id}
              post={post}
              onLike={() => dispatch(likePost(post._id))}
              onDislike={() => dispatch(dislikePost(post._id))}
            />
          ))
        ) : (
          <p>No hay publicaciones</p>
        )}
      </div>

      {selectedPost && (
        <PostModal
          post={selectedPost}
          comments={comments}
          onClose={closeModal}
          onLike={() => dispatch(likePost(selectedPost._id))}
          onDislike={() => dispatch(dislikePost(selectedPost._id))}
        />
      )}
    </section>
  );
};

export default ProfilePage;
