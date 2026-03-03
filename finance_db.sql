-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: mysql
-- Generation Time: Mar 03, 2026 at 04:26 PM
-- Server version: 8.4.8
-- PHP Version: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `finance_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `accountmaster`
--

CREATE TABLE `accountmaster` (
  `visibility` bit(1) DEFAULT NULL,
  `id` bigint NOT NULL,
  `code` varchar(255) DEFAULT NULL,
  `master_code` varchar(255) DEFAULT NULL,
  `master_icon` varchar(255) DEFAULT NULL,
  `person_type` varchar(255) DEFAULT NULL,
  `trans_type` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `business_member`
--

CREATE TABLE `business_member` (
  `amount` decimal(38,2) DEFAULT NULL,
  `cheque_reminder` bit(1) DEFAULT NULL,
  `duration` int DEFAULT NULL,
  `installment` decimal(38,2) DEFAULT NULL,
  `interest` decimal(38,2) DEFAULT NULL,
  `paid_installments` int DEFAULT NULL,
  `part_interest` int DEFAULT NULL,
  `part_principal` int DEFAULT NULL,
  `status` bit(1) DEFAULT NULL,
  `unpaid_late_fee` decimal(38,2) DEFAULT NULL,
  `end_date` datetime(6) DEFAULT NULL,
  `start_date` datetime(6) DEFAULT NULL,
  `business_id` varchar(255) DEFAULT NULL,
  `business_member_id` varchar(255) NOT NULL,
  `customer_id` varchar(255) DEFAULT NULL,
  `guarantor1_id` varchar(255) DEFAULT NULL,
  `guarantor23id` varchar(255) DEFAULT NULL,
  `guarantor2_id` varchar(255) DEFAULT NULL,
  `loan_status` varchar(255) DEFAULT NULL,
  `partner_id` varchar(255) DEFAULT NULL,
  `security` varchar(255) DEFAULT NULL,
  `sys_date` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `business_member`
--

INSERT INTO `business_member` (`amount`, `cheque_reminder`, `duration`, `installment`, `interest`, `paid_installments`, `part_interest`, `part_principal`, `status`, `unpaid_late_fee`, `end_date`, `start_date`, `business_id`, `business_member_id`, `customer_id`, `guarantor1_id`, `guarantor23id`, `guarantor2_id`, `loan_status`, `partner_id`, `security`, `sys_date`) VALUES
(500000.00, b'1', 12, 43000.00, 5.50, 0, 16500, 125000, b'1', 0.00, '2027-03-01 10:00:00.000000', '2026-03-01 10:00:00.000000', '', 'DF2026-31', 'C14', NULL, NULL, NULL, 'ACTIVE', NULL, 'Property Collateral', NULL),
(500000.00, b'1', 12, 43000.00, 5.50, 0, 16500, 125000, b'1', 0.00, '2027-03-01 10:00:00.000000', '2026-03-01 10:00:00.000000', '', 'MF2026-14', 'C14', NULL, NULL, NULL, 'ACTIVE', NULL, 'Property Collateral', NULL),
(500000.00, b'1', 12, 43000.00, 5.50, 0, 16500, 125000, b'1', 0.00, '2027-03-01 10:00:00.000000', '2026-03-01 10:00:00.000000', '', 'MF2026-15', 'C14', NULL, NULL, NULL, 'ACTIVE', NULL, 'Property Collateral', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `business_member_daily_finance_sequence`
--

CREATE TABLE `business_member_daily_finance_sequence` (
  `id` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `business_member_daily_finance_sequence`
--

INSERT INTO `business_member_daily_finance_sequence` (`id`) VALUES
(28),
(29),
(30),
(31);

-- --------------------------------------------------------

--
-- Table structure for table `business_member_monthly_finance_sequence`
--

CREATE TABLE `business_member_monthly_finance_sequence` (
  `id` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `business_member_monthly_finance_sequence`
--

INSERT INTO `business_member_monthly_finance_sequence` (`id`) VALUES
(12),
(13),
(14),
(15);

-- --------------------------------------------------------

--
-- Table structure for table `cash_book`
--

CREATE TABLE `cash_book` (
  `credit` decimal(38,2) NOT NULL,
  `debit` decimal(38,2) NOT NULL,
  `line_no` int DEFAULT NULL,
  `cash_book_id` bigint NOT NULL,
  `sys_date` datetime(6) DEFAULT NULL,
  `trans_date` datetime(6) DEFAULT NULL,
  `bm_remarks` varchar(255) DEFAULT NULL,
  `business_member_id` varchar(255) DEFAULT NULL,
  `entry_user` varchar(255) DEFAULT NULL,
  `particulars` varchar(255) DEFAULT NULL,
  `personal_info_id` varchar(255) DEFAULT NULL,
  `receipt_remarks` varchar(255) DEFAULT NULL,
  `trans_type` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `cash_book`
--

INSERT INTO `cash_book` (`credit`, `debit`, `line_no`, `cash_book_id`, `sys_date`, `trans_date`, `bm_remarks`, `business_member_id`, `entry_user`, `particulars`, `personal_info_id`, `receipt_remarks`, `trans_type`) VALUES
(0.00, 500000.00, 1, 3, '2026-03-03 16:24:13.439295', '2026-03-03 16:24:13.432885', '', 'DF2026-31', 'anonymousUser', 'DF LOAN', 'C14', '', 'DF LOAN'),
(2000.00, 0.00, 2, 4, '2026-03-03 16:24:13.515530', '2026-03-03 16:24:13.432885', '', 'DF2026-31', 'anonymousUser', 'DF DOC CHARGES', 'C14', '', 'DF DOC CHARGES'),
(11000.00, 0.00, 3, 5, '2026-03-03 16:24:13.560824', '2026-03-03 16:24:13.432885', '', 'DF2026-31', 'anonymousUser', 'DF INTEREST', 'C14', '', 'DF INTEREST'),
(0.00, 500000.00, 1, 6, '2026-03-03 16:24:26.320165', '2026-03-03 16:24:26.310312', '', 'MF2026-15', 'anonymousUser', 'MF LOAN', 'C14', '', 'MF LOAN'),
(2000.00, 0.00, 2, 7, '2026-03-03 16:24:26.377763', '2026-03-03 16:24:26.310312', '', 'MF2026-15', 'anonymousUser', 'MF DOC CHARGES', 'C14', '', 'MF DOC CHARGES'),
(41666.67, 0.00, 1, 8, '2026-03-03 16:30:22.125109', '2026-03-03 12:29:00.000000', NULL, 'MF2026-15', 'anonymousUser', 'MF LOAN INSTALLMENT', 'C14', NULL, 'MF LOAN'),
(1333.33, 0.00, 2, 9, '2026-03-03 16:30:22.127307', '2026-03-03 12:29:00.000000', NULL, 'MF2026-15', 'anonymousUser', 'MF INTEREST', 'C14', NULL, 'MF INTEREST'),
(100.00, 0.00, 3, 10, '2026-03-03 16:30:22.129372', '2026-03-03 12:29:00.000000', NULL, 'MF2026-15', 'anonymousUser', 'MF LATE FEE', 'C14', NULL, 'MF LATE FEE');

-- --------------------------------------------------------

--
-- Table structure for table `cash_book_backup`
--

CREATE TABLE `cash_book_backup` (
  `credit` decimal(19,2) DEFAULT NULL,
  `current_installment_number` int DEFAULT NULL,
  `debit` decimal(19,2) DEFAULT NULL,
  `line_no` int DEFAULT NULL,
  `pending_balance` decimal(19,2) DEFAULT NULL,
  `cash_book_backup_id` bigint NOT NULL,
  `cash_book_old_id` bigint NOT NULL,
  `deleteddate` datetime(6) DEFAULT NULL,
  `sys_date` datetime(6) DEFAULT NULL,
  `trans_date` datetime(6) DEFAULT NULL,
  `entry_user` varchar(100) DEFAULT NULL,
  `trans_type` varchar(100) DEFAULT NULL,
  `bm_remarks` varchar(500) DEFAULT NULL,
  `receipt_remarks` varchar(500) DEFAULT NULL,
  `business_member_id` varchar(255) DEFAULT NULL,
  `comments` varchar(255) DEFAULT NULL,
  `deletedby` varchar(255) DEFAULT NULL,
  `particulars` varchar(255) DEFAULT NULL,
  `personal_info_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `emi`
