-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: finance_db
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cash_book_backup`
--

DROP TABLE IF EXISTS `cash_book_backup`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cash_book_backup` (
  `credit` decimal(19,2) DEFAULT NULL,
  `current_installment_number` int DEFAULT NULL,
  `debit` decimal(19,2) DEFAULT NULL,
  `line_no` int DEFAULT NULL,
  `pending_balance` decimal(19,2) DEFAULT NULL,
  `cash_book_backup_id` bigint NOT NULL AUTO_INCREMENT,
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
  `personal_info_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`cash_book_backup_id`),
  KEY `FKotqvyk31yc971mc2r3syr8k0h` (`business_member_id`),
  KEY `FKmxaiv4o5vjcac0jxss7a10cpf` (`personal_info_id`),
  CONSTRAINT `FKmxaiv4o5vjcac0jxss7a10cpf` FOREIGN KEY (`personal_info_id`) REFERENCES `personal_info` (`personal_info_id`),
  CONSTRAINT `FKotqvyk31yc971mc2r3syr8k0h` FOREIGN KEY (`business_member_id`) REFERENCES `business_member` (`business_member_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cash_book_backup`
--

LOCK TABLES `cash_book_backup` WRITE;
/*!40000 ALTER TABLE `cash_book_backup` DISABLE KEYS */;
/*!40000 ALTER TABLE `cash_book_backup` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-02 16:04:24
