import React, { useState, useEffect } from "react";

const ProductForm = ({ initialData, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    shape: "",
    material: "",
    defaultSize: "",
    customizable: false,
    editorConfig: "",
  });
  const [images, setImages] = useState([]); // File objects
  const [existingImages, setExistingImages] = useState([]); // URLs
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price || "",
        shape: initialData.shape || "",
        material: initialData.material || "",
        defaultSize: initialData.defaultSize || "",
        customizable: Boolean(initialData.customizable),
        editorConfig: initialData.editorConfig
          ? JSON.stringify(initialData.editorConfig, null, 2)
          : "",
      });
      // Handle existing images - could be array or string
      const imgs = Array.isArray(initialData.link)
        ? initialData.link
        : initialData.link
          ? [initialData.link]
          : [];
      setExistingImages(imgs);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      setError("Name and Price are required.");
      return;
    }

    // editorConfig MUST be sent as a JSON string inside the single "data" field.
    // Validate it is valid JSON before sending (but keep it as a string).
    if (formData.editorConfig) {
      try {
        JSON.parse(formData.editorConfig);
      } catch (e) {
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
      editorConfig: formData.editorConfig || "{}", // backend expects string
    };

    const data = new FormData();
    data.append("data", JSON.stringify(payload));

    // Append new images
    images.forEach((file) => {
      data.append("images", file); // backend expects "images"
    });

    // For Update: we might need to handle keeping existing images vs replacing them.
    // The prompt says "Allow image replacement / addition".
    // Usually backend handles this. If I send new images, what happens to old ones?
    // User instruction: "Calls PUT /api/admin/products/{id} (multipart)".
    // I'll just send what I have.

    onSubmit(data);
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
          <input
            type="text"
            name="material"
            value={formData.material}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 border p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Shape
          </label>
          <input
            type="text"
            name="shape"
            value={formData.shape}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 border p-2"
          />
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

        <div className="flex items-center gap-3 pt-6">
          <input
            id="customizable"
            type="checkbox"
            name="customizable"
            checked={formData.customizable}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
          />
          <label
            htmlFor="customizable"
            className="text-sm font-medium text-gray-700"
          >
            Customizable
          </label>
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
        <label className="block text-sm font-medium text-gray-700">
          Images
        </label>
        {existingImages.length > 0 && (
          <div className="flex space-x-2 my-2 overflow-x-auto">
            {existingImages.map((src, i) => (
              <img
                key={i}
                src={src}
                alt="Existing"
                className="h-20 w-20 object-cover rounded border"
              />
            ))}
          </div>
        )}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
        />
        <p className="text-xs text-gray-500 mt-1">
          Uploading new images may replace existing ones depending on backend
          logic.
        </p>
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
