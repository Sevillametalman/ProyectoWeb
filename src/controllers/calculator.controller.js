import pool from "../db.js";

export const getCalculatedDaemon = async (req, res) => {
  try {
    const { id_daemon_1, id_daemon_2 } = req.params;

    const daemon1 = await getDaemon(id_daemon_1);
    const daemon2 = await getDaemon(id_daemon_2);

    const levelOfNewDaemon = await calculateLevel(id_daemon_1.level, id_daemon_2.level);

    const race1 = await getDaemonRace(daemon1.race)
    const race2 = await getDaemonRace(daemon2.race)

    const { rows } = await pool.query(
      `SELECT * FROM calculator WHERE race1 = $1 AND race2 = $2`,
      [race1, race2],
    );
  } catch (error) {
    console.error(error);
  }
};

async function getDaemon(id_daemon) {
  const { rows } = await pool.query(`SELECT * FROM daemon WHERE id = $1`, [
    id_daemon,
  ]);
  if (rows.length === 0) {
    return res.status(404).json({ message: "Demonio no encontrada" });
  }
  res.json(rows[0]);
}

async function getDaemonRace(id_race) {
  const { rows } = await pool.query(`SELECT * FROM race WHERE id = $1`, [
    id_race,
  ]);
  if (rows.length === 0) {
    return res.status(404).json({ message: "Demonio no encontrada" });
  }
  res.json(rows[0]);
}

async function calculateLevel(level1, level2){
    
}