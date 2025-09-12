import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatRelativeDate } from "../../utils/dateUtils";
import { likePost, dislikePost } from "../../redux/posts/postSlice";
import { followUser, unfollowUser } from "../../redux/follow/followSlice";
import { likeComment, dislikeComment, updateComment, deleteComment, createComment} from "../../redux/comments/commentSlice";
import LikeIcon from "../svg/LikeIcon";
import CommentsIcon from "../svg/CommentsIcon";

const PostModal = ({ post, comments, onClose }) => {
    const dispatch = useDispatch();
    const { user: authUser } = useSelector((state) => state.auth);
    const { following } = useSelector((state) => state.follow);
    const [newComment, setNewComment] = useState("");
    const [editingComment, setEditingComment] = useState(null);
    const [editText, setEditText] = useState("");
    const [imageOrientation, setImageOrientation] = useState("square");
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, []);

    if (!post) return null;

    const ownerId = typeof post.userId === "object" ? post.userId._id : post.userId;
    const hasLiked = post.likes?.includes(authUser._id);
    const isFollowing = following.includes(ownerId);
    const handleCreateComment = () => {
        if (newComment.trim()) {
            dispatch(createComment({ text: newComment, id: post._id }));
            setNewComment("");
        }
    };
    const toggleLike = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (hasLiked) {
            dispatch(dislikePost(post._id));
        } else {
            dispatch(likePost(post._id));
        }
    };

    const toggleFollow = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isFollowing) {
            dispatch(unfollowUser(ownerId));
        } else {
            dispatch(followUser(ownerId));
        }
    };

    const nextImage = () => {
        if (post.images && currentImageIndex < post.images.length - 1) {
            setCurrentImageIndex(currentImageIndex + 1);
        }
    };
    const prevImage = () => {
        if (currentImageIndex > 0) {
            setCurrentImageIndex(currentImageIndex - 1);
        }
    };
    const handleImageLoad = (e) => {
        const { naturalWidth, naturalHeight } = e.target;
        if (naturalWidth > naturalHeight) {
            setImageOrientation("landscape");
        } else if (naturalHeight > naturalWidth) {
            setImageOrientation("portrait");
        } else {
            setImageOrientation("square");
        }
    };

    const toggleCommentLike = (comment) => {
        const hasCommentLiked = comment.likes?.includes(authUser._id);
        if (hasCommentLiked) {
            dispatch(dislikeComment(comment._id));
        } else {
            dispatch(likeComment(comment._id));
        }
    };

    const handleDeleteComment = (commentId) => {
        if (window.confirm("¿Seguro que deseas eliminar este comentario?")) {
            dispatch(deleteComment({ id: commentId }));
        }
    };

    const handleEditComment = (comment) => {
        setEditingComment(comment);
        setEditText(comment.text);
    };

    const handleSaveEdit = (commentId) => {
        if (editText.trim()) {
            dispatch(updateComment({ id: commentId, updateText: editText }));
            setEditingComment(null);
            setEditText("");
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className={`modal-content ${imageOrientation}`} onClick={onClose}>
                <button className="modal-close-btn" onClick={onClose}>✕</button>

                {post.images?.length > 0 && (
                    <div className="post-image-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="image-container">
                            <img
                                src={post.images[currentImageIndex]}
                                alt={`post ${currentImageIndex}`}
                                onLoad={handleImageLoad}
                                className={`post-img ${imageOrientation}`}
                            />

                            {post.images.length > 1 && (
                                <>
                                    <button
                                        className="image-nav-btn prev-btn"
                                        onClick={prevImage}
                                        disabled={currentImageIndex === 0}
                                    >
                                        ‹
                                    </button>
                                    <button
                                        className="image-nav-btn next-btn"
                                        onClick={nextImage}
                                        disabled={currentImageIndex === post.images.length - 1}
                                    >
                                        ›
                                    </button>

                                    <div className="image-indicators">
                                        {post.images.map((_, index) => (
                                            <span
                                                key={index}
                                                className={`indicator ${index === currentImageIndex ? "active" : ""}`}
                                                onClick={() => setCurrentImageIndex(index)}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                <div className="modal" onClick={(e) => e.stopPropagation()}>
                    <div className="__post">
                        <div className="__post-header">
                            <img src="/img/image.png" alt="user avatar" />
                            <div className="__post-user-info">
                                <div>
                                    <strong>
                                        {typeof post.userId === "object"
                                            ? post.userId._id === authUser._id
                                                ? "Yo"
                                                : post.userId.name
                                            : ownerId === authUser._id
                                                ? "Yo"
                                                : "Usuario"}
                                    </strong>
                                    <span>
                                        {" "}
                                        {typeof post.userId === "object"
                                            ? post.userId.followers?.length || 0
                                            : 0}{" "}
                                        seguidores
                                    </span>
                                </div>
                                <span>{formatRelativeDate(post.createdAt)}</span>
                            </div>

                            {authUser._id !== ownerId && (
                                <button className="follow-btn" onClick={toggleFollow}>
                                    {isFollowing ? "Siguiendo" : "Seguir"}
                                </button>
                            )}
                        </div>

                        <div className="__post-body">
                            <h2>{post.name}</h2>
                            <p>{post.content}</p>
                        </div>

                        <div className="__post-footer">
                            <button
                                onClick={toggleLike}
                                className={hasLiked ? "text-red-500" : ""}
                            >
                                <LikeIcon
                                    className={hasLiked ? "text-red-500" : "text-gray-500"}
                                />{" "}
                                {post.likes?.length || 0} Me gusta
                            </button>
                            <button>
                                <CommentsIcon /> {comments?.length || 0} Comentarios
                            </button>
                        </div>
                    </div>

                    <h3 className="mt-4 mb-2 font-semibold">Comentarios</h3>
                    <div className="commentBox">
                        {comments.map((comment) => {
                            const hasCommentLiked = comment.likes?.includes(authUser._id);
                            const isOwner = comment.userId?._id === authUser._id;

                            return (
                                <div className="__comment" key={comment._id}>
                                    <div className="comment-header">
                                        <div>
                                            <p><strong>{typeof comment.userId === "object" ? comment.userId.name : "Usuario"}</strong></p>
                                            <p>{formatRelativeDate(comment.createdAt)}</p>
                                        </div>
                                        {isOwner && (
                                            <div className="comment-actions">

                                                <button onClick={() => handleEditComment(comment)} className="text-blue-500 ml-2">Editar</button>
                                                <button onClick={() => handleDeleteComment(comment._id)}> ✕</button>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        {editingComment?._id === comment._id ? (
                                            <div className="edit-box">
                                                <input type="text" value={editText} onChange={(e) => setEditText(e.target.value)}
                                                />
                                                <button onClick={() => handleSaveEdit(comment._id)} className="text-green-500 ml-2">
                                                    Guardar
                                                </button>
                                                <button
                                                    onClick={() => setEditingComment(null)}
                                                    className="text-gray-500 ml-2"
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <p>{comment.text}</p>
                                                <p>
                                                    <button
                                                        onClick={() => toggleCommentLike(comment)}
                                                        className={hasCommentLiked ? "text-red-500" : "btnLikeComment"}
                                                    >
                                                        <LikeIcon
                                                            className={
                                                                hasCommentLiked
                                                                    ? "text-red-500"
                                                                    : "text-gray-500"
                                                            }
                                                        />{" "}
                                                        {comment.likes?.length || 0} Me gusta
                                                    </button>
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="comment-input">
                        <input
                            type="text"
                            placeholder="Escribe un comentario..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button onClick={handleCreateComment}>Comentar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostModal;
