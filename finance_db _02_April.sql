-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: mysql
-- Generation Time: Apr 02, 2026 at 12:09 PM
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
  `type` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `accountmaster`
--

INSERT INTO `accountmaster` (`id`, `visibility`, `code`, `master_code`, `master_icon`, `person_type`, `trans_type`, `type`) VALUES
(1, b'1', 'ANNIVARSARY EXPENCES', 'OFFICE EXPENSES', '/images/expenses-3.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES'),
(2, b'1', 'BANK CHARGES', 'OFFICE EXPENSES', '/images/expenses-3.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES'),
(3, b'1', 'BONUS', 'SALARIES', '/images/salary.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES'),
(4, b'1', 'CABLE TV BILL', 'OFFICE EXPENSES', '/images/expenses-3.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES'),
(5, b'1', 'CAPITAL', 'CAPITAL', '/images/capital.png', 'Employee,Vendor,Customer,Partner', 'Debit,Credit', 'LIABILITIES'),
(6, b'1', 'CAPITAL EXCESS', 'CAPITAL', '/images/capital.png', 'Employee,Vendor,Customer,Partner', 'Debit,Credit', 'LIABILITIES'),
(7, b'1', 'CAPITAL LATE INT', 'CAPITAL', '/images/capital.png', 'Employee,Vendor,Customer,Partner', 'Credit', 'REVENUES'),
(8, b'1', 'CHITS INSTALLMENTS', 'CHITS', '/images/advance.png', 'Employee,Vendor,Customer,Partner', 'Debit,Credit', 'ASSETS'),
(9, b'1', 'COMPANY SAVINGS', 'SAVINGS', '/images/savings.png', 'Employee,Vendor,Customer,Partner', 'Debit,Credit', 'LIABILITIES'),
(10, b'1', 'CUSTOMER SAVINGS', 'SAVINGS', '/images/savings.png', 'Employee,Vendor,Customer,Partner', 'Debit,Credit', 'LIABILITIES'),
(11, b'1', 'DONATION', 'OFFICE EXPENSES', '/images/expenses-3.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES'),
(12, b'1', 'ELECTRICITY BILL', 'OFFICE EXPENSES', '/images/expenses-3.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES'),
(13, b'1', 'EMPLOYEES', 'SALARIES', '/images/salary.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES'),
(14, b'1', 'EXTRA INCOME', 'EXTRA INCOME', '/images/income.png', 'Employee,Vendor,Customer,Partner', 'Credit', 'REVENUES'),
(15, b'1', 'FUEL', 'OFFICE EXPENSES', '/images/expenses-3.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES'),
(16, b'1', 'HAND LOAN', 'HAND LOAN', '/images/savings.png', 'Employee,Vendor,Customer,Partner', 'Debit,Credit', 'LIABILITIES'),
(17, b'1', 'HDFC', 'BANK ACCOUNTS', '/images/advance.png', 'Employee,Vendor,Customer,Partner', 'Debit,Credit', 'ASSETS'),
(18, b'1', 'INTEREST PAID', 'INTEREST', '/images/payments.png', 'Employee,Vendor,Customer,Partner', 'Debit,Credit', 'REVENUES'),
(19, b'1', 'INTREST', 'C.D.INTREST', '/images/savings.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES'),
(20, b'1', 'MD MEETING FEE', 'MEETING FEE', '/images/expenses-3.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES'),
(21, b'1', 'MD SALARY', 'SALARIES', '/images/salary.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES'),
(22, b'1', 'MEETING FEE', 'OFFICE EXPENSES', '/images/expenses-3.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES'),
(23, b'1', 'NEWS PAPER BILL', 'OFFICE EXPENSES', '/images/expenses-3.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES'),
(24, b'1', 'OFFICE MAINTAINANCE', 'OFFICE EXPENSES', '/images/expenses-3.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES'),
(25, b'1', 'OFFICE RENT', 'OFFICE EXPENSES', '/images/expenses-3.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES'),
(26, b'1', 'OTHERS', 'OFFICE EXPENSES', '/images/expenses-3.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES'),
(27, b'1', 'PARTNER', 'SHERE AMOUNT', '/images/furniture.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES'),
(28, b'1', 'PARTNER MEETING FEE', 'MEETING FEE', '/images/expenses-3.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES'),
(29, b'1', 'PARTNERS', 'SALARIES', '/images/salary.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES'),
(30, b'1', 'PARTNERS DIVIDENDS', 'DIVIDENDS', '/images/savings.png', 'Employee,Vendor,Customer,Partner', 'Debit,Credit', 'EXPENSES'),
(31, b'1', 'POOJA', 'OFFICE EXPENSES', '/images/expenses-3.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES'),
(32, b'1', 'PRINTING & STATIONERY', 'OFFICE EXPENSES', '/images/expenses-3.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES'),
(33, b'1', 'PROFESSIONAL CHARGES', 'OFFICE EXPENSES', '/images/expenses-3.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES'),
(34, b'1', 'RENT ADVANCE', 'ADVANCES', '/images/advance.png', 'Employee,Vendor,Customer,Partner', 'Debit,Credit', 'ASSETS'),
(35, b'1', 'SALARY', 'SALARIES', '/images/salary.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES'),
(36, b'1', 'SALARY ADVANCE', 'ADVANCES', '/images/advance.png', 'Employee,Vendor,Customer,Partner', 'Debit,Credit', 'ASSETS'),
(37, b'1', 'SHERE', 'SHERE AMOUNT', '/images/furniture.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES'),
(38, b'1', 'STAMPS', 'OFFICE EXPENSES', '/images/expenses-3.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES'),
(39, b'1', 'TEA', 'OFFICE EXPENSES', '/images/expenses-3.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES'),
(40, b'1', 'TELEPHONE BILL', 'OFFICE EXPENSES', '/images/expenses-3.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES'),
(41, b'1', 'TOUR EXPENDITURE', 'OFFICE EXPENSES', '/images/expenses-3.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES'),
(42, b'1', 'VEHICLE', 'ASSETS', '/images/loans.png', 'Employee,Vendor,Customer,Partner', 'Debit,Credit', 'ASSETS'),
(43, b'1', 'VEHICLE MAINTAINANCE', 'VEHICLE MAINTAINANCE', '/images/savings.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES'),
(44, b'1', 'WATER BILLS', 'OFFICE EXPENSES', '/images/expenses-3.png', 'Employee,Vendor,Customer,Partner', 'Debit', 'EXPENSES'),
(45, b'0', 'DF DOC CHARGES', 'DOCUMENT CHARGES', NULL, NULL, NULL, 'REVENUES'),
(46, b'0', 'DF INTEREST', 'INTEREST', NULL, NULL, NULL, 'REVENUES'),
(47, b'0', 'DF LATE FEE', 'LATE FEE', NULL, NULL, NULL, 'REVENUES'),
(48, b'0', 'DF LOAN', 'LOANS', NULL, NULL, NULL, 'ASSETS'),
(49, b'0', 'MF DOC CHARGES', 'DOCUMENT CHARGES', NULL, NULL, NULL, 'REVENUES'),
(50, b'0', 'MF INTEREST', 'INTEREST', NULL, NULL, NULL, 'REVENUES'),
(51, b'0', 'MF LATE FEE', 'LATE FEE', NULL, NULL, NULL, 'REVENUES'),
(52, b'0', 'MF LOAN', 'LOANS', NULL, NULL, NULL, 'ASSETS'),
(53, b'0', 'DF LOAN INSTALLMENT', 'DF LOAN INSTALLMENT', NULL, NULL, NULL, 'REVENUES'),
(54, b'0', 'MF LOAN INSTALLMENT', 'MF LOAN INSTALLMENT', NULL, NULL, NULL, 'REVENUES');

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
  `year` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `business_member`
