const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { admin, db } = require("../libs/firebaseAdmin");

const router = express.Router();
const USERS_COLLECTION = "users";

//POST /api/register
router.post("/register", async (req, res) => {
  const { email, password, displayName } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email y contraseña obligatorios" });
  }
  try {
    //verificar que no exista un usuario con ese email
    const userSnapshot = await db
      .collection(USERS_COLLECTION)
      .where("email", "==", email)
      .limit(1)
      .get();

    if (!userSnapshot.empty) {
      return res.status(409).json({ message: "Email ya registrado" });
    }

    //hashear la contraseña
    const saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds);

    //crear documento de usuario
    const userRef = await db.collection(USERS_COLLECTION).add({
      email,
      password: hashed,
      displayName: displayName || "",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(201).json({ uid: userRef.id });
  } catch (err) {
    console.error("Error en /register:", err);
    return res.status(500).json({ message: "Error interno" });
  }
});

//POST /api/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email y contraseña obligatorios" });
  }
  try {
    //buscar usuario por email
    const userSnapshot = await db
      .collection(USERS_COLLECTION)
      .where("email", "==", email)
      .limit(1)
      .get();

    if (userSnapshot.empty) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const doc = userSnapshot.docs[0];
    const userData = doc.data();
    const uid = doc.id;

    //comparar contraseña
    const match = await bcrypt.compare(password, userData.password);
    if (!match) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    //generar JWT
    const token = jwt.sign(
      { uid, email: userData.email },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    //construir el objeto usuario completo
    const user = {
      uid,
      email: userData.email,
      displayName: userData.displayName || ""
    };

    return res.json({ token, user });
  } catch (err) {
    console.error("Error en /login:", err);
    return res.status(500).json({ message: "Error interno" });
  }
});

//POST /api/logout
router.post("/logout", (req, res) => {
  return res.status(200).json({ message: "Usuario deslogueado" });
});

module.exports = router;