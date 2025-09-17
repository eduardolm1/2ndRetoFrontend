import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUsers } from "../../redux/auth/authSlice";
import { followUser, unfollowUser } from "../../redux/follow/followSlice";

const ConnectPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user: authUser, users, isLoading } = useSelector((state) => state.auth);
    const { following } = useSelector((state) => state.follow);

    const [activeIndices, setActiveIndices] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        dispatch(getUsers())
            .unwrap()
            .catch(err => {
                console.error("Error al cargar usuarios:", err);
                setError("Error al cargar usuarios. Por favor, intenta nuevamente.");
            });
    }, [dispatch]);

    const filteredUsers = users?.filter(u => u._id !== authUser?._id) || [];

    const groupedUsers = [];
    for (let i = 0; i < filteredUsers.length; i += 5) {
        groupedUsers.push(filteredUsers.slice(i, i + 5));
    }

    const handleSlideClick = (groupIndex, slideIndex, user) => {
        const currentActiveIndex = activeIndices[groupIndex] || 0;
        if (currentActiveIndex === slideIndex) {
            navigate(`/profile/${user._id}`);
        } else {
            setActiveIndices(prev => ({
                ...prev,
                [groupIndex]: slideIndex
            }));
        }
    };

    const navigateSlide = (groupIndex, direction) => {
        const currentActiveIndex = activeIndices[groupIndex] || 0;
        const groupLength = groupedUsers[groupIndex].length;
        let newIndex;
        if (direction === 'prev') {
            newIndex = currentActiveIndex === 0 ? groupLength - 1 : currentActiveIndex - 1;
        } else {
            newIndex = currentActiveIndex === groupLength - 1 ? 0 : currentActiveIndex + 1;
        }
        setActiveIndices(prev => ({
            ...prev,
            [groupIndex]: newIndex
        }));
    };

    if (isLoading) {
        return (
            <div className="slider-container">
                <div className="loading">Cargando usuarios...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="slider-container">
                <div className="error-message">{error}</div>
            </div>
        );
    }

    if (!filteredUsers || filteredUsers.length === 0) {
        return (
            <div className="slider-container">
                <div className="no-users">No hay usuarios disponibles</div>
            </div>
        );
    }

    return (
        <>
            <h1>Explorar Personas</h1>
            <div className="slider-container">
                {groupedUsers.map((userGroup, groupIndex) => {
                    const groupActiveIndex = activeIndices[groupIndex] || 0;
                    return (
                        <div key={groupIndex} className="user-group">
                            <div className="accordion-slider">
                                {userGroup.map((user, index) => {
                                    const isFollowing = following.includes(user._id);
                                    return (
                                        <div
                                            key={user._id}
                                            className={`slide ${groupActiveIndex === index ? "active" : ""}`}
                                            onClick={() => handleSlideClick(groupIndex, index, user)}
                                            style={{
                                                backgroundImage: user.profileImage
                                                    ? `url('${user.profileImage}')`
                                                    : `url('/img/image-city.png')`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                            }}
                                        >
                                            <div className="slide-box">
                                                <div className="slide-content">
                                                    <div className="user-age">{user.age || 'Edad no especificada'} años</div>
                                                    <div className="user-name">{user.name || 'Usuario sin nombre'}</div>
                                                    <div className="user-stats">
                                                        <div className="stat-row">
                                                            <span className="stat-label">Seguidores:</span>
                                                            <span className="stat-value">
                                                                {user.followers?.length || 0}
                                                            </span>
                                                        </div>
                                                        <div className="stat-row">
                                                            <span className="stat-label">Siguiendo:</span>
                                                            <span className="stat-value">
                                                                {user.following?.length || 0}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="user-badges">
                                                        <div className="badge">
                                                            <div className="badge-icon"></div>
                                                            <span>Se unió: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Fecha desconocida'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    className={`follow-button ${isFollowing ? "following" : ""}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        isFollowing
                                                            ? dispatch(unfollowUser(user._id))
                                                            : dispatch(followUser(user._id));
                                                    }}
                                                >
                                                    {isFollowing ? "Siguiendo" : "Seguir"}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <button
                                className="navigation-arrows nav-prev"
                                onClick={() => navigateSlide(groupIndex, 'prev')}
                            >
                                ‹
                            </button>
                            <button
                                className="navigation-arrows nav-next"
                                onClick={() => navigateSlide(groupIndex, 'next')}
                            >
                                ›
                            </button>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default ConnectPage;