--

INSERT INTO `business_member` (`business_member_id`, `amount`, `cheque_reminder`, `duration`, `installment`, `interest`, `paid_installments`, `part_interest`, `part_principal`, `status`, `unpaid_late_fee`, `end_date`, `start_date`, `business_id`, `customer_id`, `guarantor1_id`, `guarantor23id`, `guarantor2_id`, `loan_status`, `partner_id`, `security`, `sys_date`, `interest_rate`, `loan_type`, `processing_fee`, `sequence`, `year`) VALUES
('MF2025-01', 30000.00, b'0', 10, 3900.00, 9000.00, 0, 0, 0, b'0', 0.00, '2026-10-10 21:23:19.000000', '2025-12-10 21:23:19.000000', NULL, 'C17', 'P3', NULL, NULL, 'ACTIVE', NULL, '', '2026-03-25 21:25:01.787009', 3.00, 'MONTHLY_FINANCE', 300.00, 1, 2025),
('MF2025-02', 50000.00, b'0', 10, 0.00, 0.00, 0, 0, 0, b'0', 0.00, '2026-10-11 20:34:31.000000', '2025-12-11 20:34:31.000000', NULL, 'C18', 'C17', NULL, NULL, 'ACTIVE', NULL, '', '2026-03-28 20:36:36.594786', 0.00, 'MONTHLY_FINANCE', 500.00, 2, 2025),
('MF2025-03', 50000.00, b'0', 10, 0.00, 0.00, 0, 0, 0, b'0', 0.00, '2026-10-13 20:43:15.000000', '2025-12-13 20:43:15.000000', NULL, 'C19', 'P5', NULL, NULL, 'ACTIVE', NULL, '', '2026-03-28 20:45:03.761917', 0.00, 'MONTHLY_FINANCE', 500.00, 3, 2025),
('MF2025-04', 200000.00, b'0', 10, 0.00, 0.00, 0, 0, 0, b'0', 0.00, '2026-10-15 20:45:52.000000', '2025-12-15 20:45:52.000000', NULL, 'C20', 'C20', NULL, NULL, 'ACTIVE', NULL, '', '2026-03-28 20:51:44.327864', 0.00, 'MONTHLY_FINANCE', 20000.00, 4, 2025),
('MF2025-05', 150000.00, b'0', 10, 0.00, 0.00, 0, 0, 0, b'0', 0.00, '2026-10-16 18:44:52.000000', '2025-12-16 18:44:52.000000', NULL, 'C21', 'C21', NULL, NULL, 'ACTIVE', NULL, '', '2026-03-30 18:46:26.860239', 0.00, 'MONTHLY_FINANCE', 1500.00, 5, 2025),
('MF2025-06', 100000.00, b'0', 10, 0.00, 0.00, 0, 0, 0, b'0', 0.00, '2026-10-17 18:52:39.000000', '2025-12-17 18:52:39.000000', NULL, 'C23', 'C23', NULL, NULL, 'ACTIVE', NULL, '', '2026-03-30 18:54:45.988502', 0.00, 'MONTHLY_FINANCE', 1000.00, 6, 2025),
('MF2025-07', 25000.00, b'0', 10, 0.00, 0.00, 0, 0, 0, b'0', 0.00, '2026-10-19 18:57:23.000000', '2025-12-19 18:57:23.000000', NULL, 'C24', 'C20', NULL, NULL, 'ACTIVE', NULL, '', '2026-03-30 18:58:07.285125', 0.00, 'MONTHLY_FINANCE', 300.00, 7, 2025),
('MF2025-08', 50000.00, b'0', 10, 0.00, 0.00, 0, 0, 0, b'0', 0.00, '2026-10-19 18:58:11.000000', '2025-12-19 18:58:11.000000', NULL, 'C25', 'P3', NULL, NULL, 'ACTIVE', NULL, '', '2026-03-30 18:58:51.797560', 0.00, 'MONTHLY_FINANCE', 500.00, 8, 2025),
('MF2025-09', 50000.00, b'0', 10, 0.00, 0.00, 0, 0, 0, b'0', 0.00, '2026-10-19 19:01:11.000000', '2025-12-19 19:01:11.000000', NULL, 'C26', 'P5', NULL, NULL, 'ACTIVE', NULL, '', '2026-03-30 19:01:56.286812', 0.00, 'MONTHLY_FINANCE', 500.00, 9, 2025),
('MF2025-10', 200000.00, b'0', 10, 0.00, 0.00, 0, 0, 0, b'0', 0.00, '2026-10-30 19:09:07.000000', '2025-12-30 19:09:07.000000', NULL, 'C27', 'P5', NULL, NULL, 'ACTIVE', NULL, '', '2026-03-30 19:10:00.314486', 0.00, 'MONTHLY_FINANCE', 2000.00, 10, 2025),
('MF2026-01', 20000.00, b'0', 10, 2600.00, 6000.00, 0, 0, 0, b'0', 0.00, '2026-11-01 15:58:32.000000', '2026-01-01 15:58:32.000000', NULL, 'C28', 'C20', NULL, NULL, 'ACTIVE', 'C20', '', '2026-04-02 15:59:18.960330', 3.00, 'MONTHLY_FINANCE', 200.00, 1, 2026);

-- --------------------------------------------------------

--
-- Table structure for table `business_member_daily_finance_sequence`
--

