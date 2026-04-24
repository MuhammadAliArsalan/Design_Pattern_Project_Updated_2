import React from 'react'
// import { toast } from "react-hot-toast"
import { apiConnector } from '../apiConnector';
import { categoryPageData } from '../apis';


// ================ get Category Page Data  ================
export const getCategoryPageData = async (categoryId) => {
  // const toastId = toast.loading("Loading...");
  let result = [];
  try {
    const response = await apiConnector("POST", categoryPageData.CATEGORYPAGEDATA_API,
      { categoryId: categoryId, });

    if (!response?.data?.success)
      throw new Error("Could not Fetch Category page data");

    console.log("CATEGORY PAGE DATA API RESPONSE............", response)
    result = response?.data?.data;
    console.log("CATEGORY PAGE DATA API RESULT............", result)

  }
  catch (error) {
    console.log("CATEGORY PAGE DATA API ERROR....", error);
    // toast.error(error.response?.data.message);
    result = error.response?.data.data;
  }
  // toast.dismiss(toastId);
  return result;
}

