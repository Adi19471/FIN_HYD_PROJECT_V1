-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: mysql
-- Generation Time: Apr 16, 2026 at 06:26 PM
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
  `id` bigint NOT NULL,
  `visibility` bit(1) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `master_code` varchar(255) DEFAULT NULL,
  `master_icon` varchar(255) DEFAULT NULL,
  `person_type` varchar(255) DEFAULT NULL,
  `trans_type` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `created_date` datetime(6) DEFAULT NULL,
  `modified_by` varchar(255) DEFAULT NULL,
  `modified_date` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `accountmaster`
--

INSERT INTO `accountmaster` (`id`, `visibility`, `code`, `master_code`, `master_icon`, `person_type`, `trans_type`, `type`, `created_by`, `created_date`, `modified_by`, `modified_date`) VALUES
(1, b'1', 'ANNIVARSARY EXPENCES', 'OFFICE EXPENSES', '/images/expenses-3.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES', NULL, NULL, NULL, NULL),
(2, b'1', 'BANK CHARGES', 'OFFICE EXPENSES', '/images/expenses-3.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES', NULL, NULL, NULL, NULL),
(3, b'1', 'BONUS', 'SALARIES', '/images/salary.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES', NULL, NULL, NULL, NULL),
(4, b'1', 'CABLE TV BILL', 'OFFICE EXPENSES', '/images/expenses-3.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES', NULL, NULL, NULL, NULL),
(5, b'1', 'CAPITAL', 'CAPITAL', '/images/capital.png', 'Partner', 'Debit,Credit', 'LIABILITIES', NULL, NULL, NULL, NULL),
(6, b'1', 'CAPITAL EXCESS', 'CAPITAL', '/images/capital.png', 'Partner', 'Debit,Credit', 'LIABILITIES', NULL, NULL, NULL, NULL),
(7, b'1', 'CAPITAL LATE INT', 'CAPITAL', '/images/capital.png', 'Partner', 'Credit', 'REVENUES', NULL, NULL, NULL, NULL),
(8, b'1', 'CHITS INSTALLMENTS', 'CHITS', '/images/advance.png', 'Employee,Vendor,Customer,Partner', 'Debit,Credit', 'ASSETS', NULL, NULL, NULL, NULL),
(9, b'1', 'COMPANY SAVINGS', 'SAVINGS', '/images/savings.png', 'Employee,Vendor,Customer,Partner', 'Debit,Credit', 'LIABILITIES', NULL, NULL, NULL, NULL),
(10, b'1', 'CUSTOMER SAVINGS', 'SAVINGS', '/images/savings.png', 'Employee,Vendor,Customer,Partner', 'Debit,Credit', 'LIABILITIES', NULL, NULL, NULL, NULL),
(11, b'1', 'DONATION', 'OFFICE EXPENSES', '/images/expenses-3.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES', NULL, NULL, NULL, NULL),
(12, b'1', 'ELECTRICITY BILL', 'OFFICE EXPENSES', '/images/expenses-3.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES', NULL, NULL, NULL, NULL),
(13, b'1', 'EMPLOYEES', 'SALARIES', '/images/salary.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES', NULL, NULL, NULL, NULL),
(14, b'1', 'EXTRA INCOME', 'EXTRA INCOME', '/images/income.png', 'Employee,Vendor,Customer,Partner', 'Credit', 'REVENUES', NULL, NULL, NULL, NULL),
(15, b'1', 'FUEL', 'OFFICE EXPENSES', '/images/expenses-3.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES', NULL, NULL, NULL, NULL),
(16, b'1', 'HAND LOAN', 'HAND LOAN', '/images/savings.png', 'Employee,Vendor,Customer,Partner', 'Debit,Credit', 'LIABILITIES', NULL, NULL, NULL, NULL),
(17, b'1', 'HDFC', 'BANK ACCOUNTS', '/images/advance.png', 'Employee,Vendor,Customer,Partner', 'Debit,Credit', 'ASSETS', NULL, NULL, NULL, NULL),
(18, b'1', 'INTEREST PAID', 'INTEREST', '/images/payments.png', 'Employee,Vendor,Customer,Partner', 'Debit,Credit', 'REVENUES', NULL, NULL, NULL, NULL),
(19, b'1', 'INTREST', 'C.D.INTREST', '/images/savings.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES', NULL, NULL, NULL, NULL),
(20, b'1', 'MD MEETING FEE', 'MEETING FEE', '/images/expenses-3.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES', NULL, NULL, NULL, NULL),
(21, b'1', 'MD SALARY', 'SALARIES', '/images/salary.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES', NULL, NULL, NULL, NULL),
(22, b'1', 'MEETING FEE', 'OFFICE EXPENSES', '/images/expenses-3.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES', NULL, NULL, NULL, NULL),
(23, b'1', 'NEWS PAPER BILL', 'OFFICE EXPENSES', '/images/expenses-3.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES', NULL, NULL, NULL, NULL),
(24, b'1', 'OFFICE MAINTAINANCE', 'OFFICE EXPENSES', '/images/expenses-3.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES', NULL, NULL, NULL, NULL),
(25, b'1', 'OFFICE RENT', 'OFFICE EXPENSES', '/images/expenses-3.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES', NULL, NULL, NULL, NULL),
(26, b'1', 'OTHERS', 'OFFICE EXPENSES', '/images/expenses-3.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES', NULL, NULL, NULL, NULL),
(27, b'1', 'PARTNER', 'SHERE AMOUNT', '/images/furniture.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES', NULL, NULL, NULL, NULL),
(28, b'1', 'PARTNER MEETING FEE', 'MEETING FEE', '/images/expenses-3.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES', NULL, NULL, NULL, NULL),
(29, b'1', 'PARTNERS', 'SALARIES', '/images/salary.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES', NULL, NULL, NULL, NULL),
(30, b'1', 'PARTNERS DIVIDENDS', 'DIVIDENDS', '/images/savings.png', 'Employee,Vendor,Customer,Partner', 'Debit,Credit', 'EXPENSES', NULL, NULL, NULL, NULL),
(31, b'1', 'POOJA', 'OFFICE EXPENSES', '/images/expenses-3.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES', NULL, NULL, NULL, NULL),
(32, b'1', 'PRINTING & STATIONERY', 'OFFICE EXPENSES', '/images/expenses-3.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES', NULL, NULL, NULL, NULL),
(33, b'1', 'PROFESSIONAL CHARGES', 'OFFICE EXPENSES', '/images/expenses-3.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES', NULL, NULL, NULL, NULL),
(34, b'1', 'RENT ADVANCE', 'ADVANCES', '/images/advance.png', 'Employee,Vendor,Customer,Partner', 'Debit,Credit', 'ASSETS', NULL, NULL, NULL, NULL),
(35, b'1', 'SALARY', 'SALARIES', '/images/salary.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES', NULL, NULL, NULL, NULL),
(36, b'1', 'SALARY ADVANCE', 'ADVANCES', '/images/advance.png', 'Employee,Vendor,Customer,Partner', 'Debit,Credit', 'ASSETS', NULL, NULL, NULL, NULL),
(37, b'1', 'SHERE', 'SHERE AMOUNT', '/images/furniture.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES', NULL, NULL, NULL, NULL),
(38, b'1', 'STAMPS', 'OFFICE EXPENSES', '/images/expenses-3.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES', NULL, NULL, NULL, NULL),
(39, b'1', 'TEA', 'OFFICE EXPENSES', '/images/expenses-3.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES', NULL, NULL, NULL, NULL),
(40, b'1', 'TELEPHONE BILL', 'OFFICE EXPENSES', '/images/expenses-3.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES', NULL, NULL, NULL, NULL),
(41, b'1', 'TOUR EXPENDITURE', 'OFFICE EXPENSES', '/images/expenses-3.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES', NULL, NULL, NULL, NULL),
(42, b'1', 'VEHICLE', 'ASSETS', '/images/loans.png', 'Employee,Vendor,Customer,Partner', 'Debit,Credit', 'ASSETS', NULL, NULL, NULL, NULL),
(43, b'1', 'VEHICLE MAINTAINANCE', 'VEHICLE MAINTAINANCE', '/images/savings.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES', NULL, NULL, NULL, NULL),
(44, b'1', 'WATER BILLS', 'OFFICE EXPENSES', '/images/expenses-3.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES', NULL, NULL, NULL, NULL),
(45, b'0', 'DF DOC CHARGES', 'DOCUMENT CHARGES', NULL, NULL, NULL, 'REVENUES', NULL, NULL, NULL, NULL),
(46, b'0', 'DF INTEREST', 'INTEREST', NULL, NULL, NULL, 'REVENUES', NULL, NULL, NULL, NULL),
(47, b'0', 'DF LATE FEE', 'LATE FEE', NULL, NULL, NULL, 'REVENUES', NULL, NULL, NULL, NULL),
(48, b'0', 'DF LOAN', 'LOANS', NULL, NULL, NULL, 'ASSETS', NULL, NULL, NULL, NULL),
(49, b'0', 'MF DOC CHARGES', 'DOCUMENT CHARGES', NULL, NULL, NULL, 'REVENUES', NULL, NULL, NULL, NULL),
(50, b'0', 'MF INTEREST', 'INTEREST', NULL, NULL, NULL, 'REVENUES', NULL, NULL, NULL, NULL),
(51, b'0', 'MF LATE FEE', 'LATE FEE', NULL, NULL, NULL, 'REVENUES', NULL, NULL, NULL, NULL),
(52, b'0', 'MF LOAN', 'LOANS', NULL, NULL, NULL, 'ASSETS', NULL, NULL, NULL, NULL),
(53, b'0', 'DF LOAN INSTALLMENT', 'DF LOAN INSTALLMENT', NULL, NULL, NULL, 'REVENUES', NULL, NULL, NULL, NULL),
(54, b'0', 'MF LOAN INSTALLMENT', 'MF LOAN INSTALLMENT', NULL, NULL, NULL, 'REVENUES', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `business_member`
--

CREATE TABLE `business_member` (
  `business_member_id` varchar(255) NOT NULL,
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
  `customer_id` varchar(255) DEFAULT NULL,
  `guarantor1_id` varchar(255) DEFAULT NULL,
  `guarantor23id` varchar(255) DEFAULT NULL,
  `guarantor2_id` varchar(255) DEFAULT NULL,
  `loan_status` varchar(255) DEFAULT NULL,
  `partner_id` varchar(255) DEFAULT NULL,
  `security` varchar(255) DEFAULT NULL,
  `sys_date` datetime(6) DEFAULT NULL,
  `interest_rate` decimal(38,2) DEFAULT NULL,
  `loan_type` varchar(255) DEFAULT NULL,
  `processing_fee` decimal(38,2) DEFAULT NULL,
  `sequence` int DEFAULT NULL,
  `year` int DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `created_date` datetime(6) DEFAULT NULL,
  `modified_by` varchar(255) DEFAULT NULL,
  `modified_date` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `business_member`
--

INSERT INTO `business_member` (`business_member_id`, `amount`, `cheque_reminder`, `duration`, `installment`, `interest`, `paid_installments`, `part_interest`, `part_principal`, `status`, `unpaid_late_fee`, `end_date`, `start_date`, `business_id`, `customer_id`, `guarantor1_id`, `guarantor23id`, `guarantor2_id`, `loan_status`, `partner_id`, `security`, `sys_date`, `interest_rate`, `loan_type`, `processing_fee`, `sequence`, `year`, `created_by`, `created_date`, `modified_by`, `modified_date`) VALUES
('DF2026-01', 80000.00, b'0', 100, 800.00, 8000.00, 0, 0, 0, b'0', 0.00, '2026-04-23 12:42:50.000000', '2026-01-13 12:42:50.000000', NULL, 'C38', 'P5', NULL, NULL, 'ACTIVE', 'P5', '', '2026-04-13 12:44:25.069401', 3.00, 'DAILY_FINANCE', 800.00, 1, 2026, NULL, NULL, NULL, NULL),
('MF2025-01', 30000.00, b'0', 10, 3900.00, 9000.00, 0, 0, 0, b'0', 0.00, '2026-10-10 21:23:19.000000', '2025-12-10 21:23:19.000000', NULL, 'C17', 'P3', NULL, NULL, 'ACTIVE', NULL, '', '2026-03-25 21:25:01.787009', 3.00, 'MONTHLY_FINANCE', 300.00, 1, 2025, NULL, NULL, NULL, NULL),
('MF2025-02', 50000.00, b'0', 10, 6500.00, 15000.00, 0, 0, 0, b'0', 0.00, '2026-10-11 20:34:31.000000', '2025-12-11 20:34:31.000000', NULL, 'C18', 'C17', NULL, NULL, 'ACTIVE', NULL, '', '2026-03-28 20:36:36.594786', 3.00, 'MONTHLY_FINANCE', 500.00, 2, 2025, NULL, NULL, 'admin', '2026-04-16 23:02:17.561245'),
('MF2025-03', 50000.00, b'0', 10, 6500.00, 15000.00, 0, 0, 0, b'0', 0.00, '2026-10-13 20:43:15.000000', '2025-12-13 20:43:15.000000', NULL, 'C19', 'P5', NULL, NULL, 'ACTIVE', NULL, '', '2026-03-28 20:45:03.761917', 3.00, 'MONTHLY_FINANCE', 500.00, 3, 2025, NULL, NULL, 'admin', '2026-04-16 23:02:07.583431'),
('MF2025-04', 200000.00, b'0', 10, 26000.00, 60000.00, 0, 0, 0, b'0', 0.00, '2026-10-15 20:45:52.000000', '2025-12-15 20:45:52.000000', NULL, 'C20', 'C20', NULL, NULL, 'ACTIVE', NULL, '', '2026-03-28 20:51:44.327864', 3.00, 'MONTHLY_FINANCE', 2000.00, 4, 2025, NULL, NULL, 'admin', '2026-04-16 23:02:01.535191'),
('MF2025-05', 150000.00, b'0', 10, 19500.00, 45000.00, 0, 0, 0, b'0', 0.00, '2026-10-16 18:44:52.000000', '2025-12-16 18:44:52.000000', NULL, 'C21', 'C21', NULL, NULL, 'ACTIVE', NULL, '', '2026-03-30 18:46:26.860239', 3.00, 'MONTHLY_FINANCE', 1500.00, 5, 2025, NULL, NULL, 'admin', '2026-04-16 23:01:55.707380'),
('MF2025-06', 100000.00, b'0', 5, 23000.00, 15000.00, 0, 0, 0, b'0', 0.00, '2026-05-17 18:52:39.000000', '2025-12-17 18:52:39.000000', NULL, 'C23', 'C23', NULL, NULL, 'ACTIVE', 'P11', '', '2026-03-30 18:54:45.988502', 3.00, 'MONTHLY_FINANCE', 1000.00, 6, 2025, NULL, NULL, 'admin', '2026-04-16 23:01:49.321479'),
('MF2025-07', 25000.00, b'0', 10, 3250.00, 7500.00, 0, 0, 0, b'0', 0.00, '2026-10-19 18:57:23.000000', '2025-12-19 18:57:23.000000', NULL, 'C24', 'C20', NULL, NULL, 'ACTIVE', NULL, '', '2026-03-30 18:58:07.285125', 3.00, 'MONTHLY_FINANCE', 300.00, 7, 2025, NULL, NULL, 'admin', '2026-04-16 22:45:55.314397'),
('MF2025-08', 50000.00, b'0', 10, 6500.00, 15000.00, 0, 0, 0, b'0', 0.00, '2026-10-19 18:58:11.000000', '2025-12-19 18:58:11.000000', NULL, 'C25', 'P3', NULL, NULL, 'ACTIVE', NULL, '', '2026-03-30 18:58:51.797560', 3.00, 'MONTHLY_FINANCE', 500.00, 8, 2025, NULL, NULL, 'admin', '2026-04-16 22:45:43.957329'),
('MF2025-09', 50000.00, b'0', 10, 6500.00, 15000.00, 0, 0, 0, b'0', 0.00, '2026-10-19 19:01:11.000000', '2025-12-19 19:01:11.000000', NULL, 'C26', 'P5', NULL, NULL, 'ACTIVE', NULL, '', '2026-03-30 19:01:56.286812', 3.00, 'MONTHLY_FINANCE', 500.00, 9, 2025, NULL, NULL, 'admin', '2026-04-16 22:45:30.826697'),
('MF2025-10', 200000.00, b'0', 10, 26000.00, 60000.00, 0, 0, 0, b'0', 0.00, '2026-10-30 19:09:07.000000', '2025-12-30 19:09:07.000000', NULL, 'C27', 'P5', NULL, NULL, 'ACTIVE', NULL, '', '2026-03-30 19:10:00.314486', 3.00, 'MONTHLY_FINANCE', 2000.00, 10, 2025, NULL, NULL, 'admin', '2026-04-16 22:45:19.376052'),
('MF2026-01', 20000.00, b'0', 10, 2600.00, 6000.00, 0, 0, 0, b'0', 0.00, '2026-11-01 15:58:32.000000', '2026-01-01 15:58:32.000000', NULL, 'C28', 'C20', NULL, NULL, 'ACTIVE', 'C20', '', '2026-04-02 15:59:18.960330', 3.00, 'MONTHLY_FINANCE', 200.00, 1, 2026, NULL, NULL, NULL, NULL),
('MF2026-02', 50000.00, b'0', 10, 6500.00, 15000.00, 0, 0, 0, b'0', 0.00, '2026-11-02 19:41:08.000000', '2026-01-02 19:41:08.000000', NULL, 'C30', 'C20', NULL, NULL, 'ACTIVE', 'C20', '', '2026-04-02 19:42:06.500596', 3.00, 'MONTHLY_FINANCE', 500.00, 2, 2026, NULL, NULL, NULL, NULL),
('MF2026-03', 50000.00, b'0', 10, 6500.00, 15000.00, 0, 0, 0, b'0', 0.00, '2026-11-03 14:36:19.000000', '2026-01-03 14:36:19.000000', NULL, 'C31', 'P9', NULL, NULL, 'ACTIVE', 'P9', '', '2026-04-11 14:37:31.837026', 3.00, 'MONTHLY_FINANCE', 500.00, 3, 2026, NULL, NULL, NULL, NULL),
('MF2026-04', 50000.00, b'0', 10, 6500.00, 15000.00, 0, 0, 0, b'0', 0.00, '2026-11-09 12:32:52.000000', '2026-01-09 12:32:52.000000', NULL, 'C32', 'P9', NULL, NULL, 'ACTIVE', 'P9', '', '2026-04-13 12:33:43.446947', 3.00, 'MONTHLY_FINANCE', 500.00, 4, 2026, NULL, NULL, NULL, NULL),
('MF2026-05', 50000.00, b'0', 10, 6500.00, 15000.00, 0, 0, 0, b'0', 0.00, '2026-11-11 12:38:16.000000', '2026-01-11 12:38:16.000000', NULL, 'C20', 'P11', NULL, NULL, 'ACTIVE', 'P11', '', '2026-04-13 12:38:54.286162', 3.00, 'MONTHLY_FINANCE', 500.00, 5, 2026, NULL, NULL, NULL, NULL),
('MF2026-06', 20000.00, b'0', 10, 2600.00, 6000.00, 0, 0, 0, b'0', 0.00, '2026-11-12 12:41:10.000000', '2026-01-12 12:41:10.000000', NULL, 'C33', 'P14', NULL, NULL, 'ACTIVE', 'P14', '', '2026-04-13 12:41:59.407062', 3.00, 'MONTHLY_FINANCE', 200.00, 6, 2026, NULL, NULL, NULL, NULL),
('MF2026-07', 50000.00, b'0', 10, 6500.00, 15000.00, 0, 0, 0, b'0', 0.00, '2026-11-13 12:42:06.000000', '2026-01-13 12:42:06.000000', NULL, 'C34', 'P14', NULL, NULL, 'ACTIVE', 'P14', '', '2026-04-13 12:42:41.979058', 3.00, 'MONTHLY_FINANCE', 500.00, 7, 2026, NULL, NULL, NULL, NULL),
('MF2026-08', 50000.00, b'0', 10, 6500.00, 15000.00, 0, 0, 0, b'0', 0.00, '2026-11-19 12:44:49.000000', '2026-01-19 12:44:49.000000', NULL, 'C35', 'P8', NULL, NULL, 'ACTIVE', 'P8', '', '2026-04-13 12:45:42.186791', 3.00, 'MONTHLY_FINANCE', 500.00, 8, 2026, NULL, NULL, NULL, NULL),
('MF2026-09', 50000.00, b'0', 10, 6500.00, 15000.00, 0, 0, 0, b'0', 0.00, '2026-11-21 12:45:48.000000', '2026-01-21 12:45:48.000000', NULL, 'C36', 'P5', NULL, NULL, 'ACTIVE', 'P5', '', '2026-04-13 12:46:19.874203', 3.00, 'MONTHLY_FINANCE', 500.00, 9, 2026, NULL, NULL, NULL, NULL),
('MF2026-10', 10000.00, b'0', 10, 1300.00, 3000.00, 0, 0, 0, b'0', 0.00, '2026-11-22 12:46:27.000000', '2026-01-22 12:46:27.000000', NULL, 'C37', 'P7', NULL, NULL, 'ACTIVE', 'P7', '', '2026-04-13 12:47:18.678504', 3.00, 'MONTHLY_FINANCE', 200.00, 10, 2026, NULL, NULL, NULL, NULL),
('MF2026-11', 10000.00, b'0', 10, 1300.00, 3000.00, 0, 0, 0, b'0', 0.00, '2026-11-22 12:47:29.000000', '2026-01-22 12:47:29.000000', NULL, 'C39', 'P7', NULL, NULL, 'ACTIVE', 'P7', '', '2026-04-13 12:48:23.589331', 3.00, 'MONTHLY_FINANCE', 200.00, 11, 2026, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `business_member_daily_finance_sequence`
--

CREATE TABLE `business_member_daily_finance_sequence` (
  `year` int NOT NULL,
  `last_number` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `business_member_daily_finance_sequence`
--

INSERT INTO `business_member_daily_finance_sequence` (`year`, `last_number`) VALUES
(2026, 1);

-- --------------------------------------------------------

--
-- Table structure for table `business_member_monthly_finance_sequence`
--

CREATE TABLE `business_member_monthly_finance_sequence` (
  `year` int NOT NULL,
  `last_number` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `business_member_monthly_finance_sequence`
--

INSERT INTO `business_member_monthly_finance_sequence` (`year`, `last_number`) VALUES
(2025, 10),
(2026, 11);

-- --------------------------------------------------------

--
-- Table structure for table `cash_book`
--

CREATE TABLE `cash_book` (
  `cash_book_id` bigint NOT NULL,
  `credit` decimal(38,2) NOT NULL,
  `debit` decimal(38,2) NOT NULL,
  `line_no` int DEFAULT NULL,
  `sys_date` datetime(6) DEFAULT NULL,
  `trans_date` datetime(6) DEFAULT NULL,
  `bm_remarks` varchar(255) DEFAULT NULL,
  `business_member_id` varchar(255) DEFAULT NULL,
  `entry_user` varchar(255) DEFAULT NULL,
  `particulars` varchar(255) DEFAULT NULL,
  `personal_info_id` varchar(255) DEFAULT NULL,
  `receipt_remarks` varchar(255) DEFAULT NULL,
  `trans_type` varchar(255) DEFAULT NULL,
  `account_master_master_code` varchar(255) DEFAULT NULL,
  `account_master_code` varchar(255) DEFAULT NULL,
  `account_master_type` varchar(255) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `created_date` datetime(6) DEFAULT NULL,
  `modified_by` varchar(255) DEFAULT NULL,
  `modified_date` datetime(6) DEFAULT NULL,
  `payment_ref_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `cash_book`
--

INSERT INTO `cash_book` (`cash_book_id`, `credit`, `debit`, `line_no`, `sys_date`, `trans_date`, `bm_remarks`, `business_member_id`, `entry_user`, `particulars`, `personal_info_id`, `receipt_remarks`, `trans_type`, `account_master_master_code`, `account_master_code`, `account_master_type`, `created_by`, `created_date`, `modified_by`, `modified_date`, `payment_ref_id`) VALUES
(83, 23000.00, 0.00, 1, '2026-04-11 14:38:23.004912', '2026-01-01 14:37:00.000000', NULL, NULL, 'admin', 'CAPITAL', NULL, '', 'CAPITAL', 'CAPITAL', 'CAPITAL', 'LIABILITIES', NULL, NULL, NULL, NULL, NULL),
(84, 1500.00, 0.00, 1, '2026-04-13 19:48:00.774218', '2026-01-06 19:45:00.000000', NULL, NULL, 'admin', 'CUSTOMER SAVINGS', NULL, '', 'SAVINGS', 'SAVINGS', 'CUSTOMER SAVINGS', 'LIABILITIES', NULL, NULL, NULL, NULL, NULL),
(90, 50000.00, 0.00, 1, '2026-03-25 21:17:47.148480', '2025-12-06 00:00:00.000000', NULL, NULL, 'admin', 'CAPITAL', NULL, '', 'CAPITAL', 'CAPITAL', 'CAPITAL', 'LIABILITIES', 'admin', '2026-04-16 20:20:50.237990', 'admin', '2026-04-16 20:20:50.237990', NULL),
(91, 50000.00, 0.00, 1, '2026-03-25 21:19:00.200618', '2025-12-06 00:00:00.000000', NULL, NULL, 'admin', 'CAPITAL', NULL, '', 'CAPITAL', 'CAPITAL', 'CAPITAL', 'LIABILITIES', 'admin', '2026-04-16 20:20:50.312947', 'admin', '2026-04-16 20:20:50.312947', NULL),
(92, 75000.00, 0.00, 1, '2026-03-25 21:19:57.256681', '2025-12-06 00:00:00.000000', NULL, NULL, 'admin', 'CAPITAL', NULL, '', 'CAPITAL', 'CAPITAL', 'CAPITAL', 'LIABILITIES', 'admin', '2026-04-16 20:20:50.323942', 'admin', '2026-04-16 20:20:50.323942', NULL),
(93, 0.00, 30000.00, 1, '2026-03-25 21:25:01.802633', '2025-12-10 00:00:00.000000', NULL, 'MF2025-01', 'admin', 'MF LOAN', NULL, '', 'LOANS', 'LOANS', 'MF LOAN', 'ASSETS', 'admin', '2026-04-16 20:20:50.329937', 'admin', '2026-04-16 20:20:50.329937', NULL),
(94, 300.00, 0.00, 2, '2026-03-25 21:25:01.818257', '2025-12-10 00:00:00.000000', NULL, 'MF2025-01', 'admin', 'MF DOC CHARGES', NULL, '', 'DOCUMENT CHARGES', 'DOCUMENT CHARGES', 'MF DOC CHARGES', 'REVENUES', 'admin', '2026-04-16 20:20:50.338935', 'admin', '2026-04-16 20:20:50.338935', NULL),
(95, 150000.00, 0.00, 1, '2026-03-25 21:31:38.703827', '2025-12-10 00:00:00.000000', NULL, NULL, 'admin', 'CAPITAL', NULL, '', 'CAPITAL', 'CAPITAL', 'CAPITAL', 'LIABILITIES', 'admin', '2026-04-16 20:20:50.343931', 'admin', '2026-04-16 20:20:50.343931', NULL),
(96, 0.00, 50000.00, 1, '2026-03-28 20:36:36.628883', '2025-12-11 20:34:31.000000', NULL, 'MF2025-02', 'admin', 'MF LOAN', NULL, '', 'LOANS', 'LOANS', 'MF LOAN', 'ASSETS', 'admin', '2026-04-16 20:20:50.348926', 'admin', '2026-04-16 20:20:50.348926', NULL),
(97, 500.00, 0.00, 2, '2026-03-28 20:36:36.651349', '2025-12-11 20:34:31.000000', NULL, 'MF2025-02', 'admin', 'MF DOC CHARGES', NULL, '', 'DOCUMENT CHARGES', 'DOCUMENT CHARGES', 'MF DOC CHARGES', 'REVENUES', 'admin', '2026-04-16 20:20:50.357923', 'admin', '2026-04-16 20:20:50.357923', NULL),
(98, 0.00, 50000.00, 1, '2026-03-28 20:45:03.797897', '2025-12-13 20:43:15.000000', NULL, 'MF2025-03', 'admin', 'MF LOAN', NULL, '', 'LOANS', 'LOANS', 'MF LOAN', 'ASSETS', 'admin', '2026-04-16 20:20:50.365916', 'admin', '2026-04-16 20:20:50.365916', NULL),
(99, 500.00, 0.00, 2, '2026-03-28 20:45:03.815656', '2025-12-13 20:43:15.000000', NULL, 'MF2025-03', 'admin', 'MF DOC CHARGES', NULL, '', 'DOCUMENT CHARGES', 'DOCUMENT CHARGES', 'MF DOC CHARGES', 'REVENUES', 'admin', '2026-04-16 20:20:50.377911', 'admin', '2026-04-16 20:20:50.377911', NULL),
(100, 25000.00, 0.00, 1, '2026-03-28 20:48:13.095189', '2025-12-15 00:00:00.000000', NULL, NULL, 'admin', 'CAPITAL', NULL, '', 'CAPITAL', 'CAPITAL', 'CAPITAL', 'LIABILITIES', 'admin', '2026-04-16 20:20:50.383906', 'admin', '2026-04-16 20:20:50.383906', NULL),
(101, 25000.00, 0.00, 1, '2026-03-28 20:48:49.075729', '2025-12-15 00:00:00.000000', NULL, NULL, 'admin', 'CAPITAL', NULL, '', 'CAPITAL', 'CAPITAL', 'CAPITAL', 'LIABILITIES', 'admin', '2026-04-16 20:20:50.394900', 'admin', '2026-04-16 20:20:50.394900', NULL),
(102, 100000.00, 0.00, 1, '2026-03-28 20:50:02.926043', '2025-12-15 00:00:00.000000', NULL, NULL, 'admin', 'CAPITAL', NULL, '', 'CAPITAL', 'CAPITAL', 'CAPITAL', 'LIABILITIES', 'admin', '2026-04-16 20:20:50.407893', 'admin', '2026-04-16 20:20:50.407893', NULL),
(103, 0.00, 200000.00, 1, '2026-03-28 20:51:44.348852', '2025-12-15 20:45:52.000000', NULL, 'MF2025-04', 'admin', 'MF LOAN', NULL, '', 'LOANS', 'LOANS', 'MF LOAN', 'ASSETS', 'admin', '2026-04-16 20:20:50.414889', 'admin', '2026-04-16 20:20:50.414889', NULL),
(104, 2000.00, 0.00, 2, '2026-03-28 20:51:44.364845', '2025-12-15 20:45:52.000000', NULL, 'MF2025-04', 'admin', 'MF DOC CHARGES', 'C20', '', 'DOCUMENT CHARGES', 'DOCUMENT CHARGES', 'MF DOC CHARGES', 'REVENUES', 'admin', '2026-04-16 20:20:50.425881', 'admin', '2026-04-16 23:02:01.536566', NULL),
(105, 0.00, 150000.00, 1, '2026-03-30 18:46:26.891490', '2025-12-16 18:44:52.000000', NULL, 'MF2025-05', 'admin', 'MF LOAN', NULL, '', 'LOANS', 'LOANS', 'MF LOAN', 'ASSETS', 'admin', '2026-04-16 20:20:50.432878', 'admin', '2026-04-16 20:20:50.432878', NULL),
(106, 1500.00, 0.00, 2, '2026-03-30 18:46:26.910667', '2025-12-16 18:44:52.000000', NULL, 'MF2025-05', 'admin', 'MF DOC CHARGES', NULL, '', 'DOCUMENT CHARGES', 'DOCUMENT CHARGES', 'MF DOC CHARGES', 'REVENUES', 'admin', '2026-04-16 20:20:50.455868', 'admin', '2026-04-16 20:20:50.455868', NULL),
(107, 75000.00, 0.00, 1, '2026-03-30 18:47:30.444624', '2025-12-16 00:00:00.000000', NULL, NULL, 'admin', 'CAPITAL', NULL, '', 'CAPITAL', 'CAPITAL', 'CAPITAL', 'LIABILITIES', 'admin', '2026-04-16 20:20:50.462860', 'admin', '2026-04-16 20:20:50.462860', NULL),
(108, 75000.00, 0.00, 1, '2026-03-30 18:51:27.882479', '2025-12-16 00:00:00.000000', NULL, NULL, 'admin', 'CAPITAL', NULL, '', 'CAPITAL', 'CAPITAL', 'CAPITAL', 'LIABILITIES', 'admin', '2026-04-16 20:20:50.471857', 'admin', '2026-04-16 20:20:50.471857', NULL),
(109, 0.00, 100000.00, 1, '2026-03-30 18:54:46.008673', '2025-12-17 18:52:39.000000', NULL, 'MF2025-06', 'admin', 'MF LOAN', NULL, '', 'LOANS', 'LOANS', 'MF LOAN', 'ASSETS', 'admin', '2026-04-16 20:20:50.477852', 'admin', '2026-04-16 20:20:50.477852', NULL),
(110, 1000.00, 0.00, 2, '2026-03-30 18:54:46.018518', '2025-12-17 18:52:39.000000', NULL, 'MF2025-06', 'admin', 'MF DOC CHARGES', NULL, '', 'DOCUMENT CHARGES', 'DOCUMENT CHARGES', 'MF DOC CHARGES', 'REVENUES', 'admin', '2026-04-16 20:20:50.482851', 'admin', '2026-04-16 20:20:50.482851', NULL),
(111, 0.00, 25000.00, 1, '2026-03-30 18:58:07.303408', '2025-12-19 18:57:23.000000', NULL, 'MF2025-07', 'admin', 'MF LOAN', NULL, '', 'LOANS', 'LOANS', 'MF LOAN', 'ASSETS', 'admin', '2026-04-16 20:20:50.497842', 'admin', '2026-04-16 20:20:50.497842', NULL),
(112, 300.00, 0.00, 2, '2026-03-30 18:58:07.320889', '2025-12-19 18:57:23.000000', NULL, 'MF2025-07', 'admin', 'MF DOC CHARGES', NULL, '', 'DOCUMENT CHARGES', 'DOCUMENT CHARGES', 'MF DOC CHARGES', 'REVENUES', 'admin', '2026-04-16 20:20:50.507835', 'admin', '2026-04-16 20:20:50.507835', NULL),
(113, 0.00, 50000.00, 1, '2026-03-30 18:58:51.817315', '2025-12-19 18:58:11.000000', NULL, 'MF2025-08', 'admin', 'MF LOAN', NULL, '', 'LOANS', 'LOANS', 'MF LOAN', 'ASSETS', 'admin', '2026-04-16 20:20:50.513832', 'admin', '2026-04-16 20:20:50.513832', NULL),
(114, 500.00, 0.00, 2, '2026-03-30 18:58:51.829703', '2025-12-19 18:58:11.000000', NULL, 'MF2025-08', 'admin', 'MF DOC CHARGES', NULL, '', 'DOCUMENT CHARGES', 'DOCUMENT CHARGES', 'MF DOC CHARGES', 'REVENUES', 'admin', '2026-04-16 20:20:50.523830', 'admin', '2026-04-16 20:20:50.523830', NULL),
(115, 20000.00, 0.00, 1, '2026-03-30 18:59:52.555072', '2025-12-19 00:00:00.000000', NULL, NULL, 'admin', 'CAPITAL', NULL, '', 'CAPITAL', 'CAPITAL', 'CAPITAL', 'LIABILITIES', 'admin', '2026-04-16 20:20:50.529822', 'admin', '2026-04-16 20:20:50.529822', NULL),
(116, 0.00, 50000.00, 1, '2026-03-30 19:01:56.297254', '2025-12-19 19:01:11.000000', NULL, 'MF2025-09', 'admin', 'MF LOAN', NULL, '', 'LOANS', 'LOANS', 'MF LOAN', 'ASSETS', 'admin', '2026-04-16 20:20:50.533820', 'admin', '2026-04-16 20:20:50.533820', NULL),
(117, 500.00, 0.00, 2, '2026-03-30 19:01:56.316752', '2025-12-19 19:01:11.000000', NULL, 'MF2025-09', 'admin', 'MF DOC CHARGES', NULL, '', 'DOCUMENT CHARGES', 'DOCUMENT CHARGES', 'MF DOC CHARGES', 'REVENUES', 'admin', '2026-04-16 20:20:50.544814', 'admin', '2026-04-16 20:20:50.544814', NULL),
(118, 49500.00, 0.00, 1, '2026-03-30 19:02:48.236681', '2025-12-19 00:00:00.000000', NULL, NULL, 'admin', 'HAND LOAN', NULL, '', 'HAND LOAN', 'HAND LOAN', 'HAND LOAN', 'LIABILITIES', 'admin', '2026-04-16 20:20:50.549811', 'admin', '2026-04-16 20:20:50.549811', NULL),
(119, 6500.00, 0.00, 1, '2026-03-30 19:04:17.704903', '2025-12-19 00:00:00.000000', NULL, NULL, 'admin', 'CUSTOMER SAVINGS', NULL, '', 'SAVINGS', 'SAVINGS', 'CUSTOMER SAVINGS', 'LIABILITIES', 'admin', '2026-04-16 20:20:50.557808', 'admin', '2026-04-16 20:20:50.557808', NULL),
(120, 20000.00, 0.00, 1, '2026-03-30 19:07:16.607890', '2025-12-29 00:00:00.000000', NULL, NULL, 'admin', 'CAPITAL', NULL, '', 'CAPITAL', 'CAPITAL', 'CAPITAL', 'LIABILITIES', 'admin', '2026-04-16 20:20:50.562803', 'admin', '2026-04-16 20:20:50.562803', NULL),
(121, 100000.00, 0.00, 1, '2026-03-30 19:08:00.650055', '2025-12-29 00:00:00.000000', NULL, NULL, 'admin', 'CAPITAL', NULL, '', 'CAPITAL', 'CAPITAL', 'CAPITAL', 'LIABILITIES', 'admin', '2026-04-16 20:20:50.566801', 'admin', '2026-04-16 20:20:50.566801', NULL),
(122, 1500.00, 0.00, 1, '2026-03-30 19:08:33.544038', '2025-12-29 00:00:00.000000', NULL, NULL, 'admin', 'CUSTOMER SAVINGS', NULL, '', 'SAVINGS', 'SAVINGS', 'CUSTOMER SAVINGS', 'LIABILITIES', 'admin', '2026-04-16 20:20:50.573797', 'admin', '2026-04-16 20:20:50.573797', NULL),
(123, 0.00, 200000.00, 1, '2026-03-30 19:10:00.324592', '2025-12-30 19:09:07.000000', NULL, 'MF2025-10', 'admin', 'MF LOAN', NULL, '', 'LOANS', 'LOANS', 'MF LOAN', 'ASSETS', 'admin', '2026-04-16 20:20:50.578794', 'admin', '2026-04-16 20:20:50.578794', NULL),
(124, 2000.00, 0.00, 2, '2026-03-30 19:10:00.344512', '2025-12-30 19:09:07.000000', NULL, 'MF2025-10', 'admin', 'MF DOC CHARGES', NULL, '', 'DOCUMENT CHARGES', 'DOCUMENT CHARGES', 'MF DOC CHARGES', 'REVENUES', 'admin', '2026-04-16 20:20:50.582792', 'admin', '2026-04-16 20:20:50.582792', NULL),
(125, 20000.00, 0.00, 1, '2026-03-30 19:11:01.446294', '2025-12-30 00:00:00.000000', NULL, NULL, 'admin', 'CAPITAL', NULL, '', 'CAPITAL', 'CAPITAL', 'CAPITAL', 'LIABILITIES', 'admin', '2026-04-16 20:20:50.589789', 'admin', '2026-04-16 20:20:50.589789', NULL),
(126, 54000.00, 0.00, 1, '2026-03-30 19:11:47.798885', '2025-12-30 00:00:00.000000', NULL, NULL, 'admin', 'HAND LOAN', NULL, '', 'HAND LOAN', 'HAND LOAN', 'HAND LOAN', 'LIABILITIES', 'admin', '2026-04-16 20:20:50.594786', 'admin', '2026-04-16 20:20:50.594786', NULL),
(127, 0.00, 20000.00, 1, '2026-04-02 15:59:19.070267', '2026-01-01 15:58:32.000000', NULL, 'MF2026-01', 'admin', 'MF LOAN', NULL, '', 'LOANS', 'LOANS', 'MF LOAN', 'ASSETS', 'admin', '2026-04-16 20:20:50.598783', 'admin', '2026-04-16 20:20:50.598783', NULL),
(128, 200.00, 0.00, 2, '2026-04-02 15:59:19.109245', '2026-01-01 15:58:32.000000', NULL, 'MF2026-01', 'admin', 'MF DOC CHARGES', NULL, '', 'DOCUMENT CHARGES', 'DOCUMENT CHARGES', 'MF DOC CHARGES', 'REVENUES', 'admin', '2026-04-16 20:20:50.603780', 'admin', '2026-04-16 20:20:50.603780', NULL),
(129, 0.00, 50000.00, 1, '2026-04-02 19:42:06.531848', '2026-02-01 19:41:08.000000', NULL, 'MF2026-02', 'admin', 'MF LOAN', NULL, '', 'LOANS', 'LOANS', 'MF LOAN', 'ASSETS', 'admin', '2026-04-16 20:20:50.609777', 'admin', '2026-04-16 20:20:50.609777', NULL),
(130, 500.00, 0.00, 2, '2026-04-02 19:42:06.563092', '2026-02-01 19:41:08.000000', NULL, 'MF2026-02', 'admin', 'MF DOC CHARGES', NULL, '', 'DOCUMENT CHARGES', 'DOCUMENT CHARGES', 'MF DOC CHARGES', 'REVENUES', 'admin', '2026-04-16 20:20:50.613773', 'admin', '2026-04-16 20:20:50.613773', NULL),
(131, 23000.00, 0.00, 1, '2026-04-02 20:20:53.815359', '2026-01-01 20:19:00.000000', NULL, NULL, 'admin', 'CAPITAL', NULL, '', 'CAPITAL', 'CAPITAL', 'CAPITAL', 'LIABILITIES', 'admin', '2026-04-16 20:20:50.617773', 'admin', '2026-04-16 20:20:50.617773', NULL),
(132, 0.00, 50000.00, 1, '2026-04-11 14:37:31.862933', '2026-01-03 14:36:19.000000', NULL, 'MF2026-03', 'admin', 'MF LOAN', NULL, '', 'LOANS', 'LOANS', 'MF LOAN', 'ASSETS', 'admin', '2026-04-16 20:20:50.622770', 'admin', '2026-04-16 20:20:50.622770', NULL),
(133, 500.00, 0.00, 2, '2026-04-11 14:37:31.897096', '2026-01-03 14:36:19.000000', NULL, 'MF2026-03', 'admin', 'MF DOC CHARGES', NULL, '', 'DOCUMENT CHARGES', 'DOCUMENT CHARGES', 'MF DOC CHARGES', 'REVENUES', 'admin', '2026-04-16 20:20:50.626766', 'admin', '2026-04-16 20:20:50.626766', NULL),
(134, 0.00, 50000.00, 1, '2026-04-13 12:33:43.490736', '2026-01-02 12:32:52.000000', NULL, 'MF2026-04', 'admin', 'MF LOAN', NULL, '', 'LOANS', 'LOANS', 'MF LOAN', 'ASSETS', 'admin', '2026-04-16 20:20:50.630764', 'admin', '2026-04-16 20:20:50.630764', NULL),
(135, 500.00, 0.00, 2, '2026-04-13 12:33:43.515513', '2026-01-02 12:32:52.000000', NULL, 'MF2026-04', 'admin', 'MF DOC CHARGES', NULL, '', 'DOCUMENT CHARGES', 'DOCUMENT CHARGES', 'MF DOC CHARGES', 'REVENUES', 'admin', '2026-04-16 20:20:50.633762', 'admin', '2026-04-16 20:20:50.633762', NULL),
(136, 0.00, 50000.00, 1, '2026-04-13 12:38:54.318981', '2026-01-11 12:38:16.000000', NULL, 'MF2026-05', 'admin', 'MF LOAN', NULL, '', 'LOANS', 'LOANS', 'MF LOAN', 'ASSETS', 'admin', '2026-04-16 20:20:50.640759', 'admin', '2026-04-16 20:20:50.640759', NULL),
(137, 500.00, 0.00, 2, '2026-04-13 12:38:54.330825', '2026-01-11 12:38:16.000000', NULL, 'MF2026-05', 'admin', 'MF DOC CHARGES', NULL, '', 'DOCUMENT CHARGES', 'DOCUMENT CHARGES', 'MF DOC CHARGES', 'REVENUES', 'admin', '2026-04-16 20:20:50.644755', 'admin', '2026-04-16 20:20:50.644755', NULL),
(138, 0.00, 20000.00, 1, '2026-04-13 12:41:59.422797', '2026-01-12 12:41:10.000000', NULL, 'MF2026-06', 'admin', 'MF LOAN', NULL, '', 'LOANS', 'LOANS', 'MF LOAN', 'ASSETS', 'admin', '2026-04-16 20:20:50.647754', 'admin', '2026-04-16 20:20:50.647754', NULL),
(139, 200.00, 0.00, 2, '2026-04-13 12:41:59.434806', '2026-01-12 12:41:10.000000', NULL, 'MF2026-06', 'admin', 'MF DOC CHARGES', NULL, '', 'DOCUMENT CHARGES', 'DOCUMENT CHARGES', 'MF DOC CHARGES', 'REVENUES', 'admin', '2026-04-16 20:20:50.657750', 'admin', '2026-04-16 20:20:50.657750', NULL),
(140, 0.00, 50000.00, 1, '2026-04-13 12:42:41.991533', '2026-01-13 12:42:06.000000', NULL, 'MF2026-07', 'admin', 'MF LOAN', NULL, '', 'LOANS', 'LOANS', 'MF LOAN', 'ASSETS', 'admin', '2026-04-16 20:20:50.663745', 'admin', '2026-04-16 20:20:50.663745', NULL),
(141, 500.00, 0.00, 2, '2026-04-13 12:42:42.005116', '2026-01-13 12:42:06.000000', NULL, 'MF2026-07', 'admin', 'MF DOC CHARGES', NULL, '', 'DOCUMENT CHARGES', 'DOCUMENT CHARGES', 'MF DOC CHARGES', 'REVENUES', 'admin', '2026-04-16 20:20:50.671742', 'admin', '2026-04-16 20:20:50.671742', NULL),
(142, 0.00, 80000.00, 1, '2026-04-13 12:44:25.086811', '2026-01-13 12:42:50.000000', NULL, 'DF2026-01', 'admin', 'DF LOAN', NULL, '', 'LOANS', 'LOANS', 'DF LOAN', 'ASSETS', 'admin', '2026-04-16 20:20:50.676738', 'admin', '2026-04-16 20:20:50.676738', NULL),
(143, 800.00, 0.00, 2, '2026-04-13 12:44:25.101810', '2026-01-13 12:42:50.000000', NULL, 'DF2026-01', 'admin', 'DF DOC CHARGES', NULL, '', 'DOCUMENT CHARGES', 'DOCUMENT CHARGES', 'DF DOC CHARGES', 'REVENUES', 'admin', '2026-04-16 20:20:50.681736', 'admin', '2026-04-16 20:20:50.681736', NULL),
(144, 8000.00, 0.00, 3, '2026-04-13 12:44:25.114837', '2026-01-13 12:42:50.000000', NULL, 'DF2026-01', 'admin', 'DF INTEREST', NULL, '', 'INTEREST', 'INTEREST', 'DF INTEREST', 'REVENUES', 'admin', '2026-04-16 20:20:50.692728', 'admin', '2026-04-16 20:20:50.692728', NULL),
(145, 0.00, 50000.00, 1, '2026-04-13 12:45:42.200378', '2026-01-19 12:44:49.000000', NULL, 'MF2026-08', 'admin', 'MF LOAN', NULL, '', 'LOANS', 'LOANS', 'MF LOAN', 'ASSETS', 'admin', '2026-04-16 20:20:50.698725', 'admin', '2026-04-16 20:20:50.698725', NULL),
(146, 500.00, 0.00, 2, '2026-04-13 12:45:42.210544', '2026-01-19 12:44:49.000000', NULL, 'MF2026-08', 'admin', 'MF DOC CHARGES', NULL, '', 'DOCUMENT CHARGES', 'DOCUMENT CHARGES', 'MF DOC CHARGES', 'REVENUES', 'admin', '2026-04-16 20:20:50.705722', 'admin', '2026-04-16 20:20:50.705722', NULL),
(147, 0.00, 50000.00, 1, '2026-04-13 12:46:19.890521', '2026-01-21 12:45:48.000000', NULL, 'MF2026-09', 'admin', 'MF LOAN', NULL, '', 'LOANS', 'LOANS', 'MF LOAN', 'ASSETS', 'admin', '2026-04-16 20:20:50.709719', 'admin', '2026-04-16 20:20:50.709719', NULL),
(148, 500.00, 0.00, 2, '2026-04-13 12:46:19.904846', '2026-01-21 12:45:48.000000', NULL, 'MF2026-09', 'admin', 'MF DOC CHARGES', NULL, '', 'DOCUMENT CHARGES', 'DOCUMENT CHARGES', 'MF DOC CHARGES', 'REVENUES', 'admin', '2026-04-16 20:20:50.713716', 'admin', '2026-04-16 20:20:50.713716', NULL),
(149, 0.00, 10000.00, 1, '2026-04-13 12:47:18.694085', '2026-01-22 12:46:27.000000', NULL, 'MF2026-10', 'admin', 'MF LOAN', NULL, '', 'LOANS', 'LOANS', 'MF LOAN', 'ASSETS', 'admin', '2026-04-16 20:20:50.717714', 'admin', '2026-04-16 20:20:50.717714', NULL),
(150, 200.00, 0.00, 2, '2026-04-13 12:47:18.707153', '2026-01-22 12:46:27.000000', NULL, 'MF2026-10', 'admin', 'MF DOC CHARGES', NULL, '', 'DOCUMENT CHARGES', 'DOCUMENT CHARGES', 'MF DOC CHARGES', 'REVENUES', 'admin', '2026-04-16 20:20:50.725710', 'admin', '2026-04-16 20:20:50.725710', NULL),
(151, 0.00, 10000.00, 1, '2026-04-13 12:48:23.602817', '2026-01-22 12:47:29.000000', NULL, 'MF2026-11', 'admin', 'MF LOAN', NULL, '', 'LOANS', 'LOANS', 'MF LOAN', 'ASSETS', 'admin', '2026-04-16 20:20:50.730706', 'admin', '2026-04-16 20:20:50.730706', NULL),
(152, 200.00, 0.00, 2, '2026-04-13 12:48:23.614686', '2026-01-22 12:47:29.000000', NULL, 'MF2026-11', 'admin', 'MF DOC CHARGES', NULL, '', 'DOCUMENT CHARGES', 'DOCUMENT CHARGES', 'MF DOC CHARGES', 'REVENUES', 'admin', '2026-04-16 20:20:50.734704', 'admin', '2026-04-16 20:20:50.734704', NULL),
(153, 46000.00, 0.00, 1, '2026-04-13 19:44:03.622238', '2026-01-02 19:43:00.000000', NULL, NULL, 'admin', 'HAND LOAN', NULL, '', 'HAND LOAN', 'HAND LOAN', 'HAND LOAN', 'LIABILITIES', 'admin', '2026-04-16 20:20:50.742700', 'admin', '2026-04-16 20:20:50.742700', NULL),
(154, 27500.00, 0.00, 1, '2026-04-13 19:45:03.511891', '2026-01-03 19:43:00.000000', NULL, NULL, 'admin', 'HAND LOAN', NULL, '', 'HAND LOAN', 'HAND LOAN', 'HAND LOAN', 'LIABILITIES', 'admin', '2026-04-16 20:20:50.746697', 'admin', '2026-04-16 20:20:50.746697', NULL),
(155, 22000.00, 0.00, 1, '2026-04-13 19:45:33.291753', '2026-01-03 19:43:00.000000', NULL, NULL, 'admin', 'CAPITAL', NULL, '', 'CAPITAL', 'CAPITAL', 'CAPITAL', 'LIABILITIES', 'admin', '2026-04-16 20:20:50.757696', 'admin', '2026-04-16 20:20:50.757696', NULL),
(156, 100000.00, 0.00, 1, '2026-04-13 19:46:21.644572', '2026-01-05 19:45:00.000000', NULL, NULL, 'admin', 'CAPITAL', NULL, '', 'CAPITAL', 'CAPITAL', 'CAPITAL', 'LIABILITIES', 'admin', '2026-04-16 20:20:50.763688', 'admin', '2026-04-16 20:20:50.763688', NULL),
(157, 0.00, 100000.00, 1, '2026-04-13 19:47:07.421021', '2026-01-05 19:45:00.000000', NULL, NULL, 'admin', 'HAND LOAN', NULL, '', 'HAND LOAN', 'HAND LOAN', 'HAND LOAN', 'LIABILITIES', 'admin', '2026-04-16 20:20:50.772686', 'admin', '2026-04-16 20:20:50.772686', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `cash_book_backup`
--

CREATE TABLE `cash_book_backup` (
  `cash_book_backup_id` bigint NOT NULL,
  `credit` decimal(38,2) NOT NULL,
  `current_installment_number` int DEFAULT NULL,
  `debit` decimal(38,2) NOT NULL,
  `line_no` int DEFAULT NULL,
  `pending_balance` decimal(19,2) DEFAULT NULL,
  `cash_book_old_id` bigint NOT NULL,
  `deleteddate` datetime(6) DEFAULT NULL,
  `sys_date` datetime(6) DEFAULT NULL,
  `trans_date` datetime(6) DEFAULT NULL,
  `entry_user` varchar(100) DEFAULT NULL,
  `trans_type` varchar(100) DEFAULT NULL,
  `bm_remarks` varchar(255) DEFAULT NULL,
  `receipt_remarks` varchar(255) DEFAULT NULL,
  `business_member_id` varchar(255) DEFAULT NULL,
  `comments` varchar(255) DEFAULT NULL,
  `deletedby` varchar(255) DEFAULT NULL,
  `particulars` varchar(255) DEFAULT NULL,
  `personal_info_id` varchar(255) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `created_date` datetime(6) DEFAULT NULL,
  `modified_by` varchar(255) DEFAULT NULL,
  `modified_date` datetime(6) DEFAULT NULL,
  `payment_ref_id` varchar(255) DEFAULT NULL,
  `account_master_code` varchar(255) DEFAULT NULL,
  `account_master_master_code` varchar(255) DEFAULT NULL,
  `account_master_type` varchar(255) DEFAULT NULL
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
  `status` varchar(255) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `created_date` datetime(6) DEFAULT NULL,
  `modified_by` varchar(255) DEFAULT NULL,
  `modified_date` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `emi`
--

INSERT INTO `emi` (`emi_id`, `installment_number`, `interest_amount`, `paid_amount`, `principal_amount`, `total_amount`, `due_date`, `payment_date`, `business_member_id`, `status`, `created_by`, `created_date`, `modified_by`, `modified_date`) VALUES
(1, 1, 900.00, 0.00, 3000.00, 3900.00, '2026-01-10 21:23:19.000000', NULL, 'MF2025-01', 'PENDING', NULL, NULL, NULL, NULL),
(2, 2, 900.00, 0.00, 3000.00, 3900.00, '2026-02-10 21:23:19.000000', NULL, 'MF2025-01', 'PENDING', NULL, NULL, NULL, NULL),
(3, 3, 900.00, 0.00, 3000.00, 3900.00, '2026-03-10 21:23:19.000000', NULL, 'MF2025-01', 'PENDING', NULL, NULL, NULL, NULL),
(4, 4, 900.00, 0.00, 3000.00, 3900.00, '2026-04-10 21:23:19.000000', NULL, 'MF2025-01', 'PENDING', NULL, NULL, NULL, NULL),
(5, 5, 900.00, 0.00, 3000.00, 3900.00, '2026-05-10 21:23:19.000000', NULL, 'MF2025-01', 'PENDING', NULL, NULL, NULL, NULL),
(6, 6, 900.00, 0.00, 3000.00, 3900.00, '2026-06-10 21:23:19.000000', NULL, 'MF2025-01', 'PENDING', NULL, NULL, NULL, NULL),
(7, 7, 900.00, 0.00, 3000.00, 3900.00, '2026-07-10 21:23:19.000000', NULL, 'MF2025-01', 'PENDING', NULL, NULL, NULL, NULL),
(8, 8, 900.00, 0.00, 3000.00, 3900.00, '2026-08-10 21:23:19.000000', NULL, 'MF2025-01', 'PENDING', NULL, NULL, NULL, NULL),
(9, 9, 900.00, 0.00, 3000.00, 3900.00, '2026-09-10 21:23:19.000000', NULL, 'MF2025-01', 'PENDING', NULL, NULL, NULL, NULL),
(10, 10, 900.00, 0.00, 3000.00, 3900.00, '2026-10-10 21:23:19.000000', NULL, 'MF2025-01', 'PENDING', NULL, NULL, NULL, NULL),
(111, 1, 600.00, 0.00, 2000.00, 2600.00, '2026-02-01 15:58:32.000000', NULL, 'MF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(112, 2, 600.00, 0.00, 2000.00, 2600.00, '2026-03-01 15:58:32.000000', NULL, 'MF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(113, 3, 600.00, 0.00, 2000.00, 2600.00, '2026-04-01 15:58:32.000000', NULL, 'MF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(114, 4, 600.00, 0.00, 2000.00, 2600.00, '2026-05-01 15:58:32.000000', NULL, 'MF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(115, 5, 600.00, 0.00, 2000.00, 2600.00, '2026-06-01 15:58:32.000000', NULL, 'MF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(116, 6, 600.00, 0.00, 2000.00, 2600.00, '2026-07-01 15:58:32.000000', NULL, 'MF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(117, 7, 600.00, 0.00, 2000.00, 2600.00, '2026-08-01 15:58:32.000000', NULL, 'MF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(118, 8, 600.00, 0.00, 2000.00, 2600.00, '2026-09-01 15:58:32.000000', NULL, 'MF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(119, 9, 600.00, 0.00, 2000.00, 2600.00, '2026-10-01 15:58:32.000000', NULL, 'MF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(120, 10, 600.00, 0.00, 2000.00, 2600.00, '2026-11-01 15:58:32.000000', NULL, 'MF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(121, 1, 1500.00, 0.00, 5000.00, 6500.00, '2026-03-01 19:41:08.000000', NULL, 'MF2026-02', 'PENDING', NULL, NULL, NULL, NULL),
(122, 2, 1500.00, 0.00, 5000.00, 6500.00, '2026-04-01 19:41:08.000000', NULL, 'MF2026-02', 'PENDING', NULL, NULL, NULL, NULL),
(123, 3, 1500.00, 0.00, 5000.00, 6500.00, '2026-05-01 19:41:08.000000', NULL, 'MF2026-02', 'PENDING', NULL, NULL, NULL, NULL),
(124, 4, 1500.00, 0.00, 5000.00, 6500.00, '2026-06-01 19:41:08.000000', NULL, 'MF2026-02', 'PENDING', NULL, NULL, NULL, NULL),
(125, 5, 1500.00, 0.00, 5000.00, 6500.00, '2026-07-01 19:41:08.000000', NULL, 'MF2026-02', 'PENDING', NULL, NULL, NULL, NULL),
(126, 6, 1500.00, 0.00, 5000.00, 6500.00, '2026-08-01 19:41:08.000000', NULL, 'MF2026-02', 'PENDING', NULL, NULL, NULL, NULL),
(127, 7, 1500.00, 0.00, 5000.00, 6500.00, '2026-09-01 19:41:08.000000', NULL, 'MF2026-02', 'PENDING', NULL, NULL, NULL, NULL),
(128, 8, 1500.00, 0.00, 5000.00, 6500.00, '2026-10-01 19:41:08.000000', NULL, 'MF2026-02', 'PENDING', NULL, NULL, NULL, NULL),
(129, 9, 1500.00, 0.00, 5000.00, 6500.00, '2026-11-01 19:41:08.000000', NULL, 'MF2026-02', 'PENDING', NULL, NULL, NULL, NULL),
(130, 10, 1500.00, 0.00, 5000.00, 6500.00, '2026-12-01 19:41:08.000000', NULL, 'MF2026-02', 'PENDING', NULL, NULL, NULL, NULL),
(131, 1, 600.00, 0.00, 2000.00, 2600.00, '2026-02-01 14:36:19.000000', NULL, 'MF2026-03', 'PENDING', NULL, NULL, NULL, NULL),
(132, 2, 600.00, 0.00, 2000.00, 2600.00, '2026-03-01 14:36:19.000000', NULL, 'MF2026-03', 'PENDING', NULL, NULL, NULL, NULL),
(133, 3, 600.00, 0.00, 2000.00, 2600.00, '2026-04-01 14:36:19.000000', NULL, 'MF2026-03', 'PENDING', NULL, NULL, NULL, NULL),
(134, 4, 600.00, 0.00, 2000.00, 2600.00, '2026-05-01 14:36:19.000000', NULL, 'MF2026-03', 'PENDING', NULL, NULL, NULL, NULL),
(135, 5, 600.00, 0.00, 2000.00, 2600.00, '2026-06-01 14:36:19.000000', NULL, 'MF2026-03', 'PENDING', NULL, NULL, NULL, NULL),
(136, 6, 600.00, 0.00, 2000.00, 2600.00, '2026-07-01 14:36:19.000000', NULL, 'MF2026-03', 'PENDING', NULL, NULL, NULL, NULL),
(137, 7, 600.00, 0.00, 2000.00, 2600.00, '2026-08-01 14:36:19.000000', NULL, 'MF2026-03', 'PENDING', NULL, NULL, NULL, NULL),
(138, 8, 600.00, 0.00, 2000.00, 2600.00, '2026-09-01 14:36:19.000000', NULL, 'MF2026-03', 'PENDING', NULL, NULL, NULL, NULL),
(139, 9, 600.00, 0.00, 2000.00, 2600.00, '2026-10-01 14:36:19.000000', NULL, 'MF2026-03', 'PENDING', NULL, NULL, NULL, NULL),
(140, 10, 600.00, 0.00, 2000.00, 2600.00, '2026-11-01 14:36:19.000000', NULL, 'MF2026-03', 'PENDING', NULL, NULL, NULL, NULL),
(141, 1, 1500.00, 0.00, 5000.00, 6500.00, '2026-02-02 12:32:52.000000', NULL, 'MF2026-04', 'PENDING', NULL, NULL, NULL, NULL),
(142, 2, 1500.00, 0.00, 5000.00, 6500.00, '2026-03-02 12:32:52.000000', NULL, 'MF2026-04', 'PENDING', NULL, NULL, NULL, NULL),
(143, 3, 1500.00, 0.00, 5000.00, 6500.00, '2026-04-02 12:32:52.000000', NULL, 'MF2026-04', 'PENDING', NULL, NULL, NULL, NULL),
(144, 4, 1500.00, 0.00, 5000.00, 6500.00, '2026-05-02 12:32:52.000000', NULL, 'MF2026-04', 'PENDING', NULL, NULL, NULL, NULL),
(145, 5, 1500.00, 0.00, 5000.00, 6500.00, '2026-06-02 12:32:52.000000', NULL, 'MF2026-04', 'PENDING', NULL, NULL, NULL, NULL),
(146, 6, 1500.00, 0.00, 5000.00, 6500.00, '2026-07-02 12:32:52.000000', NULL, 'MF2026-04', 'PENDING', NULL, NULL, NULL, NULL),
(147, 7, 1500.00, 0.00, 5000.00, 6500.00, '2026-08-02 12:32:52.000000', NULL, 'MF2026-04', 'PENDING', NULL, NULL, NULL, NULL),
(148, 8, 1500.00, 0.00, 5000.00, 6500.00, '2026-09-02 12:32:52.000000', NULL, 'MF2026-04', 'PENDING', NULL, NULL, NULL, NULL),
(149, 9, 1500.00, 0.00, 5000.00, 6500.00, '2026-10-02 12:32:52.000000', NULL, 'MF2026-04', 'PENDING', NULL, NULL, NULL, NULL),
(150, 10, 1500.00, 0.00, 5000.00, 6500.00, '2026-11-02 12:32:52.000000', NULL, 'MF2026-04', 'PENDING', NULL, NULL, NULL, NULL),
(151, 1, 1500.00, 0.00, 5000.00, 6500.00, '2026-02-11 12:38:16.000000', NULL, 'MF2026-05', 'PENDING', NULL, NULL, NULL, NULL),
(152, 2, 1500.00, 0.00, 5000.00, 6500.00, '2026-03-11 12:38:16.000000', NULL, 'MF2026-05', 'PENDING', NULL, NULL, NULL, NULL),
(153, 3, 1500.00, 0.00, 5000.00, 6500.00, '2026-04-11 12:38:16.000000', NULL, 'MF2026-05', 'PENDING', NULL, NULL, NULL, NULL),
(154, 4, 1500.00, 0.00, 5000.00, 6500.00, '2026-05-11 12:38:16.000000', NULL, 'MF2026-05', 'PENDING', NULL, NULL, NULL, NULL),
(155, 5, 1500.00, 0.00, 5000.00, 6500.00, '2026-06-11 12:38:16.000000', NULL, 'MF2026-05', 'PENDING', NULL, NULL, NULL, NULL),
(156, 6, 1500.00, 0.00, 5000.00, 6500.00, '2026-07-11 12:38:16.000000', NULL, 'MF2026-05', 'PENDING', NULL, NULL, NULL, NULL),
(157, 7, 1500.00, 0.00, 5000.00, 6500.00, '2026-08-11 12:38:16.000000', NULL, 'MF2026-05', 'PENDING', NULL, NULL, NULL, NULL),
(158, 8, 1500.00, 0.00, 5000.00, 6500.00, '2026-09-11 12:38:16.000000', NULL, 'MF2026-05', 'PENDING', NULL, NULL, NULL, NULL),
(159, 9, 1500.00, 0.00, 5000.00, 6500.00, '2026-10-11 12:38:16.000000', NULL, 'MF2026-05', 'PENDING', NULL, NULL, NULL, NULL),
(160, 10, 1500.00, 0.00, 5000.00, 6500.00, '2026-11-11 12:38:16.000000', NULL, 'MF2026-05', 'PENDING', NULL, NULL, NULL, NULL),
(161, 1, 600.00, 0.00, 2000.00, 2600.00, '2026-02-12 12:41:10.000000', NULL, 'MF2026-06', 'PENDING', NULL, NULL, NULL, NULL),
(162, 2, 600.00, 0.00, 2000.00, 2600.00, '2026-03-12 12:41:10.000000', NULL, 'MF2026-06', 'PENDING', NULL, NULL, NULL, NULL),
(163, 3, 600.00, 0.00, 2000.00, 2600.00, '2026-04-12 12:41:10.000000', NULL, 'MF2026-06', 'PENDING', NULL, NULL, NULL, NULL),
(164, 4, 600.00, 0.00, 2000.00, 2600.00, '2026-05-12 12:41:10.000000', NULL, 'MF2026-06', 'PENDING', NULL, NULL, NULL, NULL),
(165, 5, 600.00, 0.00, 2000.00, 2600.00, '2026-06-12 12:41:10.000000', NULL, 'MF2026-06', 'PENDING', NULL, NULL, NULL, NULL),
(166, 6, 600.00, 0.00, 2000.00, 2600.00, '2026-07-12 12:41:10.000000', NULL, 'MF2026-06', 'PENDING', NULL, NULL, NULL, NULL),
(167, 7, 600.00, 0.00, 2000.00, 2600.00, '2026-08-12 12:41:10.000000', NULL, 'MF2026-06', 'PENDING', NULL, NULL, NULL, NULL),
(168, 8, 600.00, 0.00, 2000.00, 2600.00, '2026-09-12 12:41:10.000000', NULL, 'MF2026-06', 'PENDING', NULL, NULL, NULL, NULL),
(169, 9, 600.00, 0.00, 2000.00, 2600.00, '2026-10-12 12:41:10.000000', NULL, 'MF2026-06', 'PENDING', NULL, NULL, NULL, NULL),
(170, 10, 600.00, 0.00, 2000.00, 2600.00, '2026-11-12 12:41:10.000000', NULL, 'MF2026-06', 'PENDING', NULL, NULL, NULL, NULL),
(171, 1, 1500.00, 0.00, 5000.00, 6500.00, '2026-02-13 12:42:06.000000', NULL, 'MF2026-07', 'PENDING', NULL, NULL, NULL, NULL),
(172, 2, 1500.00, 0.00, 5000.00, 6500.00, '2026-03-13 12:42:06.000000', NULL, 'MF2026-07', 'PENDING', NULL, NULL, NULL, NULL),
(173, 3, 1500.00, 0.00, 5000.00, 6500.00, '2026-04-13 12:42:06.000000', NULL, 'MF2026-07', 'PENDING', NULL, NULL, NULL, NULL),
(174, 4, 1500.00, 0.00, 5000.00, 6500.00, '2026-05-13 12:42:06.000000', NULL, 'MF2026-07', 'PENDING', NULL, NULL, NULL, NULL),
(175, 5, 1500.00, 0.00, 5000.00, 6500.00, '2026-06-13 12:42:06.000000', NULL, 'MF2026-07', 'PENDING', NULL, NULL, NULL, NULL),
(176, 6, 1500.00, 0.00, 5000.00, 6500.00, '2026-07-13 12:42:06.000000', NULL, 'MF2026-07', 'PENDING', NULL, NULL, NULL, NULL),
(177, 7, 1500.00, 0.00, 5000.00, 6500.00, '2026-08-13 12:42:06.000000', NULL, 'MF2026-07', 'PENDING', NULL, NULL, NULL, NULL),
(178, 8, 1500.00, 0.00, 5000.00, 6500.00, '2026-09-13 12:42:06.000000', NULL, 'MF2026-07', 'PENDING', NULL, NULL, NULL, NULL),
(179, 9, 1500.00, 0.00, 5000.00, 6500.00, '2026-10-13 12:42:06.000000', NULL, 'MF2026-07', 'PENDING', NULL, NULL, NULL, NULL),
(180, 10, 1500.00, 0.00, 5000.00, 6500.00, '2026-11-13 12:42:06.000000', NULL, 'MF2026-07', 'PENDING', NULL, NULL, NULL, NULL),
(181, 1, 0.00, 0.00, 800.00, 800.00, '2026-02-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(182, 2, 0.00, 0.00, 800.00, 800.00, '2026-03-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(183, 3, 0.00, 0.00, 800.00, 800.00, '2026-04-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(184, 4, 0.00, 0.00, 800.00, 800.00, '2026-05-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(185, 5, 0.00, 0.00, 800.00, 800.00, '2026-06-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(186, 6, 0.00, 0.00, 800.00, 800.00, '2026-07-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(187, 7, 0.00, 0.00, 800.00, 800.00, '2026-08-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(188, 8, 0.00, 0.00, 800.00, 800.00, '2026-09-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(189, 9, 0.00, 0.00, 800.00, 800.00, '2026-10-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(190, 10, 0.00, 0.00, 800.00, 800.00, '2026-11-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(191, 11, 0.00, 0.00, 800.00, 800.00, '2026-12-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(192, 12, 0.00, 0.00, 800.00, 800.00, '2027-01-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(193, 13, 0.00, 0.00, 800.00, 800.00, '2027-02-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(194, 14, 0.00, 0.00, 800.00, 800.00, '2027-03-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(195, 15, 0.00, 0.00, 800.00, 800.00, '2027-04-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(196, 16, 0.00, 0.00, 800.00, 800.00, '2027-05-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(197, 17, 0.00, 0.00, 800.00, 800.00, '2027-06-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(198, 18, 0.00, 0.00, 800.00, 800.00, '2027-07-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(199, 19, 0.00, 0.00, 800.00, 800.00, '2027-08-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(200, 20, 0.00, 0.00, 800.00, 800.00, '2027-09-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(201, 21, 0.00, 0.00, 800.00, 800.00, '2027-10-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(202, 22, 0.00, 0.00, 800.00, 800.00, '2027-11-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(203, 23, 0.00, 0.00, 800.00, 800.00, '2027-12-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(204, 24, 0.00, 0.00, 800.00, 800.00, '2028-01-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(205, 25, 0.00, 0.00, 800.00, 800.00, '2028-02-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(206, 26, 0.00, 0.00, 800.00, 800.00, '2028-03-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(207, 27, 0.00, 0.00, 800.00, 800.00, '2028-04-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(208, 28, 0.00, 0.00, 800.00, 800.00, '2028-05-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(209, 29, 0.00, 0.00, 800.00, 800.00, '2028-06-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(210, 30, 0.00, 0.00, 800.00, 800.00, '2028-07-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(211, 31, 0.00, 0.00, 800.00, 800.00, '2028-08-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(212, 32, 0.00, 0.00, 800.00, 800.00, '2028-09-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(213, 33, 0.00, 0.00, 800.00, 800.00, '2028-10-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(214, 34, 0.00, 0.00, 800.00, 800.00, '2028-11-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(215, 35, 0.00, 0.00, 800.00, 800.00, '2028-12-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(216, 36, 0.00, 0.00, 800.00, 800.00, '2029-01-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(217, 37, 0.00, 0.00, 800.00, 800.00, '2029-02-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(218, 38, 0.00, 0.00, 800.00, 800.00, '2029-03-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(219, 39, 0.00, 0.00, 800.00, 800.00, '2029-04-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(220, 40, 0.00, 0.00, 800.00, 800.00, '2029-05-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(221, 41, 0.00, 0.00, 800.00, 800.00, '2029-06-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(222, 42, 0.00, 0.00, 800.00, 800.00, '2029-07-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(223, 43, 0.00, 0.00, 800.00, 800.00, '2029-08-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(224, 44, 0.00, 0.00, 800.00, 800.00, '2029-09-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(225, 45, 0.00, 0.00, 800.00, 800.00, '2029-10-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(226, 46, 0.00, 0.00, 800.00, 800.00, '2029-11-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(227, 47, 0.00, 0.00, 800.00, 800.00, '2029-12-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(228, 48, 0.00, 0.00, 800.00, 800.00, '2030-01-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(229, 49, 0.00, 0.00, 800.00, 800.00, '2030-02-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(230, 50, 0.00, 0.00, 800.00, 800.00, '2030-03-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(231, 51, 0.00, 0.00, 800.00, 800.00, '2030-04-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(232, 52, 0.00, 0.00, 800.00, 800.00, '2030-05-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(233, 53, 0.00, 0.00, 800.00, 800.00, '2030-06-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(234, 54, 0.00, 0.00, 800.00, 800.00, '2030-07-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(235, 55, 0.00, 0.00, 800.00, 800.00, '2030-08-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(236, 56, 0.00, 0.00, 800.00, 800.00, '2030-09-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(237, 57, 0.00, 0.00, 800.00, 800.00, '2030-10-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(238, 58, 0.00, 0.00, 800.00, 800.00, '2030-11-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(239, 59, 0.00, 0.00, 800.00, 800.00, '2030-12-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(240, 60, 0.00, 0.00, 800.00, 800.00, '2031-01-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(241, 61, 0.00, 0.00, 800.00, 800.00, '2031-02-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(242, 62, 0.00, 0.00, 800.00, 800.00, '2031-03-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(243, 63, 0.00, 0.00, 800.00, 800.00, '2031-04-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(244, 64, 0.00, 0.00, 800.00, 800.00, '2031-05-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(245, 65, 0.00, 0.00, 800.00, 800.00, '2031-06-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(246, 66, 0.00, 0.00, 800.00, 800.00, '2031-07-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(247, 67, 0.00, 0.00, 800.00, 800.00, '2031-08-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(248, 68, 0.00, 0.00, 800.00, 800.00, '2031-09-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(249, 69, 0.00, 0.00, 800.00, 800.00, '2031-10-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(250, 70, 0.00, 0.00, 800.00, 800.00, '2031-11-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(251, 71, 0.00, 0.00, 800.00, 800.00, '2031-12-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(252, 72, 0.00, 0.00, 800.00, 800.00, '2032-01-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(253, 73, 0.00, 0.00, 800.00, 800.00, '2032-02-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(254, 74, 0.00, 0.00, 800.00, 800.00, '2032-03-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(255, 75, 0.00, 0.00, 800.00, 800.00, '2032-04-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(256, 76, 0.00, 0.00, 800.00, 800.00, '2032-05-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(257, 77, 0.00, 0.00, 800.00, 800.00, '2032-06-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(258, 78, 0.00, 0.00, 800.00, 800.00, '2032-07-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(259, 79, 0.00, 0.00, 800.00, 800.00, '2032-08-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(260, 80, 0.00, 0.00, 800.00, 800.00, '2032-09-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(261, 81, 0.00, 0.00, 800.00, 800.00, '2032-10-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(262, 82, 0.00, 0.00, 800.00, 800.00, '2032-11-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(263, 83, 0.00, 0.00, 800.00, 800.00, '2032-12-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(264, 84, 0.00, 0.00, 800.00, 800.00, '2033-01-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(265, 85, 0.00, 0.00, 800.00, 800.00, '2033-02-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(266, 86, 0.00, 0.00, 800.00, 800.00, '2033-03-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(267, 87, 0.00, 0.00, 800.00, 800.00, '2033-04-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(268, 88, 0.00, 0.00, 800.00, 800.00, '2033-05-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(269, 89, 0.00, 0.00, 800.00, 800.00, '2033-06-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(270, 90, 0.00, 0.00, 800.00, 800.00, '2033-07-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(271, 91, 0.00, 0.00, 800.00, 800.00, '2033-08-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(272, 92, 0.00, 0.00, 800.00, 800.00, '2033-09-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(273, 93, 0.00, 0.00, 800.00, 800.00, '2033-10-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(274, 94, 0.00, 0.00, 800.00, 800.00, '2033-11-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(275, 95, 0.00, 0.00, 800.00, 800.00, '2033-12-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(276, 96, 0.00, 0.00, 800.00, 800.00, '2034-01-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(277, 97, 0.00, 0.00, 800.00, 800.00, '2034-02-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(278, 98, 0.00, 0.00, 800.00, 800.00, '2034-03-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(279, 99, 0.00, 0.00, 800.00, 800.00, '2034-04-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(280, 100, 0.00, 0.00, 800.00, 800.00, '2034-05-13 12:42:50.000000', NULL, 'DF2026-01', 'PENDING', NULL, NULL, NULL, NULL),
(281, 1, 1500.00, 0.00, 5000.00, 6500.00, '2026-02-19 12:44:49.000000', NULL, 'MF2026-08', 'PENDING', NULL, NULL, NULL, NULL),
(282, 2, 1500.00, 0.00, 5000.00, 6500.00, '2026-03-19 12:44:49.000000', NULL, 'MF2026-08', 'PENDING', NULL, NULL, NULL, NULL),
(283, 3, 1500.00, 0.00, 5000.00, 6500.00, '2026-04-19 12:44:49.000000', NULL, 'MF2026-08', 'PENDING', NULL, NULL, NULL, NULL),
(284, 4, 1500.00, 0.00, 5000.00, 6500.00, '2026-05-19 12:44:49.000000', NULL, 'MF2026-08', 'PENDING', NULL, NULL, NULL, NULL),
(285, 5, 1500.00, 0.00, 5000.00, 6500.00, '2026-06-19 12:44:49.000000', NULL, 'MF2026-08', 'PENDING', NULL, NULL, NULL, NULL),
(286, 6, 1500.00, 0.00, 5000.00, 6500.00, '2026-07-19 12:44:49.000000', NULL, 'MF2026-08', 'PENDING', NULL, NULL, NULL, NULL),
(287, 7, 1500.00, 0.00, 5000.00, 6500.00, '2026-08-19 12:44:49.000000', NULL, 'MF2026-08', 'PENDING', NULL, NULL, NULL, NULL),
(288, 8, 1500.00, 0.00, 5000.00, 6500.00, '2026-09-19 12:44:49.000000', NULL, 'MF2026-08', 'PENDING', NULL, NULL, NULL, NULL),
(289, 9, 1500.00, 0.00, 5000.00, 6500.00, '2026-10-19 12:44:49.000000', NULL, 'MF2026-08', 'PENDING', NULL, NULL, NULL, NULL),
(290, 10, 1500.00, 0.00, 5000.00, 6500.00, '2026-11-19 12:44:49.000000', NULL, 'MF2026-08', 'PENDING', NULL, NULL, NULL, NULL),
(291, 1, 1500.00, 0.00, 5000.00, 6500.00, '2026-02-21 12:45:48.000000', NULL, 'MF2026-09', 'PENDING', NULL, NULL, NULL, NULL),
(292, 2, 1500.00, 0.00, 5000.00, 6500.00, '2026-03-21 12:45:48.000000', NULL, 'MF2026-09', 'PENDING', NULL, NULL, NULL, NULL),
(293, 3, 1500.00, 0.00, 5000.00, 6500.00, '2026-04-21 12:45:48.000000', NULL, 'MF2026-09', 'PENDING', NULL, NULL, NULL, NULL),
(294, 4, 1500.00, 0.00, 5000.00, 6500.00, '2026-05-21 12:45:48.000000', NULL, 'MF2026-09', 'PENDING', NULL, NULL, NULL, NULL),
(295, 5, 1500.00, 0.00, 5000.00, 6500.00, '2026-06-21 12:45:48.000000', NULL, 'MF2026-09', 'PENDING', NULL, NULL, NULL, NULL),
(296, 6, 1500.00, 0.00, 5000.00, 6500.00, '2026-07-21 12:45:48.000000', NULL, 'MF2026-09', 'PENDING', NULL, NULL, NULL, NULL),
(297, 7, 1500.00, 0.00, 5000.00, 6500.00, '2026-08-21 12:45:48.000000', NULL, 'MF2026-09', 'PENDING', NULL, NULL, NULL, NULL),
(298, 8, 1500.00, 0.00, 5000.00, 6500.00, '2026-09-21 12:45:48.000000', NULL, 'MF2026-09', 'PENDING', NULL, NULL, NULL, NULL),
(299, 9, 1500.00, 0.00, 5000.00, 6500.00, '2026-10-21 12:45:48.000000', NULL, 'MF2026-09', 'PENDING', NULL, NULL, NULL, NULL),
(300, 10, 1500.00, 0.00, 5000.00, 6500.00, '2026-11-21 12:45:48.000000', NULL, 'MF2026-09', 'PENDING', NULL, NULL, NULL, NULL),
(301, 1, 300.00, 0.00, 1000.00, 1300.00, '2026-02-22 12:46:27.000000', NULL, 'MF2026-10', 'PENDING', NULL, NULL, NULL, NULL),
(302, 2, 300.00, 0.00, 1000.00, 1300.00, '2026-03-22 12:46:27.000000', NULL, 'MF2026-10', 'PENDING', NULL, NULL, NULL, NULL),
(303, 3, 300.00, 0.00, 1000.00, 1300.00, '2026-04-22 12:46:27.000000', NULL, 'MF2026-10', 'PENDING', NULL, NULL, NULL, NULL),
(304, 4, 300.00, 0.00, 1000.00, 1300.00, '2026-05-22 12:46:27.000000', NULL, 'MF2026-10', 'PENDING', NULL, NULL, NULL, NULL),
(305, 5, 300.00, 0.00, 1000.00, 1300.00, '2026-06-22 12:46:27.000000', NULL, 'MF2026-10', 'PENDING', NULL, NULL, NULL, NULL),
(306, 6, 300.00, 0.00, 1000.00, 1300.00, '2026-07-22 12:46:27.000000', NULL, 'MF2026-10', 'PENDING', NULL, NULL, NULL, NULL),
(307, 7, 300.00, 0.00, 1000.00, 1300.00, '2026-08-22 12:46:27.000000', NULL, 'MF2026-10', 'PENDING', NULL, NULL, NULL, NULL),
(308, 8, 300.00, 0.00, 1000.00, 1300.00, '2026-09-22 12:46:27.000000', NULL, 'MF2026-10', 'PENDING', NULL, NULL, NULL, NULL),
(309, 9, 300.00, 0.00, 1000.00, 1300.00, '2026-10-22 12:46:27.000000', NULL, 'MF2026-10', 'PENDING', NULL, NULL, NULL, NULL),
(310, 10, 300.00, 0.00, 1000.00, 1300.00, '2026-11-22 12:46:27.000000', NULL, 'MF2026-10', 'PENDING', NULL, NULL, NULL, NULL),
(311, 1, 300.00, 0.00, 1000.00, 1300.00, '2026-02-22 12:47:29.000000', NULL, 'MF2026-11', 'PENDING', NULL, NULL, NULL, NULL),
(312, 2, 300.00, 0.00, 1000.00, 1300.00, '2026-03-22 12:47:29.000000', NULL, 'MF2026-11', 'PENDING', NULL, NULL, NULL, NULL),
(313, 3, 300.00, 0.00, 1000.00, 1300.00, '2026-04-22 12:47:29.000000', NULL, 'MF2026-11', 'PENDING', NULL, NULL, NULL, NULL),
(314, 4, 300.00, 0.00, 1000.00, 1300.00, '2026-05-22 12:47:29.000000', NULL, 'MF2026-11', 'PENDING', NULL, NULL, NULL, NULL),
(315, 5, 300.00, 0.00, 1000.00, 1300.00, '2026-06-22 12:47:29.000000', NULL, 'MF2026-11', 'PENDING', NULL, NULL, NULL, NULL),
(316, 6, 300.00, 0.00, 1000.00, 1300.00, '2026-07-22 12:47:29.000000', NULL, 'MF2026-11', 'PENDING', NULL, NULL, NULL, NULL),
(317, 7, 300.00, 0.00, 1000.00, 1300.00, '2026-08-22 12:47:29.000000', NULL, 'MF2026-11', 'PENDING', NULL, NULL, NULL, NULL),
(318, 8, 300.00, 0.00, 1000.00, 1300.00, '2026-09-22 12:47:29.000000', NULL, 'MF2026-11', 'PENDING', NULL, NULL, NULL, NULL),
(319, 9, 300.00, 0.00, 1000.00, 1300.00, '2026-10-22 12:47:29.000000', NULL, 'MF2026-11', 'PENDING', NULL, NULL, NULL, NULL),
(320, 10, 300.00, 0.00, 1000.00, 1300.00, '2026-11-22 12:47:29.000000', NULL, 'MF2026-11', 'PENDING', NULL, NULL, NULL, NULL),
(321, 1, 6000.00, 0.00, 20000.00, 26000.00, '2026-01-30 19:09:07.000000', NULL, 'MF2025-10', 'PENDING', 'admin', '2026-04-16 22:45:19.444836', 'admin', '2026-04-16 22:45:19.444836'),
(322, 2, 6000.00, 0.00, 20000.00, 26000.00, '2026-02-28 19:09:07.000000', NULL, 'MF2025-10', 'PENDING', 'admin', '2026-04-16 22:45:19.474665', 'admin', '2026-04-16 22:45:19.474665'),
(323, 3, 6000.00, 0.00, 20000.00, 26000.00, '2026-03-30 19:09:07.000000', NULL, 'MF2025-10', 'PENDING', 'admin', '2026-04-16 22:45:19.478378', 'admin', '2026-04-16 22:45:19.478378'),
(324, 4, 6000.00, 0.00, 20000.00, 26000.00, '2026-04-30 19:09:07.000000', NULL, 'MF2025-10', 'PENDING', 'admin', '2026-04-16 22:45:19.483686', 'admin', '2026-04-16 22:45:19.483686'),
(325, 5, 6000.00, 0.00, 20000.00, 26000.00, '2026-05-30 19:09:07.000000', NULL, 'MF2025-10', 'PENDING', 'admin', '2026-04-16 22:45:19.490273', 'admin', '2026-04-16 22:45:19.490273'),
(326, 6, 6000.00, 0.00, 20000.00, 26000.00, '2026-06-30 19:09:07.000000', NULL, 'MF2025-10', 'PENDING', 'admin', '2026-04-16 22:45:19.493136', 'admin', '2026-04-16 22:45:19.493136'),
(327, 7, 6000.00, 0.00, 20000.00, 26000.00, '2026-07-30 19:09:07.000000', NULL, 'MF2025-10', 'PENDING', 'admin', '2026-04-16 22:45:19.496828', 'admin', '2026-04-16 22:45:19.496828'),
(328, 8, 6000.00, 0.00, 20000.00, 26000.00, '2026-08-30 19:09:07.000000', NULL, 'MF2025-10', 'PENDING', 'admin', '2026-04-16 22:45:19.499958', 'admin', '2026-04-16 22:45:19.499958'),
(329, 9, 6000.00, 0.00, 20000.00, 26000.00, '2026-09-30 19:09:07.000000', NULL, 'MF2025-10', 'PENDING', 'admin', '2026-04-16 22:45:19.504181', 'admin', '2026-04-16 22:45:19.504181'),
(330, 10, 6000.00, 0.00, 20000.00, 26000.00, '2026-10-30 19:09:07.000000', NULL, 'MF2025-10', 'PENDING', 'admin', '2026-04-16 22:45:19.509040', 'admin', '2026-04-16 22:45:19.509040'),
(331, 1, 1500.00, 0.00, 5000.00, 6500.00, '2026-01-19 19:01:11.000000', NULL, 'MF2025-09', 'PENDING', 'admin', '2026-04-16 22:45:30.838491', 'admin', '2026-04-16 22:45:30.838491'),
(332, 2, 1500.00, 0.00, 5000.00, 6500.00, '2026-02-19 19:01:11.000000', NULL, 'MF2025-09', 'PENDING', 'admin', '2026-04-16 22:45:30.842390', 'admin', '2026-04-16 22:45:30.842390'),
(333, 3, 1500.00, 0.00, 5000.00, 6500.00, '2026-03-19 19:01:11.000000', NULL, 'MF2025-09', 'PENDING', 'admin', '2026-04-16 22:45:30.846219', 'admin', '2026-04-16 22:45:30.846219'),
(334, 4, 1500.00, 0.00, 5000.00, 6500.00, '2026-04-19 19:01:11.000000', NULL, 'MF2025-09', 'PENDING', 'admin', '2026-04-16 22:45:30.852125', 'admin', '2026-04-16 22:45:30.852125'),
(335, 5, 1500.00, 0.00, 5000.00, 6500.00, '2026-05-19 19:01:11.000000', NULL, 'MF2025-09', 'PENDING', 'admin', '2026-04-16 22:45:30.858987', 'admin', '2026-04-16 22:45:30.858987'),
(336, 6, 1500.00, 0.00, 5000.00, 6500.00, '2026-06-19 19:01:11.000000', NULL, 'MF2025-09', 'PENDING', 'admin', '2026-04-16 22:45:30.864409', 'admin', '2026-04-16 22:45:30.864409'),
(337, 7, 1500.00, 0.00, 5000.00, 6500.00, '2026-07-19 19:01:11.000000', NULL, 'MF2025-09', 'PENDING', 'admin', '2026-04-16 22:45:30.870520', 'admin', '2026-04-16 22:45:30.870520'),
(338, 8, 1500.00, 0.00, 5000.00, 6500.00, '2026-08-19 19:01:11.000000', NULL, 'MF2025-09', 'PENDING', 'admin', '2026-04-16 22:45:30.874570', 'admin', '2026-04-16 22:45:30.874570'),
(339, 9, 1500.00, 0.00, 5000.00, 6500.00, '2026-09-19 19:01:11.000000', NULL, 'MF2025-09', 'PENDING', 'admin', '2026-04-16 22:45:30.877391', 'admin', '2026-04-16 22:45:30.877391'),
(340, 10, 1500.00, 0.00, 5000.00, 6500.00, '2026-10-19 19:01:11.000000', NULL, 'MF2025-09', 'PENDING', 'admin', '2026-04-16 22:45:30.880952', 'admin', '2026-04-16 22:45:30.880952'),
(341, 1, 1500.00, 0.00, 5000.00, 6500.00, '2026-01-19 18:58:11.000000', NULL, 'MF2025-08', 'PENDING', 'admin', '2026-04-16 22:45:43.969217', 'admin', '2026-04-16 22:45:43.969217'),
(342, 2, 1500.00, 0.00, 5000.00, 6500.00, '2026-02-19 18:58:11.000000', NULL, 'MF2025-08', 'PENDING', 'admin', '2026-04-16 22:45:43.974310', 'admin', '2026-04-16 22:45:43.974310'),
(343, 3, 1500.00, 0.00, 5000.00, 6500.00, '2026-03-19 18:58:11.000000', NULL, 'MF2025-08', 'PENDING', 'admin', '2026-04-16 22:45:43.979307', 'admin', '2026-04-16 22:45:43.979307'),
(344, 4, 1500.00, 0.00, 5000.00, 6500.00, '2026-04-19 18:58:11.000000', NULL, 'MF2025-08', 'PENDING', 'admin', '2026-04-16 22:45:43.986075', 'admin', '2026-04-16 22:45:43.986075'),
(345, 5, 1500.00, 0.00, 5000.00, 6500.00, '2026-05-19 18:58:11.000000', NULL, 'MF2025-08', 'PENDING', 'admin', '2026-04-16 22:45:43.990713', 'admin', '2026-04-16 22:45:43.990713'),
(346, 6, 1500.00, 0.00, 5000.00, 6500.00, '2026-06-19 18:58:11.000000', NULL, 'MF2025-08', 'PENDING', 'admin', '2026-04-16 22:45:43.995876', 'admin', '2026-04-16 22:45:43.995876'),
(347, 7, 1500.00, 0.00, 5000.00, 6500.00, '2026-07-19 18:58:11.000000', NULL, 'MF2025-08', 'PENDING', 'admin', '2026-04-16 22:45:44.001268', 'admin', '2026-04-16 22:45:44.001268'),
(348, 8, 1500.00, 0.00, 5000.00, 6500.00, '2026-08-19 18:58:11.000000', NULL, 'MF2025-08', 'PENDING', 'admin', '2026-04-16 22:45:44.007090', 'admin', '2026-04-16 22:45:44.007090'),
(349, 9, 1500.00, 0.00, 5000.00, 6500.00, '2026-09-19 18:58:11.000000', NULL, 'MF2025-08', 'PENDING', 'admin', '2026-04-16 22:45:44.011196', 'admin', '2026-04-16 22:45:44.011196'),
(350, 10, 1500.00, 0.00, 5000.00, 6500.00, '2026-10-19 18:58:11.000000', NULL, 'MF2025-08', 'PENDING', 'admin', '2026-04-16 22:45:44.015898', 'admin', '2026-04-16 22:45:44.015898'),
(351, 1, 750.00, 0.00, 2500.00, 3250.00, '2026-01-19 18:57:23.000000', NULL, 'MF2025-07', 'PENDING', 'admin', '2026-04-16 22:45:55.324017', 'admin', '2026-04-16 22:45:55.324017'),
(352, 2, 750.00, 0.00, 2500.00, 3250.00, '2026-02-19 18:57:23.000000', NULL, 'MF2025-07', 'PENDING', 'admin', '2026-04-16 22:45:55.327318', 'admin', '2026-04-16 22:45:55.327318'),
(353, 3, 750.00, 0.00, 2500.00, 3250.00, '2026-03-19 18:57:23.000000', NULL, 'MF2025-07', 'PENDING', 'admin', '2026-04-16 22:45:55.331274', 'admin', '2026-04-16 22:45:55.331274'),
(354, 4, 750.00, 0.00, 2500.00, 3250.00, '2026-04-19 18:57:23.000000', NULL, 'MF2025-07', 'PENDING', 'admin', '2026-04-16 22:45:55.336697', 'admin', '2026-04-16 22:45:55.336697'),
(355, 5, 750.00, 0.00, 2500.00, 3250.00, '2026-05-19 18:57:23.000000', NULL, 'MF2025-07', 'PENDING', 'admin', '2026-04-16 22:45:55.339221', 'admin', '2026-04-16 22:45:55.339221'),
(356, 6, 750.00, 0.00, 2500.00, 3250.00, '2026-06-19 18:57:23.000000', NULL, 'MF2025-07', 'PENDING', 'admin', '2026-04-16 22:45:55.341687', 'admin', '2026-04-16 22:45:55.341687'),
(357, 7, 750.00, 0.00, 2500.00, 3250.00, '2026-07-19 18:57:23.000000', NULL, 'MF2025-07', 'PENDING', 'admin', '2026-04-16 22:45:55.344927', 'admin', '2026-04-16 22:45:55.344927'),
(358, 8, 750.00, 0.00, 2500.00, 3250.00, '2026-08-19 18:57:23.000000', NULL, 'MF2025-07', 'PENDING', 'admin', '2026-04-16 22:45:55.350475', 'admin', '2026-04-16 22:45:55.350475'),
(359, 9, 750.00, 0.00, 2500.00, 3250.00, '2026-09-19 18:57:23.000000', NULL, 'MF2025-07', 'PENDING', 'admin', '2026-04-16 22:45:55.357351', 'admin', '2026-04-16 22:45:55.357351'),
(360, 10, 750.00, 0.00, 2500.00, 3250.00, '2026-10-19 18:57:23.000000', NULL, 'MF2025-07', 'PENDING', 'admin', '2026-04-16 22:45:55.361297', 'admin', '2026-04-16 22:45:55.361297'),
(361, 1, 3000.00, 0.00, 20000.00, 23000.00, '2026-01-17 18:52:39.000000', '2026-04-16 23:54:29.000000', 'MF2025-06', 'PENDING', 'admin', '2026-04-16 23:01:49.330917', 'admin', '2026-04-16 23:55:37.379839'),
(362, 2, 3000.00, 0.00, 20000.00, 23000.00, '2026-02-17 18:52:39.000000', '2026-04-16 23:54:29.000000', 'MF2025-06', 'PENDING', 'admin', '2026-04-16 23:01:49.335264', 'admin', '2026-04-16 23:55:37.380080'),
(363, 3, 3000.00, 0.00, 20000.00, 23000.00, '2026-03-17 18:52:39.000000', NULL, 'MF2025-06', 'PENDING', 'admin', '2026-04-16 23:01:49.337855', 'admin', '2026-04-16 23:01:49.337855'),
(364, 4, 3000.00, 0.00, 20000.00, 23000.00, '2026-04-17 18:52:39.000000', NULL, 'MF2025-06', 'PENDING', 'admin', '2026-04-16 23:01:49.341359', 'admin', '2026-04-16 23:01:49.341359'),
(365, 5, 3000.00, 0.00, 20000.00, 23000.00, '2026-05-17 18:52:39.000000', NULL, 'MF2025-06', 'PENDING', 'admin', '2026-04-16 23:01:49.346805', 'admin', '2026-04-16 23:01:49.346805'),
(366, 1, 4500.00, 0.00, 15000.00, 19500.00, '2026-01-16 18:44:52.000000', NULL, 'MF2025-05', 'PENDING', 'admin', '2026-04-16 23:01:55.717965', 'admin', '2026-04-16 23:01:55.717965'),
(367, 2, 4500.00, 0.00, 15000.00, 19500.00, '2026-02-16 18:44:52.000000', NULL, 'MF2025-05', 'PENDING', 'admin', '2026-04-16 23:01:55.721552', 'admin', '2026-04-16 23:01:55.721552'),
(368, 3, 4500.00, 0.00, 15000.00, 19500.00, '2026-03-16 18:44:52.000000', NULL, 'MF2025-05', 'PENDING', 'admin', '2026-04-16 23:01:55.724308', 'admin', '2026-04-16 23:01:55.724308'),
(369, 4, 4500.00, 0.00, 15000.00, 19500.00, '2026-04-16 18:44:52.000000', NULL, 'MF2025-05', 'PENDING', 'admin', '2026-04-16 23:01:55.729768', 'admin', '2026-04-16 23:01:55.729768'),
(370, 5, 4500.00, 0.00, 15000.00, 19500.00, '2026-05-16 18:44:52.000000', NULL, 'MF2025-05', 'PENDING', 'admin', '2026-04-16 23:01:55.733381', 'admin', '2026-04-16 23:01:55.733381'),
(371, 6, 4500.00, 0.00, 15000.00, 19500.00, '2026-06-16 18:44:52.000000', NULL, 'MF2025-05', 'PENDING', 'admin', '2026-04-16 23:01:55.735798', 'admin', '2026-04-16 23:01:55.735798'),
(372, 7, 4500.00, 0.00, 15000.00, 19500.00, '2026-07-16 18:44:52.000000', NULL, 'MF2025-05', 'PENDING', 'admin', '2026-04-16 23:01:55.738928', 'admin', '2026-04-16 23:01:55.738928'),
(373, 8, 4500.00, 0.00, 15000.00, 19500.00, '2026-08-16 18:44:52.000000', NULL, 'MF2025-05', 'PENDING', 'admin', '2026-04-16 23:01:55.743121', 'admin', '2026-04-16 23:01:55.743121'),
(374, 9, 4500.00, 0.00, 15000.00, 19500.00, '2026-09-16 18:44:52.000000', NULL, 'MF2025-05', 'PENDING', 'admin', '2026-04-16 23:01:55.749094', 'admin', '2026-04-16 23:01:55.749094'),
(375, 10, 4500.00, 0.00, 15000.00, 19500.00, '2026-10-16 18:44:52.000000', NULL, 'MF2025-05', 'PENDING', 'admin', '2026-04-16 23:01:55.751737', 'admin', '2026-04-16 23:01:55.751737'),
(376, 1, 6000.00, 0.00, 20000.00, 26000.00, '2026-01-15 20:45:52.000000', NULL, 'MF2025-04', 'PENDING', 'admin', '2026-04-16 23:02:01.557526', 'admin', '2026-04-16 23:02:01.557526'),
(377, 2, 6000.00, 0.00, 20000.00, 26000.00, '2026-02-15 20:45:52.000000', NULL, 'MF2025-04', 'PENDING', 'admin', '2026-04-16 23:02:01.561243', 'admin', '2026-04-16 23:02:01.561243'),
(378, 3, 6000.00, 0.00, 20000.00, 26000.00, '2026-03-15 20:45:52.000000', NULL, 'MF2025-04', 'PENDING', 'admin', '2026-04-16 23:02:01.564538', 'admin', '2026-04-16 23:02:01.564538'),
(379, 4, 6000.00, 0.00, 20000.00, 26000.00, '2026-04-15 20:45:52.000000', NULL, 'MF2025-04', 'PENDING', 'admin', '2026-04-16 23:02:01.571361', 'admin', '2026-04-16 23:02:01.571361'),
(380, 5, 6000.00, 0.00, 20000.00, 26000.00, '2026-05-15 20:45:52.000000', NULL, 'MF2025-04', 'PENDING', 'admin', '2026-04-16 23:02:01.575639', 'admin', '2026-04-16 23:02:01.575639'),
(381, 6, 6000.00, 0.00, 20000.00, 26000.00, '2026-06-15 20:45:52.000000', NULL, 'MF2025-04', 'PENDING', 'admin', '2026-04-16 23:02:01.579860', 'admin', '2026-04-16 23:02:01.579860'),
(382, 7, 6000.00, 0.00, 20000.00, 26000.00, '2026-07-15 20:45:52.000000', NULL, 'MF2025-04', 'PENDING', 'admin', '2026-04-16 23:02:01.583569', 'admin', '2026-04-16 23:02:01.583569'),
(383, 8, 6000.00, 0.00, 20000.00, 26000.00, '2026-08-15 20:45:52.000000', NULL, 'MF2025-04', 'PENDING', 'admin', '2026-04-16 23:02:01.586915', 'admin', '2026-04-16 23:02:01.586915'),
(384, 9, 6000.00, 0.00, 20000.00, 26000.00, '2026-09-15 20:45:52.000000', NULL, 'MF2025-04', 'PENDING', 'admin', '2026-04-16 23:02:01.591570', 'admin', '2026-04-16 23:02:01.591570'),
(385, 10, 6000.00, 0.00, 20000.00, 26000.00, '2026-10-15 20:45:52.000000', NULL, 'MF2025-04', 'PENDING', 'admin', '2026-04-16 23:02:01.596088', 'admin', '2026-04-16 23:02:01.596088'),
(386, 1, 1500.00, 0.00, 5000.00, 6500.00, '2026-01-13 20:43:15.000000', NULL, 'MF2025-03', 'PENDING', 'admin', '2026-04-16 23:02:07.591467', 'admin', '2026-04-16 23:02:07.591467'),
(387, 2, 1500.00, 0.00, 5000.00, 6500.00, '2026-02-13 20:43:15.000000', NULL, 'MF2025-03', 'PENDING', 'admin', '2026-04-16 23:02:07.595021', 'admin', '2026-04-16 23:02:07.595021'),
(388, 3, 1500.00, 0.00, 5000.00, 6500.00, '2026-03-13 20:43:15.000000', NULL, 'MF2025-03', 'PENDING', 'admin', '2026-04-16 23:02:07.599753', 'admin', '2026-04-16 23:02:07.599753'),
(389, 4, 1500.00, 0.00, 5000.00, 6500.00, '2026-04-13 20:43:15.000000', NULL, 'MF2025-03', 'PENDING', 'admin', '2026-04-16 23:02:07.604631', 'admin', '2026-04-16 23:02:07.604631'),
(390, 5, 1500.00, 0.00, 5000.00, 6500.00, '2026-05-13 20:43:15.000000', NULL, 'MF2025-03', 'PENDING', 'admin', '2026-04-16 23:02:07.607034', 'admin', '2026-04-16 23:02:07.607034'),
(391, 6, 1500.00, 0.00, 5000.00, 6500.00, '2026-06-13 20:43:15.000000', NULL, 'MF2025-03', 'PENDING', 'admin', '2026-04-16 23:02:07.609430', 'admin', '2026-04-16 23:02:07.609430'),
(392, 7, 1500.00, 0.00, 5000.00, 6500.00, '2026-07-13 20:43:15.000000', NULL, 'MF2025-03', 'PENDING', 'admin', '2026-04-16 23:02:07.612714', 'admin', '2026-04-16 23:02:07.612714'),
(393, 8, 1500.00, 0.00, 5000.00, 6500.00, '2026-08-13 20:43:15.000000', NULL, 'MF2025-03', 'PENDING', 'admin', '2026-04-16 23:02:07.618616', 'admin', '2026-04-16 23:02:07.618616'),
(394, 9, 1500.00, 0.00, 5000.00, 6500.00, '2026-09-13 20:43:15.000000', NULL, 'MF2025-03', 'PENDING', 'admin', '2026-04-16 23:02:07.622284', 'admin', '2026-04-16 23:02:07.622284'),
(395, 10, 1500.00, 0.00, 5000.00, 6500.00, '2026-10-13 20:43:15.000000', NULL, 'MF2025-03', 'PENDING', 'admin', '2026-04-16 23:02:07.624627', 'admin', '2026-04-16 23:02:07.624627'),
(396, 1, 1500.00, 0.00, 5000.00, 6500.00, '2026-01-11 20:34:31.000000', NULL, 'MF2025-02', 'PENDING', 'admin', '2026-04-16 23:02:17.570558', 'admin', '2026-04-16 23:02:17.570558'),
(397, 2, 1500.00, 0.00, 5000.00, 6500.00, '2026-02-11 20:34:31.000000', NULL, 'MF2025-02', 'PENDING', 'admin', '2026-04-16 23:02:17.573011', 'admin', '2026-04-16 23:02:17.573011'),
(398, 3, 1500.00, 0.00, 5000.00, 6500.00, '2026-03-11 20:34:31.000000', NULL, 'MF2025-02', 'PENDING', 'admin', '2026-04-16 23:02:17.575919', 'admin', '2026-04-16 23:02:17.575919'),
(399, 4, 1500.00, 0.00, 5000.00, 6500.00, '2026-04-11 20:34:31.000000', NULL, 'MF2025-02', 'PENDING', 'admin', '2026-04-16 23:02:17.579251', 'admin', '2026-04-16 23:02:17.579251'),
(400, 5, 1500.00, 0.00, 5000.00, 6500.00, '2026-05-11 20:34:31.000000', NULL, 'MF2025-02', 'PENDING', 'admin', '2026-04-16 23:02:17.582830', 'admin', '2026-04-16 23:02:17.582830'),
(401, 6, 1500.00, 0.00, 5000.00, 6500.00, '2026-06-11 20:34:31.000000', NULL, 'MF2025-02', 'PENDING', 'admin', '2026-04-16 23:02:17.585714', 'admin', '2026-04-16 23:02:17.585714'),
(402, 7, 1500.00, 0.00, 5000.00, 6500.00, '2026-07-11 20:34:31.000000', NULL, 'MF2025-02', 'PENDING', 'admin', '2026-04-16 23:02:17.588278', 'admin', '2026-04-16 23:02:17.588278'),
(403, 8, 1500.00, 0.00, 5000.00, 6500.00, '2026-08-11 20:34:31.000000', NULL, 'MF2025-02', 'PENDING', 'admin', '2026-04-16 23:02:17.590960', 'admin', '2026-04-16 23:02:17.590960'),
(404, 9, 1500.00, 0.00, 5000.00, 6500.00, '2026-09-11 20:34:31.000000', NULL, 'MF2025-02', 'PENDING', 'admin', '2026-04-16 23:02:17.593469', 'admin', '2026-04-16 23:02:17.593469'),
(405, 10, 1500.00, 0.00, 5000.00, 6500.00, '2026-10-11 20:34:31.000000', NULL, 'MF2025-02', 'PENDING', 'admin', '2026-04-16 23:02:17.596532', 'admin', '2026-04-16 23:02:17.596532');

-- --------------------------------------------------------

--
-- Table structure for table `payment_allocation`
--

CREATE TABLE `payment_allocation` (
  `id` bigint NOT NULL,
  `allocated_amount` decimal(38,2) DEFAULT NULL,
  `payment_ref_id` varchar(255) DEFAULT NULL,
  `emi_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_info`
--

CREATE TABLE `personal_info` (
  `personal_info_id` varchar(255) NOT NULL,
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
  `phone` varchar(255) DEFAULT NULL,
  `phone2` varchar(255) DEFAULT NULL,
  `reference` varchar(255) DEFAULT NULL,
  `spouse` varchar(255) DEFAULT NULL,
  `created_date` datetime(6) DEFAULT NULL,
  `created_user` varchar(255) DEFAULT NULL,
  `modified_date` datetime(6) DEFAULT NULL,
  `modified_user` varchar(255) DEFAULT NULL,
  `sequence` bigint DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `modified_by` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `personal_info`
--

INSERT INTO `personal_info` (`personal_info_id`, `bussiness_exemption`, `disable`, `loan_limit`, `shares`, `address`, `address2`, `age`, `category`, `father_name`, `first_name`, `gender`, `id_proof`, `id_proof_type`, `intro_name`, `last_name`, `mobile`, `mobile2`, `occupation`, `old_id`, `phone`, `phone2`, `reference`, `spouse`, `created_date`, `created_user`, `modified_date`, `modified_user`, `sequence`, `created_by`, `modified_by`) VALUES
('C14', b'0', b'1', 500000.00, 50.00, '123 MG Road, Kukatpalli, Hyderabad, Telangana, India', 'Apartment 5B, MG Residency, Hyderabad', '35', 'CUSTOMER', 'Ramesh Korata', 'Mahesh', 'Male', 'A123456789', 'Aadhar Card', 'Ramesh Babu', 'Korata', '+91-9876543210', '+91-9123456780', 'Software Engineer', 'OLDCUST123', '+91-40-12345678', '+91-40-87654321', 'Suresh Babu', 'Sita Korata', '2026-04-02 12:05:33.000000', 'admin', '2026-04-02 12:05:33.000000', 'admin', 14, NULL, NULL),
('C15', b'0', b'1', NULL, NULL, 'hyderabad ', '', '', 'CUSTOMER', 'rangaiah', 'jayaranjan', 'Male', '', '', NULL, 'rokkam', '9949018472', '', '', NULL, '', NULL, '', '', '2026-04-02 12:05:33.000000', 'admin', '2026-04-02 12:05:33.000000', 'admin', 15, NULL, NULL),
('C16', b'0', b'1', NULL, NULL, 'moosapet ', '', '', 'CUSTOMER', 'krishna ', 'mahesh', 'Male', '', '', NULL, 'janaki', '9949018472', '', '', NULL, '', NULL, '', '', '2026-04-02 12:05:33.000000', 'admin', '2026-04-02 12:05:33.000000', 'admin', 16, NULL, NULL),
('C17', b'0', b'0', NULL, NULL, 'HYDERABAD ', '', '', 'CUSTOMER', '', 'RAVI KUMAR.G', 'Male', '', '', NULL, '( R.SWAMY )', '9949018472', '', '', NULL, '', NULL, '', '', '2026-04-02 12:05:33.000000', 'admin', '2026-04-02 12:05:33.000000', 'admin', 17, NULL, NULL),
('C18', b'0', b'0', NULL, NULL, 'BANJARAHILLS\nHYDERABAD', '', '', 'CUSTOMER', 'SHAIK JAHANGIR', 'shaik yakqoob', 'Male', '', '', NULL, '( R.SWAMY )', '8919403101', '', '', NULL, '', NULL, '', '', '2026-04-02 12:05:33.000000', 'admin', '2026-04-02 12:05:33.000000', 'admin', 18, NULL, NULL),
('C19', b'0', b'0', NULL, NULL, 'ATTAPUR\nMAHADIPATNAM\nHYDERABAD ', '', '', 'CUSTOMER', 'SHAIK MADHAR', 'SHAIK YOUNUS ', 'Male', '', '', NULL, '( RAJU MILAP )', '9347320337', '', '', NULL, '', NULL, 'RAJU-MILAP', '', '2026-04-02 12:05:33.000000', 'admin', '2026-04-02 12:05:33.000000', 'admin', 19, NULL, NULL),
('C20', b'0', b'0', NULL, NULL, 'IZZAT NAGAR \nHITEC CITY\nHYDERABAD ', '', '', 'CUSTOMER', 'CHENNAIAH', 'RANGA SWMY', 'Male', '', '', NULL, 'ARRAM', '9985219800', '', '', NULL, '', NULL, '', '', '2026-04-02 12:05:33.000000', 'admin', '2026-04-02 12:05:33.000000', 'admin', 20, NULL, NULL),
('C21', b'0', b'0', NULL, NULL, 'RAHAMATH NAGAR ', '', '', 'CUSTOMER', 'VEERBADRA.B', 'SANGRAM', 'Male', '', '', NULL, 'BIRADARI', '9032661083', '', '', NULL, '', NULL, '', '', '2026-04-02 12:05:33.000000', 'admin', '2026-04-02 12:05:33.000000', 'admin', 21, NULL, NULL),
('C22', b'0', b'0', NULL, NULL, 'RAHAMATH NAGAR \nHYDERABAD ', '', '', 'CUSTOMER', 'VEERBADRA.B', 'SANGRAM', 'Male', '', '', NULL, 'BIRADARI', '9032661083', '9032661083', '', NULL, '', NULL, '', '', '2026-04-02 12:05:33.000000', 'admin', '2026-04-02 12:05:33.000000', 'admin', 22, NULL, NULL),
('C23', b'0', b'0', NULL, NULL, 'FLAT NO 103\n2ND FLOOR,ROYAL EXOTICA,\nNEW NALLAKUNTA', '', '', 'CUSTOMER', 'KRISHNA CHARY.S', 'HANUMANTH CHARY.S', 'Male', '', '', NULL, '( RAMU.B )', '9701237492', '', '', NULL, '', NULL, '', '', '2026-04-02 12:05:33.000000', 'admin', '2026-04-02 12:05:33.000000', 'admin', 23, NULL, NULL),
('C24', b'0', b'0', NULL, NULL, 'BORABANDA \nHYDERABAD ', '', '', 'CUSTOMER', 'VENKATAIAH.B', 'ALIVELAMMA.B', 'Male', '', '', NULL, '( R.SWAMY )', '9515225480', '', '', NULL, '', NULL, '', '', '2026-04-02 12:05:33.000000', 'admin', '2026-04-02 12:05:33.000000', 'admin', 24, NULL, NULL),
('C25', b'0', b'0', NULL, NULL, 'OLD BOWINPALLY\nHYDERABAD ', '', '', 'CUSTOMER', 'CHANDAN MALIK', 'ASHUMALIL', 'Male', '', '', NULL, '( R J R )', '630481029', '', '', NULL, '', NULL, '', '', '2026-04-02 12:05:33.000000', 'admin', '2026-04-02 12:05:33.000000', 'admin', 25, NULL, NULL),
('C26', b'0', b'0', NULL, NULL, 'HYDERABAD', '', '', 'CUSTOMER', 'ISHAQ.MD', 'NOUSHAD.MD', 'Male', '', '', NULL, '( RAJU-MILAP )', '7989837975', '', '', NULL, '', NULL, '', '', '2026-04-02 12:05:33.000000', 'admin', '2026-04-02 12:05:33.000000', 'admin', 26, NULL, NULL),
('C27', b'0', b'0', NULL, NULL, '1-192,MALLIKARJUN NAGAR, PARVATH NAGAR,FEROZGUDA \nHYDERABAD ', '', '', 'CUSTOMER', 'NANCHARAYA.K', 'NAGARAJU.K ', 'Male', '', '', NULL, '( RAJU.MILAP )', '9502199005', '', '', NULL, '', NULL, '', '', '2026-04-02 12:05:33.000000', 'admin', '2026-04-02 12:05:33.000000', 'admin', 27, NULL, NULL),
('C28', b'0', b'0', NULL, NULL, 'HYDERABAD ', '', '', 'CUSTOMER', 'RAJU.P', 'RAJU.P', 'Male', '', '', NULL, '( R.SWAMY )', '9949018472', '', '', NULL, '', NULL, '', '', '2026-04-02 12:05:33.000000', 'admin', '2026-04-02 12:05:33.000000', 'admin', 28, NULL, NULL),
('C29', b'0', b'0', NULL, NULL, 'SRI NAGAR COLONY\nHYDERABAD ', '', '', 'CUSTOMER', 'NARASIMHA.P', 'RAJU.PUTTA POGU', 'Male', '', '', NULL, '( R. SWAMY )', '8374362227', '', '', NULL, '', NULL, '', '', '2026-04-11 14:18:25.543540', 'admin', '2026-04-11 14:18:25.543540', 'admin', 29, NULL, NULL),
('C30', b'0', b'0', NULL, NULL, '7-4-104\nVIKARABAD\n', '', '', 'CUSTOMER', '', 'SRINIVAS.YERROLA', 'Male', '', '', NULL, '( R.SWAMY )', '8977325172', '', '', NULL, '', NULL, '', '', '2026-04-11 14:19:33.869803', 'admin', '2026-04-11 14:19:33.869803', 'admin', 30, NULL, NULL),
('C31', b'0', b'0', NULL, NULL, 'FEROZGUDA\nBALANAGAR ', '', '', 'CUSTOMER', 'MADAV RAO.S', 'MANOJ.SHELKE', 'Male', '', '', NULL, '( RAMU.B )', '9701237492', '', '', NULL, '', NULL, '', '', '2026-04-11 14:21:17.056899', 'admin', '2026-04-11 14:21:17.056899', 'admin', 31, NULL, NULL),
('C32', b'0', b'0', NULL, NULL, 'MOOSAPET\nHYDERABAD ', '', '', 'CUSTOMER', 'BASKAR RAO.Y ', 'BHAGYA LAXMI.Y ', 'Male', '', '', NULL, '( RAMU.B )', '7794090775', '', '', NULL, '', NULL, '', '', '2026-04-11 14:22:38.265311', 'admin', '2026-04-11 14:22:38.265311', 'admin', 32, NULL, NULL),
('C33', b'0', b'0', NULL, NULL, 'SHAMSHABAD \n', '', '', 'CUSTOMER', 'YADAGIRI.R', 'SRAVN KUMAR.R', 'Male', '', '', NULL, '( R.SWAMY )', '7988113796', '', '', NULL, '', NULL, '', '', '2026-04-11 14:25:10.894677', 'admin', '2026-04-11 14:25:10.894677', 'admin', 33, NULL, NULL),
('C34', b'0', b'0', NULL, NULL, 'HMT SATAVAHANA NAGAR \nK P H B', '', '', 'CUSTOMER', 'VENKATA RATHNAM.S', 'SUBBA RAO.S', 'Male', '', '', NULL, '( A.S.RAO )', '9440063663', '', '', NULL, '', NULL, '', '', '2026-04-11 14:26:50.380914', 'admin', '2026-04-11 14:26:50.380914', 'admin', 34, NULL, NULL),
('C35', b'0', b'0', NULL, NULL, 'BOWINPALLY\nHYDERABAD ', '', '', 'CUSTOMER', 'BABU REDDY.Y', 'RAJU.YELLA', 'Male', '', '', NULL, '( SANGRAM.B )', '9542245366', '', '', NULL, '', NULL, '', '', '2026-04-11 14:28:16.648923', 'admin', '2026-04-11 14:28:16.648923', 'admin', 35, NULL, NULL),
('C36', b'0', b'0', NULL, NULL, '1-4-548\nINDIRANAGAR \nBHOLAKPUR\nMUSHEERABAD ', '', '', 'CUSTOMER', 'YAQOOB SHAIK MAHAMOOD', 'SHAIK MAHAMMED RAFI', 'Male', '', '', NULL, '( RAJU-MILAP )', '7013664898', '', '', NULL, '', NULL, '', '', '2026-04-11 14:30:12.353830', 'admin', '2026-04-11 14:30:12.353830', 'admin', 36, NULL, NULL),
('C37', b'0', b'0', NULL, NULL, '8-3-228/678/1009/140\nSHIVAMMA PAPIREDDY HILLS\nKARMIKA NAGAR \nHYDERABAD ', '', '', 'CUSTOMER', 'ASHAPPA.G', 'BHEEM RAJ.GODDALLU', 'Male', '', '', NULL, '( RAJU.N )', '8519872780', '', '', NULL, '', NULL, '', '', '2026-04-11 14:31:52.355108', 'admin', '2026-04-11 14:31:52.355108', 'admin', 37, NULL, NULL),
('C38', b'0', b'0', NULL, NULL, '1-64/7\nYELLAMMA BANDA \nKUKKATPALLY\nHYDERABAD ', '', '', 'CUSTOMER', 'MAHABOOB.MD', 'IRAFAN.MD', 'Male', '', '', NULL, '( RAJU-MILAP )', '9949997763', '', '', NULL, '', NULL, '', '', '2026-04-11 14:33:21.847691', 'admin', '2026-04-11 14:33:21.847691', 'admin', 38, NULL, NULL),
('C39', b'0', b'0', NULL, NULL, '8-3-169/60/891\nVINAYAK NAGAR \nSPR HILLS,\nYOUSUFGUDA \nHYDERABAD ', '', '', 'CUSTOMER', 'BUCHANNA.MURGAPOTHU', 'MAHESH.MURGAPOTHU', 'Male', '', '', NULL, '( RAJU.N )', '9491110722', '', '', NULL, '', NULL, '', '', '2026-04-11 14:35:26.833662', 'admin', '2026-04-11 14:35:26.833662', 'admin', 39, NULL, NULL),
('E4', b'0', b'0', NULL, NULL, '9949018472', '', '', 'EMPLOYEE', 'Rangaiah', 'jayaranjan', 'Male', '', '', NULL, 'rokkam', '9949018472', '', '', NULL, '', NULL, '', '', '2026-04-02 12:05:33.000000', 'admin', '2026-04-02 12:05:33.000000', 'admin', 4, NULL, NULL),
('P10', b'0', b'0', NULL, NULL, 'HASMATPET \nHYDERABAD', '', '60', 'PARTNER', 'NARAYANA.K', 'NARASIMHA', 'Male', '', '', NULL, 'KOPPULA', '9440082458', '', '', NULL, '', NULL, '', '', '2026-04-11 13:51:42.474950', 'admin', '2026-04-11 13:51:42.474950', 'admin', 10, NULL, NULL),
('P11', b'0', b'0', NULL, NULL, 'KANAMET \nHITEC CITY \nHYDERABAD ', '', '', 'PARTNER', 'CHENNAIAH', 'RANGA SWAMY ', 'Male', '', '', NULL, 'ARRAM', '9985219800', '', '', NULL, '', NULL, '', '', '2026-04-11 13:56:49.192186', 'admin', '2026-04-11 13:56:49.192186', 'admin', 11, NULL, NULL),
('P12', b'0', b'0', NULL, NULL, 'HYDERABAD ', '', '', 'PARTNER', 'RANGAIAH.R', 'JAYARANJAN.R', 'Male', '', '', NULL, '( II )', '9949018472', '', '', NULL, '', NULL, '', '', '2026-04-11 13:57:52.883171', 'admin', '2026-04-11 13:57:52.883171', 'admin', 12, NULL, NULL),
('P13', b'0', b'0', NULL, NULL, 'MADHURA NAGAR \nHYDERABAD ', '', '', 'PARTNER', 'SUBBA RAO.A', 'SRINIVAS RAO .A', 'Male', '', '', NULL, '( II )', '8639660067', '', '', NULL, '', NULL, '', '', '2026-04-11 13:59:07.813999', 'admin', '2026-04-11 13:59:07.813999', 'admin', 13, NULL, NULL),
('P14', b'0', b'0', NULL, NULL, 'MADURA NAGAR \nHYDERABAD ', '', '', 'PARTNER', 'SUBBA RAO.A', 'SRINIVAS RAO', 'Male', '', '', NULL, 'ANNAPUREDDY', '8639660067', '', '', NULL, '', NULL, '', '', '2026-04-11 14:02:06.280215', 'admin', '2026-04-11 14:02:06.280215', 'admin', 14, NULL, NULL),
('P3', b'0', b'0', NULL, NULL, 'HYDERABAD', '', '', 'PARTNER', 'RANGAIAH.R', 'JAYARANJAN', 'Male', '', '', NULL, 'ROKKAM', '9949018472', '', '', NULL, '', NULL, '', '', '2026-04-02 12:05:33.000000', 'admin', '2026-04-02 12:05:33.000000', 'admin', 3, NULL, NULL),
('P4', b'0', b'0', NULL, NULL, 'HYDERABAD', '', '', 'PARTNER', '', 'SURENDAR REDDY', 'Male', '', '', NULL, 'GURAM', '9885308702', '', '', NULL, '', NULL, '', '', '2026-04-02 12:05:33.000000', 'admin', '2026-04-02 12:05:33.000000', 'admin', 4, NULL, NULL),
('P5', b'0', b'0', NULL, NULL, 'AMEERPET, HYDERABAD ', '', '', 'PARTNER', '', 'RAJU-MILAP', 'Male', '', '', NULL, '', '9494440447', '9494440447', '', NULL, '', NULL, '', '', '2026-04-02 12:05:33.000000', 'admin', '2026-04-02 12:05:33.000000', 'admin', 5, NULL, NULL),
('P6', b'0', b'0', NULL, NULL, 'MOOSAPET', '', '', 'PARTNER', '', 'MAHESH', 'Male', '', '', NULL, 'JANAKI', '9948519960', '', '', NULL, '', NULL, '', '', '2026-04-02 12:05:33.000000', 'admin', '2026-04-02 12:05:33.000000', 'admin', 6, NULL, NULL),
('P7', b'0', b'0', NULL, NULL, 'SRIRAM NAGAR \nHYDERABAD ', '', '', 'PARTNER', 'RAJU', 'RAJU', 'Male', '', '', NULL, 'NAMA', '9030065142', '', '', NULL, '', NULL, '', '', '2026-04-02 12:05:33.000000', 'admin', '2026-04-02 12:05:33.000000', 'admin', 7, NULL, NULL),
('P8', b'0', b'0', NULL, NULL, 'RAHAMATH NAGAR ', '', '', 'PARTNER', 'VEERBADRA.B', 'SANGRAM', 'Male', '', '', NULL, 'BIRADARI', '9032661083', '', '', NULL, '', NULL, '', '', '2026-04-02 12:05:33.000000', 'admin', '2026-04-02 12:05:33.000000', 'admin', 8, NULL, NULL),
('P9', b'0', b'0', NULL, NULL, 'BALKAMPET\nHYDERABAD ', '', '', 'PARTNER', 'VEERBADRA', 'RAMU', 'Male', '', '', NULL, 'BIRADARI', '9030904053', '', '', NULL, '', NULL, '', '', '2026-04-02 12:05:33.000000', 'admin', '2026-04-02 12:05:33.000000', 'admin', 9, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `person_sequence_table`
--

CREATE TABLE `person_sequence_table` (
  `name` varchar(255) NOT NULL,
  `last_number` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `person_sequence_table`
--

INSERT INTO `person_sequence_table` (`name`, `last_number`) VALUES
('CUSTOMER', 39),
('EMPLOYEE', 4),
('PARTNER', 14),
('VENDOR', 1);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint NOT NULL,
  `cell` varchar(255) DEFAULT NULL,
  `menu` varchar(255) DEFAULT NULL,
  `submenu` varchar(255) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `created_date` datetime(6) DEFAULT NULL,
  `modified_by` varchar(255) DEFAULT NULL,
  `modified_date` datetime(6) DEFAULT NULL
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
(1, 'admin', '$2a$10$yi4GOwt5Vib09wCniObNZ.2RRuUJNwogAPlWpIF6n5pw.1rYKTOdu', 'ADMIN'),
(2, 'jayaranjan.rokkam', '$2a$10$9u0H7v6oQpcewPgccFdDiOmOuZy.RFc3K0G0fruTcq/t89.HLfKcO', NULL);

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
  ADD PRIMARY KEY (`year`);

--
-- Indexes for table `business_member_monthly_finance_sequence`
--
ALTER TABLE `business_member_monthly_finance_sequence`
  ADD PRIMARY KEY (`year`);

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
-- Indexes for table `payment_allocation`
--
ALTER TABLE `payment_allocation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK7vm9jp3s76udk2pltv6mcpnyj` (`emi_id`);

--
-- Indexes for table `personal_info`
--
ALTER TABLE `personal_info`
  ADD PRIMARY KEY (`personal_info_id`);

--
-- Indexes for table `person_sequence_table`
--
ALTER TABLE `person_sequence_table`
  ADD PRIMARY KEY (`name`);

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
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `cash_book`
--
ALTER TABLE `cash_book`
  MODIFY `cash_book_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=214;

--
-- AUTO_INCREMENT for table `cash_book_backup`
--
ALTER TABLE `cash_book_backup`
  MODIFY `cash_book_backup_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;

--
-- AUTO_INCREMENT for table `emi`
--
ALTER TABLE `emi`
  MODIFY `emi_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=406;

--
-- AUTO_INCREMENT for table `payment_allocation`
--
ALTER TABLE `payment_allocation`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
  ADD CONSTRAINT `fk_cash_member_new` FOREIGN KEY (`business_member_id`) REFERENCES `business_member` (`business_member_id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
  ADD CONSTRAINT `fk_emi_member_new` FOREIGN KEY (`business_member_id`) REFERENCES `business_member` (`business_member_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `payment_allocation`
--
ALTER TABLE `payment_allocation`
  ADD CONSTRAINT `FK7vm9jp3s76udk2pltv6mcpnyj` FOREIGN KEY (`emi_id`) REFERENCES `emi` (`emi_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
