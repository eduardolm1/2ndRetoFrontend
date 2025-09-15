import React, { useState, useEffect } from "react";

const EditPostModal = ({ post, onSave, onCancel }) => {
  const [content, setContent] = useState(post.content);
  const [name, setName] = useState(post.name);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onCancel]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) {
      alert("Nombre y contenido son requeridos");
      return;
    }

    onSave({
      ...post,
      name,
      content
    });
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <button className="modal-close-btn" onClick={onCancel}>✕</button>
        <div className="modal-header">
          <h2>Editar Publicación</h2>
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
          />
          <label htmlFor="content">Contenido:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="¿Qué estás pensando?"
            required
          />
          <div className="modal-actions">

            <button type="submit">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostModal;