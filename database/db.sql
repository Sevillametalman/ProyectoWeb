CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    admin BOOLEAN NOT NULL
);

CREATE TABLE daemon(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    race VARCHAR(255) NOT NULL,
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
    user_id INT REFERENCES users(id),
    daemon_id INT REFERENCES daemon(id),
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