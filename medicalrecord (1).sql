-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 28, 2021 at 03:08 AM
-- Server version: 10.4.19-MariaDB
-- PHP Version: 7.4.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `medicalrecord`
--

-- --------------------------------------------------------

--
-- Table structure for table `diagnosis`
--

CREATE TABLE `diagnosis` (
  `diagnosis_id` varchar(36) NOT NULL,
  `patient_record_id` varchar(36) DEFAULT NULL,
  `doc_id` varchar(36) DEFAULT NULL,
  `diagnosis` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `diagnosis`
--

INSERT INTO `diagnosis` (`diagnosis_id`, `patient_record_id`, `doc_id`, `diagnosis`, `description`) VALUES
('1693e0d1-0757-11ec-a179-f469d5c90e84', '52fcc235-074a-11ec-a179-f469d5c90e84', '5056d4f2-0755-11ec-a179-f469d5c90e84', 'Amputation', 'Potential complication of head injury: increased intracranial pressure');

-- --------------------------------------------------------

--
-- Table structure for table `doctors`
--

CREATE TABLE `doctors` (
  `doc_id` varchar(36) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `middle_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) NOT NULL,
  `department` varchar(255) NOT NULL,
  `contact_number` varchar(255) NOT NULL,
  `house_number` varchar(255) NOT NULL,
  `street` varchar(255) NOT NULL,
  `barangay` varchar(255) NOT NULL,
  `municipality` varchar(255) NOT NULL,
  `province` varchar(255) NOT NULL,
  `active_status` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `doctors`
--

INSERT INTO `doctors` (`doc_id`, `first_name`, `middle_name`, `last_name`, `department`, `contact_number`, `house_number`, `street`, `barangay`, `municipality`, `province`, `active_status`, `created_at`, `updated_at`) VALUES
('5056d4f2-0755-11ec-a179-f469d5c90e84', 'Kim', 'Bruce', 'Abell', 'Family Medicine', '09235476534', '213', 'Penfield Rd', 'Ste 101', 'Makati City', 'NCR', 'Active', '2021-08-28 00:39:15', NULL),
('7a122ceb-0755-11ec-a179-f469d5c90e84', 'Nicholas', '', 'Aloisio', 'Emergency', '09235476534', '213', 'Penfield Rd', 'Ste 101', 'Makati City', 'NCR', 'Active', '2021-08-28 00:40:25', NULL),
('aa97dcaa-0756-11ec-a179-f469d5c90e84', 'Robert', '', 'Fortuna', 'General Surgery', '09235476534', '213', 'Penfield Rd', 'Ste 101', 'Makati City', 'NCR', 'Active', '2021-08-28 00:48:56', NULL),
('c04083f2-0755-11ec-a179-f469d5c90e84', 'Jonathan', '', 'Bloon', 'Urology', '09235476534', '213', 'Penfield Rd', 'Ste 101', 'Makati City', 'NCR', 'Active', '2021-08-28 00:42:23', NULL),
('f934e75e-0755-11ec-a179-f469d5c90e84', 'Jane', '', 'Doeblin', 'OB/GYN', '09235476534', '213', 'Penfield Rd', 'Ste 101', 'Makati City', 'NCR', 'Active', '2021-08-28 00:43:59', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `lab_results`
--

CREATE TABLE `lab_results` (
  `lab_result_id` varchar(36) NOT NULL,
  `patient_record_id` varchar(36) DEFAULT NULL,
  `specimen` varchar(255) NOT NULL,
  `result` varchar(255) NOT NULL,
  `reference` varchar(255) NOT NULL,
  `unit` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `detailed_result` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `lab_results`
--

INSERT INTO `lab_results` (`lab_result_id`, `patient_record_id`, `specimen`, `result`, `reference`, `unit`, `status`, `detailed_result`) VALUES
('8f37b563-075a-11ec-a179-f469d5c90e84', '52fcc235-074a-11ec-a179-f469d5c90e84', 'Swab, throat', 'Positive for group A streptococcus', 'Negative for group A streptococcus', 'pg/ML', 'Processing', 'Throat Culture for Beta  Hemolytic Streptococci');

-- --------------------------------------------------------

--
-- Table structure for table `medical_history`
--

CREATE TABLE `medical_history` (
  `history_id` varchar(36) NOT NULL,
  `patient_record_id` varchar(36) DEFAULT NULL,
  `chief_complaint` varchar(255) NOT NULL,
  `medical_history` varchar(255) DEFAULT NULL,
  `allergy` varchar(255) NOT NULL,
  `general_physician` varchar(255) NOT NULL,
  `medication` varchar(255) NOT NULL,
  `family_history` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `medical_history`
--

INSERT INTO `medical_history` (`history_id`, `patient_record_id`, `chief_complaint`, `medical_history`, `allergy`, `general_physician`, `medication`, `family_history`, `created_at`, `updated_at`) VALUES
('b2e74918-0752-11ec-a179-f469d5c90e84', '52fcc235-074a-11ec-a179-f469d5c90e84', 'Abdominal Pain, Anxiety', 'Heart Infection', 'N/A', 'Dr. Ramirez', 'Not available', 'Not available', '2021-08-28 00:20:32', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `patients`
--

CREATE TABLE `patients` (
  `patient_id` varchar(36) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `middle_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `birth_date` date NOT NULL,
  `contact_number` varchar(255) NOT NULL,
  `house_number` varchar(255) NOT NULL,
  `street` varchar(255) NOT NULL,
  `barangay` varchar(255) NOT NULL,
  `municipality` varchar(255) NOT NULL,
  `province` varchar(255) NOT NULL,
  `active_status` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `patients`
--

INSERT INTO `patients` (`patient_id`, `first_name`, `middle_name`, `last_name`, `gender`, `birth_date`, `contact_number`, `house_number`, `street`, `barangay`, `municipality`, `province`, `active_status`, `created_at`, `updated_at`) VALUES
('52f9c6d2-074a-11ec-a179-f469d5c90e84', 'Emma', 'Cruz', 'Wilson', 'Female', '1980-11-11', '09122345678', '2101', 'Lopez Street', 'Barangay San Isidro', 'Quezon City', 'NCR', 'Active', '2021-08-27 23:20:34', NULL),
('5892f2c8-0762-11ec-a179-f469d5c90e84', 'Julietta', '', 'Fiscella', 'Female', '1980-11-11', '09122345678', '2101', 'Lopez Street', 'Barangay San Isidro', 'Quezon City', 'NCR', 'Active', '2021-08-28 02:12:32', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `patient_call_logs`
--

CREATE TABLE `patient_call_logs` (
  `patient_call_log_id` varchar(36) NOT NULL,
  `patient_record_id` varchar(36) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `patient_call_logs`
--

INSERT INTO `patient_call_logs` (`patient_call_log_id`, `patient_record_id`) VALUES
('52fdab3e-074a-11ec-a179-f469d5c90e84', '52fcc235-074a-11ec-a179-f469d5c90e84'),
('589d54cf-0762-11ec-a179-f469d5c90e84', '5899e941-0762-11ec-a179-f469d5c90e84');

-- --------------------------------------------------------

--
-- Table structure for table `patient_call_log_details`
--

CREATE TABLE `patient_call_log_details` (
  `call_log_detail_id` varchar(36) NOT NULL,
  `patient_call_log_id` varchar(36) DEFAULT NULL,
  `call_log_date` date NOT NULL,
  `contact_first_name` varchar(255) NOT NULL,
  `contact_last_name` varchar(255) NOT NULL,
  `contact_phone` varchar(255) NOT NULL,
  `call_details` varchar(255) NOT NULL,
  `follow_up_date` date DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `patient_call_log_details`
--

INSERT INTO `patient_call_log_details` (`call_log_detail_id`, `patient_call_log_id`, `call_log_date`, `contact_first_name`, `contact_last_name`, `contact_phone`, `call_details`, `follow_up_date`, `created_at`, `updated_at`) VALUES
('d74c96b5-0762-11ec-a179-f469d5c90e84', '52fdab3e-074a-11ec-a179-f469d5c90e84', '2021-08-12', 'John', 'Doe', '09123456434', 'settle bills', '0000-00-00', '2021-08-28 02:16:05', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `patient_records`
--

CREATE TABLE `patient_records` (
  `patient_record_id` varchar(36) NOT NULL,
  `patient_id` varchar(36) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `patient_records`
--

INSERT INTO `patient_records` (`patient_record_id`, `patient_id`, `created_at`, `updated_at`) VALUES
('52fcc235-074a-11ec-a179-f469d5c90e84', '52f9c6d2-074a-11ec-a179-f469d5c90e84', '2021-08-27 23:20:34', NULL),
('5899e941-0762-11ec-a179-f469d5c90e84', '5892f2c8-0762-11ec-a179-f469d5c90e84', '2021-08-28 02:12:33', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `prescriptions`
--

CREATE TABLE `prescriptions` (
  `prescription_id` varchar(36) NOT NULL,
  `patient_record_id` varchar(36) DEFAULT NULL,
  `medication_name` varchar(255) NOT NULL,
  `dosage` varchar(255) NOT NULL,
  `quantity` varchar(255) NOT NULL,
  `frequency` varchar(255) NOT NULL,
  `med_taken_for` varchar(255) NOT NULL,
  `doc_id` varchar(36) DEFAULT NULL,
  `prescription_notes` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `prescriptions`
--

INSERT INTO `prescriptions` (`prescription_id`, `patient_record_id`, `medication_name`, `dosage`, `quantity`, `frequency`, `med_taken_for`, `doc_id`, `prescription_notes`, `created_at`, `updated_at`) VALUES
('16698202-0762-11ec-a179-f469d5c90e84', '52fcc235-074a-11ec-a179-f469d5c90e84', 'Cephalexin HCL Monohydrate', '500mg/tab', '32', 'every 12 hrs', 'Per Oris', '5056d4f2-0755-11ec-a179-f469d5c90e84', 'asdf', '2021-08-28 02:10:41', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `problems`
--

CREATE TABLE `problems` (
  `problem_id` varchar(36) NOT NULL,
  `patient_record_id` varchar(36) DEFAULT NULL,
  `problem_name` varchar(255) NOT NULL,
  `problem_note` varchar(255) NOT NULL,
  `active_status` varchar(255) NOT NULL,
  `date_occured` date NOT NULL,
  `date_resolved` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `problems`
--

INSERT INTO `problems` (`problem_id`, `patient_record_id`, `problem_name`, `problem_note`, `active_status`, `date_occured`, `date_resolved`) VALUES
('b890883e-0753-11ec-a179-f469d5c90e84', '52fcc235-074a-11ec-a179-f469d5c90e84', 'Asthma', 'Lungs can become inflamed and swollen', 'Active', '2021-08-05', '0000-00-00');

-- --------------------------------------------------------

--
-- Table structure for table `progress_notes`
--

CREATE TABLE `progress_notes` (
  `progress_note_id` varchar(36) NOT NULL,
  `patient_record_id` varchar(36) DEFAULT NULL,
  `doc_id` varchar(36) DEFAULT NULL,
  `reason_for_consultation` varchar(255) NOT NULL,
  `physical_examination` varchar(255) NOT NULL,
  `impression` varchar(255) NOT NULL,
  `recommendation` varchar(255) NOT NULL,
  `next_appointment` date DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `progress_notes`
--

INSERT INTO `progress_notes` (`progress_note_id`, `patient_record_id`, `doc_id`, `reason_for_consultation`, `physical_examination`, `impression`, `recommendation`, `next_appointment`, `created_at`, `updated_at`) VALUES
('d9188bee-075d-11ec-a179-f469d5c90e84', '52fcc235-074a-11ec-a179-f469d5c90e84', 'aa97dcaa-0756-11ec-a179-f469d5c90e84', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ', 'It is a long established fact that a reader', 'It is a long established fact that a reader will be distracted by the readable content of a page', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using \'Content here, co', '2021-08-19', '2021-08-28 01:40:21', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` varchar(36) NOT NULL,
  `user_type_id` varchar(36) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `active_status` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `user_profiles`
--

CREATE TABLE `user_profiles` (
  `user_profile_id` varchar(36) NOT NULL,
  `user_id` varchar(36) DEFAULT NULL,
  `first_name` varchar(255) NOT NULL,
  `middle_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) NOT NULL,
  `suffix_name` varchar(255) DEFAULT NULL,
  `birth_date` date NOT NULL,
  `house_number` varchar(255) NOT NULL,
  `street` varchar(255) NOT NULL,
  `barangay` varchar(255) NOT NULL,
  `municipality` varchar(255) NOT NULL,
  `province` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `user_types`
--

CREATE TABLE `user_types` (
  `user_type_id` varchar(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `active_status` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `diagnosis`
--
ALTER TABLE `diagnosis`
  ADD PRIMARY KEY (`diagnosis_id`),
  ADD KEY `patient_record_id` (`patient_record_id`),
  ADD KEY `doc_id` (`doc_id`);

--
-- Indexes for table `doctors`
--
ALTER TABLE `doctors`
  ADD PRIMARY KEY (`doc_id`);

--
-- Indexes for table `lab_results`
--
ALTER TABLE `lab_results`
  ADD PRIMARY KEY (`lab_result_id`),
  ADD KEY `patient_record_id` (`patient_record_id`);

--
-- Indexes for table `medical_history`
--
ALTER TABLE `medical_history`
  ADD PRIMARY KEY (`history_id`),
  ADD KEY `patient_record_id` (`patient_record_id`);

--
-- Indexes for table `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`patient_id`);

--
-- Indexes for table `patient_call_logs`
--
ALTER TABLE `patient_call_logs`
  ADD PRIMARY KEY (`patient_call_log_id`),
  ADD KEY `patient_record_id` (`patient_record_id`);

--
-- Indexes for table `patient_call_log_details`
--
ALTER TABLE `patient_call_log_details`
  ADD PRIMARY KEY (`call_log_detail_id`),
  ADD KEY `patient_call_log_id` (`patient_call_log_id`);

--
-- Indexes for table `patient_records`
--
ALTER TABLE `patient_records`
  ADD PRIMARY KEY (`patient_record_id`),
  ADD KEY `patient_id` (`patient_id`);

--
-- Indexes for table `prescriptions`
--
ALTER TABLE `prescriptions`
  ADD PRIMARY KEY (`prescription_id`),
  ADD KEY `patient_record_id` (`patient_record_id`),
  ADD KEY `doc_id` (`doc_id`);

--
-- Indexes for table `problems`
--
ALTER TABLE `problems`
  ADD PRIMARY KEY (`problem_id`),
  ADD KEY `patient_record_id` (`patient_record_id`);

--
-- Indexes for table `progress_notes`
--
ALTER TABLE `progress_notes`
  ADD PRIMARY KEY (`progress_note_id`),
  ADD KEY `patient_record_id` (`patient_record_id`),
  ADD KEY `doc_id` (`doc_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD KEY `user_type_id` (`user_type_id`);

--
-- Indexes for table `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD PRIMARY KEY (`user_profile_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `user_types`
--
ALTER TABLE `user_types`
  ADD PRIMARY KEY (`user_type_id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `diagnosis`
--
ALTER TABLE `diagnosis`
  ADD CONSTRAINT `diagnosis_ibfk_1` FOREIGN KEY (`patient_record_id`) REFERENCES `patient_records` (`patient_record_id`),
  ADD CONSTRAINT `diagnosis_ibfk_2` FOREIGN KEY (`doc_id`) REFERENCES `doctors` (`doc_id`);

--
-- Constraints for table `lab_results`
--
ALTER TABLE `lab_results`
  ADD CONSTRAINT `lab_results_ibfk_1` FOREIGN KEY (`patient_record_id`) REFERENCES `patient_records` (`patient_record_id`);

--
-- Constraints for table `medical_history`
--
ALTER TABLE `medical_history`
  ADD CONSTRAINT `medical_history_ibfk_1` FOREIGN KEY (`patient_record_id`) REFERENCES `patient_records` (`patient_record_id`);

--
-- Constraints for table `patient_call_logs`
--
ALTER TABLE `patient_call_logs`
  ADD CONSTRAINT `patient_call_logs_ibfk_1` FOREIGN KEY (`patient_record_id`) REFERENCES `patient_records` (`patient_record_id`);

--
-- Constraints for table `patient_call_log_details`
--
ALTER TABLE `patient_call_log_details`
  ADD CONSTRAINT `patient_call_log_details_ibfk_1` FOREIGN KEY (`patient_call_log_id`) REFERENCES `patient_call_logs` (`patient_call_log_id`);

--
-- Constraints for table `patient_records`
--
ALTER TABLE `patient_records`
  ADD CONSTRAINT `patient_records_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`);

--
-- Constraints for table `prescriptions`
--
ALTER TABLE `prescriptions`
  ADD CONSTRAINT `prescriptions_ibfk_1` FOREIGN KEY (`patient_record_id`) REFERENCES `patient_records` (`patient_record_id`),
  ADD CONSTRAINT `prescriptions_ibfk_2` FOREIGN KEY (`doc_id`) REFERENCES `doctors` (`doc_id`);

--
-- Constraints for table `problems`
--
ALTER TABLE `problems`
  ADD CONSTRAINT `problems_ibfk_1` FOREIGN KEY (`patient_record_id`) REFERENCES `patient_records` (`patient_record_id`);

--
-- Constraints for table `progress_notes`
--
ALTER TABLE `progress_notes`
  ADD CONSTRAINT `progress_notes_ibfk_1` FOREIGN KEY (`patient_record_id`) REFERENCES `patient_records` (`patient_record_id`),
  ADD CONSTRAINT `progress_notes_ibfk_2` FOREIGN KEY (`doc_id`) REFERENCES `doctors` (`doc_id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`user_type_id`) REFERENCES `user_types` (`user_type_id`);

--
-- Constraints for table `user_profiles`
--
ALTER TABLE `user_profiles`
  ADD CONSTRAINT `user_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
