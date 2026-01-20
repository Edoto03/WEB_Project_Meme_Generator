CREATE DATABASE IF NOT EXISTS meme_project;
USE meme_project;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`id`, `username`, `email`, `password`, `created_at`) VALUES
(1, 'Ediz', 'ediz@abv.bg', '$2y$10$qJ.dOR9lYptKyOXjLulYW.7pZouD..iIWyNb/54mclO2B5YY9GkQG', '2026-01-02 09:30:15'),
(2, 'Aleks', 'aleks@abv.bg', '$2y$10$8lsf1Foso5P1FuSpHiNwFul0xYn81YjWteMxDon4ZpW5bxBzK6vWW', '2026-01-03 14:15:22'),
(3, 'Edi_Bateto', 'edi99@abv.bg', '$2y$10$np9nMsimTqg/GGlrAEy0Fuux6MYyzbTMS4UWp2dn40uRu5aQN4/9u', '2026-01-05 18:45:10'),
(4, 'Sasho', 'aleksander_bg@abv.bg', '$2y$10$oncqqEp2NXOwEqAcN6uFXONcH.O7JrKlCa0Unztn/dndLxgASKV26', '2026-01-08 10:20:05'),
(5, 'Edizko', 'ediz_official@gmail.com', '$2y$10$cCCVQSUnB4TaaT/Rck6NQ.rZbDMubjxsvW/wkpu8yqfrOUZHVVBq.', '2026-01-12 16:55:30'),
(6, 'Aleks_Gamer', 'sasho06@abv.bg', '$2y$10$F/WxeIH1vCgold6eN.MPweqIgRWGtW8f7UxGvcyVza/opRikkIHJO', '2026-01-15 20:10:40'),
(7, 'EdiAndAleks', 'ediz_aleks_fen@abv.bg', '$2y$10$b0ntzj0B9HEVkQi0AnTfqecsOdNIBfH9W3vmsm8CSDXtLgHjg7Ynm', '2026-01-19 23:05:12');

ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

CREATE TABLE `favorites` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `image_path` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `favorites` (`id`, `user_id`, `image_path`) VALUES
(27, 2, 'images/10.jpg'),
(51, 2, 'images/2.jpg');

ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`image_path`);

ALTER TABLE `favorites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

