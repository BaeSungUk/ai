import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as userRepository from "../repositories/userRepository.js";
import { ApiError } from "../utils/ApiError.js";
const emailOf = (v) => (v || "").trim().toLowerCase();
export async function signup({ name, email, password }) {
  if (!name?.trim() || !emailOf(email) || !password)
    throw new ApiError(400, "모든 필수 항목을 입력해 주세요.");
  if (!/^\S+@\S+\.\S+$/.test(emailOf(email)))
    throw new ApiError(400, "올바른 이메일 형식이 아닙니다.");
  if (password.length < 6)
    throw new ApiError(400, "비밀번호는 6자 이상 입력해 주세요.");
  if (await userRepository.existsByEmail(emailOf(email)))
    throw new ApiError(409, "이미 사용 중인 이메일입니다.");
  const user = await userRepository.create({
    name: name.trim(),
    email: emailOf(email),
    password: await bcrypt.hash(password, 10),
  });
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}
export async function login({ email, password }) {
  const user = await userRepository.findByEmail(emailOf(email), true);
  if (!user || !(await bcrypt.compare(password || "", user.password)))
    throw new ApiError(401, "이메일 또는 비밀번호가 올바르지 않습니다.");
  const payload = { userId: user.id, email: user.email, role: user.role };
  return {
    token: jwt.sign(payload, process.env.JWT_SECRET || "stayhub_dev_secret", {
      expiresIn: "7d",
    }),
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
}
export const checkEmail = async (email) => ({
  available: !(await userRepository.existsByEmail(emailOf(email))),
});
