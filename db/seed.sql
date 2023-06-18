DROP TABLE IF EXISTS party;
DROP TABLE IF EXISTS creatures;

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
    creature_plane VARCHAR (20),
    creature_url TEXT
);

INSERT INTO party
    (char_lvl, char_name, char_class, char_ancestry)
VALUES
    (7, 'Elara', 'Wizard', 'Elf'),
    (5, 'Roland', 'Fighter', 'Dwarf');

INSERT INTO creatures
    (creature_lvl, creature_name, creature_plane, creature_url)
VALUES
    (9, 'Frost Giant', 'Material', 'https://2e.aonprd.com/Monsters.aspx?ID=222'),
    (6, 'Ether Spider', 'Ethereal', 'https://2e.aonprd.com/Monsters.aspx?ID=203');