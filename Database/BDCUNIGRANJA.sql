-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: cunigranja
-- ------------------------------------------------------
-- Server version	8.0.39

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
-- Table structure for table `cage`
--

DROP TABLE IF EXISTS `cage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cage` (
  `Id_cage` int NOT NULL AUTO_INCREMENT,
  `estado_cage` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`Id_cage`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cage`
--

LOCK TABLES `cage` WRITE;
/*!40000 ALTER TABLE `cage` DISABLE KEYS */;
INSERT INTO `cage` VALUES (1,'string');
/*!40000 ALTER TABLE `cage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `destete`
--

DROP TABLE IF EXISTS `destete`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `destete` (
  `Id_destete` int NOT NULL AUTO_INCREMENT,
  `fecha_destete` datetime DEFAULT NULL,
  `peso_destete` int DEFAULT NULL,
  PRIMARY KEY (`Id_destete`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `destete`
--

LOCK TABLES `destete` WRITE;
/*!40000 ALTER TABLE `destete` DISABLE KEYS */;
/*!40000 ALTER TABLE `destete` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entrada`
--

DROP TABLE IF EXISTS `entrada`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entrada` (
  `Id_entrada` int NOT NULL AUTO_INCREMENT,
  `fecha_entrada` datetime DEFAULT NULL,
  `cantidad_entrada` int DEFAULT NULL,
  `valor_entrada` int DEFAULT NULL,
  PRIMARY KEY (`Id_entrada`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entrada`
--

LOCK TABLES `entrada` WRITE;
/*!40000 ALTER TABLE `entrada` DISABLE KEYS */;
/*!40000 ALTER TABLE `entrada` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feeding`
--

DROP TABLE IF EXISTS `feeding`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feeding` (
  `Id_feeding` int NOT NULL AUTO_INCREMENT,
  `fecha_feeding` datetime DEFAULT NULL,
  `hora_feeding` varchar(250) DEFAULT NULL,
  `cantidad_feeding` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`Id_feeding`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feeding`
--

LOCK TABLES `feeding` WRITE;
/*!40000 ALTER TABLE `feeding` DISABLE KEYS */;
/*!40000 ALTER TABLE `feeding` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `food`
--

DROP TABLE IF EXISTS `food`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `food` (
  `Id_food` int NOT NULL AUTO_INCREMENT,
  `name_food` varchar(250) DEFAULT NULL,
  `estado_food` varchar(250) DEFAULT NULL,
  `valor_food` int DEFAULT NULL,
  `unidad_food` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`Id_food`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `food`
--

LOCK TABLES `food` WRITE;
/*!40000 ALTER TABLE `food` DISABLE KEYS */;
INSERT INTO `food` VALUES (1,'string','string',2147483647,'string'),(2,'string','string',1000000,'string');
/*!40000 ALTER TABLE `food` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `health`
--

DROP TABLE IF EXISTS `health`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `health` (
  `Id_health` int NOT NULL AUTO_INCREMENT,
  `name_health` varchar(250) DEFAULT NULL,
  `fecha_health` date DEFAULT NULL,
  `descripcion_health` varchar(250) DEFAULT NULL,
  `valor_health` int DEFAULT NULL,
  PRIMARY KEY (`Id_health`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `health`
--

LOCK TABLES `health` WRITE;
/*!40000 ALTER TABLE `health` DISABLE KEYS */;
INSERT INTO `health` VALUES (1,'string','2024-12-07','string',2147483647),(2,'string','2024-12-07','string',300000);
/*!40000 ALTER TABLE `health` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mortality`
--

DROP TABLE IF EXISTS `mortality`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mortality` (
  `Id_mortality` int NOT NULL AUTO_INCREMENT,
  `cantidad_mortality` int DEFAULT NULL,
  `fecha_mortality` datetime DEFAULT NULL,
  PRIMARY KEY (`Id_mortality`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mortality`
--

LOCK TABLES `mortality` WRITE;
/*!40000 ALTER TABLE `mortality` DISABLE KEYS */;
INSERT INTO `mortality` VALUES (1,40,'2024-12-07 00:00:00');
/*!40000 ALTER TABLE `mortality` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mounts`
--

DROP TABLE IF EXISTS `mounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mounts` (
  `Id_mounts` int NOT NULL AUTO_INCREMENT,
  `tiempo_mounts` datetime DEFAULT NULL,
  `fecha_mounts` datetime DEFAULT NULL,
  `cantidad_mounts` int DEFAULT NULL,
  PRIMARY KEY (`Id_mounts`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mounts`
--

LOCK TABLES `mounts` WRITE;
/*!40000 ALTER TABLE `mounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `mounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rabi`
--

DROP TABLE IF EXISTS `rabi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rabi` (
  `Id_rabi` int NOT NULL AUTO_INCREMENT,
  `nombre_rabi` varchar(250) DEFAULT NULL,
  `fecha_salida` datetime DEFAULT NULL,
  `peso_actual` int DEFAULT NULL,
  `peso_inicial` int DEFAULT NULL,
  `sexo_rabi` varchar(250) DEFAULT NULL,
  `ganancia_peso` int DEFAULT NULL,
  `estado` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`Id_rabi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rabi`
--

LOCK TABLES `rabi` WRITE;
/*!40000 ALTER TABLE `rabi` DISABLE KEYS */;
/*!40000 ALTER TABLE `rabi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `race`
--

DROP TABLE IF EXISTS `race`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `race` (
  `Id_race` int NOT NULL AUTO_INCREMENT,
  `nombre_race` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`Id_race`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `race`
--

LOCK TABLES `race` WRITE;
/*!40000 ALTER TABLE `race` DISABLE KEYS */;
INSERT INTO `race` VALUES (1,'string');
/*!40000 ALTER TABLE `race` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reproduction`
--

DROP TABLE IF EXISTS `reproduction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reproduction` (
  `Id_reproduction` int NOT NULL AUTO_INCREMENT,
  `fecha_nacimiento` date DEFAULT NULL,
  `total_conejos` int DEFAULT NULL,
  `nacidos_vivos` int DEFAULT NULL,
  `nacidos_muertos` int DEFAULT NULL,
  PRIMARY KEY (`Id_reproduction`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reproduction`
--

LOCK TABLES `reproduction` WRITE;
/*!40000 ALTER TABLE `reproduction` DISABLE KEYS */;
INSERT INTO `reproduction` VALUES (1,'2024-12-07',50,30,30);
/*!40000 ALTER TABLE `reproduction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `Id_user` int NOT NULL AUTO_INCREMENT,
  `password_user` varchar(250) DEFAULT NULL,
  `name_user` varchar(250) DEFAULT NULL,
  `intentos_user` int DEFAULT '0',
  `token_user` varchar(250) DEFAULT NULL,
  `blockard` tinyint(1) DEFAULT '0',
  `tipo_user` varchar(250) DEFAULT NULL,
  `email_user` varchar(250) NOT NULL,
  `salt` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`Id_user`),
  UNIQUE KEY `email_user_UNIQUE` (`email_user`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'$2a$11$Tbt2UJE6H.C8EPhCylH41.xTkhWg5cnH0SKz1H6wmcQY/bUZOYBKK','luisa',NULL,'',0,NULL,'luisa@gmail','$2a$11$BGle7tBywwQFSwx0Fg3B2u'),(3,'$2a$11$TrfK.MuiCSWPnPVJ5j0zGOOLKZRmKyGyPnuiU4.QW45HLTC6lyqrS','luis',NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyIjoibHVpc0BnbWFpbCIsIm5iZiI6MTczMTkzNzU0NiwiZXhwIjoxNzMxOTQxMTQ2LCJpYXQiOjE3MzE5Mzc1NDZ9.RqLjSiIO3zPzFI3T2lmQPL5iMNtxid6ep0l9Ob385vE',0,NULL,'luis@gmail','$2a$11$mvjrLpltimr7XAeTV9IDm.'),(4,'$2a$11$l4X54DhtBuQO/SdPczZpcOd.2oFWgenm3esbunCKx9siqQGFSgVpi','carla',NULL,'',0,NULL,'carla@gmail','$2a$11$Tvq4CjY/NfNeYFBcLexRZO'),(5,'$2a$11$125Ui/7R5nW461a782MlW.eG7wAgkSflc5SSqii/7Fxy0JpBHB7MG','luis',0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyIjoibHVpc3NvbGFub3IyMDIyQGdhbWlsLmNvbSIsIm5iZiI6MTczMzU4Mjc3NCwiZXhwIjoxNzMzNTg2Mzc0LCJpYXQiOjE3MzM1ODI3NzR9.MmtSMeR5XwPdb9sHJcmnZjHRfwIodl_CFZJLbwYT8wk',0,'string','luissolanor2022@gamil.com','$2a$11$XnFI6rTK3N1Z4PmFVfIm/u');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `weighing`
--

DROP TABLE IF EXISTS `weighing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `weighing` (
  `Id_weighing` int NOT NULL AUTO_INCREMENT,
  `fecha_weighing` datetime DEFAULT NULL,
  `cantidad_peso` int DEFAULT NULL,
  PRIMARY KEY (`Id_weighing`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `weighing`
--

LOCK TABLES `weighing` WRITE;
/*!40000 ALTER TABLE `weighing` DISABLE KEYS */;
INSERT INTO `weighing` VALUES (1,'2024-12-07 00:00:00',500);
/*!40000 ALTER TABLE `weighing` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-07 12:53:58
