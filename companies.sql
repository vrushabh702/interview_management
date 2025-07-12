-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jul 12, 2025 at 07:53 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `companies`
--

-- --------------------------------------------------------

--
-- Table structure for table `companies`
--

CREATE TABLE `companies` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `location` text DEFAULT NULL,
  `google_maps_rating` decimal(2,1) DEFAULT NULL,
  `number_of_reviews` int(11) DEFAULT NULL,
  `services` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `companies`
--

INSERT INTO `companies` (`id`, `name`, `location`, `google_maps_rating`, `number_of_reviews`, `services`, `created_at`) VALUES
(1, 'Nextbrain Technologies', 'No. 1084, 17th Cross, 14th Main Rd, Sector 3, HSR Layout, Bengaluru, Karnataka 560102, India', 4.8, 45, 'React.js, Node.js, Next.js, React Native, Web Development, Mobile Apps', '2025-06-09 19:15:54'),
(2, 'GeekyAnts', 'No. 56/3, 6th Floor, Vakil Square, Bannerghatta Road, Bengaluru, Karnataka 560029, India', 4.5, 120, 'React.js, Node.js, Next.js, Angular, Web Development, UI/UX', '2025-06-09 19:15:54'),
(3, 'Nextbrain Technologies', 'No. 1084, 17th Cross, 14th Main Rd, Sector 3, HSR Layout, Bengaluru, Karnataka 560102, India', 4.8, 45, 'React.js, Node.js, Next.js, React Native, Web Development, Mobile Apps', '2025-06-09 19:16:21'),
(4, 'GeekyAnts', 'No. 56/3, 6th Floor, Vakil Square, Bannerghatta Road, Bengaluru, Karnataka 560029, India', 4.5, 120, 'React.js, Node.js, Next.js, Angular, Web Development, UI/UX', '2025-06-09 19:16:21'),
(5, 'MagnusMinds IT Solution LLP', 'Ahmedabad, Gujarat, India', 4.9, 64, 'Web Development, Application Management & Support, Application Testing', '2025-06-20 18:26:20'),
(6, 'Maruti Techlabs', 'Ahmedabad, Gujarat, India', 4.3, 120, 'Custom Software Development, AI, Cloud Consulting', '2025-06-20 18:26:20'),
(7, 'Thinkwik', 'Ahmedabad, Gujarat, India', 4.7, 49, 'Web Development, AI, Mobile App Development', '2025-06-20 18:26:20'),
(8, 'SPEC INDIA', 'Ahmedabad, Gujarat, India', 4.5, 183, 'Custom Software Development, Mobile App Development, Web Development', '2025-06-20 18:26:20'),
(9, 'Global Software', 'SUN WESTBANK, B 905-908, Ashram Rd, near VALLABH SADAN, opp. CITY GOLD, Vishalpur, Muslim Society, Navrangpura, Ahmedabad, Gujarat 380009', 4.8, 308, 'working no postion ', '2025-07-07 17:45:22');

-- --------------------------------------------------------

--
-- Table structure for table `company_status`
--

CREATE TABLE `company_status` (
  `id` int(11) NOT NULL,
  `company_id` int(11) DEFAULT NULL,
  `is_applied` tinyint(1) DEFAULT 0,
  `is_favorite` tinyint(1) DEFAULT 0,
  `is_approached` tinyint(1) DEFAULT 0,
  `is_pending` tinyint(1) DEFAULT 0,
  `in_interview_process` tinyint(1) DEFAULT 0,
  `is_rejected` tinyint(1) DEFAULT 0,
  `has_offer` tinyint(1) DEFAULT 0,
  `notes` text DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `company_status`
--

INSERT INTO `company_status` (`id`, `company_id`, `is_applied`, `is_favorite`, `is_approached`, `is_pending`, `in_interview_process`, `is_rejected`, `has_offer`, `notes`, `updated_at`) VALUES
(1, 1, 1, 0, 0, 1, 1, 0, 0, 'Applied recently, interview scheduled.', '2025-06-20 18:59:20'),
(2, 2, 0, 1, 0, 0, 0, 0, 0, 'Saved as favorite, might apply later.', '2025-06-20 18:29:05'),
(3, 3, 0, 0, 1, 0, 0, 0, 1, 'Company approached and made an offer.', '2025-06-20 18:29:05'),
(4, 4, 1, 0, 0, 0, 1, 1, 0, 'Interview completed, but rejected.', '2025-06-20 18:29:05'),
(5, 5, 1, 0, 0, 1, 0, 0, 0, 'Application sent, waiting for response.', '2025-06-20 18:29:05'),
(6, 6, 1, 1, 0, 0, 1, 0, 0, 'Top choice, interview in progress.', '2025-06-20 18:29:05'),
(7, 7, 1, 0, 0, 0, 0, 1, 0, 'Applied, rejected without interview.', '2025-06-20 18:29:05'),
(8, 8, 0, 0, 1, 0, 0, 0, 1, 'Received an offer without applying.', '2025-06-20 18:29:05'),
(9, 9, 1, 0, 0, 1, 1, 0, 0, 'no opening', '2025-07-07 17:46:54');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `companies`
--
ALTER TABLE `companies`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `company_status`
--
ALTER TABLE `company_status`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_company_id` (`company_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `companies`
--
ALTER TABLE `companies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `company_status`
--
ALTER TABLE `company_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `company_status`
--
ALTER TABLE `company_status`
  ADD CONSTRAINT `fk_company` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
