import pool from "../db.js";

export const getAllDaemons = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM daemon`);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener demonios" });
  }
};

export const getDaemonById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(`SELECT * FROM daemon WHERE id = $1`, [
      id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Demonio no encontrado" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
  }
};

export const getDaemonByName = async (req, res) => {
  try {
    const { name } = req.params;
    const { rows } = await pool.query(`SELECT * FROM daemon WHERE name = $1`, [
      name,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Demonio no encontrado" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
  }
};

export const createDemon = async (req, res) => {
  try {
    const {
      name,
      race,
      level,
      HP,
      MP,
      strength,
      intelligence,
      magic,
      vitality,
      agility,
      luck,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO daemon(name, race, level, HP, MP, strength, intelligence, magic, vitality, agility, luck) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [
        name,
        race,
        level,
        HP,
        MP,
        strength,
        intelligence,
        magic,
        vitality,
        agility,
        luck,
      ],
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    if (error.code === "23505") {
      res.status(400).json({ error: "El demonio ya existe" });
    } else {
      res.status(500).json({ error: "Error al guardar demonio" });
    }
  }
};

export const editDaemonByName = async (req, res) => {
  try {
    const { name } = req.params;
    const {
      race,
      level,
      HP,
      MP,
      strength,
      intelligence,
      magic,
      vitality,
      agility,
      luck,
    } = req.body;

    const result = await pool.query(
      `UPDATE daemon SET race = $1, level = $2, HP = $3, MP = $4, strength = $5, intelligence = $6, magic = $7, vitality = $8, agility = $9, luck = $10 WHERE name = $11 RETURNING *`,
      [
        race,
        level,
        HP,
        MP,
        strength,
        intelligence,
        magic,
        vitality,
        agility,
        luck,
        name,
      ],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Demonio no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    console.error(error);
    res.status(500).json({ error: "Error al actualizar demonio" });
  }
};

export const deleteDaemonByName = async (req, res) => {
  try {
    const { name } = req.params;
    const result = await pool.query(`DELETE FROM daemon WHERE name = $1`, [
      name,
    ]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
  }
};
