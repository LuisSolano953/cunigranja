CREATE DATABASE  IF NOT EXISTS `cunigranja` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `cunigranja`;
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
  `estado_cage` varchar(250) NOT NULL,
  `cantidad_animales` int NOT NULL,
  PRIMARY KEY (`Id_cage`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cage`
--

LOCK TABLES `cage` WRITE;
/*!40000 ALTER TABLE `cage` DISABLE KEYS */;
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
  `Id_rabi` int DEFAULT NULL,
  PRIMARY KEY (`Id_destete`),
  KEY `Id_destete_idx` (`Id_rabi`),
  CONSTRAINT `Id_destete` FOREIGN KEY (`Id_rabi`) REFERENCES `rabbit` (`Id_rabbit`) ON DELETE SET NULL
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
  `Id_food` int NOT NULL,
  `valor_total` int DEFAULT NULL,
  `existencia_actual` int DEFAULT NULL,
  PRIMARY KEY (`Id_entrada`),
  KEY `Aliments_idx` (`Id_food`),
  CONSTRAINT `Aliments` FOREIGN KEY (`Id_food`) REFERENCES `food` (`Id_food`)
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
  `cantidad_feeding` int DEFAULT NULL,
  `Id_food` int NOT NULL,
  `Id_rabbit` int DEFAULT NULL,
  `Id_user` int DEFAULT NULL,
  `existencia_actual` float DEFAULT NULL,
  PRIMARY KEY (`Id_feeding`),
  KEY `Id_food_idx` (`Id_feeding`,`Id_food`),
  KEY `Id_feeding_idx` (`Id_food`),
  KEY `Id_rabi_idx` (`Id_rabbit`),
  KEY `Id_user_idx` (`Id_user`),
  CONSTRAINT `Id_feeding` FOREIGN KEY (`Id_food`) REFERENCES `food` (`Id_food`) ON DELETE RESTRICT,
  CONSTRAINT `Id_rabi` FOREIGN KEY (`Id_rabbit`) REFERENCES `rabbit` (`Id_rabbit`) ON DELETE SET NULL,
  CONSTRAINT `Id_user` FOREIGN KEY (`Id_user`) REFERENCES `user` (`Id_user`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
  `saldo_existente` float DEFAULT NULL,
  PRIMARY KEY (`Id_food`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `food`
--

LOCK TABLES `food` WRITE;
/*!40000 ALTER TABLE `food` DISABLE KEYS */;
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
  `Id_user` int NOT NULL,
  PRIMARY KEY (`Id_health`),
  KEY `responsable_idx` (`Id_user`),
  CONSTRAINT `responsable` FOREIGN KEY (`Id_user`) REFERENCES `user` (`Id_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `health`
--

LOCK TABLES `health` WRITE;
/*!40000 ALTER TABLE `health` DISABLE KEYS */;
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
  `causa_mortality` varchar(250) DEFAULT NULL,
  `fecha_mortality` datetime DEFAULT NULL,
  `Id_rabbit` int DEFAULT NULL,
  `Id_user` int DEFAULT NULL,
  PRIMARY KEY (`Id_mortality`),
  KEY `encargado_idx` (`Id_user`),
  KEY `conejo_idx` (`Id_rabbit`),
  CONSTRAINT `conejo` FOREIGN KEY (`Id_rabbit`) REFERENCES `rabbit` (`Id_rabbit`) ON DELETE SET NULL,
  CONSTRAINT `encargado` FOREIGN KEY (`Id_user`) REFERENCES `user` (`Id_user`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mortality`
--

LOCK TABLES `mortality` WRITE;
/*!40000 ALTER TABLE `mortality` DISABLE KEYS */;
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
  `Id_rabbit` int DEFAULT NULL,
  PRIMARY KEY (`Id_mounts`),
  KEY `animal_idx` (`Id_rabbit`),
  CONSTRAINT `animal` FOREIGN KEY (`Id_rabbit`) REFERENCES `rabbit` (`Id_rabbit`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mounts`
--

LOCK TABLES `mounts` WRITE;
/*!40000 ALTER TABLE `mounts` DISABLE KEYS */;
INSERT INTO `mounts` VALUES (5,'2025-04-06 13:22:00','2025-04-06 00:00:00',3,22);
/*!40000 ALTER TABLE `mounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rabbit`
--

DROP TABLE IF EXISTS `rabbit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rabbit` (
  `Id_rabbit` int NOT NULL AUTO_INCREMENT,
  `name_rabbit` varchar(250) DEFAULT NULL,
  `fecha_registro` datetime DEFAULT NULL,
  `peso_inicial` int DEFAULT NULL,
  `sexo_rabbit` varchar(250) DEFAULT NULL,
  `estado` varchar(250) DEFAULT NULL,
  `peso_actual` int DEFAULT NULL,
  `Id_race` int NOT NULL,
  `Id_cage` int NOT NULL,
  PRIMARY KEY (`Id_rabbit`),
  KEY `raza_idx` (`Id_race`),
  KEY `corral_idx` (`Id_cage`),
  CONSTRAINT `jaula` FOREIGN KEY (`Id_cage`) REFERENCES `cage` (`Id_cage`),
  CONSTRAINT `raza` FOREIGN KEY (`Id_race`) REFERENCES `race` (`Id_race`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rabbit`
--

LOCK TABLES `rabbit` WRITE;
/*!40000 ALTER TABLE `rabbit` DISABLE KEYS */;
/*!40000 ALTER TABLE `rabbit` ENABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `race`
--

LOCK TABLES `race` WRITE;
/*!40000 ALTER TABLE `race` DISABLE KEYS */;
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
  `Id_rabbit` int DEFAULT NULL,
  PRIMARY KEY (`Id_reproduction`),
  KEY `animal_idx` (`Id_rabbit`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reproduction`
--

LOCK TABLES `reproduction` WRITE;
/*!40000 ALTER TABLE `reproduction` DISABLE KEYS */;
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
  `ResetToken` varchar(255) DEFAULT NULL,
  `ResetTokenExpiration` datetime DEFAULT NULL,
  `estado` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`Id_user`),
  UNIQUE KEY `email_user_UNIQUE` (`email_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
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
  `ganancia_peso` int DEFAULT NULL,
  `Id_rabbit` int DEFAULT NULL,
  `Id_user` int DEFAULT NULL,
  `peso_actual` int DEFAULT NULL,
  PRIMARY KEY (`Id_weighing`),
  KEY `trabajador_idx` (`Id_user`),
  KEY `Conejos_idx` (`Id_rabbit`),
  CONSTRAINT `Conejos` FOREIGN KEY (`Id_rabbit`) REFERENCES `rabbit` (`Id_rabbit`) ON DELETE SET NULL,
  CONSTRAINT `trabajador` FOREIGN KEY (`Id_user`) REFERENCES `user` (`Id_user`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `weighing`
--

LOCK TABLES `weighing` WRITE;
/*!40000 ALTER TABLE `weighing` DISABLE KEYS */;
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

-- Dump completed on 2025-06-16  9:30:24
