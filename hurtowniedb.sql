CREATE DATABASE hurtownieDB;
CREATE TABLE IF NOT EXISTS userDatabase(ID INT PRIMARY KEY ,cenaMin INT, cenaMax INT, powMin INT, powMax INT, woj TEXT, typdomu TEXT, typsprzedazy TEXT);
USE hurtownieDB;
INSERT INTO userdatabase(ID,cenaMin,cenaMax,powMin,powMax,woj,typdomu,typsprzedazy) VALUES(1, 50, 5000, 10, 100, "slaskie", "dom", "sprzedaz");
INSERT INTO userdatabase(ID,cenaMin,cenaMax,powMin,powMax,woj,typdomu,typsprzedazy) VALUES(2, 502, 50002, 102, 1002, "malopolskie", "mieszkanie", "wynajem");
DELETE FROM userDatabase WHERE ID = 2;
