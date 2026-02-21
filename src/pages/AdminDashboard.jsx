import React, { useState, useEffect } from "react";
import { getProducts, getProductById } from "../api/products.api";
import { createProduct, updateProduct, deleteProduct } from "../api/admin.api";
import ProductForm from "../components/ProductForm";
import ConfirmModal from "../components/ConfirmModal";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list"); // 'list', 'add', 'edit'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const { logout } = useAuth();
  const navigate = useNavigate();

  // Load products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts(0, 50); // Fetch more for admin list
      if (Array.isArray(data)) setProducts(data);
      else if (data && data.content) setProducts(data.content);
      else setProducts([]);
    } catch (err) {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreate = async (formData) => {
    setActionLoading(true);
    try {
      await createProduct(formData);
      setView("list");
      await fetchProducts(); // Refresh list
    } catch (err) {
      alert(`Failed to create product: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (formData) => {
    if (!selectedProduct) return;
    setActionLoading(true);
    try {
      await updateProduct(selectedProduct.id, formData);
      setView("list");
      setSelectedProduct(null);
      await fetchProducts();
    } catch (err) {
      alert(`Failed to update product: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    setActionLoading(true);
    try {
      await deleteProduct(productToDelete.id);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      await fetchProducts();
    } catch (err) {
      alert(`Failed to delete product: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditClick = async (product) => {
    setActionLoading(true);
    try {
      // Fetch full product details including all images
      const fullProduct = await getProductById(product.id);
      setSelectedProduct(fullProduct);
      setView("edit");
    } catch (err) {
      alert(`Failed to fetch product details: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  if (loading && view === "list" && products.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <a
              href="/admin/api-test"
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              🧪 API Test Panel
            </a>
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* controls */}
        {view === "list" && (
          <div className="mb-6 flex justify-end">
            <button
              onClick={() => {
                setView("add");
                setSelectedProduct(null);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
            >
              + Add New Product
            </button>
          </div>
        )}

        {view === "list" ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {products.map((product) => (
                <li
                  key={product.id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={
                        product.thumbnailUrl ||
                        (Array.isArray(product.link)
                          ? product.link[0]
                          : product.link)
                      }
                      alt=""
                      className="h-12 w-12 rounded object-cover bg-gray-100"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        ID: {product.id} | ₹{product.basePrice || product.price}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleEditClick(product)}
                      className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(product)}
                      className="text-red-600 hover:text-red-900 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
              {products.length === 0 && (
                <li className="px-6 py-10 text-center text-gray-500">
                  No products found.
                </li>
              )}
            </ul>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                {view === "add" ? "Add New Product" : "Edit Product"}
              </h2>
              <button
                onClick={() => setView("list")}
                className="text-gray-600 hover:text-black"
              >
                Cancel
              </button>
            </div>

            <ProductForm
              initialData={selectedProduct}
              onSubmit={view === "add" ? handleCreate : handleUpdate}
              onCancel={() => setView("list")}
              loading={actionLoading}
            />
          </div>
        )}
      </main>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        loading={actionLoading}
      />
    </div>
  );
};

export default AdminDashboard;
