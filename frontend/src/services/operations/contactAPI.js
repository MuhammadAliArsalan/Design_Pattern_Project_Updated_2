import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { contactusEndpoint } from "../apis";

const { CONTACT_US_API } = contactusEndpoint;

export const sendContactMessage = async (data) => {
  const toastId = toast.loading("Sending message...");
  let result = null;

  try {
    const response = await apiConnector("POST", CONTACT_US_API, data, {
      "Content-Type": "application/json",
    });

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Unable to send message");
    }

    toast.success(response.data.message || "Message sent successfully!");
    result = response.data;
  } catch (error) {
    console.log("CONTACT_US_API ERROR............", error);
    toast.error(error?.message || "Failed to send message");
  } finally {
    toast.dismiss(toastId);
  }

  return result;
};
