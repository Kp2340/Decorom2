import React, { useState, useEffect } from "react";
import { deleteProductImage } from "../api/admin.api";

const ProductForm = ({ initialData, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    shape: "",
    material: "",
    defaultSize: "",
    // Must default to TRUE: `customizable` now decides the pricing model, so a false default
    // would silently make every newly created product a fixed-price SKU.
    customizable: true,
    featured: false,
    editorConfig: "",
  });
  const [images, setImages] = useState([]); // File objects
  const [imagePreviews, setImagePreviews] = useState([]); // Preview URLs for new images
  const [existingImages, setExistingImages] = useState([]); // {id, url} objects
  const [videoFile, setVideoFile] = useState(null); // File object for video
  const [videoPreview, setVideoPreview] = useState(null); // Preview URL for new video
  const [existingVideo, setExistingVideo] = useState(initialData?.videoUrl || null);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const [draggedItem, setDraggedItem] = useState(null); // { index, type: 'existing' | 'new' }

  // Drag and Drop Handlers
  const handleDragStart = (e, index, type) => {
    setDraggedItem({ index, type });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetIndex, type) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.type !== type || draggedItem.index === targetIndex) return;

    if (type === "existing") {
      setExistingImages((prev) => {
        const copy = [...prev];
        const [moved] = copy.splice(draggedItem.index, 1);
        copy.splice(targetIndex, 0, moved);
        return copy;
      });
    } else if (type === "new") {
      setImages((prev) => {
        const copy = [...prev];
        const [moved] = copy.splice(draggedItem.index, 1);
        copy.splice(targetIndex, 0, moved);
        return copy;
      });
      setImagePreviews((prev) => {
        const copy = [...prev];
        const [moved] = copy.splice(draggedItem.index, 1);
        copy.splice(targetIndex, 0, moved);
        return copy;
      });
    }
    setDraggedItem(null);
  };

  // Move existing images left/right
  const moveExistingImage = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= existingImages.length) return;
    setExistingImages((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  // Move newly uploaded images left/right
  const moveNewImage = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    setImages((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
    setImagePreviews((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  // Handle single video selection (max 1 video validation)
  const handleVideoChange = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length > 1) {
        setError("Only 1 showcase video file is allowed per product.");
        return;
      }
      const file = files[0];
      if (!file) return;

      if (!file.type.startsWith("video/")) {
        setError("Please select a valid video file (.mp4, .webm, .mov).");
        return;
      }

      if (file.size > 20 * 1024 * 1024) {
        setError("Video size must be less than 20MB.");
        return;
      }

      setError("");
      setVideoFile(file);
      if (videoPreview) URL.revokeObjectURL(videoPreview);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const removeVideo = () => {
    setVideoFile(null);
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setVideoPreview(null);
    setExistingVideo(null);
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price || initialData.basePrice || "",
        shape: initialData.shape || "",
        material: initialData.material || "",
        defaultSize: initialData.defaultSize || "",
        customizable: Boolean(initialData.customizable),
        featured: Boolean(initialData.featured),
        editorConfig: initialData.editorConfig
          ? JSON.stringify(initialData.editorConfig, null, 2)
          : "",
      });

      // Handle existing images with IDs - backend returns 'images' array
      if (initialData.images && Array.isArray(initialData.images)) {
        setExistingImages(initialData.images.map(img => ({
          id: img.id,
          url: img.imageUrl || img.url
        })));
      } else if (initialData.thumbnailUrl) {
        // Fallback: Single thumbnail from list view
        setExistingImages([{ id: 'thumbnail', url: initialData.thumbnailUrl }]);
      } else if (Array.isArray(initialData.link)) {
        setExistingImages(initialData.link.map((url, idx) => ({
          id: `link-${idx}`,
          url
        })));
      } else if (initialData.link) {
        setExistingImages([{ id: 'link-0', url: initialData.link }]);
      }
    }
  }, [initialData]);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
      if (videoPreview) URL.revokeObjectURL(videoPreview);
    };
  }, [imagePreviews, videoPreview]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const totalImages = existingImages.length + images.length + files.length;

      if (totalImages > 5) {
        setError(`Maximum 5 images allowed. You currently have ${existingImages.length + images.length} images.`);
        return;
      }

      const totalBytes = [...images, ...files].reduce((sum, f) => sum + f.size, 0);
      if (totalBytes > 20 * 1024 * 1024) {
        setError("Total image upload size exceeds 20MB limit.");
        return;
      }

      setError("");
      setImages((prev) => [...prev, ...files]);

      // Create preview URLs
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeNewImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));

    // Revoke and remove preview URL
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (imageId) => {
    if (!initialData?.id) {
      // If no product ID, just remove from state
      setExistingImages(prev => prev.filter(img => img.id !== imageId));
      return;
    }

    const imageIdStr = imageId.toString();
    // Check if this is a temporary/fallback ID (not from backend)
    if (imageIdStr.startsWith('temp-') || imageIdStr.startsWith('link-') || imageIdStr === 'thumbnail') {
      // Just remove from state, no backend call needed
      setExistingImages(prev => prev.filter(img => img.id !== imageId));
      return;
    }

    // Real backend image - confirm and delete via API
    const confirmed = window.confirm("Delete this image permanently from the product?");
    if (!confirmed) return;

    try {
      await deleteProductImage(initialData.id, imageId);
      setExistingImages(prev => prev.filter(img => img.id !== imageId));
    } catch (err) {
      setError(`Failed to delete image: ${err.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.price) {
      setError("Name and Price are required.");
      return;
    }

    if (existingImages.length === 0 && images.length === 0) {
      setError("At least one image is required.");
      return;
    }

    // editorConfig MUST be sent as a JSON string inside the single "data" field.
    // Validate it is valid JSON before sending (but keep it as a string).
    if (formData.editorConfig) {
      try {
        JSON.parse(formData.editorConfig);
      } catch {
        setError("Invalid JSON in Editor Config");
        return;
      }
    }

    const payload = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      shape: formData.shape,
      material: formData.material,
      ...(formData.defaultSize ? { defaultSize: formData.defaultSize } : {}),
      customizable: Boolean(formData.customizable),
      featured: Boolean(formData.featured),
      editorConfig: formData.editorConfig || "{}", // backend expects string
      imageOrder: existingImages
        .map((img) => img.id)
        .filter((id) => id && !String(id).startsWith("temp-") && !String(id).startsWith("link-")),
    };

    const data = new FormData();
    data.append("data", JSON.stringify(payload));

    // Append new images
    images.forEach((file) => {
      data.append("images", file); // backend expects "images"
    });

    // Append video if selected (max 1 video)
    if (videoFile) {
      data.append("video", videoFile);
    }

    try {
      setUploadProgress(10);
      await onSubmit(data);
      setUploadProgress(100);
    } catch (err) {
      setError(err.message || "Failed to save product");
      setUploadProgress(0);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-lg shadow"
    >
      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 border p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price (₹)
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 border p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Material
          </label>
          <select
            name="material"
            value={formData.material}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 border p-2"
          >
            <option value="">Select Material</option>
            <option value="Acrylic">Acrylic</option>
            <option value="ACP">ACP</option>
            <option value="Wooden">Wooden</option>
            <option value="MS">MS</option>
            <option value="SS">SS</option>
            <option value="Resin">Resin</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Shape
          </label>
          <select
            name="shape"
            value={formData.shape}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 border p-2"
          >
            <option value="">Select Shape</option>
            <option value="Square">Square</option>
            <option value="Rectangle">Rectangle</option>
            <option value="Round">Round</option>
            <option value="Oval">Oval</option>
            <option value="Capsule">Capsule</option>
            <option value="Unique">Unique</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Default Size (optional)
          </label>
          <input
            type="text"
            name="defaultSize"
            value={formData.defaultSize}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 border p-2"
            placeholder="e.g. 12x8"
          />
        </div>

        <div className="flex flex-col gap-3 pt-6">
          <div className="flex items-center gap-3">
            <input
              id="customizable"
              type="checkbox"
              name="customizable"
              checked={formData.customizable}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
            />
            <div className="flex flex-col">
              <label htmlFor="customizable" className="text-sm font-medium text-gray-700">
                Customisable size &amp; price
              </label>
              <span className="text-xs text-gray-500">
                Leave checked for normal products (price calculated from size). <b>Uncheck</b> for
                a fixed-price product: it then sells for exactly the Price above at exactly the
                Default Size, the customer cannot change the size, and ₹150 delivery applies.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              id="featured"
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-400"
            />
            <label htmlFor="featured" className="text-sm font-medium text-gray-700">
              ⭐ Best Seller (Featured)
            </label>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 border p-2"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-700">
            Editor Config (JSON)
          </label>
          <button
            type="button"
            onClick={() => {
              const samplePreset = {
                enabled: true,
                defaultWidth: 12,
                defaultHeight: 8,
                fonts: ["Cinzel", "Great Vibes", "Montserrat", "Playfair Display"],
                textZones: [
                  { id: "family_name", label: "Family Name / Main Text", placeholder: "The Patels", default: "The Patels" },
                  { id: "house_number", label: "House Number / Flat No.", placeholder: "A-302", default: "A-302" }
                ]
              };
              setFormData((prev) => ({
                ...prev,
                editorConfig: JSON.stringify(samplePreset, null, 2),
              }));
            }}
            className="text-xs text-pink-600 hover:text-pink-700 font-semibold bg-pink-50 hover:bg-pink-100 px-2 py-1 rounded transition-colors"
          >
            ✨ Load Sample Customizer Preset
          </button>
        </div>
        <textarea
          name="editorConfig"
          rows={6}
          value={formData.editorConfig}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 border p-2 font-mono text-sm"
          placeholder='{"enabled": true, "textZones": [...] }'
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Images ({existingImages.length + images.length}/5)
        </label>

        {/* Existing Images with Drag & Drop + Reordering */}
        {existingImages.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-600 mb-2">
              Existing Images (🖐️ Drag &amp; Drop or use ◀ ▶ to reorder. #1 = Main Thumbnail)
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {existingImages.map((img, idx) => (
                <div
                  key={img.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, idx, "existing")}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, idx, "existing")}
                  className={`relative group border rounded-lg overflow-hidden bg-gray-50 shadow-sm p-1 cursor-grab active:cursor-grabbing transition-transform ${
                    draggedItem?.type === "existing" && draggedItem?.index === idx ? "opacity-40 scale-95 border-dashed border-pink-500" : ""
                  }`}
                >
                  <div className="relative h-24 w-full">
                    <img
                      src={img.url}
                      alt={`Image ${idx + 1}`}
                      className="h-full w-full object-cover rounded pointer-events-none"
                    />
                    <span className="absolute top-1 left-1 bg-black/75 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {idx === 0 ? "★ #1 Main" : `#${idx + 1}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeExistingImage(img.id)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-90 hover:opacity-100 transition-opacity"
                      title="Delete image"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  {/* Reorder Buttons */}
                  <div className="flex items-center justify-between mt-1 px-1 text-xs">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveExistingImage(idx, -1)}
                      className="px-2 py-0.5 bg-gray-200 hover:bg-gray-300 disabled:opacity-30 rounded text-gray-800 font-bold"
                      title="Move Left"
                    >
                      ◀
                    </button>
                    <span className="text-[10px] text-gray-500 font-medium">Pos {idx + 1}</span>
                    <button
                      type="button"
                      disabled={idx === existingImages.length - 1}
                      onClick={() => moveExistingImage(idx, 1)}
                      className="px-2 py-0.5 bg-gray-200 hover:bg-gray-300 disabled:opacity-30 rounded text-gray-800 font-bold"
                      title="Move Right"
                    >
                      ▶
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Image Previews with Drag & Drop + Reordering */}
        {images.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-green-700 mb-2">
              New Images to Upload (🖐️ Drag &amp; Drop or use ◀ ▶ to adjust order)
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {imagePreviews.map((preview, index) => {
                const globalIndex = existingImages.length + index;
                return (
                  <div
                    key={index}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index, "new")}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index, "new")}
                    className={`relative group border border-green-400 rounded-lg overflow-hidden bg-green-50 shadow-sm p-1 cursor-grab active:cursor-grabbing transition-transform ${
                      draggedItem?.type === "new" && draggedItem?.index === index ? "opacity-40 scale-95 border-dashed border-green-600" : ""
                    }`}
                  >
                    <div className="relative h-24 w-full">
                      <img
                        src={preview}
                        alt={`New Preview ${index + 1}`}
                        className="h-full w-full object-cover rounded pointer-events-none"
                      />
                      <span className="absolute top-1 left-1 bg-green-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        {globalIndex === 0 ? "★ #1 Main" : `#${globalIndex + 1}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-90 hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    {/* Reorder Buttons */}
                    <div className="flex items-center justify-between mt-1 px-1 text-xs">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveNewImage(index, -1)}
                        className="px-2 py-0.5 bg-green-200 hover:bg-green-300 disabled:opacity-30 rounded text-green-900 font-bold"
                        title="Move Left"
                      >
                        ◀
                      </button>
                      <span className="text-[10px] text-green-700 font-medium">New #{index + 1}</span>
                      <button
                        type="button"
                        disabled={index === images.length - 1}
                        onClick={() => moveNewImage(index, 1)}
                        className="px-2 py-0.5 bg-green-200 hover:bg-green-300 disabled:opacity-30 rounded text-green-900 font-bold"
                        title="Move Right"
                      >
                        ▶
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* File Input */}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          disabled={existingImages.length + images.length >= 5}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 disabled:opacity-50"
        />
        <p className="text-xs text-gray-500 mt-1">
          Select up to 5 images (max 20MB total combined). Position #1 will automatically serve as the primary thumbnail.
        </p>
      </div>

      {/* Video Upload Section (Max 1 Video, Max 20MB) */}
      <div className="pt-4 border-t border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Product Showcase Video (Max 1 Video, max 20MB)
        </label>
        
        {videoPreview || existingVideo ? (
          <div className="relative max-w-sm rounded-lg overflow-hidden border border-gray-300 bg-black p-2">
            <video
              src={videoPreview || existingVideo}
              controls
              className="w-full h-48 object-contain rounded"
            />
            <div className="flex items-center justify-between mt-2 text-xs text-white px-1">
              <span className="text-green-400 font-medium">
                {videoPreview ? "📹 New Video Selected" : "📹 Active Video"}
              </span>
              <button
                type="button"
                onClick={removeVideo}
                className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition"
              >
                Remove Video
              </button>
            </div>
          </div>
        ) : (
          <div>
            <input
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              onChange={handleVideoChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Upload 1 video file (.mp4 or .webm, max 20MB) to display in the Product Showcase on the product page.
            </p>
          </div>
        )}

        {/* Upload Progress */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mt-2">
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-pink-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Uploading... {uploadProgress}%</p>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Product"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
