DROP TABLE IF EXISTS party;
DROP TABLE IF EXISTS creatures;

Access-Control-Allow-Origin= *

CREATE TABLE party(
    char_id SERIAL PRIMARY KEY,
    char_lvl INT,
    char_name VARCHAR (50),
    char_class VARCHAR (50),
    char_ancestry VARCHAR (50)
);

CREATE TABLE creatures(
    creature_id SERIAL PRIMARY KEY,
    creature_lvl INT,
    creature_name VARCHAR (100),
    creature_url TEXT,
    creature_plane VARCHAR (20)
);

INSERT INTO party
    (char_lvl, char_name, char_class, char_ancestry)
VALUES
    (7, 'Elara', 'Wizard', 'Elf'),
    (5, 'Roland', 'Fighter', 'Dwarf');

INSERT INTO creatures
    (creature_lvl, creature_name, creature_url, creature_plane)
VALUES
    (9, 'Frost Giant', 'https://2e.aonprd.com/Monsters.aspx?ID=222', 'Matereial Plane'),
    (6, 'Ether Speder', 'https://2e.aonprd.com/Monsters.aspx?ID=203', 'Ethereal Plane');