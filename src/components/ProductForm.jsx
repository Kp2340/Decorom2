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
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

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
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

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

      if (totalImages > 10) {
        setError(`Maximum 10 images allowed. You currently have ${existingImages.length + images.length} images.`);
        return;
      }

      setError("");
      setImages(prev => [...prev, ...files]);

      // Create preview URLs
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
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
    };

    const data = new FormData();
    data.append("data", JSON.stringify(payload));

    // Append new images
    images.forEach((file) => {
      data.append("images", file); // backend expects "images"
    });

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
        <label className="block text-sm font-medium text-gray-700">
          Editor Config (JSON)
        </label>
        <textarea
          name="editorConfig"
          rows={5}
          value={formData.editorConfig}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 border p-2 font-mono text-sm"
          placeholder='{"font": "Arial", ...}'
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Images ({existingImages.length + images.length}/10)
        </label>

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-600 mb-2">Existing Images</p>
            <div className="grid grid-cols-4 gap-2">
              {existingImages.map((img) => (
                <div key={img.id} className="relative group">
                  <img
                    src={img.url}
                    alt="Existing"
                    className="h-24 w-full object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(img.id)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete image"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Image Previews */}
        {images.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-600 mb-2">New Images (to be uploaded)</p>
            <div className="grid grid-cols-4 gap-2">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="h-24 w-full object-cover rounded border border-green-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove image"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="absolute bottom-1 left-1 bg-green-600 text-white text-xs px-1 rounded">
                    New
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* File Input */}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          disabled={existingImages.length + images.length >= 10}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 disabled:opacity-50"
        />
        <p className="text-xs text-gray-500 mt-1">
          Select up to 10 images. You can add more images or remove existing ones.
        </p>

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