CREATE TABLE `business_member_daily_finance_sequence` (
  `year` int NOT NULL,
  `last_number` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
(2026, 1);

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
  `account_master_type` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `cash_book`
--

INSERT INTO `cash_book` (`cash_book_id`, `credit`, `debit`, `line_no`, `sys_date`, `trans_date`, `bm_remarks`, `business_member_id`, `entry_user`, `particulars`, `personal_info_id`, `receipt_remarks`, `trans_type`, `account_master_master_code`, `account_master_code`, `account_master_type`) VALUES
(1, 50000.00, 0.00, 1, '2026-03-25 21:17:47.148480', '2025-12-06 00:00:00.000000', '', NULL, 'admin', 'PARTNER', 'P4', '', 'PARTNER', 'CAPITAL', 'CAPITAL', 'LIABILITIES'),
(2, 50000.00, 0.00, 1, '2026-03-25 21:19:00.200618', '2025-12-06 00:00:00.000000', '', NULL, 'admin', 'PARTNER', 'P3', '', 'PARTNER', 'CAPITAL', 'CAPITAL', 'LIABILITIES'),
(3, 75000.00, 0.00, 1, '2026-03-25 21:19:57.256681', '2025-12-06 00:00:00.000000', '', NULL, 'admin', 'PARTNER', 'P5', '', 'PARTNER', 'CAPITAL', 'CAPITAL', 'LIABILITIES'),
(4, 0.00, 30000.00, 1, '2026-03-25 21:25:01.802633', '2025-12-10 00:00:00.000000', '', 'MF2025-01', 'admin', 'MF LOAN', 'C17', '', 'MF LOAN', 'LOANS', 'MF LOAN', 'ASSETS'),
(5, 300.00, 0.00, 2, '2026-03-25 21:25:01.818257', '2025-12-10 00:00:00.000000', '', 'MF2025-01', 'admin', 'MF DOC CHARGES', 'C17', '', 'MF DOC CHARGES', 'MF DOC CHARGES', 'MF DOC CHARGES', 'REVENUES'),
(6, 150000.00, 0.00, 1, '2026-03-25 21:31:38.703827', '2025-12-10 00:00:00.000000', '', NULL, 'admin', 'PARTNER', 'P6', '', 'PARTNER', 'CAPITAL', 'CAPITAL', 'LIABILITIES'),
(7, 0.00, 50000.00, 1, '2026-03-28 20:36:36.628883', '2025-12-11 20:34:31.000000', '', 'MF2025-02', 'admin', NULL, 'C18', '', NULL, 'LOANS', 'MF LOAN', 'ASSETS'),
(8, 500.00, 0.00, 2, '2026-03-28 20:36:36.651349', '2025-12-11 20:34:31.000000', '', 'MF2025-02', 'admin', NULL, 'C18', '', NULL, 'DOCUMENT CHARGES', 'MF DOC CHARGES', 'REVENUES'),
(9, 0.00, 50000.00, 1, '2026-03-28 20:45:03.797897', '2025-12-13 20:43:15.000000', '', 'MF2025-03', 'admin', NULL, 'C19', '', NULL, 'LOANS', 'MF LOAN', 'ASSETS'),
(10, 500.00, 0.00, 2, '2026-03-28 20:45:03.815656', '2025-12-13 20:43:15.000000', '', 'MF2025-03', 'admin', NULL, 'C19', '', NULL, 'DOCUMENT CHARGES', 'MF DOC CHARGES', 'REVENUES'),
(13, 25000.00, 0.00, 1, '2026-03-28 20:48:13.095189', '2025-12-15 00:00:00.000000', 'CAPITAL', NULL, 'admin', NULL, 'P3', '', NULL, 'CAPITAL', 'CAPITAL', 'LIABILITIES'),
(14, 25000.00, 0.00, 1, '2026-03-28 20:48:49.075729', '2025-12-15 00:00:00.000000', 'CAPITAL', NULL, 'admin', NULL, 'P4', '', NULL, 'CAPITAL', 'CAPITAL', 'LIABILITIES'),
(15, 100000.00, 0.00, 1, '2026-03-28 20:50:02.926043', '2025-12-15 00:00:00.000000', 'CAPITAL', NULL, 'admin', NULL, 'C20', '', NULL, 'CAPITAL', 'CAPITAL', 'LIABILITIES'),
(16, 0.00, 200000.00, 1, '2026-03-28 20:51:44.348852', '2025-12-15 20:45:52.000000', '', 'MF2025-04', 'admin', NULL, 'C20', '', NULL, 'LOANS', 'MF LOAN', 'ASSETS'),
(17, 2000.00, 0.00, 2, '2026-03-28 20:51:44.364845', '2025-12-15 20:45:52.000000', '', 'MF2025-04', 'admin', NULL, 'C20', '', NULL, 'DOCUMENT CHARGES', 'MF DOC CHARGES', 'REVENUES'),
(18, 0.00, 150000.00, 1, '2026-03-30 18:46:26.891490', '2025-12-16 18:44:52.000000', '', 'MF2025-05', 'admin', NULL, 'C21', '', NULL, 'LOANS', 'MF LOAN', 'ASSETS'),
(19, 1500.00, 0.00, 2, '2026-03-30 18:46:26.910667', '2025-12-16 18:44:52.000000', '', 'MF2025-05', 'admin', NULL, 'C21', '', NULL, 'DOCUMENT CHARGES', 'MF DOC CHARGES', 'REVENUES'),
(20, 75000.00, 0.00, 1, '2026-03-30 18:47:30.444624', '2025-12-16 00:00:00.000000', 'CAPITAL', NULL, 'admin', NULL, 'C21', '', NULL, 'CAPITAL', 'CAPITAL', 'LIABILITIES'),
(21, 75000.00, 0.00, 1, '2026-03-30 18:51:27.882479', '2025-12-16 00:00:00.000000', 'CAPITAL', NULL, 'admin', NULL, 'P7', '', NULL, 'CAPITAL', 'CAPITAL', 'LIABILITIES'),
(22, 0.00, 100000.00, 1, '2026-03-30 18:54:46.008673', '2025-12-17 18:52:39.000000', '', 'MF2025-06', 'admin', NULL, 'C23', '', NULL, 'LOANS', 'MF LOAN', 'ASSETS'),
(23, 1000.00, 0.00, 2, '2026-03-30 18:54:46.018518', '2025-12-17 18:52:39.000000', '', 'MF2025-06', 'admin', NULL, 'C23', '', NULL, 'DOCUMENT CHARGES', 'MF DOC CHARGES', 'REVENUES'),
(24, 0.00, 25000.00, 1, '2026-03-30 18:58:07.303408', '2025-12-19 18:57:23.000000', '', 'MF2025-07', 'admin', NULL, 'C24', '', NULL, 'LOANS', 'MF LOAN', 'ASSETS'),
(25, 300.00, 0.00, 2, '2026-03-30 18:58:07.320889', '2025-12-19 18:57:23.000000', '', 'MF2025-07', 'admin', NULL, 'C24', '', NULL, 'DOCUMENT CHARGES', 'MF DOC CHARGES', 'REVENUES'),
(26, 0.00, 50000.00, 1, '2026-03-30 18:58:51.817315', '2025-12-19 18:58:11.000000', '', 'MF2025-08', 'admin', NULL, 'C25', '', NULL, 'LOANS', 'MF LOAN', 'ASSETS'),
(27, 500.00, 0.00, 2, '2026-03-30 18:58:51.829703', '2025-12-19 18:58:11.000000', '', 'MF2025-08', 'admin', NULL, 'C25', '', NULL, 'DOCUMENT CHARGES', 'MF DOC CHARGES', 'REVENUES'),
(28, 20000.00, 0.00, 1, '2026-03-30 18:59:52.555072', '2025-12-19 00:00:00.000000', 'CAPITAL', NULL, 'admin', NULL, 'P9', '', NULL, 'CAPITAL', 'CAPITAL', 'LIABILITIES'),
(29, 0.00, 50000.00, 1, '2026-03-30 19:01:56.297254', '2025-12-19 19:01:11.000000', '', 'MF2025-09', 'admin', NULL, 'C26', '', NULL, 'LOANS', 'MF LOAN', 'ASSETS'),
(30, 500.00, 0.00, 2, '2026-03-30 19:01:56.316752', '2025-12-19 19:01:11.000000', '', 'MF2025-09', 'admin', NULL, 'C26', '', NULL, 'DOCUMENT CHARGES', 'MF DOC CHARGES', 'REVENUES'),
(31, 49500.00, 0.00, 1, '2026-03-30 19:02:48.236681', '2025-12-19 00:00:00.000000', 'FOR HAND LOAN', NULL, 'admin', NULL, 'P5', '', NULL, 'HAND LOAN', 'HAND LOAN', 'LIABILITIES'),
(32, 6500.00, 0.00, 1, '2026-03-30 19:04:17.704903', '2025-12-19 00:00:00.000000', 'Other Payment', NULL, 'admin', NULL, 'C24', '', NULL, 'SAVINGS', 'CUSTOMER SAVINGS', 'LIABILITIES'),
(33, 20000.00, 0.00, 1, '2026-03-30 19:07:16.607890', '2025-12-29 00:00:00.000000', 'CAPITAL', NULL, 'admin', NULL, 'P9', '', NULL, 'CAPITAL', 'CAPITAL', 'LIABILITIES'),
(34, 100000.00, 0.00, 1, '2026-03-30 19:08:00.650055', '2025-12-29 00:00:00.000000', 'CAPITAL', NULL, 'admin', NULL, 'P10', '', NULL, 'CAPITAL', 'CAPITAL', 'LIABILITIES'),
(35, 1500.00, 0.00, 1, '2026-03-30 19:08:33.544038', '2025-12-29 00:00:00.000000', 'Other Payment', NULL, 'admin', NULL, 'C26', '', NULL, 'SAVINGS', 'CUSTOMER SAVINGS', 'LIABILITIES'),
(36, 0.00, 200000.00, 1, '2026-03-30 19:10:00.324592', '2025-12-30 19:09:07.000000', '', 'MF2025-10', 'admin', NULL, 'C27', '', NULL, 'LOANS', 'MF LOAN', 'ASSETS'),
(37, 2000.00, 0.00, 2, '2026-03-30 19:10:00.344512', '2025-12-30 19:09:07.000000', '', 'MF2025-10', 'admin', NULL, 'C27', '', NULL, 'DOCUMENT CHARGES', 'MF DOC CHARGES', 'REVENUES'),
(38, 20000.00, 0.00, 1, '2026-03-30 19:11:01.446294', '2025-12-30 00:00:00.000000', 'CAPITAL', NULL, 'admin', NULL, 'P9', '', NULL, 'CAPITAL', 'CAPITAL', 'LIABILITIES'),
(39, 54000.00, 0.00, 1, '2026-03-30 19:11:47.798885', '2025-12-30 00:00:00.000000', 'HAND LOAN', NULL, 'admin', NULL, 'P3', '', NULL, 'HAND LOAN', 'HAND LOAN', 'LIABILITIES'),
(40, 0.00, 20000.00, 1, '2026-04-02 15:59:19.070267', '2026-01-01 15:58:32.000000', '', 'MF2026-01', 'admin', NULL, 'C28', '', NULL, 'LOANS', 'MF LOAN', 'ASSETS'),
(41, 200.00, 0.00, 2, '2026-04-02 15:59:19.109245', '2026-01-01 15:58:32.000000', '', 'MF2026-01', 'admin', NULL, 'C28', '', NULL, 'DOCUMENT CHARGES', 'MF DOC CHARGES', 'REVENUES');

-- --------------------------------------------------------

--
-- Table structure for table `cash_book_backup`
--

CREATE TABLE `cash_book_backup` (
  `cash_book_backup_id` bigint NOT NULL,
  `credit` decimal(19,2) DEFAULT NULL,
  `current_installment_number` int DEFAULT NULL,
  `debit` decimal(19,2) DEFAULT NULL,
  `line_no` int DEFAULT NULL,
  `pending_balance` decimal(19,2) DEFAULT NULL,
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
(1, 1, 900.00, 0.00, 3000.00, 3900.00, '2026-01-10 21:23:19.000000', NULL, 'MF2025-01', 'PENDING'),
(2, 2, 900.00, 0.00, 3000.00, 3900.00, '2026-02-10 21:23:19.000000', NULL, 'MF2025-01', 'PENDING'),
(3, 3, 900.00, 0.00, 3000.00, 3900.00, '2026-03-10 21:23:19.000000', NULL, 'MF2025-01', 'PENDING'),
(4, 4, 900.00, 0.00, 3000.00, 3900.00, '2026-04-10 21:23:19.000000', NULL, 'MF2025-01', 'PENDING'),
(5, 5, 900.00, 0.00, 3000.00, 3900.00, '2026-05-10 21:23:19.000000', NULL, 'MF2025-01', 'PENDING'),
(6, 6, 900.00, 0.00, 3000.00, 3900.00, '2026-06-10 21:23:19.000000', NULL, 'MF2025-01', 'PENDING'),
(7, 7, 900.00, 0.00, 3000.00, 3900.00, '2026-07-10 21:23:19.000000', NULL, 'MF2025-01', 'PENDING'),
(8, 8, 900.00, 0.00, 3000.00, 3900.00, '2026-08-10 21:23:19.000000', NULL, 'MF2025-01', 'PENDING'),
(9, 9, 900.00, 0.00, 3000.00, 3900.00, '2026-09-10 21:23:19.000000', NULL, 'MF2025-01', 'PENDING'),
(10, 10, 900.00, 0.00, 3000.00, 3900.00, '2026-10-10 21:23:19.000000', NULL, 'MF2025-01', 'PENDING'),
(11, 1, 0.00, 0.00, 5000.00, 5000.00, '2026-01-11 20:34:31.000000', NULL, 'MF2025-02', 'PENDING'),
(12, 2, 0.00, 0.00, 5000.00, 5000.00, '2026-02-11 20:34:31.000000', NULL, 'MF2025-02', 'PENDING'),
(13, 3, 0.00, 0.00, 5000.00, 5000.00, '2026-03-11 20:34:31.000000', NULL, 'MF2025-02', 'PENDING'),
(14, 4, 0.00, 0.00, 5000.00, 5000.00, '2026-04-11 20:34:31.000000', NULL, 'MF2025-02', 'PENDING'),
(15, 5, 0.00, 0.00, 5000.00, 5000.00, '2026-05-11 20:34:31.000000', NULL, 'MF2025-02', 'PENDING'),
(16, 6, 0.00, 0.00, 5000.00, 5000.00, '2026-06-11 20:34:31.000000', NULL, 'MF2025-02', 'PENDING'),
(17, 7, 0.00, 0.00, 5000.00, 5000.00, '2026-07-11 20:34:31.000000', NULL, 'MF2025-02', 'PENDING'),
(18, 8, 0.00, 0.00, 5000.00, 5000.00, '2026-08-11 20:34:31.000000', NULL, 'MF2025-02', 'PENDING'),
(19, 9, 0.00, 0.00, 5000.00, 5000.00, '2026-09-11 20:34:31.000000', NULL, 'MF2025-02', 'PENDING'),
(20, 10, 0.00, 0.00, 5000.00, 5000.00, '2026-10-11 20:34:31.000000', NULL, 'MF2025-02', 'PENDING'),
(21, 1, 0.00, 0.00, 5000.00, 5000.00, '2026-01-13 20:43:15.000000', NULL, 'MF2025-03', 'PENDING'),
(22, 2, 0.00, 0.00, 5000.00, 5000.00, '2026-02-13 20:43:15.000000', NULL, 'MF2025-03', 'PENDING'),
(23, 3, 0.00, 0.00, 5000.00, 5000.00, '2026-03-13 20:43:15.000000', NULL, 'MF2025-03', 'PENDING'),
(24, 4, 0.00, 0.00, 5000.00, 5000.00, '2026-04-13 20:43:15.000000', NULL, 'MF2025-03', 'PENDING'),
(25, 5, 0.00, 0.00, 5000.00, 5000.00, '2026-05-13 20:43:15.000000', NULL, 'MF2025-03', 'PENDING'),
(26, 6, 0.00, 0.00, 5000.00, 5000.00, '2026-06-13 20:43:15.000000', NULL, 'MF2025-03', 'PENDING'),
(27, 7, 0.00, 0.00, 5000.00, 5000.00, '2026-07-13 20:43:15.000000', NULL, 'MF2025-03', 'PENDING'),
(28, 8, 0.00, 0.00, 5000.00, 5000.00, '2026-08-13 20:43:15.000000', NULL, 'MF2025-03', 'PENDING'),
(29, 9, 0.00, 0.00, 5000.00, 5000.00, '2026-09-13 20:43:15.000000', NULL, 'MF2025-03', 'PENDING'),
(30, 10, 0.00, 0.00, 5000.00, 5000.00, '2026-10-13 20:43:15.000000', NULL, 'MF2025-03', 'PENDING'),
(41, 1, 0.00, 0.00, 20000.00, 20000.00, '2026-01-15 20:45:52.000000', NULL, 'MF2025-04', 'PENDING'),
(42, 2, 0.00, 0.00, 20000.00, 20000.00, '2026-02-15 20:45:52.000000', NULL, 'MF2025-04', 'PENDING'),
(43, 3, 0.00, 0.00, 20000.00, 20000.00, '2026-03-15 20:45:52.000000', NULL, 'MF2025-04', 'PENDING'),
(44, 4, 0.00, 0.00, 20000.00, 20000.00, '2026-04-15 20:45:52.000000', NULL, 'MF2025-04', 'PENDING'),
(45, 5, 0.00, 0.00, 20000.00, 20000.00, '2026-05-15 20:45:52.000000', NULL, 'MF2025-04', 'PENDING'),
(46, 6, 0.00, 0.00, 20000.00, 20000.00, '2026-06-15 20:45:52.000000', NULL, 'MF2025-04', 'PENDING'),
(47, 7, 0.00, 0.00, 20000.00, 20000.00, '2026-07-15 20:45:52.000000', NULL, 'MF2025-04', 'PENDING'),
(48, 8, 0.00, 0.00, 20000.00, 20000.00, '2026-08-15 20:45:52.000000', NULL, 'MF2025-04', 'PENDING'),
(49, 9, 0.00, 0.00, 20000.00, 20000.00, '2026-09-15 20:45:52.000000', NULL, 'MF2025-04', 'PENDING'),
(50, 10, 0.00, 0.00, 20000.00, 20000.00, '2026-10-15 20:45:52.000000', NULL, 'MF2025-04', 'PENDING'),
(51, 1, 0.00, 0.00, 15000.00, 15000.00, '2026-01-16 18:44:52.000000', NULL, 'MF2025-05', 'PENDING'),
(52, 2, 0.00, 0.00, 15000.00, 15000.00, '2026-02-16 18:44:52.000000', NULL, 'MF2025-05', 'PENDING'),
(53, 3, 0.00, 0.00, 15000.00, 15000.00, '2026-03-16 18:44:52.000000', NULL, 'MF2025-05', 'PENDING'),
(54, 4, 0.00, 0.00, 15000.00, 15000.00, '2026-04-16 18:44:52.000000', NULL, 'MF2025-05', 'PENDING'),
(55, 5, 0.00, 0.00, 15000.00, 15000.00, '2026-05-16 18:44:52.000000', NULL, 'MF2025-05', 'PENDING'),
(56, 6, 0.00, 0.00, 15000.00, 15000.00, '2026-06-16 18:44:52.000000', NULL, 'MF2025-05', 'PENDING'),
(57, 7, 0.00, 0.00, 15000.00, 15000.00, '2026-07-16 18:44:52.000000', NULL, 'MF2025-05', 'PENDING'),
(58, 8, 0.00, 0.00, 15000.00, 15000.00, '2026-08-16 18:44:52.000000', NULL, 'MF2025-05', 'PENDING'),
(59, 9, 0.00, 0.00, 15000.00, 15000.00, '2026-09-16 18:44:52.000000', NULL, 'MF2025-05', 'PENDING'),
(60, 10, 0.00, 0.00, 15000.00, 15000.00, '2026-10-16 18:44:52.000000', NULL, 'MF2025-05', 'PENDING'),
(61, 1, 0.00, 0.00, 10000.00, 10000.00, '2026-01-17 18:52:39.000000', NULL, 'MF2025-06', 'PENDING'),
(62, 2, 0.00, 0.00, 10000.00, 10000.00, '2026-02-17 18:52:39.000000', NULL, 'MF2025-06', 'PENDING'),
(63, 3, 0.00, 0.00, 10000.00, 10000.00, '2026-03-17 18:52:39.000000', NULL, 'MF2025-06', 'PENDING'),
(64, 4, 0.00, 0.00, 10000.00, 10000.00, '2026-04-17 18:52:39.000000', NULL, 'MF2025-06', 'PENDING'),
(65, 5, 0.00, 0.00, 10000.00, 10000.00, '2026-05-17 18:52:39.000000', NULL, 'MF2025-06', 'PENDING'),
(66, 6, 0.00, 0.00, 10000.00, 10000.00, '2026-06-17 18:52:39.000000', NULL, 'MF2025-06', 'PENDING'),
(67, 7, 0.00, 0.00, 10000.00, 10000.00, '2026-07-17 18:52:39.000000', NULL, 'MF2025-06', 'PENDING'),
(68, 8, 0.00, 0.00, 10000.00, 10000.00, '2026-08-17 18:52:39.000000', NULL, 'MF2025-06', 'PENDING'),
(69, 9, 0.00, 0.00, 10000.00, 10000.00, '2026-09-17 18:52:39.000000', NULL, 'MF2025-06', 'PENDING'),
(70, 10, 0.00, 0.00, 10000.00, 10000.00, '2026-10-17 18:52:39.000000', NULL, 'MF2025-06', 'PENDING'),
(71, 1, 0.00, 0.00, 2500.00, 2500.00, '2026-01-19 18:57:23.000000', NULL, 'MF2025-07', 'PENDING'),
(72, 2, 0.00, 0.00, 2500.00, 2500.00, '2026-02-19 18:57:23.000000', NULL, 'MF2025-07', 'PENDING'),
(73, 3, 0.00, 0.00, 2500.00, 2500.00, '2026-03-19 18:57:23.000000', NULL, 'MF2025-07', 'PENDING'),
(74, 4, 0.00, 0.00, 2500.00, 2500.00, '2026-04-19 18:57:23.000000', NULL, 'MF2025-07', 'PENDING'),
(75, 5, 0.00, 0.00, 2500.00, 2500.00, '2026-05-19 18:57:23.000000', NULL, 'MF2025-07', 'PENDING'),
(76, 6, 0.00, 0.00, 2500.00, 2500.00, '2026-06-19 18:57:23.000000', NULL, 'MF2025-07', 'PENDING'),
(77, 7, 0.00, 0.00, 2500.00, 2500.00, '2026-07-19 18:57:23.000000', NULL, 'MF2025-07', 'PENDING'),
(78, 8, 0.00, 0.00, 2500.00, 2500.00, '2026-08-19 18:57:23.000000', NULL, 'MF2025-07', 'PENDING'),
(79, 9, 0.00, 0.00, 2500.00, 2500.00, '2026-09-19 18:57:23.000000', NULL, 'MF2025-07', 'PENDING'),
(80, 10, 0.00, 0.00, 2500.00, 2500.00, '2026-10-19 18:57:23.000000', NULL, 'MF2025-07', 'PENDING'),
(81, 1, 0.00, 0.00, 5000.00, 5000.00, '2026-01-19 18:58:11.000000', NULL, 'MF2025-08', 'PENDING'),
(82, 2, 0.00, 0.00, 5000.00, 5000.00, '2026-02-19 18:58:11.000000', NULL, 'MF2025-08', 'PENDING'),
(83, 3, 0.00, 0.00, 5000.00, 5000.00, '2026-03-19 18:58:11.000000', NULL, 'MF2025-08', 'PENDING'),
(84, 4, 0.00, 0.00, 5000.00, 5000.00, '2026-04-19 18:58:11.000000', NULL, 'MF2025-08', 'PENDING'),
(85, 5, 0.00, 0.00, 5000.00, 5000.00, '2026-05-19 18:58:11.000000', NULL, 'MF2025-08', 'PENDING'),
(86, 6, 0.00, 0.00, 5000.00, 5000.00, '2026-06-19 18:58:11.000000', NULL, 'MF2025-08', 'PENDING'),
(87, 7, 0.00, 0.00, 5000.00, 5000.00, '2026-07-19 18:58:11.000000', NULL, 'MF2025-08', 'PENDING'),
(88, 8, 0.00, 0.00, 5000.00, 5000.00, '2026-08-19 18:58:11.000000', NULL, 'MF2025-08', 'PENDING'),
(89, 9, 0.00, 0.00, 5000.00, 5000.00, '2026-09-19 18:58:11.000000', NULL, 'MF2025-08', 'PENDING'),
(90, 10, 0.00, 0.00, 5000.00, 5000.00, '2026-10-19 18:58:11.000000', NULL, 'MF2025-08', 'PENDING'),
(91, 1, 0.00, 0.00, 5000.00, 5000.00, '2026-01-19 19:01:11.000000', NULL, 'MF2025-09', 'PENDING'),
(92, 2, 0.00, 0.00, 5000.00, 5000.00, '2026-02-19 19:01:11.000000', NULL, 'MF2025-09', 'PENDING'),
(93, 3, 0.00, 0.00, 5000.00, 5000.00, '2026-03-19 19:01:11.000000', NULL, 'MF2025-09', 'PENDING'),
(94, 4, 0.00, 0.00, 5000.00, 5000.00, '2026-04-19 19:01:11.000000', NULL, 'MF2025-09', 'PENDING'),
(95, 5, 0.00, 0.00, 5000.00, 5000.00, '2026-05-19 19:01:11.000000', NULL, 'MF2025-09', 'PENDING'),
(96, 6, 0.00, 0.00, 5000.00, 5000.00, '2026-06-19 19:01:11.000000', NULL, 'MF2025-09', 'PENDING'),
(97, 7, 0.00, 0.00, 5000.00, 5000.00, '2026-07-19 19:01:11.000000', NULL, 'MF2025-09', 'PENDING'),
(98, 8, 0.00, 0.00, 5000.00, 5000.00, '2026-08-19 19:01:11.000000', NULL, 'MF2025-09', 'PENDING'),
(99, 9, 0.00, 0.00, 5000.00, 5000.00, '2026-09-19 19:01:11.000000', NULL, 'MF2025-09', 'PENDING'),
(100, 10, 0.00, 0.00, 5000.00, 5000.00, '2026-10-19 19:01:11.000000', NULL, 'MF2025-09', 'PENDING'),
(101, 1, 0.00, 0.00, 20000.00, 20000.00, '2026-01-30 19:09:07.000000', NULL, 'MF2025-10', 'PENDING'),
(102, 2, 0.00, 0.00, 20000.00, 20000.00, '2026-02-28 19:09:07.000000', NULL, 'MF2025-10', 'PENDING'),
(103, 3, 0.00, 0.00, 20000.00, 20000.00, '2026-03-30 19:09:07.000000', NULL, 'MF2025-10', 'PENDING'),
(104, 4, 0.00, 0.00, 20000.00, 20000.00, '2026-04-30 19:09:07.000000', NULL, 'MF2025-10', 'PENDING'),
(105, 5, 0.00, 0.00, 20000.00, 20000.00, '2026-05-30 19:09:07.000000', NULL, 'MF2025-10', 'PENDING'),
(106, 6, 0.00, 0.00, 20000.00, 20000.00, '2026-06-30 19:09:07.000000', NULL, 'MF2025-10', 'PENDING'),
(107, 7, 0.00, 0.00, 20000.00, 20000.00, '2026-07-30 19:09:07.000000', NULL, 'MF2025-10', 'PENDING'),
(108, 8, 0.00, 0.00, 20000.00, 20000.00, '2026-08-30 19:09:07.000000', NULL, 'MF2025-10', 'PENDING'),
(109, 9, 0.00, 0.00, 20000.00, 20000.00, '2026-09-30 19:09:07.000000', NULL, 'MF2025-10', 'PENDING'),
(110, 10, 0.00, 0.00, 20000.00, 20000.00, '2026-10-30 19:09:07.000000', NULL, 'MF2025-10', 'PENDING'),
(111, 1, 600.00, 0.00, 2000.00, 2600.00, '2026-02-01 15:58:32.000000', NULL, 'MF2026-01', 'PENDING'),
(112, 2, 600.00, 0.00, 2000.00, 2600.00, '2026-03-01 15:58:32.000000', NULL, 'MF2026-01', 'PENDING'),
(113, 3, 600.00, 0.00, 2000.00, 2600.00, '2026-04-01 15:58:32.000000', NULL, 'MF2026-01', 'PENDING'),
(114, 4, 600.00, 0.00, 2000.00, 2600.00, '2026-05-01 15:58:32.000000', NULL, 'MF2026-01', 'PENDING'),
(115, 5, 600.00, 0.00, 2000.00, 2600.00, '2026-06-01 15:58:32.000000', NULL, 'MF2026-01', 'PENDING'),
(116, 6, 600.00, 0.00, 2000.00, 2600.00, '2026-07-01 15:58:32.000000', NULL, 'MF2026-01', 'PENDING'),
(117, 7, 600.00, 0.00, 2000.00, 2600.00, '2026-08-01 15:58:32.000000', NULL, 'MF2026-01', 'PENDING'),
(118, 8, 600.00, 0.00, 2000.00, 2600.00, '2026-09-01 15:58:32.000000', NULL, 'MF2026-01', 'PENDING'),
(119, 9, 600.00, 0.00, 2000.00, 2600.00, '2026-10-01 15:58:32.000000', NULL, 'MF2026-01', 'PENDING'),
(120, 10, 600.00, 0.00, 2000.00, 2600.00, '2026-11-01 15:58:32.000000', NULL, 'MF2026-01', 'PENDING');

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
(14),
(15),
(16),
(17),
(18),
(19),
(20),
(21),
(22),
(23),
(24),
(25),
(26),
(27),
(28);

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
(3),
(4);

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
  `sequence` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `personal_info`
--

INSERT INTO `personal_info` (`personal_info_id`, `bussiness_exemption`, `disable`, `loan_limit`, `shares`, `address`, `address2`, `age`, `category`, `father_name`, `first_name`, `gender`, `id_proof`, `id_proof_type`, `intro_name`, `last_name`, `mobile`, `mobile2`, `occupation`, `old_id`, `phone`, `phone2`, `reference`, `spouse`, `created_date`, `created_user`, `modified_date`, `modified_user`, `sequence`) VALUES
('C14', b'0', b'1', 500000.00, 50.00, '123 MG Road, Kukatpalli, Hyderabad, Telangana, India', 'Apartment 5B, MG Residency, Hyderabad', '35', 'CUSTOMER', 'Ramesh Korata', 'Mahesh', 'Male', 'A123456789', 'Aadhar Card', 'Ramesh Babu', 'Korata', '+91-9876543210', '+91-9123456780', 'Software Engineer', 'OLDCUST123', '+91-40-12345678', '+91-40-87654321', 'Suresh Babu', 'Sita Korata', '2026-04-02 12:05:33.000000', 'admin', '2026-04-02 12:05:33.000000', 'admin', 14),
('C15', b'0', b'1', NULL, NULL, 'hyderabad ', '', '', 'CUSTOMER', 'rangaiah', 'jayaranjan', 'Male', '', '', NULL, 'rokkam', '9949018472', '', '', NULL, '', NULL, '', '', '2026-04-02 12:05:33.000000', 'admin', '2026-04-02 12:05:33.000000', 'admin', 15),
('C16', b'0', b'1', NULL, NULL, 'moosapet ', '', '', 'CUSTOMER', 'krishna ', 'mahesh', 'Male', '', '', NULL, 'janaki', '9949018472', '', '', NULL, '', NULL, '', '', '2026-04-02 12:05:33.000000', 'admin', '2026-04-02 12:05:33.000000', 'admin', 16),
('C17', b'0', b'0', NULL, NULL, 'HYDERABAD ', '', '', 'CUSTOMER', '', 'RAVI KUMAR.G', 'Male', '', '', NULL, '( R.SWAMY )', '9949018472', '', '', NULL, '', NULL, '', '', '2026-04-02 12:05:33.000000', 'admin', '2026-04-02 12:05:33.000000', 'admin', 17),
('C18', b'0', b'0', NULL, NULL, 'BANJARAHILLS\nHYDERABAD', '', '', 'CUSTOMER', 'SHAIK JAHANGIR', 'shaik yakqoob', 'Male', '', '', NULL, '( R.SWAMY )', '8919403101', '', '', NULL, '', NULL, '', '', '2026-04-02 12:05:33.000000', 'admin', '2026-04-02 12:05:33.000000', 'admin', 18),
('C19', b'0', b'0', NULL, NULL, 'ATTAPUR\nMAHADIPATNAM\nHYDERABAD ', '', '', 'CUSTOMER', 'SHAIK MADHAR', 'SHAIK YOUNUS ', 'Male', '', '', NULL, '( RAJU MILAP )', '9347320337', '', '', NULL, '', NULL, 'RAJU-MILAP', '', '2026-04-02 12:05:33.000000', 'admin', '2026-04-02 12:05:33.000000', 'admin', 19),
('C20', b'0', b'0', NULL, NULL, 'IZZAT NAGAR \nHITEC CITY\nHYDERABAD ', '', '', 'CUSTOMER', 'CHENNAIAH', 'RANGA SWMY', 'Male', '', '', NULL, 'ARRAM', '9985219800', '', '', NULL, '', NULL, '', '', '2026-04-02 12:05:33.000000', 'admin', '2026-04-02 12:05:33.000000', 'admin', 20),
('C21', b'0', b'0', NULL, NULL, 'RAHAMATH NAGAR ', '', '', 'CUSTOMER', 'VEERBADRA.B', 'SANGRAM', 'Male', '', '', NULL, 'BIRADARI', '9032661083', '', '', NULL, '', NULL, '', '', '2026-04-02 12:05:33.000000', 'admin', '2026-04-02 12:05:33.000000', 'admin', 21),
('C22', b'0', b'0', NULL, NULL, 'RAHAMATH NAGAR \nHYDERABAD ', '', '', 'CUSTOMER', 'VEERBADRA.B', 'SANGRAM', 'Male', '', '', NULL, 'BIRADARI', '9032661083', '9032661083', '', NULL, '', NULL, '', '', '2026-04-02 12:05:33.000000', 'admin', '2026-04-02 12:05:33.000000', 'admin', 22),
('C23', b'0', b'0', NULL, NULL, 'FLAT NO 103\n2ND FLOOR,ROYAL EXOTICA,\nNEW NALLAKUNTA', '', '', 'CUSTOMER', 'KRISHNA CHARY.S', 'HANUMANTH CHARY.S', 'Male', '', '', NULL, '( RAMU.B )', '9701237492', '', '', NULL, '', NULL, '', '', '2026-04-02 12:05:33.000000', 'admin', '2026-04-02 12:05:33.000000', 'admin', 23),
('C24', b'0', b'0', NULL, NULL, 'BORABANDA \nHYDERABAD ', '', '', 'CUSTOMER', 'VENKATAIAH.B', 'ALIVELAMMA.B', 'Male', '', '', NULL, '( R.SWAMY )', '9515225480', '', '', NULL, '', NULL, '', '', '2026-04-02 12:05:33.000000', 'admin', '2026-04-02 12:05:33.000000', 'admin', 24),
('C25', b'0', b'0', NULL, NULL, 'OLD BOWINPALLY\nHYDERABAD ', '', '', 'CUSTOMER', 'CHANDAN MALIK', 'ASHUMALIL', 'Male', '', '', NULL, '( R J R )', '630481029', '', '', NULL, '', NULL, '', '', '2026-04-02 12:05:33.000000', 'admin', '2026-04-02 12:05:33.000000', 'admin', 25),
('C26', b'0', b'0', NULL, NULL, 'HYDERABAD', '', '', 'CUSTOMER', 'ISHAQ.MD', 'NOUSHAD.MD', 'Male', '', '', NULL, '( RAJU-MILAP )', '7989837975', '', '', NULL, '', NULL, '', '', '2026-04-02 12:05:33.000000', 'admin', '2026-04-02 12:05:33.000000', 'admin', 26),
('C27', b'0', b'0', NULL, NULL, '1-192,MALLIKARJUN NAGAR, PARVATH NAGAR,FEROZGUDA \nHYDERABAD ', '', '', 'CUSTOMER', 'NANCHARAYA.K', 'NAGARAJU.K ', 'Male', '', '', NULL, '( RAJU.MILAP )', '9502199005', '', '', NULL, '', NULL, '', '', '2026-04-02 12:05:33.000000', 'admin', '2026-04-02 12:05:33.000000', 'admin', 27),
('C28', b'0', b'0', NULL, NULL, 'HYDERABAD ', '', '', 'CUSTOMER', 'RAJU.P', 'RAJU.P', 'Male', '', '', NULL, '( R.SWAMY )', '9949018472', '', '', NULL, '', NULL, '', '', '2026-04-02 12:05:33.000000', 'admin', '2026-04-02 12:05:33.000000', 'admin', 28),
('E4', b'0', b'0', NULL, NULL, '9949018472', '', '', 'EMPLOYEE', 'Rangaiah', 'jayaranjan', 'Male', '', '', NULL, 'rokkam', '9949018472', '', '', NULL, '', NULL, '', '', '2026-04-02 12:05:33.000000', 'admin', '2026-04-02 12:05:33.000000', 'admin', 4),
('P10', b'0', b'0', NULL, NULL, 'MADURA NAGAR \nHYDERABAD ', '', '', 'PARTNER', 'SUBBA RAO.A', 'SRINIVAS RAO', 'Male', '', '', NULL, 'A ( 01 )', '8639660067', '', '', NULL, '', NULL, '', '', '2026-04-02 12:05:33.000000', 'admin', '2026-04-02 12:05:33.000000', 'admin', 10),
('P3', b'0', b'0', NULL, NULL, '', '', '', 'PARTNER', 'RANGAIAH.R', 'JAYARANJAN', 'Male', '', '', NULL, 'ROKKAM', '9949018472', '', '', NULL, '', NULL, '', '', '2026-04-02 12:05:33.000000', 'admin', '2026-04-02 12:05:33.000000', 'admin', 3),
('P4', b'0', b'0', NULL, NULL, '', '', '', 'PARTNER', '', 'SURENDAR REDDY', 'Male', '', '', NULL, 'G', '9885308702', '', '', NULL, '', NULL, '', '', '2026-04-02 12:05:33.000000', 'admin', '2026-04-02 12:05:33.000000', 'admin', 4),
('P5', b'0', b'0', NULL, NULL, 'AMEERPET, HYDERABAD ', '', '', 'PARTNER', '', 'RAJU-MILAP', 'Male', '', '', NULL, '', '', '9494440447', '', NULL, '', NULL, '', '', '2026-04-02 12:05:33.000000', 'admin', '2026-04-02 12:05:33.000000', 'admin', 5),
('P6', b'0', b'0', NULL, NULL, '', '', '', 'PARTNER', '', 'MAHESH', 'Male', '', '', NULL, 'JANAKI', '9948519960', '', '', NULL, '', NULL, '', '', '2026-04-02 12:05:33.000000', 'admin', '2026-04-02 12:05:33.000000', 'admin', 6),
('P7', b'0', b'0', NULL, NULL, 'SRIRAM NAGAR \nHYDERABAD ', '', '', 'PARTNER', 'RAJU', 'RAJU', 'Male', '', '', NULL, 'NAMA', '9030065142', '', '', NULL, '', NULL, '', '', '2026-04-02 12:05:33.000000', 'admin', '2026-04-02 12:05:33.000000', 'admin', 7),
('P8', b'0', b'0', NULL, NULL, 'RAHAMATH NAGAR ', '', '', 'PARTNER', 'VEERBADRA.B', 'SANGRAM', 'Male', '', '', NULL, 'BIRADARI', '9032661083', '', '', NULL, '', NULL, '', '', '2026-04-02 12:05:33.000000', 'admin', '2026-04-02 12:05:33.000000', 'admin', 8),
('P9', b'0', b'0', NULL, NULL, 'BALKAMPET\nHYDERABAD ', '', '', 'PARTNER', 'VEERBADRA', 'RAMU', 'Male', '', '', NULL, 'BIRADARI', '9030904053', '', '', NULL, '', NULL, '', '', '2026-04-02 12:05:33.000000', 'admin', '2026-04-02 12:05:33.000000', 'admin', 9);

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
(2),
(3),
(4),
(5),
(6),
(7),
(8),
(9),
(10);

-- --------------------------------------------------------

--
-- Table structure for table `personal_vendor_sequence_table`
--

CREATE TABLE `personal_vendor_sequence_table` (
  `id` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
('CUSTOMER', 28),
('EMPLOYEE', 4),
('PARTNER', 9),
('VENDOR', 1);

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
(1, 'admin', '$2a$10$yi4GOwt5Vib09wCniObNZ.2RRuUJNwogAPlWpIF6n5pw.1rYKTOdu', 'ADMIN');

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
  MODIFY `cash_book_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `cash_book_backup`
--
ALTER TABLE `cash_book_backup`
  MODIFY `cash_book_backup_id` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `emi`
--
ALTER TABLE `emi`
  MODIFY `emi_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=121;

--
-- AUTO_INCREMENT for table `personal_customer_sequence_table`
--
ALTER TABLE `personal_customer_sequence_table`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `personal_employee_sequence_table`
--
ALTER TABLE `personal_employee_sequence_table`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `personal_partner_sequence_table`
--
ALTER TABLE `personal_partner_sequence_table`
  MODIFY `id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
