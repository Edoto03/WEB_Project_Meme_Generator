DROP SCHEMA IF EXISTS meme_project;
CREATE SCHEMA meme_project;
USE meme_project;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;

CREATE TABLE users (
  id int(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
  username varchar(50) UNIQUE KEY NOT NULL,
  email varchar(100) UNIQUE KEY NOT NULL,
  password varchar(255) NOT NULL,
  created_at timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO users (id, username, email, password, created_at) VALUES
(1, 'Ediz', 'ediz@abv.bg', '$2y$10$qJ.dOR9lYptKyOXjLulYW.7pZouD..iIWyNb/54mclO2B5YY9GkQG', '2026-01-02 09:30:15'),
(2, 'Aleks', 'aleks@abv.bg', '$2a$12$ItijmhofeH8OSwzc9yvhx./9nMReoJeYO5vhhpGiDxuOiCltqPhW.', '2026-01-03 14:15:22'),
(3, 'Edi_Bateto', 'edi99@abv.bg', '$2y$10$np9nMsimTqg/GGlrAEy0Fuux6MYyzbTMS4UWp2dn40uRu5aQN4/9u', '2026-01-05 18:45:10'),
(4, 'Sasho', 'aleksander_bg@abv.bg', '$2y$10$oncqqEp2NXOwEqAcN6uFXONcH.O7JrKlCa0Unztn/dndLxgASKV26', '2026-01-08 10:20:05'),
(5, 'Edizko', 'ediz_official@gmail.com', '$2y$10$cCCVQSUnB4TaaT/Rck6NQ.rZbDMubjxsvW/wkpu8yqfrOUZHVVBq.', '2026-01-12 16:55:30'),
(6, 'Aleks_Gamer', 'sasho06@abv.bg', '$2y$10$F/WxeIH1vCgold6eN.MPweqIgRWGtW8f7UxGvcyVza/opRikkIHJO', '2026-01-15 20:10:40'),
(7, 'EdiAndAleks', 'ediz_aleks_fen@abv.bg', '$2y$10$b0ntzj0B9HEVkQi0AnTfqecsOdNIBfH9W3vmsm8CSDXtLgHjg7Ynm', '2026-01-19 23:05:12');

COMMIT;
