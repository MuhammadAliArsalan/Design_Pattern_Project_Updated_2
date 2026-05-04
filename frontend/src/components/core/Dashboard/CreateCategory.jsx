import { useState } from "react";
import { useSelector } from "react-redux";
import { createCategory } from "../../../services/operations/categoryAPI";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

export default function CreateCategory() {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    const result = await createCategory(formData, token);
    setLoading(false);

    if (result?.success) {
      setFormData({ name: "", description: "" });
      setTimeout(() => {
        navigate("/dashboard/instructor");
      }, 1500);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate("/dashboard/instructor")}
          className="flex items-center gap-2 text-richblack-100 hover:text-richblack-5 transition-colors"
        >
          <BiArrowBack className="text-2xl" />
          <span>Back</span>
        </button>
        <h1 className="text-3xl font-medium text-richblack-5">Create New Category</h1>
      </div>

      {/* Form Container */}
      <div className="bg-richblack-800 rounded-lg border border-richblack-700 p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-richblack-5 mb-2">
              Category Name <span className="text-pink-200">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter category name (e.g., Web Development)"
              className="w-full rounded-lg border border-richblack-500 bg-richblack-700 px-4 py-3 text-richblack-5 placeholder-richblack-400 focus:border-richblack-200 focus:outline-none focus:ring-2 focus:ring-richblack-200 focus:ring-opacity-20 transition-all"
              disabled={loading}
            />
            <p className="mt-1 text-xs text-richblack-300">
              Enter a descriptive name for the category
            </p>
          </div>

          {/* Category Description Field */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-richblack-5 mb-2">
              Category Description <span className="text-pink-200">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter a detailed description of the category"
              rows="5"
              className="w-full rounded-lg border border-richblack-500 bg-richblack-700 px-4 py-3 text-richblack-5 placeholder-richblack-400 focus:border-richblack-200 focus:outline-none focus:ring-2 focus:ring-richblack-200 focus:ring-opacity-20 transition-all resize-none"
              disabled={loading}
            />
            <p className="mt-1 text-xs text-richblack-300">
              Provide a clear description of what courses will be in this category
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-blue-600 px-6 py-3 text-center font-semibold text-richblack-900 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? "Creating..." : "Create Category"}
            </button>
            <button
              type="button"
              onClick={() => {
                setFormData({ name: "", description: "" });
                navigate("/dashboard/instructor");
              }}
              disabled={loading}
              className="rounded-lg border border-richblack-500 px-6 py-3 text-center font-semibold text-richblack-5 hover:bg-richblack-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Info Section */}
      <div className="bg-richblack-800 rounded-lg border border-richblack-700 p-6 max-w-2xl">
        <h3 className="text-lg font-semibold text-richblack-5 mb-4">📋 Tips for Creating Categories</h3>
        <ul className="space-y-3 text-richblack-300">
          <li className="flex gap-2">
            <span className="text-blue-400 font-bold">•</span>
            <span>Use clear, descriptive names that accurately represent the course content</span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-400 font-bold">•</span>
            <span>Categories help students find courses related to their interests</span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-400 font-bold">•</span>
            <span>Avoid creating duplicate categories - check existing ones first</span>
          </li>
          <li className="flex gap-2">
            <span className="text-blue-400 font-bold">•</span>
            <span>Write descriptions that clearly explain what courses belong in this category</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
