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
    (5, 'Roland', 'Fighter', 'Dwarf'),
    (6, 'Aria', 'Rogue', 'Halfling'),
    (9, 'Gideon', 'Barbarian', 'Human'),
    (6, 'Luna', 'Cleric', 'Half-Elf');

INSERT INTO creatures
    (creature_lvl, creature_name, creature_plane, creature_url)
VALUES
    (9, 'Frost Giant', 'Material', 'https://2e.aonprd.com/Monsters.aspx?ID=222'),
    (6, 'Ether Spider', 'Ethereal', 'https://2e.aonprd.com/Monsters.aspx?ID=203'),
    (12, 'Shining Child', 'Astral', 'https://2e.aonprd.com/Monsters.aspx?ID=367'),
    (3, 'D''ziriak', 'Shadow', 'https://2e.aonprd.com/Monsters.aspx?ID=644'),
    (6, 'Wraith', 'Negative', 'https://2e.aonprd.com/Monsters.aspx?ID=417'),
    (8, 'Magma Scorpion', 'Fire', 'https://2e.aonprd.com/Monsters.aspx?ID=658'),
    (4, 'Mist Stalker', 'Water', 'https://2e.aonprd.com/Monsters.aspx?ID=664'),
    (2, 'Spark Bat', 'Air', 'https://2e.aonprd.com/Monsters.aspx?ID=646'),
    (5, 'Living Landslide', 'Earth', 'https://2e.aonprd.com/Monsters.aspx?ID=183'),
    (4, 'Abrikandilu', 'Abyss', 'https://2e.aonprd.com/Monsters.aspx?ID=1110');