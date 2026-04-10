import pool from "../db.js";

export const asignDaemonToUser = async (req, res) => {
  try {
    const { level, hp, mp } = req.body;
    const {
      user_id,
      daemon_id,
      strength,
      intelligence,
      magic,
      vitality,
      agility,
      luck,
    } = req.params;
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
