import { FastifyReply } from "fastify";
import bcrypt from "bcryptjs";
import { User } from "../models/userModel";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../errors/unauthorizedError";
import { LoginRequestBody, RegisterRequestBody } from "../types/requests";
import { InternalError } from "../errors/internalError";

export const register = async (
  reqBody: RegisterRequestBody,
  reply: FastifyReply
) => {
  try {
    const { email, password, name } = reqBody;
    const hashedPw = await bcrypt.hash(password, 12);
    const user = User.build({
      email,
      password: hashedPw,
      name,
    });
    const result = await user.save();
    return reply.status(201).send({ userId: result.id });
  } catch (err) {
    throw new InternalError(err);
  }
};

export const login = async (reqBody: LoginRequestBody, reply: FastifyReply) => {
  try {
    const { email, password } = reqBody;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedError();
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new UnauthorizedError();
    }

    const token = jwt.sign({ userId: user.id.toString(), email }, "secret", {
      expiresIn: "1h",
    });
    console.log(token);
    reply.status(200).send({ token });
  } catch (err) {
    throw new InternalError(err);
  }
};
