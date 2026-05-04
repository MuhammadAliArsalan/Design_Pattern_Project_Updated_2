import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { categories } from "../apis";

const { CATEGORIES_API, CREATE_CATEGORY_API } = categories;

// ================ Fetch All Categories ================
export const fetchAllCategories = async () => {
  let result = [];

  try {
    const response = await apiConnector("GET", CATEGORIES_API);
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Categories");
    }
    result = response?.data?.data || [];
  } catch (error) {
    console.log("FETCH_CATEGORIES_API ERROR............", error);
    toast.error(error.message);
  }
  return result;
};

// ================ Create Category ================
export const createCategory = async (data, token) => {
  const toastId = toast.loading("Creating category...");
  let result = null;

  try {
    const response = await apiConnector("POST", CREATE_CATEGORY_API, data, {
      Authorization: `Bearer ${token}`,
    });

    console.log("CREATE_CATEGORY_API RESPONSE............", response);

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Failed to create category");
    }

    toast.success("Category created successfully!");
    result = response?.data;
  } catch (error) {
    console.log("CREATE_CATEGORY_API ERROR............", error);
    toast.error(error.message || "Error creating category");
  }

  toast.dismiss(toastId);
  return result;
};
