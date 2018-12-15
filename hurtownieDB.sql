CREATE DATABASE hurtownieDB;

USE hurtownieDB;
CREATE TABLE IF NOT EXISTS ads(
    Id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Price INT,
    Size VARCHAR(200),
    Region VARCHAR(200),
    BuildingType VARCHAR(200),
    ContractType VARCHAR(200)
);
