-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 07, 2025 at 11:52 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

CREATE DATABASE IF NOT EXISTS meme_project;
USE meme_project;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `meme_project`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `created_at`) VALUES
(1, 'Stasi', 'stanislava43422@abv.bg', '$2y$10$qJ.dOR9lYptKyOXjLulYW.7pZouD..iIWyNb/54mclO2B5YY9GkQG', '2025-05-15 05:50:40'),
(2, 'Eli', 'eli@abv.bg', '$2y$10$8lsf1Foso5P1FuSpHiNwFul0xYn81YjWteMxDon4ZpW5bxBzK6vWW', '2025-05-15 05:53:09'),
(3, 'Gosho', 'gosho@abv.bg', '$2y$10$np9nMsimTqg/GGlrAEy0Fuux6MYyzbTMS4UWp2dn40uRu5aQN4/9u', '2025-05-15 06:01:43'),
(4, 'ivan', 'ivan@abv.bg', '$2y$10$oncqqEp2NXOwEqAcN6uFXONcH.O7JrKlCa0Unztn/dndLxgASKV26', '2025-05-15 06:13:15'),
(5, 'Kaloqncho', 'kaloqn@abv.bg', '$2y$10$cCCVQSUnB4TaaT/Rck6NQ.rZbDMubjxsvW/wkpu8yqfrOUZHVVBq.', '2025-05-15 08:30:21'),
(6, 'eli@abv.bg', 'eli03@abv.bg', '$2y$10$F/WxeIH1vCgold6eN.MPweqIgRWGtW8f7UxGvcyVza/opRikkIHJO', '2025-06-07 10:37:42'),
(7, 'elitoooo', 'elitooo@abv.bg', '$2y$10$b0ntzj0B9HEVkQi0AnTfqecsOdNIBfH9W3vmsm8CSDXtLgHjg7Ynm', '2025-06-07 20:42:30');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- --------------------------------------------------------
--
-- Table structure for table `favorites`
--

CREATE TABLE `favorites` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `image_path` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `favorites`
--

INSERT INTO `favorites` (`id`, `user_id`, `image_path`) VALUES
(27, 2, 'images/10.jpg'),
(51, 2, 'images/2.jpg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`image_path`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `favorites`
--
ALTER TABLE `favorites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

