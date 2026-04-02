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
-- Table structure for table `business_member`
--

DROP TABLE IF EXISTS `business_member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
  `sys_date` datetime(6) DEFAULT NULL,
  `interest_rate` decimal(38,2) DEFAULT NULL,
  `loan_type` varchar(255) DEFAULT NULL,
  `processing_fee` decimal(38,2) DEFAULT NULL,
  PRIMARY KEY (`business_member_id`),
  KEY `FKldwvwbo4b9hqknyitecbnax2l` (`customer_id`),
  KEY `FK46qodb5py4co9xbfnlcfurwd7` (`guarantor1_id`),
  KEY `FKeim3w19msns7skr8v4iylupo` (`guarantor2_id`),
  KEY `FKcmapbuap9krutaxwrqdh2x911` (`guarantor23id`),
  KEY `FKofmeyctdwbgt3nc2j3b6r23p8` (`partner_id`),
  CONSTRAINT `FK46qodb5py4co9xbfnlcfurwd7` FOREIGN KEY (`guarantor1_id`) REFERENCES `personal_info` (`personal_info_id`),
  CONSTRAINT `FKcmapbuap9krutaxwrqdh2x911` FOREIGN KEY (`guarantor23id`) REFERENCES `personal_info` (`personal_info_id`),
  CONSTRAINT `FKeim3w19msns7skr8v4iylupo` FOREIGN KEY (`guarantor2_id`) REFERENCES `personal_info` (`personal_info_id`),
  CONSTRAINT `FKldwvwbo4b9hqknyitecbnax2l` FOREIGN KEY (`customer_id`) REFERENCES `personal_info` (`personal_info_id`),
  CONSTRAINT `FKofmeyctdwbgt3nc2j3b6r23p8` FOREIGN KEY (`partner_id`) REFERENCES `personal_info` (`personal_info_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_member`
--

LOCK TABLES `business_member` WRITE;
/*!40000 ALTER TABLE `business_member` DISABLE KEYS */;
INSERT INTO `business_member` VALUES (20000.00,_binary '\0',10,2600.00,6000.00,0,0,0,_binary '\0',0.00,'2026-11-01 15:58:32.000000','2026-01-01 15:58:32.000000',NULL,'MF-2026-00','C28','C20',NULL,NULL,'ACTIVE','C20','','2026-04-02 15:59:18.960330',3.00,'MONTHLY_FINANCE',200.00),(30000.00,_binary '\0',10,3900.00,9000.00,0,0,0,_binary '\0',0.00,'2026-10-10 21:23:19.000000','2025-12-10 21:23:19.000000',NULL,'MF2025-01','C17','P3',NULL,NULL,'ACTIVE',NULL,'','2026-03-25 21:25:01.787009',3.00,'MONTHLY_FINANCE',300.00),(50000.00,_binary '\0',10,0.00,0.00,0,0,0,_binary '\0',0.00,'2026-10-11 20:34:31.000000','2025-12-11 20:34:31.000000',NULL,'MF2025-02','C18','C17',NULL,NULL,'ACTIVE',NULL,'','2026-03-28 20:36:36.594786',0.00,'MONTHLY_FINANCE',500.00),(50000.00,_binary '\0',10,0.00,0.00,0,0,0,_binary '\0',0.00,'2026-10-13 20:43:15.000000','2025-12-13 20:43:15.000000',NULL,'MF2025-03','C19','P5',NULL,NULL,'ACTIVE',NULL,'','2026-03-28 20:45:03.761917',0.00,'MONTHLY_FINANCE',500.00),(200000.00,_binary '\0',10,0.00,0.00,0,0,0,_binary '\0',0.00,'2026-10-15 20:45:52.000000','2025-12-15 20:45:52.000000',NULL,'MF2025-04','C20','C20',NULL,NULL,'ACTIVE',NULL,'','2026-03-28 20:51:44.327864',0.00,'MONTHLY_FINANCE',20000.00),(150000.00,_binary '\0',10,0.00,0.00,0,0,0,_binary '\0',0.00,'2026-10-16 18:44:52.000000','2025-12-16 18:44:52.000000',NULL,'MF2025-05','C21','C21',NULL,NULL,'ACTIVE',NULL,'','2026-03-30 18:46:26.860239',0.00,'MONTHLY_FINANCE',1500.00),(100000.00,_binary '\0',10,0.00,0.00,0,0,0,_binary '\0',0.00,'2026-10-17 18:52:39.000000','2025-12-17 18:52:39.000000',NULL,'MF2025-06','C23','C23',NULL,NULL,'ACTIVE',NULL,'','2026-03-30 18:54:45.988502',0.00,'MONTHLY_FINANCE',1000.00),(25000.00,_binary '\0',10,0.00,0.00,0,0,0,_binary '\0',0.00,'2026-10-19 18:57:23.000000','2025-12-19 18:57:23.000000',NULL,'MF2025-07','C24','C20',NULL,NULL,'ACTIVE',NULL,'','2026-03-30 18:58:07.285125',0.00,'MONTHLY_FINANCE',300.00),(50000.00,_binary '\0',10,0.00,0.00,0,0,0,_binary '\0',0.00,'2026-10-19 18:58:11.000000','2025-12-19 18:58:11.000000',NULL,'MF2025-08','C25','P3',NULL,NULL,'ACTIVE',NULL,'','2026-03-30 18:58:51.797560',0.00,'MONTHLY_FINANCE',500.00),(50000.00,_binary '\0',10,0.00,0.00,0,0,0,_binary '\0',0.00,'2026-10-19 19:01:11.000000','2025-12-19 19:01:11.000000',NULL,'MF2025-09','C26','P5',NULL,NULL,'ACTIVE',NULL,'','2026-03-30 19:01:56.286812',0.00,'MONTHLY_FINANCE',500.00),(200000.00,_binary '\0',10,0.00,0.00,0,0,0,_binary '\0',0.00,'2026-10-30 19:09:07.000000','2025-12-30 19:09:07.000000',NULL,'MF2025-10','C27','P5',NULL,NULL,'ACTIVE',NULL,'','2026-03-30 19:10:00.314486',0.00,'MONTHLY_FINANCE',2000.00);
/*!40000 ALTER TABLE `business_member` ENABLE KEYS */;
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
