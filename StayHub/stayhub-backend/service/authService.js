import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
  createUser,
  findByEmail,
  findByUserid,
  findByUseridWithPassword,
  findUserById,
} from "../repository/userRepository.js";

import AppError from "../util/AppError.js";

export const signup = async ({ userid, userpw, username, nickname, email }) => {
  if (!userid || !userpw || !username || !nickname || !email) {
    throw new AppError("필수 입력값을 모두 입력해주세요.", 400);
  }

  // 비밀번호 검증
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  if (!passwordRegex.test(userpw)) {
    throw new AppError(
      "비밀번호는 8자 이상이며 영문자, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다.",
      400,
    );
  }

  userid = userid.trim();
  username = username.trim();
  nickname = nickname.trim();
  email = email.trim().toLowerCase();

  const existUserid = await findByUserid(userid);

  if (existUserid) {
    throw new AppError("이미 사용 중인 아이디입니다.", 409);
  }

  const existEmail = await findByEmail(email);

  if (existEmail) {
    throw new AppError("이미 사용 중인 이메일입니다.", 409);
  }

  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);

  const hashedPassword = await bcrypt.hash(userpw, saltRounds);

  const user = await createUser({
    userid,
    userpw: hashedPassword,
    username,
    nickname,
    email,
  });

  return {
    _id: user._id,
    userid: user.userid,
    username: user.username,
    nickname: user.nickname,
    email: user.email,
    role: user.role,
  };
};

export const checkEmail = async (email) => {
  if (!email) {
    throw new AppError("이메일을 입력해주세요.", 400);
  }

  email = email.trim().toLowerCase();

  const user = await findByEmail(email);

  return {
    available: !user,
  };
};

export const login = async ({ userid, userpw }) => {
  if (!userid || !userpw) {
    throw new AppError("아이디와 비밀번호를 입력해주세요.", 400);
  }

  const user = await findByUseridWithPassword(userid.trim());

  if (!user) {
    throw new AppError("아이디 또는 비밀번호가 올바르지 않습니다.", 401);
  }

  const passwordMatch = await bcrypt.compare(userpw, user.userpw);

  if (!passwordMatch) {
    throw new AppError("아이디 또는 비밀번호가 올바르지 않습니다.", 401);
  }

  const token = jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: Number(process.env.JWT_EXPIRES_SEC || 86400),
    },
  );

  return {
    token,

    user: {
      _id: user._id,
      userid: user.userid,
      username: user.username,
      nickname: user.nickname,
      email: user.email,
      role: user.role,
    },
  };
};

export const getMyInfo = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new AppError("사용자를 찾을 수 없습니다.", 404);
  }

  return user;
};
