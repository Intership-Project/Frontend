import axios from "axios";
import { createError, createUrl } from "../utils";

const getToken = () => sessionStorage.getItem("token");

//  Get all module types for a given feedback type
export const getFeedbackModuleTypesByType = async (feedbackTypeId) => {
  try {
    const res = await axios.get(
      createUrl(`feedbackmoduletype/by-feedbacktype/${feedbackTypeId}`),
      { headers: { token: getToken() } }
    );
    return res.data.status === "success"
      ? { status: "success", data: res.data.data }
      : { status: "error", error: res.data.error };
  } catch (err) {
    return createError(err);
  }
};

//  Create new feedback module type
export const createFeedbackModuleType = async (payload) => {
  try {
    const res = await axios.post(createUrl("feedbackmoduletype"), payload, {
      headers: { token: getToken() },
    });
    return res.data.status === "success"
      ? { status: "success", data: res.data.data }
      : { status: "error", error: res.data.error };
  } catch (err) {
    return createError(err);
  }
};

//  Get all feedback module types (optional list view)
export const getFeedbackModuleTypes = async () => {
  try {
    const res = await axios.get(createUrl("feedbackmoduletype"), {
      headers: { token: getToken() },
    });
    return res.data.status === "success"
      ? { status: "success", data: res.data.data }
      : { status: "error", error: res.data.error };
  } catch (err) {
    return createError(err);
  }
};

//  Update feedback module type
export const updateFeedbackModuleType = async (id, payload) => {
  try {
    const res = await axios.put(
      createUrl(`feedbackmoduletype/${id}`),
      payload,
      { headers: { token: getToken() } }
    );
    return res.data.status === "success"
      ? { status: "success", data: res.data.data }
      : { status: "error", error: res.data.error };
  } catch (err) {
    return createError(err);
  }
};

//  Delete feedback module type
export const deleteFeedbackModuleType = async (id) => {
  try {
    const res = await axios.delete(createUrl(`feedbackmoduletype/${id}`), {
      headers: { token: getToken() },
    });
    return res.data.status === "success"
      ? { status: "success", data: res.data.data }
      : { status: "error", error: res.data.error };
  } catch (err) {
    return createError(err);
  }
};
