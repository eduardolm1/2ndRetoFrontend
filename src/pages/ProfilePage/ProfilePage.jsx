import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import Post from "../../components/Post/Post";
import { followUser, unfollowUser } from "../../redux/follow/followSlice";
import { getPostComments } from "../../redux/comments/commentSlice";
import { likePost, dislikePost, updatePost, deletePost, createPost } from "../../redux/posts/postSlice";
import { getInfo, updateUser } from "../../redux/auth/authSlice"; 
import ChartIcon from "../../components/svg/ChartIcon";
import LikeIcon from "../../components/svg/LikeIcon";
import MultimediaIcon from "../../components/svg/MultimediaIcon";
import PostModal from "../../components/PostModal/PostModal";
import EditPostModal from "../../components/EditPostModal/EditPostModal";
import EditProfileModal from "../../components/EditProfileModal/EditProfileModal";
import CreatePostModal from "../../components/CreatePostModal/CreatePostModal";
import DesignIcon from "../../components/svg/DesignIcon";

const ProfilePage = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  const { user: authUser, userInfo, isLoading: authLoading } = useSelector(
    (state) => state.auth
  );
  const { following } = useSelector((state) => state.follow);
  const { comments } = useSelector((state) => state.comments);
  const { isLoading: postLoading } = useSelector((state) => state.posts);

  const [activeTab, setActiveTab] = useState("posts");
  const [editingPost, setEditingPost] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [creatingPost, setCreatingPost] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
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

  if (authLoading || refreshing) return <div className="loading">Cargando...</div>;
  if (!userInfo) return <div className="error">Usuario no encontrado</div>;

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
  const isOwnProfile = authUser._id === userInfo._id;

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

  const handleEditPost = (post) => {
    setEditingPost(post);
  };

  const handleSavePost = async (updatedPost) => {
    try {
      setRefreshing(true);
      await dispatch(updatePost(updatedPost)).unwrap();
      await dispatch(getInfo(id)).unwrap();
      setEditingPost(null);
    } catch (error) {
      console.error("Error al actualizar el post:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
  };

  const handleDeletePost = async (post) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta publicación?")) {
      try {
        setRefreshing(true);
        await dispatch(deletePost(post._id)).unwrap();
        await dispatch(getInfo(id)).unwrap();
      } catch (error) {
        console.error("Error al eliminar el post:", error);
      } finally {
        setRefreshing(false);
      }
    }
  };

  const handleEditProfile = () => {
    setEditingProfile(true);
  };

  const handleSaveProfile = async (updatedProfile) => {
    try {
      setRefreshing(true);
      await dispatch(updateUser(updatedProfile)).unwrap();
      await dispatch(getInfo(id)).unwrap();
      setEditingProfile(false);
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleCancelEditProfile = () => {
    setEditingProfile(false);
  };

  const handleCreatePost = () => {
    setCreatingPost(true);
  };

  const handleSaveNewPost = async (postData) => {
    try {
      setRefreshing(true);
      await dispatch(createPost(postData)).unwrap();
      await dispatch(getInfo(id)).unwrap();
      setCreatingPost(false);
    } catch (error) {
      console.error("Error al crear el post:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleCancelCreate = () => {
    setCreatingPost(false);
  };

  const selectedPost = postId
    ? profilePosts.find((p) => p._id === postId)
    : null;
  
  return (
    <section className="section-data-container">
      <div className="user-data-container">
        <div className="user-img-container">
          <img src={userInfo.profileImage || "/img/image.png"} alt="user" />
          {isOwnProfile && (
            <button className="edit-profile-btn" onClick={() => setEditingProfile(true)}>
              Editar Perfil
            </button>
          )}
        </div>

        <div className="user-data-info-container">
          <div className="title-follow-more-container">
            <h2 className="user-name-title">{userInfo.name}</h2>
            {!isOwnProfile ? (
              <button className="follow-btn" onClick={toggleFollow}>
                {isFollowing ? "Dejar de seguir" : "Seguir"}
              </button>
            ) : (
              <button className="create-post-btn" onClick={handleCreatePost}>
                Crear Publicación
              </button>
            )}
            {isOwnProfile && (
              <button className="btn-more" onClick={() => setEditingProfile(true)}>
                <DesignIcon/>
              </button>
            )}
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
        {postLoading ? (
          <div className="loading">Cargando publicaciones...</div>
        ) : postsToRender.length > 0 ? (
          postsToRender.map((post) => (
            <div key={post._id} className="post-with-actions">
              <Post
                post={post}
                onLike={() => dispatch(likePost(post._id))}
                onDislike={() => dispatch(dislikePost(post._id))}
              />
              {isOwnProfile && (
                <div className="post-actions">
                  <button 
                    className="edit-post-btn"
                    onClick={() => handleEditPost(post)}
                  >
                    Editar
                  </button>
                  <button 
                    className="delete-post-btn"
                    onClick={() => handleDeletePost(post)}
                  >
                  ✖
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="no-posts">No hay publicaciones para mostrar</p>
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

      {editingPost && (
        <EditPostModal
          post={editingPost}
          onSave={handleSavePost}
          onCancel={handleCancelEdit}
        />
      )}

      {editingProfile && (
        <EditProfileModal
          user={userInfo}
          onSave={handleSaveProfile}
          onCancel={handleCancelEditProfile}
        />
      )}

      {creatingPost && (
        <CreatePostModal
          onSave={handleSaveNewPost}
          onCancel={handleCancelCreate}
        />
      )}
    </section>
  );
};

export default ProfilePage;