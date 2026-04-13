import pool from "../db.js";

//Buscar usuarios
export const getUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

//Buscar usuario por ID
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(`SELECT * FROM users WHERE id = $1`, [
      id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
  }
};

//Crear usuario
export const createUser = async (req, res) => {
  try {
    const { username, password, admin } = req.body;

    // Validación básica
    if (!username || !password) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    // Insertar en la base de datos
    const result = await pool.query(
      `INSERT INTO users (username, password, admin) VALUES ($1,$2,$3) RETURNING *`,
      [username, password, admin],
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    if (error.code === "23505") {
      res.status(400).json({ error: "El usuario ya existe" });
    } else {
      res.status(500).json({ error: "Error al guardar usuario" });
    }
  }
};

//Borrar usuario
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
  }
};

// Borrar todos los usuarios
export const deleteAllUsers = async (req, res) => {
  try {
    await pool.query("DELETE FROM users");
    res.json({ message: "Todos los usuarios han sido eliminados" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al borrar todos los usuarios" });
  }
};

//Actualizar usuario
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, admin } = req.body;
    console.log("ID:", id);
    console.log("Datos recibidos:", username, password, admin);
    let result;
    if (password) {
      result = await pool.query(
        `UPDATE users SET username = $1, password = $2, admin = $3 WHERE id = $4 RETURNING *`,
        [username, password, admin, id],
      );
    } else {
      result = await pool.query(
        `UPDATE users SET username = $1, admin = $2 WHERE id = $3 RETURNING *`,
        [username, admin, id],
      );
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Persona no encontrada" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};
