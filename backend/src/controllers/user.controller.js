import { prisma } from "../lib/prisma.js";

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // NOTE: In production, hash password before saving!
    const newUser = await prisma.user.create({
      data: {
        email,
        password,
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
};
