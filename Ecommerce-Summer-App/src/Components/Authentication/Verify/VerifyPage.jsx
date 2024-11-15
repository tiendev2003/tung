import React from "react";
import { toast } from "react-hot-toast";
import baseApi from "../../../utils/api";

const VerifyPage = () => {
  // lấy token từ url
  const token = window.location.pathname.split("/")[2];

  const verifyEmail = async () => {
    try {
      const data = await baseApi.post(`/customer/register/${token}`);
      if (data.status === true) {
        window.location.href = "/";
      } else {
        toast.error("Failed to verify email. Please try again.");
        window.location.href = "/loginSignUp";
      }
    } catch (error) {
      console.error("Failed to verify email: ", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Verify Your Email</h1>
      <button
        onClick={verifyEmail}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
      >
        Verify Email
      </button>
    </div>
  );
};

export default VerifyPage;
