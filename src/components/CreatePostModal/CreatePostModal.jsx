import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPost } from "../../redux/posts/postSlice";

const CreatePostModal = ({ onSave, onCancel }) => {
  const [content, setContent] = useState("");
  const [name, setName] = useState("");
  const dispatch = useDispatch();
  const [media, setMedia] = useState(null);
  const { isLoading, error } = useSelector(state => state.posts);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        handleCancel();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(() => {
    return () => {
      if (media && typeof media === 'string') {
        URL.revokeObjectURL(media);
      }
    };
  }, [media]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Formato de archivo no válido. Solo se permiten imágenes.');
        return;
      }
      if (media && typeof media === 'string') {
        URL.revokeObjectURL(media);
      }
      const url = URL.createObjectURL(file);
      setMedia(url);
      setMedia(file);
    }
  };

  const removeMedia = () => {
    if (media && typeof media === 'string') {
      URL.revokeObjectURL(media);
    }
    setMedia(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !content.trim()) {
      alert("Nombre y contenido son requeridos");
      return;
    }

    if (isLoading) return;

    const postData = {
      name,
      content,
      media
    };

    try {
      await dispatch(createPost(postData)).unwrap();
      setName("");
      setContent("");
      removeMedia();

      if (onSave) {
        onSave();
      }
    } catch (error) {
      console.error("Error al crear el post:", error);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <h2>Crear Nueva Publicación</h2>
          <button
            className="modal-close-btn"
            onClick={handleCancel}
            disabled={isLoading}
          >
           ✕ 
          </button>
        </div>
        <form className="formRegister" onSubmit={handleSubmit}>
          <label htmlFor="name">Título:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Título de la publicación"
            required
            disabled={isLoading}
          />

          <label htmlFor="content">Contenido:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="¿Qué estás pensando?"
            required
            disabled={isLoading}
          />

          {/* Sección multimedia simplificada */}
          <div className="media-section">
            <label>Agregar imagen (opcional):</label>
            {!media ? (
              <div className="media-buttons">
                <label htmlFor="file-upload" className={`media-btn file-upload-label ${isLoading ? 'disabled' : ''}`}>
                  📁 Subir imagen
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    disabled={isLoading}
                  />
                </label>
              </div>
            ) : (
              <div className="media-preview">
                <button
                  type="button"
                  onClick={removeMedia}
                  className="remove-media-btn"
                  disabled={isLoading}
                >
                  ✕ Eliminar
                </button>
                <img src={media} alt="Vista previa" className="media-preview-element" />
              </div>
            )}
          </div>

          <div className="modal-actions">

            <button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Creando...' : 'Crear Publicación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;