import pool from "../db.js";

export const getAllRaces = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM races`);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener razas" });
  }
};

export const getRaceById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(`SELECT * FROM races WHERE id = $1`, [
      id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Raza no encontrada" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener dicha raza" });
  }
};

export const getRaceByName = async (req, res) => {
  try {
    const { name } = req.params;
    const { rows } = await pool.query(`SELECT * FROM races WHERE name = $1`, [
      name,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Raza no encontrada" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener dicha raza" });
  }
};
