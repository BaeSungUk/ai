import api from "./axios.js";

export const signupUser = async (userData) => {
  const response = await api.post("/auth/signup", userData);

  return response.data;
};

export const loginUser = async (loginData) => {
  const response = await api.post("/auth/login", loginData);

  return response.data;
};

export const checkEmail = async (email) => {
  const response = await api.get("/auth/check-email", {
    params: {
      email,
    },
  });

  return response.data;
};

export const getMyInfo = async () => {
  const response = await api.get("/auth/me");

  return response.data;
};
