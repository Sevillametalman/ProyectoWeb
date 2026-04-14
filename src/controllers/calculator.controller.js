import pool from "../db.js";

export const getCalculatedDaemon = async (req, res) => {
  try {
    const { id1, id2 } = req.params;

    const daemon1 = await getDaemon(id1);
    const daemon2 = await getDaemon(id2);

    const levelOfNewDaemon = await calculateLevel(daemon1.level, daemon2.level);

    const race1 = daemon1.race_id;
    const race2 = daemon2.race_id;

    const raceOfDaemonsToSelect = await getResultingRace(race1, race2);

    if (raceOfDaemonsToSelect !== 0) {
      const listOfDaemons = await getDaemonsFromRace(raceOfDaemonsToSelect);
      console.log(listOfDaemons);

      const newDaemon = await calculatedDaemon(listOfDaemons, levelOfNewDaemon);

      return res.json(newDaemon);
    } else {
      return res
        .status(404)
        .json({ error: "No existe esa combinacion de razas" });
    }
  } catch (error) {
    console.error(error);
  }
};

//Obtener demonio dado un id
async function getDaemon(idDaemon) {
  const { rows } = await pool.query(`SELECT * FROM daemon WHERE id = $1`, [
    idDaemon,
  ]);

  return rows[0];
}

//Calcular el nivel del siguiente demonio (literal o el mas cercano a este)
async function calculateLevel(level1, level2) {
  let result = (level1 + level2) / 2;
  if (result % 1 !== 0) {
    result = Math.ceil(result);
  }
  return result;
}

//Obtener la raza resultante de la "suma" de dos razas
async function getResultingRace(race1, race2) {
  // Intentar primero (race1, race2)
  let { rows } = await pool.query(
    `SELECT * FROM race_fusions WHERE race1_id = $1 AND race2_id = $2`,
    [race1, race2]
  );
  if (rows.length > 0) {
    return rows[0].result_race_id;
  }

  // Si no existe, intentar el orden inverso (race2, race1)
  ({ rows } = await pool.query(
    `SELECT * FROM race_fusions WHERE race1_id = $1 AND race2_id = $2`,
    [race2, race1]
  ));
  if (rows.length > 0) {
    return rows[0].result_race_id;
  }

  // Si no existe ninguna combinación
  return 0;
}

//Obtener los demonios dada una raza
async function getDaemonsFromRace(race) {
  const { rows } = await pool.query(`SELECT * FROM daemon WHERE race_id = $1`, [
    race,
  ]);

  return rows;
}

//Resultado del caclulo de demonios/Demonio seleccionado
async function calculatedDaemon(listOfDaemons, calculatedLevel) {
  // 1. Filtramos solo los que tienen nivel igual o mayor al calculado
  const candidates = listOfDaemons.filter((p) => p.level >= calculatedLevel);

  // 2. Si hay candidatos, buscamos el que tenga el nivel más bajo de ese grupo
  if (candidates.length > 0) {
    return candidates.sort((a, b) => a.level - b.level)[0];
  }

  // 3. Fallback: Si el nivel calculado es mayor a todos, SMT 1 suele devolver
  return listOfDaemons.sort((a, b) => b.level - a.level)[0];
}