--

CREATE TABLE `emi` (
  `emi_id` int NOT NULL,
  `installment_number` int NOT NULL,
  `interest_amount` decimal(38,2) DEFAULT NULL,
  `paid_amount` decimal(38,2) DEFAULT NULL,
  `principal_amount` decimal(38,2) DEFAULT NULL,
  `total_amount` decimal(38,2) DEFAULT NULL,
  `due_date` datetime(6) DEFAULT NULL,
  `payment_date` datetime(6) DEFAULT NULL,
  `business_member_id` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `emi`
--

INSERT INTO `emi` (`emi_id`, `installment_number`, `interest_amount`, `paid_amount`, `principal_amount`, `total_amount`, `due_date`, `payment_date`, `business_member_id`, `status`) VALUES
(13, 1, 0.00, 0.00, 41666.67, 41666.67, '2026-04-01 10:00:00.000000', NULL, 'DF2026-31', 'PENDING'),
(14, 2, 0.00, 0.00, 41666.67, 41666.67, '2026-05-01 10:00:00.000000', NULL, 'DF2026-31', 'PENDING'),
(15, 3, 0.00, 0.00, 41666.67, 41666.67, '2026-06-01 10:00:00.000000', NULL, 'DF2026-31', 'PENDING'),
(16, 4, 0.00, 0.00, 41666.67, 41666.67, '2026-07-01 10:00:00.000000', NULL, 'DF2026-31', 'PENDING'),
(17, 5, 0.00, 0.00, 41666.67, 41666.67, '2026-08-01 10:00:00.000000', NULL, 'DF2026-31', 'PENDING'),
(18, 6, 0.00, 0.00, 41666.67, 41666.67, '2026-09-01 10:00:00.000000', NULL, 'DF2026-31', 'PENDING'),
(19, 7, 0.00, 0.00, 41666.67, 41666.67, '2026-10-01 10:00:00.000000', NULL, 'DF2026-31', 'PENDING'),
(20, 8, 0.00, 0.00, 41666.67, 41666.67, '2026-11-01 10:00:00.000000', NULL, 'DF2026-31', 'PENDING'),
(21, 9, 0.00, 0.00, 41666.67, 41666.67, '2026-12-01 10:00:00.000000', NULL, 'DF2026-31', 'PENDING'),
(22, 10, 0.00, 0.00, 41666.67, 41666.67, '2027-01-01 10:00:00.000000', NULL, 'DF2026-31', 'PENDING'),
(23, 11, 0.00, 0.00, 41666.67, 41666.67, '2027-02-01 10:00:00.000000', NULL, 'DF2026-31', 'PENDING'),
(24, 12, 0.00, 0.00, 41666.67, 41666.67, '2027-03-01 10:00:00.000000', NULL, 'DF2026-31', 'PENDING'),
(25, 1, 0.46, 41667.13, 41666.67, 41667.13, '2026-04-01 10:00:00.000000', '2026-03-03 12:29:00.000000', 'MF2026-15', 'PAID'),
(26, 2, 0.46, 1332.87, 41666.67, 41667.13, '2026-05-01 10:00:00.000000', '2026-03-03 12:29:00.000000', 'MF2026-15', 'PENDING'),
(27, 3, 0.46, 0.00, 41666.67, 41667.13, '2026-06-01 10:00:00.000000', NULL, 'MF2026-15', 'PENDING'),
(28, 4, 0.46, 0.00, 41666.67, 41667.13, '2026-07-01 10:00:00.000000', NULL, 'MF2026-15', 'PENDING'),
(29, 5, 0.46, 0.00, 41666.67, 41667.13, '2026-08-01 10:00:00.000000', NULL, 'MF2026-15', 'PENDING'),
(30, 6, 0.46, 0.00, 41666.67, 41667.13, '2026-09-01 10:00:00.000000', NULL, 'MF2026-15', 'PENDING'),
(31, 7, 0.46, 0.00, 41666.67, 41667.13, '2026-10-01 10:00:00.000000', NULL, 'MF2026-15', 'PENDING'),
(32, 8, 0.46, 0.00, 41666.67, 41667.13, '2026-11-01 10:00:00.000000', NULL, 'MF2026-15', 'PENDING'),
(33, 9, 0.46, 0.00, 41666.67, 41667.13, '2026-12-01 10:00:00.000000', NULL, 'MF2026-15', 'PENDING'),
(34, 10, 0.46, 0.00, 41666.67, 41667.13, '2027-01-01 10:00:00.000000', NULL, 'MF2026-15', 'PENDING'),
(35, 11, 0.46, 0.00, 41666.67, 41667.13, '2027-02-01 10:00:00.000000', NULL, 'MF2026-15', 'PENDING'),
(36, 12, 0.46, 0.00, 41666.67, 41667.13, '2027-03-01 10:00:00.000000', NULL, 'MF2026-15', 'PENDING');

-- --------------------------------------------------------

--
-- Table structure for table `personal_customer_sequence_table`
--

CREATE TABLE `personal_customer_sequence_table` (
  `id` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `personal_customer_sequence_table`
--

INSERT INTO `personal_customer_sequence_table` (`id`) VALUES
(1),
(2),
(3),
(4),
(5),
(6),
(7),
(8),
(9),
(10),
(11),
(12),
(13),
(14);

-- --------------------------------------------------------

--
-- Table structure for table `personal_employee_sequence_table`
--

CREATE TABLE `personal_employee_sequence_table` (
  `id` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `personal_employee_sequence_table`
--

INSERT INTO `personal_employee_sequence_table` (`id`) VALUES
(1),
(2),
(3);

-- --------------------------------------------------------

--
-- Table structure for table `personal_info`
--

CREATE TABLE `personal_info` (
  `bussiness_exemption` bit(1) DEFAULT NULL,
  `disable` bit(1) DEFAULT NULL,
  `loan_limit` decimal(38,2) DEFAULT NULL,
  `shares` decimal(38,2) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `address2` varchar(255) DEFAULT NULL,
  `age` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `father_name` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL,
  `id_proof` varchar(255) DEFAULT NULL,
  `id_proof_type` varchar(255) DEFAULT NULL,
  `intro_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `mobile` varchar(255) DEFAULT NULL,
  `mobile2` varchar(255) DEFAULT NULL,
  `occupation` varchar(255) DEFAULT NULL,
  `old_id` varchar(255) DEFAULT NULL,
  `personal_info_id` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `phone2` varchar(255) DEFAULT NULL,
  `reference` varchar(255) DEFAULT NULL,
  `spouse` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `personal_info`
--

INSERT INTO `personal_info` (`bussiness_exemption`, `disable`, `loan_limit`, `shares`, `address`, `address2`, `age`, `category`, `father_name`, `first_name`, `gender`, `id_proof`, `id_proof_type`, `intro_name`, `last_name`, `mobile`, `mobile2`, `occupation`, `old_id`, `personal_info_id`, `phone`, `phone2`, `reference`, `spouse`) VALUES
(b'0', b'0', 500000.00, 50.00, '123 MG Road, Kukatpalli, Hyderabad, Telangana, India', 'Apartment 5B, MG Residency, Hyderabad', '35', 'CUSTOMER', 'Ramesh Korata', 'Mahesh', 'Male', 'A123456789', 'Aadhar Card', 'Ramesh Babu', 'Korata', '+91-9876543210', '+91-9123456780', 'Software Engineer', 'OLDCUST123', 'C14', '+91-40-12345678', '+91-40-87654321', 'Suresh Babu', 'Sita Korata');

-- --------------------------------------------------------

--
-- Table structure for table `personal_partner_sequence_table`
--

CREATE TABLE `personal_partner_sequence_table` (
  `id` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `personal_partner_sequence_table`
--

INSERT INTO `personal_partner_sequence_table` (`id`) VALUES
(1),
(2);

-- --------------------------------------------------------

--
-- Table structure for table `personal_vendor_sequence_table`
--

CREATE TABLE `personal_vendor_sequence_table` (
  `id` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint NOT NULL,
  `cell` varchar(255) DEFAULT NULL,
  `menu` varchar(255) DEFAULT NULL,
  `submenu` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `password`, `role`) VALUES
(1, 'admin', '$2a$10$6./v2SpB9UtOooJFblmcFemXunpYGDnq8UtLok5VFkGRyYOh35J.6', 'ROLE_ADMIN');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accountmaster`
--
ALTER TABLE `accountmaster`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `business_member`
--
ALTER TABLE `business_member`
  ADD PRIMARY KEY (`business_member_id`),
  ADD KEY `FKldwvwbo4b9hqknyitecbnax2l` (`customer_id`),
  ADD KEY `FK46qodb5py4co9xbfnlcfurwd7` (`guarantor1_id`),
  ADD KEY `FKeim3w19msns7skr8v4iylupo` (`guarantor2_id`),
  ADD KEY `FKcmapbuap9krutaxwrqdh2x911` (`guarantor23id`),
  ADD KEY `FKofmeyctdwbgt3nc2j3b6r23p8` (`partner_id`);

--
-- Indexes for table `business_member_daily_finance_sequence`
--
ALTER TABLE `business_member_daily_finance_sequence`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `business_member_monthly_finance_sequence`
--
ALTER TABLE `business_member_monthly_finance_sequence`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cash_book`
--
ALTER TABLE `cash_book`
  ADD PRIMARY KEY (`cash_book_id`),
  ADD KEY `FK76ejk0uvot77h8y5x4iu7fsav` (`business_member_id`),
  ADD KEY `FK585k25g9ds98r717d6iuf1vxp` (`personal_info_id`);

--
-- Indexes for table `cash_book_backup`
--
ALTER TABLE `cash_book_backup`
  ADD PRIMARY KEY (`cash_book_backup_id`),
  ADD KEY `FKotqvyk31yc971mc2r3syr8k0h` (`business_member_id`),
  ADD KEY `FKmxaiv4o5vjcac0jxss7a10cpf` (`personal_info_id`);

--
-- Indexes for table `emi`
--
ALTER TABLE `emi`
  ADD PRIMARY KEY (`emi_id`),
  ADD KEY `FK8a9jg5qv2p99hij95gqrn8u53` (`business_member_id`);

--
-- Indexes for table `personal_customer_sequence_table`
--
ALTER TABLE `personal_customer_sequence_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `personal_employee_sequence_table`
--
ALTER TABLE `personal_employee_sequence_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `personal_info`
--
ALTER TABLE `personal_info`
  ADD PRIMARY KEY (`personal_info_id`);

--
-- Indexes for table `personal_partner_sequence_table`
--
ALTER TABLE `personal_partner_sequence_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `personal_vendor_sequence_table`
--
ALTER TABLE `personal_vendor_sequence_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK3g1j96g94xpk3lpxl2qbl985x` (`name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accountmaster`
--
ALTER TABLE `accountmaster`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `business_member_daily_finance_sequence`
--
ALTER TABLE `business_member_daily_finance_sequence`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `business_member_monthly_finance_sequence`
--
ALTER TABLE `business_member_monthly_finance_sequence`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `cash_book`
--
ALTER TABLE `cash_book`
  MODIFY `cash_book_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `cash_book_backup`
--
ALTER TABLE `cash_book_backup`
  MODIFY `cash_book_backup_id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `emi`
--
ALTER TABLE `emi`
  MODIFY `emi_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `personal_customer_sequence_table`
--
ALTER TABLE `personal_customer_sequence_table`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `personal_employee_sequence_table`
--
ALTER TABLE `personal_employee_sequence_table`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `personal_partner_sequence_table`
--
ALTER TABLE `personal_partner_sequence_table`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `personal_vendor_sequence_table`
--
ALTER TABLE `personal_vendor_sequence_table`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `business_member`
--
ALTER TABLE `business_member`
  ADD CONSTRAINT `FK46qodb5py4co9xbfnlcfurwd7` FOREIGN KEY (`guarantor1_id`) REFERENCES `personal_info` (`personal_info_id`),
  ADD CONSTRAINT `FKcmapbuap9krutaxwrqdh2x911` FOREIGN KEY (`guarantor23id`) REFERENCES `personal_info` (`personal_info_id`),
  ADD CONSTRAINT `FKeim3w19msns7skr8v4iylupo` FOREIGN KEY (`guarantor2_id`) REFERENCES `personal_info` (`personal_info_id`),
  ADD CONSTRAINT `FKldwvwbo4b9hqknyitecbnax2l` FOREIGN KEY (`customer_id`) REFERENCES `personal_info` (`personal_info_id`),
  ADD CONSTRAINT `FKofmeyctdwbgt3nc2j3b6r23p8` FOREIGN KEY (`partner_id`) REFERENCES `personal_info` (`personal_info_id`);

--
-- Constraints for table `cash_book`
--
ALTER TABLE `cash_book`
  ADD CONSTRAINT `FK585k25g9ds98r717d6iuf1vxp` FOREIGN KEY (`personal_info_id`) REFERENCES `personal_info` (`personal_info_id`),
  ADD CONSTRAINT `FK76ejk0uvot77h8y5x4iu7fsav` FOREIGN KEY (`business_member_id`) REFERENCES `business_member` (`business_member_id`);

--
-- Constraints for table `cash_book_backup`
--
ALTER TABLE `cash_book_backup`
  ADD CONSTRAINT `FKmxaiv4o5vjcac0jxss7a10cpf` FOREIGN KEY (`personal_info_id`) REFERENCES `personal_info` (`personal_info_id`),
  ADD CONSTRAINT `FKotqvyk31yc971mc2r3syr8k0h` FOREIGN KEY (`business_member_id`) REFERENCES `business_member` (`business_member_id`);

--
-- Constraints for table `emi`
--
ALTER TABLE `emi`
  ADD CONSTRAINT `FK8a9jg5qv2p99hij95gqrn8u53` FOREIGN KEY (`business_member_id`) REFERENCES `business_member` (`business_member_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
