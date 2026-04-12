CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    admin BOOLEAN NOT NULL
);

CREATE TABLE races(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE race_fusions (
    id SERIAL PRIMARY KEY,
    race1_id INTEGER NOT NULL REFERENCES races(id),
    race2_id INTEGER NOT NULL REFERENCES races(id),
    result_race_id INTEGER NOT NULL REFERENCES races(id),
    UNIQUE (race1_id, race2_id)
);

CREATE TABLE daemon(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    race_id INT NOT NULL REFERENCES races(id), 
    level INT,
    hp INT,
    mp INT,
    strength INT,
    intelligence INT,
    magic INT,
    vitality INT,
    agility INT,
    luck INT
);

CREATE TABLE daemonUsers(
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    daemon_id INT NOT NULL REFERENCES daemon(id),
    level INT,
    hp INT,
    mp INT,
    strength INT,
    intelligence INT,
    magic INT,
    vitality INT,
    agility INT,
    luck INT
);