import User from "../model/userModel.js";
import bcrypt from "bcrypt";

export const register = async (req, res, next) => {
  try {
    const { usuario, email, contraseña } = req.body;
    const usernameCheck = await User.findOne({ usuario });
    if (usernameCheck) {
      return res.status(400).json({ message: "El usuario ya existe." });
    }
    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
      return res.status(400).json({ message: "El email ya existe." });
    }
    const hashedPassword = await bcrypt.hash(contraseña, 10);
    const user = await User.create({
      usuario,
      email,
      contraseña: hashedPassword,
      conectado: true // Establecer usuario como conectado al registrarse
    });
    delete user.contraseña;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

export const login = async (req, res, next) => {
  try {
    const { usuario, contraseña } = req.body;
    const user = await User.findOne({ usuario });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Usuario o contraseña incorrectos." });
    }
    const isPasswordValid = await bcrypt.compare(contraseña, user.contraseña);
    if (!isPasswordValid)
      return res
        .status(400)
        .json({ message: "Usuario o contraseña incorrectos." });
    user.conectado = true; // Establecer usuario como conectado al iniciar sesión
    await user.save(); // Guardar cambios en el usuario
    delete user.contraseña;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

export const logout = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado." });
    user.conectado = false; // Establecer usuario como desconectado al cerrar sesión
    await user.save(); // Guardar cambios en el usuario
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};

export const setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    next(ex);
  }
};

export const getAllUsers = async(req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "usuario",
      "avatarImage",
      "_id",
      "conectado" // Incluir el estado de conexión de cada usuario
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};
