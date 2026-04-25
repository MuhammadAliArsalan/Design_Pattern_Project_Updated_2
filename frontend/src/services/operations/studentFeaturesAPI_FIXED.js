import { toast } from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiConnector";
import rzpLogo from "../../assets/Logo/rzp_logo.png";
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";

const {
  COURSE_PAYMENT_API,
  COURSE_VERIFY_API,
  SEND_PAYMENT_SUCCESS_EMAIL_API,
} = studentEndpoints;

const getPaymentMode = () => {
  const mode = (import.meta.env.VITE_APP_PAYMENT_MODE || "").toLowerCase();
  const razorpayKey = import.meta.env.VITE_APP_RAZORPAY_KEY;
  const stripeKey = import.meta.env.VITE_APP_STRIPE_PUBLISHABLE_KEY;

  if (mode === "demo") return "demo";
  if (mode === "stripe" && stripeKey && !stripeKey.includes("your_stripe")) {
    return "stripe";
  }
  if (mode === "razorpay" && razorpayKey) {
    return "razorpay";
  }

  // Auto-detect
  if (stripeKey && !stripeKey.includes("your_stripe")) return "stripe";
  if (razorpayKey && !razorpayKey.includes("your_razorpay_key"))
    return "razorpay";
  return "demo";
};

const isDemoPaymentMode = () => getPaymentMode() === "demo";
const isStripeMode = () => getPaymentMode() === "stripe";
const isRazorpayMode = () => getPaymentMode() === "razorpay";

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;

    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

// ================ buyCourse ================
export async function buyCourse(
  token,
  coursesId,
  userDetails,
  navigate,
  dispatch,
) {
  const toastId = toast.loading("Loading...");

  try {
    // initiate the order
    const orderResponse = await apiConnector(
      "POST",
      COURSE_PAYMENT_API,
      { coursesId },
      {
        Authorization: `Bearer ${token}`,
      },
    );

    if (!orderResponse.data.success) {
      throw new Error(orderResponse.data.message);
    }

    const orderData = orderResponse?.data?.data;
    if (!orderData) {
      throw new Error("Invalid order response from server");
    }

    // ════════════════ DEMO MODE ════════════════
    if (orderData.isDemo || isDemoPaymentMode()) {
      await verifyPayment(
        {
          razorpay_order_id: orderData.id,
          razorpay_payment_id: `pay_demo_${Date.now()}`,
          razorpay_signature: "demo_signature",
          coursesId,
        },
        token,
        navigate,
        dispatch,
      );
      return;
    }

    // ════════════════ STRIPE MODE ════════════════
    if (isStripeMode()) {
      // Load Stripe.js
      const stripeLoaded = await loadScript("https://js.stripe.com/v3/");
      if (!stripeLoaded) {
        toast.error("Stripe SDK failed to load");
        toast.dismiss(toastId);
        return;
      }

      const stripe = window.Stripe(
        import.meta.env.VITE_APP_STRIPE_PUBLISHABLE_KEY,
      );

      // Use test card for Stripe
      // Successful payment: 4242 4242 4242 4242
      // Failed payment: 4000 0000 0000 0002
      const testCardNumber = "4242424242424242";
      const testExpiry = "12/25";
      const testCVC = "123";

      // Create payment method with test card
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: {
          number: testCardNumber,
          exp_month: 12,
          exp_year: 25,
          cvc: testCVC,
        },
        billing_details: {
          name: userDetails.firstName,
          email: userDetails.email,
        },
      });

      if (error) {
        toast.error(`Card error: ${error.message}`);
        console.log("Card creation failed: ", error);
        toast.dismiss(toastId);
        return;
      }

      // Confirm payment with PaymentIntent
      const { error: confirmError, paymentIntent } =
        await stripe.confirmCardPayment(orderData.clientSecret, {
          payment_method: paymentMethod.id,
        });

      if (confirmError) {
        toast.error(`Payment error: ${confirmError.message}`);
        console.log("Payment confirmation failed: ", confirmError);
        toast.dismiss(toastId);
        return;
      }

      if (
        paymentIntent.status !== "succeeded" &&
        paymentIntent.status !== "processing"
      ) {
        toast.error(`Payment failed with status: ${paymentIntent.status}`);
        toast.dismiss(toastId);
        return;
      }

      // Send success email
      sendPaymentSuccessEmail(
        {
          stripe_payment_intent_id: paymentIntent.id,
        },
        orderData.amount,
        token,
      );

      // Verify payment
      await verifyPayment(
        {
          stripe_payment_intent_id: paymentIntent.id,
          coursesId,
        },
        token,
        navigate,
        dispatch,
      );
      toast.dismiss(toastId);
      return;
    }

    // ════════════════ RAZORPAY MODE ════════════════
    // load Razorpay script for real checkout flow
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js",
    );
    if (!res) {
      toast.error("RazorPay SDK failed to load");
      toast.dismiss(toastId);
      return;
    }

    const RAZORPAY_KEY = import.meta.env.VITE_APP_RAZORPAY_KEY;

    // options
    const options = {
      key: RAZORPAY_KEY,
      currency: orderData.currency,
      amount: orderData.amount,
      order_id: orderData.id,
      name: "StudyNotion",
      description: "Thank You for Purchasing the Course",
      image: rzpLogo,
      prefill: {
        name: userDetails.firstName,
        email: userDetails.email,
      },
      handler: function (response) {
        //send successful mail
        sendPaymentSuccessEmail(response, orderData.amount, token);
        //verifyPayment
        verifyPayment({ ...response, coursesId }, token, navigate, dispatch);
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    paymentObject.on("payment.failed", function (response) {
      toast.error("oops, payment failed");
      console.log("payment failed.... ", response.error);
    });
  } catch (error) {
    console.log("PAYMENT API ERROR.....", error);
    toast.error(
      error.response?.data?.message ||
        error.message ||
        "Could not make Payment",
    );
  }
  toast.dismiss(toastId);
}

// ================ send Payment Success Email ================
async function sendPaymentSuccessEmail(response, amount, token) {
  try {
    const emailData = {
      amount,
    };

    // Handle Stripe response
    if (response.stripe_payment_intent_id) {
      emailData.paymentId = response.stripe_payment_intent_id;
      emailData.orderId = response.stripe_payment_intent_id;
    }
    // Handle Razorpay response
    else {
      emailData.orderId = response.razorpay_order_id;
      emailData.paymentId = response.razorpay_payment_id;
    }

    await apiConnector("POST", SEND_PAYMENT_SUCCESS_EMAIL_API, emailData, {
      Authorization: `Bearer ${token}`,
    });
  } catch (error) {
    console.log("PAYMENT SUCCESS EMAIL ERROR....", error);
  }
}

// ================ verify payment ================
async function verifyPayment(bodyData, token, navigate, dispatch) {
  const toastId = toast.loading("Verifying Payment....");
  dispatch(setPaymentLoading(true));

  try {
    const response = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
      Authorization: `Bearer ${token}`,
    });

    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    toast.success("payment Successful, you are added to the course");
    navigate("/dashboard/enrolled-courses");
    dispatch(resetCart());
  } catch (error) {
    console.log("PAYMENT VERIFY ERROR....", error);
    toast.error("Could not verify Payment");
  }
  toast.dismiss(toastId);
  dispatch(setPaymentLoading(false));
}
