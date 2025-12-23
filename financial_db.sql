-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 18, 2025 at 01:09 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `financial_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `accountmaster`
--

CREATE TABLE `accountmaster` (
  `Type` varchar(255) DEFAULT NULL,
  `MasterCode` varchar(255) DEFAULT NULL,
  `Code` varchar(255) DEFAULT NULL,
  `Visibility` tinyint(1) DEFAULT NULL,
  `MasterIcon` varchar(255) DEFAULT NULL,
  `PersonType` varchar(255) DEFAULT NULL,
  `TransType` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accountmaster`
--

INSERT INTO `accountmaster` (`Type`, `MasterCode`, `Code`, `Visibility`, `MasterIcon`, `PersonType`, `TransType`) VALUES
('LOAN', 'MC001', 'C001', 1, 'loan.png', 'CUSTOMER', 'DEBIT'),
('SAVING', 'MC002', 'C002', 1, 'save.png', 'CUSTOMER', 'CREDIT');

-- --------------------------------------------------------

--
-- Table structure for table `assignedroles`
--

CREATE TABLE `assignedroles` (
  `USERNAME` varchar(255) DEFAULT NULL,
  `ROLEID` int(11) DEFAULT NULL,
  `SYSDATE` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `assignedroles`
--

INSERT INTO `assignedroles` (`USERNAME`, `ROLEID`, `SYSDATE`) VALUES
('admin', 1, '2025-11-19 14:40:00'),
('manager', 2, '2025-11-19 14:40:00');

-- --------------------------------------------------------

--
-- Table structure for table `businessmembers`
--

CREATE TABLE `businessmembers` (
  `ID` varchar(255) NOT NULL,
  `CUSTOMERID` varchar(255) DEFAULT NULL,
  `GUARANTOR1` varchar(255) DEFAULT NULL,
  `GUARANTOR2` varchar(255) DEFAULT NULL,
  `GUARANTOR3` varchar(255) DEFAULT NULL,
  `PARTNERID` varchar(255) DEFAULT NULL,
  `STARTDATE` datetime DEFAULT NULL,
  `ENDDATE` datetime DEFAULT NULL,
  `AMOUNT` double DEFAULT NULL,
  `DURATION` double DEFAULT NULL,
  `INTEREST` double DEFAULT NULL,
  `INSTALLMENT` double DEFAULT NULL,
  `SECURITY` varchar(255) DEFAULT NULL,
  `STATUS` bit(1) DEFAULT NULL,
  `PAIDINSTALLMENTS` int(11) DEFAULT NULL,
  `PARTPRINCIPAL` int(11) DEFAULT NULL,
  `PARTINTEREST` int(11) DEFAULT NULL,
  `UNPAIDLATEFEE` int(11) DEFAULT NULL,
  `CHEQUEREMINDER` bit(1) DEFAULT NULL,
  `BUSINESSID` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `businessmembers`
--

INSERT INTO `businessmembers` (`ID`, `CUSTOMERID`, `GUARANTOR1`, `GUARANTOR2`, `GUARANTOR3`, `PARTNERID`, `STARTDATE`, `ENDDATE`, `AMOUNT`, `DURATION`, `INTEREST`, `INSTALLMENT`, `SECURITY`, `STATUS`, `PAIDINSTALLMENTS`, `PARTPRINCIPAL`, `PARTINTEREST`, `UNPAIDLATEFEE`, `CHEQUEREMINDER`, `BUSINESSID`) VALUES
('DF2025-22', 'C11', 'C12', 'C12', 'C1', NULL, '2025-12-18 14:37:28', '2026-03-28 14:37:28', 100000, 100, 5, NULL, 'yes', b'0', 0, NULL, NULL, 0, b'0', NULL),
('DF2025-23', 'C1', 'C10', 'C2', 'C11', 'C12', '2025-12-18 14:48:19', '2026-03-28 14:48:19', 100000, 100, 3, 1030, 'yes', b'0', 1, NULL, NULL, 0, b'0', NULL),
('DF2025-24', 'C1', NULL, NULL, NULL, NULL, '2025-12-18 15:13:33', '2026-03-28 15:13:33', 10000, 100, 3, 103, 'u', b'0', 0, NULL, NULL, 0, b'0', NULL),
('DF2025-25', 'C1', 'C12', NULL, NULL, NULL, '2025-12-18 15:41:35', '2026-03-28 15:41:35', 100000, 100, 3, NULL, '', b'0', 0, NULL, NULL, 0, b'0', NULL),
('DF2025-26', 'C1', 'C12', NULL, NULL, NULL, '2025-12-18 15:43:13', '2026-03-28 15:43:13', 10000, 100, 3, NULL, '', b'0', 0, NULL, NULL, 0, b'0', NULL),
('MF2025-11', 'C1', 'C11', 'C2', NULL, NULL, '2025-12-17 18:32:14', '2026-10-17 18:32:14', 100000, 10, NULL, 13000, '', b'0', 7, NULL, NULL, 0, b'0', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `businessmembersbackup`
--

CREATE TABLE `businessmembersbackup` (
  `OBJECTID` int(11) NOT NULL,
  `ID` varchar(255) DEFAULT NULL,
  `CUSTOMERID` varchar(255) DEFAULT NULL,
  `BUSINESSID` varchar(255) DEFAULT NULL,
  `STARTDATE` datetime DEFAULT NULL,
  `ENDDATE` datetime DEFAULT NULL,
  `AMOUNT` double DEFAULT NULL,
  `DURATION` double DEFAULT NULL,
  `INTEREST` double DEFAULT NULL,
  `PARTNERID` varchar(255) DEFAULT NULL,
  `INSTALLMENT` double DEFAULT NULL,
  `SECURITY` varchar(255) DEFAULT NULL,
  `GUARANTOR1` varchar(255) DEFAULT NULL,
  `GUARANTOR2` varchar(255) DEFAULT NULL,
  `GUARANTOR3` varchar(255) DEFAULT NULL,
  `STATUS` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `businessmembersbackup`
--

INSERT INTO `businessmembersbackup` (`OBJECTID`, `ID`, `CUSTOMERID`, `BUSINESSID`, `STARTDATE`, `ENDDATE`, `AMOUNT`, `DURATION`, `INTEREST`, `PARTNERID`, `INSTALLMENT`, `SECURITY`, `GUARANTOR1`, `GUARANTOR2`, `GUARANTOR3`, `STATUS`) VALUES
(1, 'BM001', 'C001', 'B001', '2025-01-01 00:00:00', '2025-12-31 00:00:00', 50000, 12, 12, 'P001', 4500, 'House', 'G001', 'G002', 'G003', 1);

-- --------------------------------------------------------

--
-- Table structure for table `businessmembersbk`
--

CREATE TABLE `businessmembersbk` (
  `ID` varchar(255) DEFAULT NULL,
  `CUSTOMERID` varchar(255) DEFAULT NULL,
  `BUSINESSID` varchar(255) DEFAULT NULL,
  `STARTDATE` datetime DEFAULT NULL,
  `ENDDATE` datetime DEFAULT NULL,
  `AMOUNT` double DEFAULT NULL,
  `DURATION` double DEFAULT NULL,
  `INTEREST` double DEFAULT NULL,
  `PARTNERID` varchar(255) DEFAULT NULL,
  `INSTALLMENT` double DEFAULT NULL,
  `SECURITY` varchar(255) DEFAULT NULL,
  `GUARANTOR1` varchar(255) DEFAULT NULL,
  `GUARANTOR2` varchar(255) DEFAULT NULL,
  `GUARANTOR3` varchar(255) DEFAULT NULL,
  `STATUS` tinyint(1) DEFAULT NULL,
  `PAIDINSTALLMENTS` int(11) DEFAULT NULL,
  `PARTPRINCIPAL` int(11) DEFAULT NULL,
  `PARTINTEREST` int(11) DEFAULT NULL,
  `ADVANCEMODE` varchar(255) DEFAULT NULL,
  `UNPAIDLATEFEE` int(11) DEFAULT NULL,
  `UPDATEDDATE` datetime DEFAULT NULL,
  `UPDATEDBY` varchar(255) DEFAULT NULL,
  `USERCOMMENTS` varchar(255) DEFAULT NULL,
  `SYSTEMCOMMENTS` varchar(255) DEFAULT NULL,
  `CHEQUEREMINDER` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `businessmembersbk`
--

INSERT INTO `businessmembersbk` (`ID`, `CUSTOMERID`, `BUSINESSID`, `STARTDATE`, `ENDDATE`, `AMOUNT`, `DURATION`, `INTEREST`, `PARTNERID`, `INSTALLMENT`, `SECURITY`, `GUARANTOR1`, `GUARANTOR2`, `GUARANTOR3`, `STATUS`, `PAIDINSTALLMENTS`, `PARTPRINCIPAL`, `PARTINTEREST`, `ADVANCEMODE`, `UNPAIDLATEFEE`, `UPDATEDDATE`, `UPDATEDBY`, `USERCOMMENTS`, `SYSTEMCOMMENTS`, `CHEQUEREMINDER`) VALUES
('BM001', 'C001', 'B001', '2025-01-01 00:00:00', '2025-12-31 00:00:00', 50000, 12, 12, 'P001', 4500, 'House', 'G001', 'G002', 'G003', 1, 5, 20000, 1500, 'AUTO', 0, '2025-11-19 14:40:33', 'admin', 'Updated payment', 'System OK', 1);

-- --------------------------------------------------------

--
-- Table structure for table `businessmembersjn`
--

CREATE TABLE `businessmembersjn` (
  `ID` int(11) NOT NULL,
  `ACCOUNTNO` varchar(255) DEFAULT NULL,
  `FILE` longblob DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `businessmembersjn`
--

INSERT INTO `businessmembersjn` (`ID`, `ACCOUNTNO`, `FILE`) VALUES
(1, 'AC001', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `business_member_daily_finance_sequence`
--

CREATE TABLE `business_member_daily_finance_sequence` (
  `id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `business_member_daily_finance_sequence`
--

INSERT INTO `business_member_daily_finance_sequence` (`id`) VALUES
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
(26);

-- --------------------------------------------------------

--
-- Table structure for table `business_member_monthly_finance_sequence`
--

CREATE TABLE `business_member_monthly_finance_sequence` (
  `id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `business_member_monthly_finance_sequence`
--

INSERT INTO `business_member_monthly_finance_sequence` (`id`) VALUES
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
(11);

-- --------------------------------------------------------

--
-- Table structure for table `cashbook`
--

CREATE TABLE `cashbook` (
  `ID` double NOT NULL,
  `LINENO` double DEFAULT NULL,
  `TRANSDate` datetime DEFAULT NULL,
  `SYSDATE` datetime DEFAULT NULL,
  `ACCOUNTNO` varchar(255) DEFAULT NULL,
  `TRANSTYPE` varchar(255) DEFAULT NULL,
  `CUSTOMERID` varchar(255) DEFAULT NULL,
  `PARTICULARS` varchar(255) DEFAULT NULL,
  `CREDIT` double DEFAULT NULL,
  `DEBIT` double DEFAULT NULL,
  `USER` varchar(255) DEFAULT NULL,
  `RECEIPTREMARKS` varchar(255) DEFAULT NULL,
  `BMREMARKS` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cashbook`
--

INSERT INTO `cashbook` (`ID`, `LINENO`, `TRANSDate`, `SYSDATE`, `ACCOUNTNO`, `TRANSTYPE`, `CUSTOMERID`, `PARTICULARS`, `CREDIT`, `DEBIT`, `USER`, `RECEIPTREMARKS`, `BMREMARKS`) VALUES
(24, 1, '2025-12-17 18:32:53', '2025-12-17 18:32:53', 'MF2025-11', 'MF LOAN', NULL, 'MF LOAN', 0, 100000, 'Mahesh', '', ''),
(25, 2, '2025-12-17 18:32:53', '2025-12-17 18:32:53', 'MF2025-11', 'MF DOC CHARGES', NULL, 'MF DOC CHARGES', 200, 0, 'Mahesh', '', ''),
(27, 1, '2025-12-17 18:57:13', '2025-12-17 18:57:21', 'MF2025-11', 'MF LOAN', NULL, 'MF LOAN INSTALLMENT', 10000, 0, 'Mahesh', '', ''),
(28, 2, '2025-12-17 18:57:13', '2025-12-17 18:57:21', 'MF2025-11', 'MF INTEREST', NULL, 'MF INTEREST', 3000, 0, 'Mahesh', '', ''),
(29, 1, '2025-12-17 19:01:33', '2025-12-17 19:02:16', 'MF2025-11', 'MF LOAN', NULL, 'MF LOAN INSTALLMENT', 10000, 0, 'Mahesh', '', ''),
(30, 2, '2025-12-17 19:01:33', '2025-12-17 19:02:16', 'MF2025-11', 'MF INTEREST', NULL, 'MF INTEREST', 3000, 0, 'Mahesh', '', ''),
(31, 1, '2025-12-17 19:02:16', '2025-12-17 19:03:19', 'MF2025-11', 'MF LOAN', NULL, 'MF LOAN INSTALLMENT', 10000, 0, 'Mahesh', '', ''),
(32, 2, '2025-12-17 19:02:16', '2025-12-17 19:03:19', 'MF2025-11', 'MF INTEREST', NULL, 'MF INTEREST', 3000, 0, 'Mahesh', '', ''),
(33, 1, '2025-12-17 19:09:28', '2025-12-17 19:09:51', 'MF2025-11', 'MF LOAN', NULL, 'MF LOAN INSTALLMENT', 4000, 0, 'Mahesh', '', ''),
(34, 3, '2025-12-17 19:09:28', '2025-12-17 19:09:51', 'MF2025-11', 'MF LATE FEE', NULL, 'MF LATE FEE', 100, 0, 'Mahesh', '', ''),
(35, 1, '2025-12-18 13:12:50', '2025-12-18 13:13:09', 'MF2025-11', 'MF LOAN', NULL, 'MF LOAN INSTALLMENT', 19000, 0, 'Mahesh', '', ''),
(36, 2, '2025-12-18 13:12:50', '2025-12-18 13:13:09', 'MF2025-11', 'MF INTEREST', NULL, 'MF INTEREST', 3000, 0, 'Mahesh', '', ''),
(37, 3, '2025-12-18 13:13:09', '2025-12-18 13:14:09', 'MF2025-11', 'MF LATE FEE', NULL, 'MF LATE FEE', 100000, 0, 'Mahesh', '', ''),
(38, 1, '2025-12-18 13:14:10', '2025-12-18 13:14:17', 'MF2025-11', 'MF LOAN', NULL, 'MF LOAN INSTALLMENT', 23000, 0, 'Mahesh', '', ''),
(39, 2, '2025-12-18 13:14:10', '2025-12-18 13:14:17', 'MF2025-11', 'MF INTEREST', NULL, 'MF INTEREST', 3000, 0, 'Mahesh', '', ''),
(40, 3, '2025-12-18 13:14:10', '2025-12-18 13:14:17', 'MF2025-11', 'MF LATE FEE', NULL, 'MF LATE FEE', 1000, 0, 'Mahesh', '', ''),
(41, 1, '2025-12-18 14:38:20', '2025-12-18 14:38:20', 'DF2025-22', 'DF LOAN', NULL, 'DF LOAN', 0, 100000, 'Mahesh', '', ''),
(42, 2, '2025-12-18 14:38:20', '2025-12-18 14:38:20', 'DF2025-22', 'DF DOC CHARGES', NULL, 'DF DOC CHARGES', 500, 0, 'Mahesh', '', ''),
(43, 3, '2025-12-18 14:38:20', '2025-12-18 14:38:20', 'DF2025-22', 'DF INTEREST', NULL, 'DF INTEREST', 5000, 0, 'Mahesh', '', ''),
(44, 1, '2025-12-18 14:57:03', '2025-12-18 14:57:03', 'DF2025-23', 'DF LOAN', NULL, 'DF LOAN', 0, 100000, 'Mahesh', '', ''),
(45, 2, '2025-12-18 14:57:03', '2025-12-18 14:57:03', 'DF2025-23', 'DF DOC CHARGES', NULL, 'DF DOC CHARGES', 1000, 0, 'Mahesh', '', ''),
(46, 3, '2025-12-18 14:57:03', '2025-12-18 14:57:03', 'DF2025-23', 'DF INTEREST', NULL, 'DF INTEREST', 3000, 0, 'Mahesh', '', ''),
(47, 1, '2025-12-18 15:13:50', '2025-12-18 15:13:50', 'DF2025-24', 'DF LOAN', NULL, 'DF LOAN', 0, 10000, 'Mahesh', '', ''),
(48, 2, '2025-12-18 15:13:50', '2025-12-18 15:13:50', 'DF2025-24', 'DF DOC CHARGES', NULL, 'DF DOC CHARGES', 520, 0, 'Mahesh', '', ''),
(49, 3, '2025-12-18 15:13:50', '2025-12-18 15:13:50', 'DF2025-24', 'DF INTEREST', NULL, 'DF INTEREST', 300, 0, 'Mahesh', '', ''),
(50, 1, '2025-12-18 15:41:55', '2025-12-18 15:41:55', 'DF2025-25', 'DF LOAN', NULL, 'DF LOAN', 0, 100000, 'Mahesh', '', ''),
(51, 2, '2025-12-18 15:41:55', '2025-12-18 15:41:55', 'DF2025-25', 'DF DOC CHARGES', NULL, 'DF DOC CHARGES', 200, 0, 'Mahesh', '', ''),
(52, 3, '2025-12-18 15:41:55', '2025-12-18 15:41:55', 'DF2025-25', 'DF INTEREST', NULL, 'DF INTEREST', 3000, 0, 'Mahesh', '', ''),
(53, 1, '2025-12-18 15:43:40', '2025-12-18 15:43:40', 'DF2025-26', 'DF LOAN', NULL, 'DF LOAN', 0, 10000, 'Mahesh', '', ''),
(54, 3, '2025-12-18 15:43:40', '2025-12-18 15:43:40', 'DF2025-26', 'DF INTEREST', NULL, 'DF INTEREST', 300, 0, 'Mahesh', '', ''),
(55, 1, '2025-12-18 16:00:05', '2025-12-18 16:00:48', 'DF2025-23', 'DF LOAN', NULL, 'DF LOAN INSTALLMENT', 1000000, 0, 'Mahesh', '', ''),
(56, 2, '2025-12-18 16:00:05', '2025-12-18 16:00:48', 'DF2025-23', 'DF LATE FEE', NULL, 'DF LATE FEE', 1000, 0, 'Mahesh', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `cashbookbackup`
--

CREATE TABLE `cashbookbackup` (
  `BACKUPID` int(11) NOT NULL,
  `ID` double DEFAULT NULL,
  `LineNo` double DEFAULT NULL,
  `TRANSDate` datetime DEFAULT NULL,
  `SYSDATE` datetime DEFAULT NULL,
  `ACCOUNTNO` varchar(255) DEFAULT NULL,
  `TRANSTYPE` varchar(255) DEFAULT NULL,
  `CUSTOMERID` varchar(255) DEFAULT NULL,
  `PARTICULARS` varchar(255) DEFAULT NULL,
  `CREDIT` double DEFAULT NULL,
  `DEBIT` double DEFAULT NULL,
  `USER` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cashbookbackup`
--

INSERT INTO `cashbookbackup` (`BACKUPID`, `ID`, `LineNo`, `TRANSDate`, `SYSDATE`, `ACCOUNTNO`, `TRANSTYPE`, `CUSTOMERID`, `PARTICULARS`, `CREDIT`, `DEBIT`, `USER`) VALUES
(1, 1, 1, '2025-11-19 14:41:03', '2025-11-19 14:41:03', 'AC001', 'CREDIT', 'C001', 'Backup record', 1000, 0, 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `cashbookbk`
--

CREATE TABLE `cashbookbk` (
  `ID` double DEFAULT NULL,
  `LineNo` double DEFAULT NULL,
  `TRANSDate` datetime DEFAULT NULL,
  `SYSDATE` datetime DEFAULT NULL,
  `ACCOUNTNO` varchar(255) DEFAULT NULL,
  `TRANSTYPE` varchar(255) DEFAULT NULL,
  `CUSTOMERID` varchar(255) DEFAULT NULL,
  `PARTICULARS` varchar(255) DEFAULT NULL,
  `CREDIT` double DEFAULT NULL,
  `DEBIT` double DEFAULT NULL,
  `USER` varchar(255) DEFAULT NULL,
  `RECEIPTREMARKS` varchar(255) DEFAULT NULL,
  `BMREMARKS` varchar(255) DEFAULT NULL,
  `DELETEDDATE` datetime DEFAULT NULL,
  `DELETEDBY` varchar(255) DEFAULT NULL,
  `COMMENTS` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cashbookbk`
--

INSERT INTO `cashbookbk` (`ID`, `LineNo`, `TRANSDate`, `SYSDATE`, `ACCOUNTNO`, `TRANSTYPE`, `CUSTOMERID`, `PARTICULARS`, `CREDIT`, `DEBIT`, `USER`, `RECEIPTREMARKS`, `BMREMARKS`, `DELETEDDATE`, `DELETEDBY`, `COMMENTS`) VALUES
(1, 1, '2025-11-19 14:41:21', '2025-11-19 14:41:21', 'AC001', 'DEBIT', 'C001', 'Deleted entry', 0, 1000, 'admin', 'None', 'None', '2025-11-19 14:41:21', 'admin', 'Wrong entry');

-- --------------------------------------------------------

--
-- Table structure for table `configs`
--

CREATE TABLE `configs` (
  `ID` int(11) NOT NULL,
  `Category` varchar(255) DEFAULT NULL,
  `Data` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `configs`
--

INSERT INTO `configs` (`ID`, `Category`, `Data`) VALUES
(1, 'SYSTEM', 'ACTIVE'),
(2, 'INTEREST_RATE', '12%');

-- --------------------------------------------------------

--
-- Table structure for table `dbbackup`
--

CREATE TABLE `dbbackup` (
  `ID` int(11) NOT NULL,
  `CreatedDate` datetime DEFAULT NULL,
  `Status` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dbbackup`
--

INSERT INTO `dbbackup` (`ID`, `CreatedDate`, `Status`) VALUES
(1, '2025-11-19 14:41:40', 'SUCCESS');

-- --------------------------------------------------------

--
-- Table structure for table `loancommitments`
--

CREATE TABLE `loancommitments` (
  `ID` int(11) NOT NULL,
  `ACCOUNTNO` varchar(255) DEFAULT NULL,
  `CDATE` datetime DEFAULT NULL,
  `COMMENTS` varchar(255) DEFAULT NULL,
  `CALLDATE` datetime DEFAULT NULL,
  `AMOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `loancommitments`
--

INSERT INTO `loancommitments` (`ID`, `ACCOUNTNO`, `CDATE`, `COMMENTS`, `CALLDATE`, `AMOUNT`) VALUES
(1, 'AC001', '2025-11-19 14:41:50', 'Commitment entry', '2025-11-19 14:41:50', 25000);

-- --------------------------------------------------------

--
-- Table structure for table `loantypes`
--

CREATE TABLE `loantypes` (
  `ID` varchar(255) DEFAULT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `Visibility` tinyint(1) DEFAULT NULL,
  `ImagePath` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `loantypes`
--

INSERT INTO `loantypes` (`ID`, `Description`, `Visibility`, `ImagePath`) VALUES
('LT01', 'Business Loan', 1, 'loan.png'),
('LT02', 'Personal Loan', 1, 'personal.png');

-- --------------------------------------------------------

--
-- Table structure for table `log`
--

CREATE TABLE `log` (
  `ID` int(11) NOT NULL,
  `UserName` varchar(255) DEFAULT NULL,
  `LoginDate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `log`
--

INSERT INTO `log` (`ID`, `UserName`, `LoginDate`) VALUES
(1, 'admin', '2025-11-19 14:42:21');

-- --------------------------------------------------------

--
-- Table structure for table `personalinfo`
--

CREATE TABLE `personalinfo` (
  `ID` varchar(255) NOT NULL,
  `FIRSTNAME` varchar(255) DEFAULT NULL,
  `LASTNAME` varchar(255) DEFAULT NULL,
  `GENDER` varchar(255) DEFAULT NULL,
  `FATHERNAME` varchar(255) DEFAULT NULL,
  `ADDRESS` varchar(255) DEFAULT NULL,
  `MOBILE` varchar(255) DEFAULT NULL,
  `PHONE` varchar(255) DEFAULT NULL,
  `CATEGORY` varchar(255) DEFAULT NULL,
  `REFERENCE` varchar(255) DEFAULT NULL,
  `IDPROOF` varchar(255) DEFAULT NULL,
  `DISABLE` tinyint(1) DEFAULT 0,
  `SHARES` double DEFAULT NULL,
  `LOANLIMIT` double DEFAULT NULL,
  `ADDRESS2` varchar(255) DEFAULT NULL,
  `MOBILE2` varchar(255) DEFAULT NULL,
  `PHONE2` varchar(255) DEFAULT NULL,
  `OLDID` varchar(255) DEFAULT NULL,
  `AGE` varchar(255) DEFAULT NULL,
  `OCCUPATION` varchar(255) DEFAULT NULL,
  `SPOUSE` varchar(255) DEFAULT NULL,
  `BUSSINESSEXEMPTION` tinyint(1) DEFAULT 0,
  `INTRONAME` varchar(255) DEFAULT NULL,
  `IDPROOFTYPE` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `personalinfo`
--

INSERT INTO `personalinfo` (`ID`, `FIRSTNAME`, `LASTNAME`, `GENDER`, `FATHERNAME`, `ADDRESS`, `MOBILE`, `PHONE`, `CATEGORY`, `REFERENCE`, `IDPROOF`, `DISABLE`, `SHARES`, `LOANLIMIT`, `ADDRESS2`, `MOBILE2`, `PHONE2`, `OLDID`, `AGE`, `OCCUPATION`, `SPOUSE`, `BUSSINESSEXEMPTION`, `INTRONAME`, `IDPROOFTYPE`) VALUES
('C1', 'ADI', 'REDDY', 'Male', 'PULLAREDDY', 'Tadipatri Hyderabd ', '9398895448', '9398895448', 'CUSTOMER', 'f', 'f', 0, NULL, NULL, 'f', '8341553216', '8341553216', NULL, '28', 'ff', 'No', 0, NULL, NULL),
('C10', 'rtrt', 't', 'Male', 'rt', '4545454544', '4545454544', '4545454544', 'CUSTOMER', '4545454544', '4545454544', 0, NULL, NULL, '4545454544', '4545454544', NULL, NULL, '44', '4545454544', 'rt', 0, NULL, 'Voter ID'),
('C11', 'Jyothi', 'Jyothi', 'Female', 'Jyothi', 'Jyothi', '7799885566', '452', 'CUSTOMER', '563210', '7852', 0, NULL, NULL, 'lop', '7799885566', NULL, NULL, '23', 'Jyothi', 'Jyothi', 0, NULL, 'PAN Card'),
('C12', 'jaya', 'rokkam', 'Male', 'rang', 'hyd', '9949', '99490', 'CUSTOMER', 'hyd', '123456987\\', 0, NULL, NULL, 'hyd', '99490', NULL, NULL, '48', 'bus', 'jaya', 0, NULL, 'Voter ID'),
('C18', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL),
('C2', 'Mahfghjk', 'gbnm', 'Male', 'bnm', 'bnm', '7894561230', '2020', 'CUSTOMER', 'jk', 'hn45', 0, NULL, NULL, '412', '7894561230', NULL, NULL, '52', 'hjk', 'bnm', 0, NULL, NULL),
('C20', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL),
('C21', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL),
('C22', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL),
('C23', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL),
('C24', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL),
('C25', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL),
('C26', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL),
('C27', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL),
('C28', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL),
('C3', 'sdfghj', 'sdfghj864sdfghjkl;kjhbvcxbnm,.', 'Male', 'sdfg', 'sdf', '3456345673', '34567', 'CUSTOMER', 'sdfgh', 'sdf', 1, NULL, NULL, 'sdfg', '3456345673', NULL, NULL, '4545', 'sdfg', 'sdfgh', 0, NULL, NULL),
('C30', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL),
('C38', 'Arun', 'Reddy', 'Male', 'Kullayapa', 'Hydeerabad', '7799252514', '6320', 'CUSTOMER', 'KIran', '4585632510', 1, NULL, NULL, 'Panjagutta', '7799252514', NULL, NULL, '30', 'Software', 'Rani', 0, NULL, NULL),
('C39', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL),
('C4', 'sdfgh', 'fhgj', 'Male', 'dfhg', 'rt', '1234567890', '1234567890', 'CUSTOMER', 't', 't', 0, NULL, NULL, 'rt', '1234567890', NULL, NULL, '56', 'dfg', 'dfgh', 0, NULL, NULL),
('C41', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL),
('C5', 'Mahesh', 'Mahesh', 'Male', 'Mahesh', 'Hyderbad  Nampally area \n', '9876543210', '250', 'CUSTOMER', '145200', '562314520', 0, NULL, NULL, 'Hyderbad  Nampally area \n', '9876543210', NULL, NULL, '46', 'Developer', 'Mahesh', 0, NULL, NULL),
('C6', 'aaaaaaaaa', 'aaaaaaaaa', 'Male', 'aaaaaaaaa', 'aaaaaaaaa', '2345634432', '2345634432', 'CUSTOMER', 'aaaaaaaaa', '2345', 0, NULL, NULL, 'aaaaaaaaa', '2345634432', NULL, NULL, '33', 'aaaaaaaaa', 'aaaaaaaaa', 0, NULL, NULL),
('C7', 'sdfg', 'sdfg', 'Male', 'sdf', '3456', '3461034610', '34533', 'CUSTOMER', '364', '345', 1, NULL, NULL, '345', '3461034610', NULL, NULL, '45', 'dsf', 'sdf', 0, NULL, NULL),
('C8', 'Lakshmi', 'Mahesh', 'Male', 'd', 'xcsdvfbv', '', '9876543210', 'CUSTOMER', 'cdvfb', 'cdvfc', 0, NULL, NULL, 'cdvfbgn', '', NULL, NULL, '22', 'Male', 'd', 0, NULL, ''),
('C9', 'sd', 'df', 'Male', 'df', '4545454544', '4545454544', '4545454544', 'CUSTOMER', '4545454544', '4545454544', 0, NULL, NULL, '4545454544', '4545454544', NULL, NULL, '454', 'er', 'df', 0, NULL, 'PAN Card'),
('E1', 'REDDY', 'erer', 'Male', 'er', '7799252521', '7799252521', '7799252521', 'EMPLOYEE', '7799252521', 'epos', 0, NULL, NULL, '7799252521', '7799252521', NULL, NULL, '44', 'dev', 'er', 0, NULL, 'PAN Card'),
('E2', 'Naveen', 'Naveen.B', 'Male', 'rajesh', 'dfgh', '7896541230', '5', 'EMPLOYEE', '34', '7896521', 0, NULL, NULL, '', '7896541230', NULL, NULL, '63', 'wef', 'opos', 0, NULL, 'PAN Card'),
('E3', 'pradsd', 'pradsd', 'Male', 'pradsdq', '520', '7744112223', '3', 'EMPLOYEE', '543', '896521', 0, NULL, NULL, 'hjkl', '7744112223', NULL, NULL, '44', 's', 'e', 0, NULL, 'Voter ID'),
('E31', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL),
('E32', 'UPDENDRA', 'UPDENDRA', 'Male', 'UPDEN', 'HYD', '7799525221', '443', 'EMPLOYEE', 'ADI', 'ADHAR', 1, NULL, NULL, 'HYD', '7799525221', NULL, NULL, '29', 'resr', 'UPDENDRA', 0, NULL, NULL),
('E40', 'Mahesh', 'Mahi', 'Male', 'Raj', 'Delhi', '9398895448', '5210', 'EMPLOYEE', 'lokesh', '63524100', 1, NULL, NULL, 'Hyderbad', '9398895448', NULL, NULL, '35', 'Former', 'Kalyani', 0, NULL, NULL),
('P1', 'paert', 'paert', 'Male', 'paert', 'dfd', '1452145220', '1452145220', 'PARTNER', 'df', 'dsd', 0, NULL, NULL, 'dd', '1452145220', NULL, NULL, '455', 'ere', 'paert', 0, NULL, 'PAN Card'),
('P2', 'sdsd', 'sd', 'Male', 'sd', '7410852085', '7410852085', '7410852085', 'PARTNER', '7410852085', '7410852085', 0, NULL, NULL, '7410852085', '7410852085', NULL, NULL, '343', 'sdd', 'sd', 0, NULL, 'PAN Card'),
('P33', 'NARSHIMHA', 'NARSHIMHA', 'Male', 'NARSHIMHA', 'NARSHIMHA', '7799552211', '7799552211', 'PARTNER', 'NARSHIMHA', 'Mahesh', 0, NULL, NULL, 'NARSHIMHA', '7799552211', NULL, NULL, '34', 'Lakshmi', 'NARSHIMHA', 0, NULL, NULL),
('P36', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL),
('V1', 'dsada', 'sda', 'Male', 'asdas', '7410852085', '7410852085', '7410852085', 'VENDOR', '7410852085', '7410852085', 0, NULL, NULL, '7410852085', '7410852085', NULL, NULL, '43', 'sd', 'asd', 0, NULL, 'PAN Card'),
('V35', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL),
('V37', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `personalinfobackup`
--

CREATE TABLE `personalinfobackup` (
  `OBJECTID` int(11) NOT NULL,
  `ID` varchar(255) DEFAULT NULL,
  `FIRSTNAME` varchar(255) DEFAULT NULL,
  `LASTNAME` varchar(255) DEFAULT NULL,
  `INTRONAME` varchar(255) DEFAULT NULL,
  `GENDER` varchar(255) DEFAULT NULL,
  `FATHERNAME` varchar(255) DEFAULT NULL,
  `ADDRESS` varchar(255) DEFAULT NULL,
  `MOBILE` varchar(255) DEFAULT NULL,
  `PHONE` varchar(255) DEFAULT NULL,
  `CATEGORY` varchar(255) DEFAULT NULL,
  `REFERENCE` varchar(255) DEFAULT NULL,
  `IMAGE` longblob DEFAULT NULL,
  `IDPROOF` varchar(255) DEFAULT NULL,
  `CreatedDate` datetime DEFAULT NULL,
  `DISABLE` tinyint(1) DEFAULT NULL,
  `SHARES` double DEFAULT NULL,
  `LOANLIMIT` double DEFAULT NULL,
  `ADDRESS2` varchar(255) DEFAULT NULL,
  `MOBILE2` varchar(255) DEFAULT NULL,
  `PHONE2` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `personalinfobackup`
--

INSERT INTO `personalinfobackup` (`OBJECTID`, `ID`, `FIRSTNAME`, `LASTNAME`, `INTRONAME`, `GENDER`, `FATHERNAME`, `ADDRESS`, `MOBILE`, `PHONE`, `CATEGORY`, `REFERENCE`, `IMAGE`, `IDPROOF`, `CreatedDate`, `DISABLE`, `SHARES`, `LOANLIMIT`, `ADDRESS2`, `MOBILE2`, `PHONE2`) VALUES
(1, 'C001', 'John', 'Doe', 'Intro', 'M', 'Father Doe', 'City A', '1234567890', '0987654321', 'REGULAR', 'Ref1', NULL, 'ID123', '2025-11-19 14:42:41', 0, 10, 50000, 'Street 2', '12340000', '88880000');

-- --------------------------------------------------------

--
-- Table structure for table `personalinfojn`
--

CREATE TABLE `personalinfojn` (
  `CUSTOMERID` varchar(255) DEFAULT NULL,
  `IMAGE` longblob DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `personalinfojn`
--

INSERT INTO `personalinfojn` (`CUSTOMERID`, `IMAGE`) VALUES
('C001', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `personal_customer_sequence_table`
--

CREATE TABLE `personal_customer_sequence_table` (
  `id` bigint(20) NOT NULL
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
(12);

-- --------------------------------------------------------

--
-- Table structure for table `personal_employee_sequence_table`
--

CREATE TABLE `personal_employee_sequence_table` (
  `id` bigint(20) NOT NULL
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
-- Table structure for table `personal_partner_sequence_table`
--

CREATE TABLE `personal_partner_sequence_table` (
  `id` bigint(20) NOT NULL
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
  `id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `personal_vendor_sequence_table`
--

INSERT INTO `personal_vendor_sequence_table` (`id`) VALUES
(1);

-- --------------------------------------------------------

--
-- Table structure for table `reminderslist`
--

CREATE TABLE `reminderslist` (
  `ID` int(11) NOT NULL,
  `DUEDATE` datetime DEFAULT NULL,
  `ACCOUNTNO` varchar(255) DEFAULT NULL,
  `NAME` varchar(255) DEFAULT NULL,
  `MOBILE` varchar(255) DEFAULT NULL,
  `STATUS` varchar(255) DEFAULT NULL,
  `AMOUNT` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reminderslist`
--

INSERT INTO `reminderslist` (`ID`, `DUEDATE`, `ACCOUNTNO`, `NAME`, `MOBILE`, `STATUS`, `AMOUNT`) VALUES
(1, '2025-11-19 14:43:08', 'AC001', 'John Doe', '1234567890', 'PENDING', 1500);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `ID` int(11) NOT NULL,
  `MENU` varchar(255) DEFAULT NULL,
  `SUBMENU` varchar(255) DEFAULT NULL,
  `CELL` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`ID`, `MENU`, `SUBMENU`, `CELL`) VALUES
(1, 'Dashboard', 'Main', 'Cell1'),
(2, 'Loans', 'Create', 'Cell2');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `Name` varchar(255) DEFAULT NULL,
  `Password` varchar(255) DEFAULT NULL,
  `Role` varchar(255) DEFAULT NULL,
  `id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`Name`, `Password`, `Role`, `id`) VALUES
('Mahesh', '$2a$10$US9cuyOEzq4FP9KCLiKYluQGUrer0shPV2alurfDnLmnqGdf.rIJe', NULL, 2);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `businessmembers`
--
ALTER TABLE `businessmembers`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `fk_customer` (`CUSTOMERID`),
  ADD KEY `fk_g1` (`GUARANTOR1`),
  ADD KEY `fk_g2` (`GUARANTOR2`),
  ADD KEY `fk_g3` (`GUARANTOR3`),
  ADD KEY `fk_partner` (`PARTNERID`);

--
-- Indexes for table `businessmembersbackup`
--
ALTER TABLE `businessmembersbackup`
  ADD PRIMARY KEY (`OBJECTID`);

--
-- Indexes for table `businessmembersjn`
--
ALTER TABLE `businessmembersjn`
  ADD PRIMARY KEY (`ID`);

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
-- Indexes for table `cashbook`
--
ALTER TABLE `cashbook`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `cashbookbackup`
--
ALTER TABLE `cashbookbackup`
  ADD PRIMARY KEY (`BACKUPID`);

--
-- Indexes for table `configs`
--
ALTER TABLE `configs`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `dbbackup`
--
ALTER TABLE `dbbackup`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `loancommitments`
--
ALTER TABLE `loancommitments`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `log`
--
ALTER TABLE `log`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `personalinfo`
--
ALTER TABLE `personalinfo`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `personalinfobackup`
--
ALTER TABLE `personalinfobackup`
  ADD PRIMARY KEY (`OBJECTID`);

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
-- Indexes for table `reminderslist`
--
ALTER TABLE `reminderslist`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `businessmembersbackup`
--
ALTER TABLE `businessmembersbackup`
  MODIFY `OBJECTID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `businessmembersjn`
--
ALTER TABLE `businessmembersjn`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `business_member_daily_finance_sequence`
--
ALTER TABLE `business_member_daily_finance_sequence`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `business_member_monthly_finance_sequence`
--
ALTER TABLE `business_member_monthly_finance_sequence`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `cashbook`
--
ALTER TABLE `cashbook`
  MODIFY `ID` double NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `cashbookbackup`
--
ALTER TABLE `cashbookbackup`
  MODIFY `BACKUPID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `configs`
--
ALTER TABLE `configs`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `dbbackup`
--
ALTER TABLE `dbbackup`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `loancommitments`
--
ALTER TABLE `loancommitments`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `log`
--
ALTER TABLE `log`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `personalinfobackup`
--
ALTER TABLE `personalinfobackup`
  MODIFY `OBJECTID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `personal_customer_sequence_table`
--
ALTER TABLE `personal_customer_sequence_table`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `personal_employee_sequence_table`
--
ALTER TABLE `personal_employee_sequence_table`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `personal_partner_sequence_table`
--
ALTER TABLE `personal_partner_sequence_table`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `personal_vendor_sequence_table`
--
ALTER TABLE `personal_vendor_sequence_table`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `reminderslist`
--
ALTER TABLE `reminderslist`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `businessmembers`
--
ALTER TABLE `businessmembers`
  ADD CONSTRAINT `fk_customer` FOREIGN KEY (`CUSTOMERID`) REFERENCES `personalinfo` (`ID`),
  ADD CONSTRAINT `fk_g1` FOREIGN KEY (`GUARANTOR1`) REFERENCES `personalinfo` (`ID`),
  ADD CONSTRAINT `fk_g2` FOREIGN KEY (`GUARANTOR2`) REFERENCES `personalinfo` (`ID`),
  ADD CONSTRAINT `fk_g3` FOREIGN KEY (`GUARANTOR3`) REFERENCES `personalinfo` (`ID`),
  ADD CONSTRAINT `fk_partner` FOREIGN KEY (`PARTNERID`) REFERENCES `personalinfo` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
