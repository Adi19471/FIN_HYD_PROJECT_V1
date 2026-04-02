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
-- Table structure for table `personal_info`
--

DROP TABLE IF EXISTS `personal_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
  `spouse` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`personal_info_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_info`
--

LOCK TABLES `personal_info` WRITE;
/*!40000 ALTER TABLE `personal_info` DISABLE KEYS */;
INSERT INTO `personal_info` VALUES (_binary '\0',_binary '',500000.00,50.00,'123 MG Road, Kukatpalli, Hyderabad, Telangana, India','Apartment 5B, MG Residency, Hyderabad','35','CUSTOMER','Ramesh Korata','Mahesh','Male','A123456789','Aadhar Card','Ramesh Babu','Korata','+91-9876543210','+91-9123456780','Software Engineer','OLDCUST123','C14','+91-40-12345678','+91-40-87654321','Suresh Babu','Sita Korata'),(_binary '\0',_binary '',NULL,NULL,'hyderabad ','','','CUSTOMER','rangaiah','jayaranjan','Male','','',NULL,'rokkam','9949018472','','',NULL,'C15','',NULL,'',''),(_binary '\0',_binary '',NULL,NULL,'moosapet ','','','CUSTOMER','krishna ','mahesh','Male','','',NULL,'janaki','9949018472','','',NULL,'C16','',NULL,'',''),(_binary '\0',_binary '\0',NULL,NULL,'HYDERABAD ','','','CUSTOMER','','RAVI KUMAR.G','Male','','',NULL,'( R.SWAMY )','9949018472','','',NULL,'C17','',NULL,'',''),(_binary '\0',_binary '\0',NULL,NULL,'BANJARAHILLS\nHYDERABAD','','','CUSTOMER','SHAIK JAHANGIR','shaik yakqoob','Male','','',NULL,'( R.SWAMY )','8919403101','','',NULL,'C18','',NULL,'',''),(_binary '\0',_binary '\0',NULL,NULL,'ATTAPUR\nMAHADIPATNAM\nHYDERABAD ','','','CUSTOMER','SHAIK MADHAR','SHAIK YOUNUS ','Male','','',NULL,'( RAJU MILAP )','9347320337','','',NULL,'C19','',NULL,'RAJU-MILAP',''),(_binary '\0',_binary '\0',NULL,NULL,'IZZAT NAGAR \nHITEC CITY\nHYDERABAD ','','','CUSTOMER','CHENNAIAH','RANGA SWMY','Male','','',NULL,'ARRAM','9985219800','','',NULL,'C20','',NULL,'',''),(_binary '\0',_binary '\0',NULL,NULL,'RAHAMATH NAGAR ','','','CUSTOMER','VEERBADRA.B','SANGRAM','Male','','',NULL,'BIRADARI','9032661083','','',NULL,'C21','',NULL,'',''),(_binary '\0',_binary '\0',NULL,NULL,'RAHAMATH NAGAR \nHYDERABAD ','','','CUSTOMER','VEERBADRA.B','SANGRAM','Male','','',NULL,'BIRADARI','9032661083','9032661083','',NULL,'C22','',NULL,'',''),(_binary '\0',_binary '\0',NULL,NULL,'FLAT NO 103\n2ND FLOOR,ROYAL EXOTICA,\nNEW NALLAKUNTA','','','CUSTOMER','KRISHNA CHARY.S','HANUMANTH CHARY.S','Male','','',NULL,'( RAMU.B )','9701237492','','',NULL,'C23','',NULL,'',''),(_binary '\0',_binary '\0',NULL,NULL,'BORABANDA \nHYDERABAD ','','','CUSTOMER','VENKATAIAH.B','ALIVELAMMA.B','Male','','',NULL,'( R.SWAMY )','9515225480','','',NULL,'C24','',NULL,'',''),(_binary '\0',_binary '\0',NULL,NULL,'OLD BOWINPALLY\nHYDERABAD ','','','CUSTOMER','CHANDAN MALIK','ASHUMALIL','Male','','',NULL,'( R J R )','630481029','','',NULL,'C25','',NULL,'',''),(_binary '\0',_binary '\0',NULL,NULL,'HYDERABAD','','','CUSTOMER','ISHAQ.MD','NOUSHAD.MD','Male','','',NULL,'( RAJU-MILAP )','7989837975','','',NULL,'C26','',NULL,'',''),(_binary '\0',_binary '\0',NULL,NULL,'1-192,MALLIKARJUN NAGAR, PARVATH NAGAR,FEROZGUDA \nHYDERABAD ','','','CUSTOMER','NANCHARAYA.K','NAGARAJU.K ','Male','','',NULL,'( RAJU.MILAP )','9502199005','','',NULL,'C27','',NULL,'',''),(_binary '\0',_binary '\0',NULL,NULL,'HYDERABAD ','','','CUSTOMER','RAJU.P','RAJU.P','Male','','',NULL,'( R.SWAMY )','9949018472','','',NULL,'C28','',NULL,'',''),(_binary '\0',_binary '\0',NULL,NULL,'9949018472','','','EMPLOYEE','Rangaiah','jayaranjan','Male','','',NULL,'rokkam','9949018472','','',NULL,'E4','',NULL,'',''),(_binary '\0',_binary '\0',NULL,NULL,'MADURA NAGAR \nHYDERABAD ','','','PARTNER','SUBBA RAO.A','SRINIVAS RAO','Male','','',NULL,'A ( 01 )','8639660067','','',NULL,'P10','',NULL,'',''),(_binary '\0',_binary '\0',NULL,NULL,'','','','PARTNER','RANGAIAH.R','JAYARANJAN','Male','','',NULL,'ROKKAM','9949018472','','',NULL,'P3','',NULL,'',''),(_binary '\0',_binary '\0',NULL,NULL,'','','','PARTNER','','SURENDAR REDDY','Male','','',NULL,'G','9885308702','','',NULL,'P4','',NULL,'',''),(_binary '\0',_binary '\0',NULL,NULL,'AMEERPET, HYDERABAD ','','','PARTNER','','RAJU-MILAP','Male','','',NULL,'','','9494440447','',NULL,'P5','',NULL,'',''),(_binary '\0',_binary '\0',NULL,NULL,'','','','PARTNER','','MAHESH','Male','','',NULL,'JANAKI','9948519960','','',NULL,'P6','',NULL,'',''),(_binary '\0',_binary '\0',NULL,NULL,'SRIRAM NAGAR \nHYDERABAD ','','','PARTNER','RAJU','RAJU','Male','','',NULL,'NAMA','9030065142','','',NULL,'P7','',NULL,'',''),(_binary '\0',_binary '\0',NULL,NULL,'RAHAMATH NAGAR ','','','PARTNER','VEERBADRA.B','SANGRAM','Male','','',NULL,'BIRADARI','9032661083','','',NULL,'P8','',NULL,'',''),(_binary '\0',_binary '\0',NULL,NULL,'BALKAMPET\nHYDERABAD ','','','PARTNER','VEERBADRA','RAMU','Male','','',NULL,'BIRADARI','9030904053','','',NULL,'P9','',NULL,'','');
/*!40000 ALTER TABLE `personal_info` ENABLE KEYS */;
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
