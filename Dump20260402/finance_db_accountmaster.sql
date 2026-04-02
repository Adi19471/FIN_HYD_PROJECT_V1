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
-- Table structure for table `accountmaster`
--

DROP TABLE IF EXISTS `accountmaster`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accountmaster` (
  `visibility` bit(1) DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code` varchar(255) DEFAULT NULL,
  `master_code` varchar(255) DEFAULT NULL,
  `master_icon` varchar(255) DEFAULT NULL,
  `person_type` varchar(255) DEFAULT NULL,
  `trans_type` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accountmaster`
--

LOCK TABLES `accountmaster` WRITE;
/*!40000 ALTER TABLE `accountmaster` DISABLE KEYS */;
INSERT INTO `accountmaster` VALUES (_binary '',1,'ANNIVARSARY EXPENCES','OFFICE EXPENSES','/images/expenses-3.png','Employee,Vendor,Customer,Partner','Debit','EXPENSES'),(_binary '',2,'BANK CHARGES','OFFICE EXPENSES','/images/expenses-3.png','Employee,Vendor,Customer,Partner','Debit','EXPENSES'),(_binary '',3,'BONUS','SALARIES','/images/salary.png','Employee,Vendor,Customer,Partner','Debit','EXPENSES'),(_binary '',4,'CABLE TV BILL','OFFICE EXPENSES','/images/expenses-3.png','Employee,Vendor,Customer,Partner','Debit','EXPENSES'),(_binary '',5,'CAPITAL','CAPITAL','/images/capital.png','Employee,Vendor,Customer,Partner','Debit,Credit','LIABILITIES'),(_binary '',6,'CAPITAL EXCESS','CAPITAL','/images/capital.png','Employee,Vendor,Customer,Partner','Debit,Credit','LIABILITIES'),(_binary '',7,'CAPITAL LATE INT','CAPITAL','/images/capital.png','Employee,Vendor,Customer,Partner','Credit','REVENUES'),(_binary '',8,'CHITS INSTALLMENTS','CHITS','/images/advance.png','Employee,Vendor,Customer,Partner','Debit,Credit','ASSETS'),(_binary '',9,'COMPANY SAVINGS','SAVINGS','/images/savings.png','Employee,Vendor,Customer,Partner','Debit,Credit','LIABILITIES'),(_binary '',10,'CUSTOMER SAVINGS','SAVINGS','/images/savings.png','Employee,Vendor,Customer,Partner','Debit,Credit','LIABILITIES'),(_binary '',11,'DONATION','OFFICE EXPENSES','/images/expenses-3.png','Employee,Vendor,Customer,Partner','Debit','EXPENSES'),(_binary '',12,'ELECTRICITY BILL','OFFICE EXPENSES','/images/expenses-3.png','Employee,Vendor,Customer,Partner','Debit','EXPENSES'),(_binary '',13,'EMPLOYEES','SALARIES','/images/salary.png','Employee,Vendor,Customer,Partner','Debit','EXPENSES'),(_binary '',14,'EXTRA INCOME','EXTRA INCOME','/images/income.png','Employee,Vendor,Customer,Partner','Credit','REVENUES'),(_binary '',15,'FUEL','OFFICE EXPENSES','/images/expenses-3.png','Employee,Vendor,Customer,Partner','Debit','EXPENSES'),(_binary '',16,'HAND LOAN','HAND LOAN','/images/savings.png','Employee,Vendor,Customer,Partner','Debit,Credit','LIABILITIES'),(_binary '',17,'HDFC','BANK ACCOUNTS','/images/advance.png','Employee,Vendor,Customer,Partner','Debit,Credit','ASSETS'),(_binary '',18,'INTEREST PAID','INTEREST','/images/payments.png','Employee,Vendor,Customer,Partner','Debit,Credit','REVENUES'),(_binary '',19,'INTREST','C.D.INTREST','/images/savings.png','Employee,Vendor,Customer,Partner','Debit','EXPENSES'),(_binary '',20,'MD MEETING FEE','MEETING FEE','/images/expenses-3.png','Employee,Vendor,Customer,Partner','Debit','EXPENSES'),(_binary '',21,'MD SALARY','SALARIES','/images/salary.png','Employee,Vendor,Customer,Partner','Debit','EXPENSES'),(_binary '',22,'MEETING FEE','OFFICE EXPENSES','/images/expenses-3.png','Employee,Vendor,Customer,Partner','Debit','EXPENSES'),(_binary '',23,'NEWS PAPER BILL','OFFICE EXPENSES','/images/expenses-3.png','Employee,Vendor,Customer,Partner','Debit','EXPENSES'),(_binary '',24,'OFFICE MAINTAINANCE','OFFICE EXPENSES','/images/expenses-3.png','Employee,Vendor,Customer,Partner','Debit','EXPENSES'),(_binary '',25,'OFFICE RENT','OFFICE EXPENSES','/images/expenses-3.png','Employee,Vendor,Customer,Partner','Debit','EXPENSES'),(_binary '',26,'OTHERS','OFFICE EXPENSES','/images/expenses-3.png','Employee,Vendor,Customer,Partner','Debit','EXPENSES'),(_binary '',27,'PARTNER','SHERE AMOUNT','/images/furniture.png','Employee,Vendor,Customer,Partner','Debit','EXPENSES'),(_binary '',28,'PARTNER MEETING FEE','MEETING FEE','/images/expenses-3.png','Employee,Vendor,Customer,Partner','Debit','EXPENSES'),(_binary '',29,'PARTNERS','SALARIES','/images/salary.png','Employee,Vendor,Customer,Partner','Debit','EXPENSES'),(_binary '',30,'PARTNERS DIVIDENDS','DIVIDENDS','/images/savings.png','Employee,Vendor,Customer,Partner','Debit,Credit','EXPENSES'),(_binary '',31,'POOJA','OFFICE EXPENSES','/images/expenses-3.png','Employee,Vendor,Customer,Partner','Debit','EXPENSES'),(_binary '',32,'PRINTING & STATIONERY','OFFICE EXPENSES','/images/expenses-3.png','Employee,Vendor,Customer,Partner','Debit','EXPENSES'),(_binary '',33,'PROFESSIONAL CHARGES','OFFICE EXPENSES','/images/expenses-3.png','Employee,Vendor,Customer,Partner','Debit','EXPENSES'),(_binary '',34,'RENT ADVANCE','ADVANCES','/images/advance.png','Employee,Vendor,Customer,Partner','Debit,Credit','ASSETS'),(_binary '',35,'SALARY','SALARIES','/images/salary.png','Employee,Vendor,Customer,Partner','Debit','EXPENSES'),(_binary '',36,'SALARY ADVANCE','ADVANCES','/images/advance.png','Employee,Vendor,Customer,Partner','Debit,Credit','ASSETS'),(_binary '',37,'SHERE','SHERE AMOUNT','/images/furniture.png','Employee,Vendor,Customer,Partner','Debit','EXPENSES'),(_binary '',38,'STAMPS','OFFICE EXPENSES','/images/expenses-3.png','Employee,Vendor,Customer,Partner','Debit','EXPENSES'),(_binary '',39,'TEA','OFFICE EXPENSES','/images/expenses-3.png','Employee,Vendor,Customer,Partner','Debit','EXPENSES'),(_binary '',40,'TELEPHONE BILL','OFFICE EXPENSES','/images/expenses-3.png','Employee,Vendor,Customer,Partner','Debit','EXPENSES'),(_binary '',41,'TOUR EXPENDITURE','OFFICE EXPENSES','/images/expenses-3.png','Employee,Vendor,Customer,Partner','Debit','EXPENSES'),(_binary '',42,'VEHICLE','ASSETS','/images/loans.png','Employee,Vendor,Customer,Partner','Debit,Credit','ASSETS'),(_binary '',43,'VEHICLE MAINTAINANCE','VEHICLE MAINTAINANCE','/images/savings.png','Employee,Vendor,Customer,Partner','Debit','EXPENSES'),(_binary '',44,'WATER BILLS','OFFICE EXPENSES','/images/expenses-3.png','Employee,Vendor,Customer,Partner','Debit','EXPENSES'),(_binary '\0',45,'DF DOC CHARGES','DOCUMENT CHARGES',NULL,NULL,NULL,'REVENUES'),(_binary '\0',46,'DF INTEREST','INTEREST',NULL,NULL,NULL,'REVENUES'),(_binary '\0',47,'DF LATE FEE','LATE FEE',NULL,NULL,NULL,'REVENUES'),(_binary '\0',48,'DF LOAN','LOANS',NULL,NULL,NULL,'ASSETS'),(_binary '\0',49,'MF DOC CHARGES','DOCUMENT CHARGES',NULL,NULL,NULL,'REVENUES'),(_binary '\0',50,'MF INTEREST','INTEREST',NULL,NULL,NULL,'REVENUES'),(_binary '\0',51,'MF LATE FEE','LATE FEE',NULL,NULL,NULL,'REVENUES'),(_binary '\0',52,'MF LOAN','LOANS',NULL,NULL,NULL,'ASSETS'),(_binary '\0',53,'DF LOAN INSTALLMENT','DF LOAN INSTALLMENT',NULL,NULL,NULL,'REVENUES'),(_binary '\0',54,'MF LOAN INSTALLMENT','MF LOAN INSTALLMENT',NULL,NULL,NULL,'REVENUES');
/*!40000 ALTER TABLE `accountmaster` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-02 16:04:25
