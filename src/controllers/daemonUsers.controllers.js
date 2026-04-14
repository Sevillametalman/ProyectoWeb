import pool from "../db.js";

export const getDaemonByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;
    const result = await pool.query(
      `SELECT d.*, du.level, du.hp, du.mp, du.strength, du.intelligence, du.magic, du.vitality, du.agility, du.luck
       FROM daemon d
        JOIN daemonUsers du ON d.id = du.daemon_id
        WHERE du.user_id = $1`,
      [user_id],
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener demonios del usuario" });
  }
};

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

    console.log("Desasignando demonio", { user_id, daemon_id });

    const selectedDaemon = await pool.query(
      `SELECT * FROM daemonUsers WHERE user_id = $1 AND daemon_id = $2`,
      [user_id, daemon_id],
    );

    const selectedDaemonId = selectedDaemon.rows[0]?.id;

    const result = await pool.query(`DELETE FROM daemonUsers WHERE id = $1`, [
      selectedDaemonId,
    ]);

    res.status(201).json({ message: "Demonio desasignado correctamente" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al desasignar el demonio al usuario" });
  }
};
