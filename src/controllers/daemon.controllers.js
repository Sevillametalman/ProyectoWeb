import pool from "../db.js";
import { z } from "zod";

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
      race_id,
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

    const daemonSchema = z.object({
      name: z.string().min(1, "El nombre es obligatorio"),
      race_id: z
        .number()
        .int()
        .positive({ message: "race_id debe ser un entero positivo" }),
      level: z.number().int().min(1, "El nivel debe ser al menos 1"),
      HP: z.number().int().min(0, "HP debe ser 0 o mayor"),
      MP: z.number().int().min(0, "MP debe ser 0 o mayor"),
      strength: z.number().int().min(0),
      intelligence: z.number().int().min(0),
      magic: z.number().int().min(0),
      vitality: z.number().int().min(0),
      agility: z.number().int().min(0),
      luck: z.number().int().min(0),
    });

    // Convertir los valores a número si vienen como string
    const parsed = daemonSchema.safeParse({
      name: name,
      race_id: Number(race_id),
      level: Number(level),
      HP: Number(HP),
      MP: Number(MP),
      strength: Number(strength),
      intelligence: Number(intelligence),
      magic: Number(magic),
      vitality: Number(vitality),
      agility: Number(agility),
      luck: Number(luck),
    });

    if (!parsed.success) {
      // 1. Aplanamos los errores para agruparlos por el nombre de cada campo
      const formattedErrors = parsed.error.flatten().fieldErrors;

      // 2. Imprimimos en consola con JSON.stringify para que tenga indentación (espaciado de 2)
      console.error("❌ Errores de validación:");
      console.error(JSON.stringify(formattedErrors, null, 2));

      // 3. Devolvemos la respuesta formateada al cliente
      return res.status(400).json({ 
        error: "Datos inválidos", 
        details: formattedErrors 
      });
    }

    const validData = parsed.data;

    const result = await pool.query(
      `INSERT INTO daemon(name, race_id, level, HP, MP, strength, intelligence, magic, vitality, agility, luck) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [
        validData.name,
        validData.race_id,
        validData.level,
        validData.HP,
        validData.MP,
        validData.strength,
        validData.intelligence,
        validData.magic,
        validData.vitality,
        validData.agility,
        validData.luck,
      ],
    );

    res.json(result.rows[0]);
  } catch (error) {
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
      race_id,
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

    const daemonSchema = z.object({
      race_id: z
        .number()
        .int()
        .positive({ message: "race_id debe ser un entero positivo" }),
      level: z.number().int().min(1, "El nivel debe ser al menos 1"),
      HP: z.number().int().min(0, "HP debe ser 0 o mayor"),
      MP: z.number().int().min(0, "MP debe ser 0 o mayor"),
      strength: z.number().int().min(0),
      intelligence: z.number().int().min(0),
      magic: z.number().int().min(0),
      vitality: z.number().int().min(0),
      agility: z.number().int().min(0),
      luck: z.number().int().min(0),
    });

    // Convertir los valores a número si vienen como string
    const parsed = daemonSchema.safeParse({
      race_id: Number(race_id),
      level: Number(level),
      HP: Number(HP),
      MP: Number(MP),
      strength: Number(strength),
      intelligence: Number(intelligence),
      magic: Number(magic),
      vitality: Number(vitality),
      agility: Number(agility),
      luck: Number(luck),
    });

    if (!parsed.success) {
      // 1. Aplanamos los errores para agruparlos por el nombre de cada campo
      const formattedErrors = parsed.error.flatten().fieldErrors;

      // 2. Imprimimos en consola con JSON.stringify para que tenga indentación (espaciado de 2)
      console.error("❌ Errores de validación:");
      console.error(JSON.stringify(formattedErrors, null, 2));

      // 3. Devolvemos la respuesta formateada al cliente
      return res.status(400).json({ 
        error: "Datos inválidos", 
        details: formattedErrors 
      });
    }

    const validData = parsed.data;


    const result = await pool.query(
      `UPDATE daemon SET race_id = $1, level = $2, HP = $3, MP = $4, strength = $5, intelligence = $6, magic = $7, vitality = $8, agility = $9, luck = $10 WHERE name = $11 RETURNING *`,
      [
        validData.race_id,
        validData.level,
        validData.HP,
        validData.MP,
        validData.strength,
        validData.intelligence,
        validData.magic,
        validData.vitality,
        validData.agility,
        validData.luck,
        name,
      ],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Demonio no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (error) {
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

export const getDaemonRaceById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `SELECT r.name FROM daemon d
        JOIN
        races r ON d.race_id = r.id
        WHERE d.id = $1
      `,
      [id],
    );
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener la raza del demonio" });
  }
};
