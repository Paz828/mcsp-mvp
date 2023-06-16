DROP TABLE IF EXISTS party;
DROP TABLE IF EXISTS creatures;

CREATE TABLE party(
    char_id SERIAL PRIMARY KEY,
    char_lvl INT,
    char_name VARCHAR (50),
    char_class VARCHAR (50),
    cast_spells BIT
);

CREATE TABLE creatures(
    creature_id SERIAL PRIMARY KEY,
    creature_lvl INT,
    creature_name VARCHAR (100),
    creature_url TEXT,
    creature_plane VARCHAR (20)
);

INSERT INTO party
    (char_lvl, char_name, char_class, cast_spells)
VALUES
    (7, 'Elara', 'Wizard', 1),
    (5, 'Roland', 'Fighter', 0);