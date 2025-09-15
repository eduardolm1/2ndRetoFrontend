import React, { useState, useRef,useEffect } from "react";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/auth/authSlice';

const EditProfileModal = ({ user, onSave, onCancel }) => {
  const dispatch = useDispatch()
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    age: user?.age || "",
    config: {
      background: user?.config?.background || "",
      textColor: user?.config?.textColor || "#000000",
      fontFamily: user?.config?.fontFamily || "Arial",
      button: {
        background: user?.config?.button?.background || "#1976d2",
        textColor: user?.config?.button?.textColor || "#ffffff",
        fontFamily: user?.config?.button?.fontFamily || "Arial",
        borderRadius: user?.config?.button?.borderRadius || "4"
      }
    }
  });
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(user?.profileImage || "");
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        age: user.age || "",
        config: {
          background: user.config?.background || "",
          textColor: user.config?.textColor || "#000000",
          fontFamily: user.config?.fontFamily || "Arial",
          button: {
            background: user.config?.button?.background || "#1976d2",
            textColor: user.config?.button?.textColor || "#ffffff",
            fontFamily: user.config?.button?.fontFamily || "Arial",
            borderRadius: user.config?.button?.borderRadius || "4"
          }
        }
      });
      setPreview(user.profileImage || "");
    }
  }, [user]);
  const [backgroundType, setBackgroundType] = useState(
    user.config?.background?.startsWith('#') || user.config?.background?.startsWith('rgb') ? "color" : "image"
  );
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('config.')) {
      const path = name.split('.');
      if (path.length === 2) {
        setForm(prev => ({
          ...prev,
          config: {
            ...prev.config,
            [path[1]]: value
          }
        }));
      } else if (path.length === 3) {
        setForm(prev => ({
          ...prev,
          config: {
            ...prev.config,
            [path[1]]: {
              ...prev.config[path[1]],
              [path[2]]: value
            }
          }
        }));
      }
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleColorChange = (field, value, isButton = false) => {
    if (isButton) {
      setForm(prev => ({
        ...prev,
        config: {
          ...prev.config,
          button: {
            ...prev.config.button,
            [field]: value
          }
        }
      }));
    } else {
      setForm(prev => ({
        ...prev,
        config: {
          ...prev.config,
          [field]: value
        }
      }));
    }
  };

  const handleBackgroundImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setForm(prev => ({
        ...prev,
        config: {
          ...prev.config,
          background: imageUrl
        }
      }));
    }
  };

  const handleBackgroundTypeChange = (type) => {
    setBackgroundType(type);
    if (type === "color") {
      setForm(prev => ({
        ...prev,
        config: {
          ...prev.config,
          background: "#ffffff"
        }
      }));
    } else {
      setForm(prev => ({
        ...prev,
        config: {
          ...prev.config,
          background: ""
        }
      }));
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("age", form.age);
    if (profileImage) formData.append("image", profileImage);
    if (user && user._id) {
      formData.append("_id", user._id);
    }
    formData.append("config", JSON.stringify(form.config));
    onSave(formData);
  };

  const onLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal modalProfile" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onCancel}>✕</button>
        <h2>Tu perfil</h2>

        <div className="modal-tabs">
          <button
            className={activeTab === "profile" ? "active" : ""}
            onClick={() => setActiveTab("profile")}
            type="button"
          >
            Perfil
          </button>
          <button
            className={activeTab === "customization" ? "active" : ""}
            onClick={() => setActiveTab("customization")}
            type="button"
          >
            Personalización
          </button>
        </div>

        <form className="formRegister formProfileModal" onSubmit={handleSubmit}>
          {activeTab === "profile" && (
            <div className="tab-content">
              <div className="edit-profile-image">
                <div className="image-preview">
                  {preview ? (
                    <img src={preview} alt="preview" />
                  ) : (
                    <div className="image-placeholder">Sin imagen</div>
                  )}
                </div>
                <label className="file-upload-label">
                  <span>Cambiar imagen</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              <div className="form-group-profile">
                <p>Nombre:</p>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                />
              </div>

              <div className="form-group-profile">
                <p>Edad:</p>
                <input
                  name="age"
                  type="number"
                  value={form.age}
                  onChange={handleChange}
                  min="1"
                  max="120"
                />
              </div>
            </div>
          )}

          {activeTab === "customization" && (
            <div className="tab-content">
              <h3>Personaliza tu perfil</h3>

              <div className="form-group">
                <label>Tipo de fondo:</label>
                <select value={backgroundType} onChange={e => handleBackgroundTypeChange(e.target.value)}>
                  <option value="color">Color</option>
                  <option value="image">Imagen</option>
                </select>

                {backgroundType === "color" ? (
                  <div className="background-color-input">
                    <div className="color-input-group">
                      <input
                        type="text"
                        name="config.background"
                        value={form.config.background}
                        onChange={handleChange}
                        placeholder="#hex, rgb()"
                      />
                      <input
                        type="color"
                        value={form.config.background && form.config.background.startsWith('#') ? form.config.background : '#ffffff'}
                        onChange={(e) => handleColorChange('background', e.target.value)}
                        className="color-picker"
                      />
                    </div>

                  </div>
                ) : (
                  <div className="background-image-input">
                    <div className="image-upload-container">
                      <label className="file-upload-label full-width">
                        <span>Seleccionar imagen</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleBackgroundImageChange}
                          style={{ display: 'none' }}
                          ref={fileInputRef}
                        />
                      </label>
                      {form.config.background && (
                        <div className="background-image-preview">
                          <img src={form.config.background} alt="Vista previa del fondo" />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Color de texto:</label>
                <div className="color-input-group">
                  <input
                    type="text"
                    name="config.textColor"
                    value={form.config.textColor}
                    onChange={handleChange}
                    placeholder="#000000"
                  />
                  <input
                    type="color"
                    value={form.config.textColor}
                    onChange={(e) => handleColorChange('textColor', e.target.value)}
                    className="color-picker"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Fuente:</label>
                <select
                  name="config.fontFamily"
                  value={form.config.fontFamily}
                  onChange={handleChange}
                >
                  <option value="Arial">Arial</option>
                  <option value="Helvetica">Helvetica</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Courier New">Courier New</option>
                  <option value="Verdana">Verdana</option>
                  <option value="Impact">Impact</option>
                  <option value="Comic Sans MS">Comic Sans MS</option>
                  <option value="'Roboto', sans-serif">Roboto</option>
                  <option value="'Open Sans', sans-serif">Open Sans</option>
                </select>
              </div>

              <h4>Botón principal</h4>

              <div className="form-group">
                <label>Fondo del botón:</label>
                <div className="color-input-group">
                  <input
                    type="text"
                    name="config.button.background"
                    value={form.config.button.background}
                    onChange={handleChange}
                    placeholder="#1976d2"
                  />
                  <input
                    type="color"
                    value={form.config.button.background}
                    onChange={(e) => handleColorChange('background', e.target.value, true)}
                    className="color-picker"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Color del texto:</label>
                <div className="color-input-group">
                  <input
                    type="text"
                    name="config.button.textColor"
                    value={form.config.button.textColor}
                    onChange={handleChange}
                    placeholder="#ffffff"
                  />
                  <input
                    type="color"
                    value={form.config.button.textColor}
                    onChange={(e) => handleColorChange('textColor', e.target.value, true)}
                    className="color-picker"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Fuente del botón:</label>
                <select
                  name="config.button.fontFamily"
                  value={form.config.button.fontFamily}
                  onChange={handleChange}
                >
                  <option value="Arial">Arial</option>
                  <option value="Helvetica">Helvetica</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Verdana">Verdana</option>
                  <option value="'Roboto', sans-serif">Roboto</option>
                  <option value="'Open Sans', sans-serif">Open Sans</option>
                </select>
              </div>

              <div className="form-group">
                <label>Border radius (px):</label>
                <input
                  type="range"
                  name="config.button.borderRadius"
                  value={form.config.button.borderRadius}
                  onChange={handleChange}
                  min="0"
                  max="50"
                />
                <span className="range-value">{form.config.button.borderRadius}px</span>
              </div>

              <div className="preview-section">
                <h5>Vista previa del botón:</h5>
                <button
                  type="button"
                  className="preview-button"
                  style={{
                    backgroundColor: form.config.button.background,
                    color: form.config.button.textColor,
                    fontFamily: form.config.button.fontFamily,
                    borderRadius: `${form.config.button.borderRadius}px`,
                    padding: '10px 20px',
                    border: 'none',
                    cursor: 'default'
                  }}
                >
                  Botón de ejemplo
                </button>
              </div>
            </div>
          )}

          <div className="form-actions">
            <button type="submit">Guardar cambios</button>

          </div>

        </form>
        <button className="btnLogout" onClick={onLogout}>Logout</button>

      </div>
    </div>
  );
};

export default EditProfileModal;