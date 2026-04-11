import pool from "../db.js";

export const asignDaemonToUser = async (req, res) => {
  try {
    const {
      level,
      hp,
      mp,
      strength,
      intelligence,
      magic,
      vitality,
      agility,
      luck,
    } = req.body;
    const { user_id, daemon_id } = req.params;
    const result = await pool.query(
      `INSERT INTO daemonUsers(user_id, daemon_id, level, hp, mp, strength, intelligence, magic, vitality, agility, luck) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [
        user_id,
        daemon_id,
        level,
        hp,
        mp,
        strength,
        intelligence,
        magic,
        vitality,
        agility,
        luck,
      ],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al asignar demonio al usuario" });
  }
};

export const unasignDaemonToUser = async (req, res) => {
  try {
    const { user_id, daemon_id } = req.params;

    const result = await pool.query(
      `DELETE FROM daemonUsers WHERE user_id = $1 AND daemon_id = $2`,
      [user_id, daemon_id],
    );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al desasignar el demonio al usuario" });
  }
};
