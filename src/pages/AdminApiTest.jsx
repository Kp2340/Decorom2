import React, { useState } from "react";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  addProductImages,
  deleteProductImage,
} from "../api/admin.api";
import { getProducts, getProductById } from "../api/products.api";

const AdminApiTest = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [testProductId, setTestProductId] = useState(null);

  const addLog = (message, type = "info") => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [
      ...prev,
      { timestamp, message, type }, // type: 'info', 'success', 'error'
    ]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  // Test 1: Fetch Product List
  const testGetProducts = async () => {
    addLog("🔄 Testing GET /api/products...");
    try {
      const data = await getProducts(0, 10);
      addLog(
        `✅ Success: Fetched ${Array.isArray(data) ? data.length : data?.content?.length || 0} products`,
        "success",
      );
      addLog(`Response: ${JSON.stringify(data, null, 2)}`, "info");
    } catch (error) {
      addLog(`❌ Error: ${error.message}`, "error");
    }
  };

  // Test 2: Fetch Product Detail
  const testGetProductById = async () => {
    if (!testProductId) {
      addLog("⚠️ Please create a product first to get test ID", "error");
      return;
    }
    addLog(`🔄 Testing GET /api/products/${testProductId}...`);
    try {
      const data = await getProductById(testProductId);
      addLog(`✅ Success: Fetched product "${data.name}"`, "success");
      addLog(`Response: ${JSON.stringify(data, null, 2)}`, "info");
    } catch (error) {
      addLog(`❌ Error: ${error.message}`, "error");
    }
  };

  // Test 3: Create Product
  const testCreateProduct = async () => {
    addLog("🔄 Testing POST /api/admin/products...");
    try {
      // Create test image blob
      const canvas = document.createElement("canvas");
      canvas.width = 200;
      canvas.height = 200;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#FF6B9D";
      ctx.fillRect(0, 0, 200, 200);
      ctx.fillStyle = "white";
      ctx.font = "20px Arial";
      ctx.fillText("Test Image 1", 50, 100);

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png"),
      );
      const file = new File([blob], "test-image.png", { type: "image/png" });

      // Create FormData
      const formData = new FormData();
      const productData = {
        name: `Test Product ${Date.now()}`,
        description: "This is a test product created by API integration test",
        price: 499,
        shape: "Rectangle",
        material: "Acrylic",
        defaultSize: "12x8",
        customizable: true,
        editorConfig: JSON.stringify({
          font: "Arial",
          textColor: "#000000",
        }),
      };

      formData.append("data", JSON.stringify(productData));
      formData.append("images", file);

      const response = await createProduct(formData);
      const productId = response?.id || response?.data?.id;

      addLog(`✅ Success: Product created with ID: ${productId}`, "success");
      addLog(`Response: ${JSON.stringify(response, null, 2)}`, "info");

      return productId;
    } catch (error) {
      addLog(`❌ Error: ${error.message}`, "error");
      if (error.response) {
        addLog(
          `Backend response: ${JSON.stringify(error.response, null, 2)}`,
          "error",
        );
      }
      return null;
    }
  };

  // Test 4: Update Product
  const testUpdateProduct = async () => {
    if (!testProductId) {
      addLog("⚠️ Please create a product first to get test ID", "error");
      return;
    }
    addLog(`🔄 Testing PUT /api/admin/products/${testProductId}...`);
    try {
      const formData = new FormData();
      const updatedData = {
        name: `Updated Test Product ${Date.now()}`,
        description: "This product has been updated",
        price: 599,
        shape: "Circle",
        material: "Metal",
        customizable: false,
        editorConfig: "{}",
      };

      formData.append("data", JSON.stringify(updatedData));

      const response = await updateProduct(testProductId, formData);
      addLog(`✅ Success: Product ${testProductId} updated`, "success");
      addLog(`Response: ${JSON.stringify(response, null, 2)}`, "info");
    } catch (error) {
      addLog(`❌ Error: ${error.message}`, "error");
    }
  };

  // Test 5: Add Product Images
  const testAddProductImages = async () => {
    if (!testProductId) {
      addLog("⚠️ Please create a product first to get test ID", "error");
      return;
    }
    addLog(`🔄 Testing POST /api/admin/products/${testProductId}/images...`);
    try {
      // Create another test image
      const canvas = document.createElement("canvas");
      canvas.width = 200;
      canvas.height = 200;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#4CAF50";
      ctx.fillRect(0, 0, 200, 200);
      ctx.fillStyle = "white";
      ctx.font = "20px Arial";
      ctx.fillText("Extra Image", 50, 100);

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png"),
      );
      const file = new File([blob], "extra-image.png", { type: "image/png" });

      const formData = new FormData();
      formData.append("images", file);

      const response = await addProductImages(testProductId, formData);
      addLog(
        `✅ Success: Additional images added to product ${testProductId}`,
        "success",
      );
      addLog(`Response: ${JSON.stringify(response, null, 2)}`, "info");
    } catch (error) {
      addLog(`❌ Error: ${error.message}`, "error");
    }
  };

  // Test 6: Delete Product Image
  const testDeleteProductImage = async () => {
    if (!testProductId) {
      addLog("⚠️ Please create a product first to get test ID", "error");
      return;
    }
    addLog(
      `⚠️ Manual step required: Delete product image via DELETE /api/admin/products/{productId}/images/{imageId}`,
      "info",
    );
    addLog(
      "You need to get the image ID from the product details first",
      "info",
    );
  };

  // Test 7: Delete Product
  const testDeleteProduct = async () => {
    if (!testProductId) {
      addLog("⚠️ Please create a product first to get test ID", "error");
      return;
    }
    addLog(`🔄 Testing DELETE /api/admin/products/${testProductId}...`);
    try {
      await deleteProduct(testProductId);
      addLog(`✅ Success: Product ${testProductId} deleted`, "success");
      setTestProductId(null);
    } catch (error) {
      addLog(`❌ Error: ${error.message}`, "error");
    }
  };

  // Run All Tests
  const runAllTests = async () => {
    setLoading(true);
    clearLogs();
    addLog("🚀 Starting comprehensive API test suite...", "info");

    await testGetProducts();
    await new Promise((r) => setTimeout(r, 500));

    const createdProductId = await testCreateProduct();
    setTestProductId(createdProductId);
    await new Promise((r) => setTimeout(r, 1000));

    if (createdProductId) {
      addLog(
        `Using product ID ${createdProductId} for remaining tests...`,
        "info",
      );

      await testGetProductById();
      await new Promise((r) => setTimeout(r, 500));

      await testUpdateProduct();
      await new Promise((r) => setTimeout(r, 500));

      await testAddProductImages();
      await new Promise((r) => setTimeout(r, 500));

      await testGetProductById();
      await new Promise((r) => setTimeout(r, 500));

      const confirmDelete = window.confirm(
        "All tests completed. Delete the test product?",
      );
      if (confirmDelete) {
        await testDeleteProduct();
      }
    }

    addLog("✨ Test suite completed!", "success");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin API Integration Test Panel
          </h1>
          <p className="text-gray-600 mb-6">
            Test all backend product APIs and verify functionality
          </p>

          {testProductId && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-800">
                <strong>Test Product ID:</strong> {testProductId}
              </p>
            </div>
          )}

          {/* Control Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <button
              onClick={testGetProducts}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
            >
              Test GET Products
            </button>
            <button
              onClick={testGetProductById}
              disabled={loading || !testProductId}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
            >
              Test GET Product
            </button>
            <button
              onClick={testCreateProduct}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm"
            >
              Test CREATE
            </button>
            <button
              onClick={testUpdateProduct}
              disabled={loading || !testProductId}
              className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50 text-sm"
            >
              Test UPDATE
            </button>
            <button
              onClick={testAddProductImages}
              disabled={loading || !testProductId}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 text-sm"
            >
              Test Add Images
            </button>
            <button
              onClick={testDeleteProductImage}
              disabled={loading || !testProductId}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50 text-sm"
            >
              Test Delete Image
            </button>
            <button
              onClick={testDeleteProduct}
              disabled={loading || !testProductId}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 text-sm"
            >
              Test DELETE
            </button>
            <button
              onClick={runAllTests}
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 text-sm font-semibold"
            >
              🚀 Run All Tests
            </button>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Test Logs</h2>
            <button
              onClick={clearLogs}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border rounded"
            >
              Clear Logs
            </button>
          </div>

          {/* Logs Display */}
          <div className="bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto font-mono text-sm">
            {logs.length === 0 ? (
              <p className="text-gray-500">
                No logs yet. Click a test button to start.
              </p>
            ) : (
              logs.map((log, index) => (
                <div
                  key={index}
                  className={`mb-2 ${
                    log.type === "error"
                      ? "text-red-400"
                      : log.type === "success"
                        ? "text-green-400"
                        : "text-gray-300"
                  }`}
                >
                  <span className="text-gray-500">[{log.timestamp}]</span>{" "}
                  {log.message}
                </div>
              ))
            )}
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <h3 className="font-semibold text-yellow-900 mb-2">
              Testing Instructions:
            </h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>
                1. Click <strong>"Run All Tests"</strong> to execute the full
                test suite automatically
              </li>
              <li>2. Or click individual test buttons to test specific APIs</li>
              <li>
                3. Check the logs for success/error messages and API responses
              </li>
              <li>
                4. Test Product ID is saved after creation for subsequent tests
              </li>
              <li>
                5. Make sure you're logged in as admin before running tests
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminApiTest;
