CREATE DATABASE hurtownieDB;

USE hurtownieDB;
CREATE TABLE IF NOT EXISTS ads(
    Id BIGINT(20) PRIMARY KEY,
	Name CHAR(255),
    Price DOUBLE,
	NrOfRooms INT,
    Size DOUBLE,
	LandSize DOUBLE,
    BuildingType VARCHAR(200),
    ContractType VARCHAR(200)
);
