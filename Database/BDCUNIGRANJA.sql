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
<<<<<<< HEAD
  `Id_cage` int NOT NULL AUTO_INCREMENT,
=======
  `Id_cage` int NOT NULL,
>>>>>>> 56dc09bf91636aff202dfdb3c8894fd5a85467d4
  `capacidad_cage` varchar(250) DEFAULT NULL,
  `tamaño_cage` varchar(250) DEFAULT NULL,
  `ubicacion_cage` varchar(250) DEFAULT NULL,
  `ficha_conejo` int DEFAULT NULL,
  `fecha_ingreso` date DEFAULT NULL,
  `fecha_salida` date DEFAULT NULL,
  `sexo_conejo` varchar(250) DEFAULT NULL,
  `estado_cage` varchar(250) DEFAULT NULL,
  `edad_conejo` int DEFAULT NULL,
  PRIMARY KEY (`Id_cage`)
<<<<<<< HEAD
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
=======
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
>>>>>>> 56dc09bf91636aff202dfdb3c8894fd5a85467d4
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cage`
--

LOCK TABLES `cage` WRITE;
/*!40000 ALTER TABLE `cage` DISABLE KEYS */;
INSERT INTO `cage` VALUES (1,'string','string','string',1,'2024-10-04','2024-10-04','string','string',3);
/*!40000 ALTER TABLE `cage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feeding`
--

DROP TABLE IF EXISTS `feeding`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feeding` (
<<<<<<< HEAD
  `Id_feeding` int NOT NULL AUTO_INCREMENT,
  `fecha_feeding` datetime DEFAULT NULL,
  `hora_feeding` varchar(250) DEFAULT NULL,
  `cantidad_feeding` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`Id_feeding`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
=======
  `Id_feeding` int NOT NULL,
  `fecha_feeding` datetime DEFAULT NULL,
  `hora_feeding` time DEFAULT NULL,
  `cantidad_feeding` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`Id_feeding`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
>>>>>>> 56dc09bf91636aff202dfdb3c8894fd5a85467d4
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feeding`
--

LOCK TABLES `feeding` WRITE;
/*!40000 ALTER TABLE `feeding` DISABLE KEYS */;
<<<<<<< HEAD
INSERT INTO `feeding` VALUES (1,'2024-11-10 00:00:00','05:16','3lb');
=======
>>>>>>> 56dc09bf91636aff202dfdb3c8894fd5a85467d4
/*!40000 ALTER TABLE `feeding` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `food`
--

DROP TABLE IF EXISTS `food`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `food` (
<<<<<<< HEAD
  `Id_food` int NOT NULL AUTO_INCREMENT,
  `name_food` varchar(250) DEFAULT NULL,
  `cantidad_food` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`Id_food`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
=======
  `Id_food` int NOT NULL,
  `name_food` varchar(250) DEFAULT NULL,
  `cantidad_food` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`Id_food`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
>>>>>>> 56dc09bf91636aff202dfdb3c8894fd5a85467d4
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `food`
--

LOCK TABLES `food` WRITE;
/*!40000 ALTER TABLE `food` DISABLE KEYS */;
<<<<<<< HEAD
INSERT INTO `food` VALUES (1,'string','string'),(2,'string','string'),(3,'string','string'),(4,'string','string'),(5,'string','string'),(10,'string','string'),(11,'rosa','12');
=======
INSERT INTO `food` VALUES (1,'string','string'),(2,'string','string'),(3,'string','string'),(4,'string','string'),(5,'string','string'),(10,'string','string');
>>>>>>> 56dc09bf91636aff202dfdb3c8894fd5a85467d4
/*!40000 ALTER TABLE `food` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `health`
--

DROP TABLE IF EXISTS `health`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `health` (
<<<<<<< HEAD
  `Id_health` int NOT NULL AUTO_INCREMENT,
  `name_health` varchar(250) DEFAULT NULL,
  `fecha_health` date DEFAULT NULL,
  PRIMARY KEY (`Id_health`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
=======
  `Id_health` int NOT NULL,
  `name_health` varchar(250) DEFAULT NULL,
  `fecha_health` date DEFAULT NULL,
  PRIMARY KEY (`Id_health`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
>>>>>>> 56dc09bf91636aff202dfdb3c8894fd5a85467d4
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `health`
--

LOCK TABLES `health` WRITE;
/*!40000 ALTER TABLE `health` DISABLE KEYS */;
<<<<<<< HEAD
INSERT INTO `health` VALUES (1,'string','2024-10-04'),(2,'string','2024-10-04'),(3,'rwrerwerw','2024-11-02');
=======
INSERT INTO `health` VALUES (1,'string','2024-10-04'),(2,'string','2024-10-04');
>>>>>>> 56dc09bf91636aff202dfdb3c8894fd5a85467d4
/*!40000 ALTER TABLE `health` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mortality`
--

DROP TABLE IF EXISTS `mortality`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mortality` (
<<<<<<< HEAD
  `Id_mortality` int NOT NULL AUTO_INCREMENT,
=======
  `Id_mortality` int NOT NULL,
>>>>>>> 56dc09bf91636aff202dfdb3c8894fd5a85467d4
  `causa_mortality` varchar(250) DEFAULT NULL,
  `cantidad_mortality` int DEFAULT NULL,
  `fecha_mortality` datetime DEFAULT NULL,
  PRIMARY KEY (`Id_mortality`)
<<<<<<< HEAD
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
=======
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
>>>>>>> 56dc09bf91636aff202dfdb3c8894fd5a85467d4
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mortality`
--

LOCK TABLES `mortality` WRITE;
/*!40000 ALTER TABLE `mortality` DISABLE KEYS */;
<<<<<<< HEAD
INSERT INTO `mortality` VALUES (1,'asad',2,'2024-11-06 00:00:00');
=======
>>>>>>> 56dc09bf91636aff202dfdb3c8894fd5a85467d4
/*!40000 ALTER TABLE `mortality` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `race`
--

DROP TABLE IF EXISTS `race`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `race` (
<<<<<<< HEAD
  `Id_race` int NOT NULL AUTO_INCREMENT,
=======
  `Id_race` int NOT NULL,
>>>>>>> 56dc09bf91636aff202dfdb3c8894fd5a85467d4
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
<<<<<<< HEAD
  `Id_reproduction` int NOT NULL AUTO_INCREMENT,
  `fecha_reproduction` date DEFAULT NULL,
  PRIMARY KEY (`Id_reproduction`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
=======
  `Id_reproduction` int NOT NULL,
  `fecha__reproduction` date DEFAULT NULL,
  PRIMARY KEY (`Id_reproduction`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
>>>>>>> 56dc09bf91636aff202dfdb3c8894fd5a85467d4
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reproduction`
--

LOCK TABLES `reproduction` WRITE;
/*!40000 ALTER TABLE `reproduction` DISABLE KEYS */;
<<<<<<< HEAD
INSERT INTO `reproduction` VALUES (1,'2024-11-08');
=======
INSERT INTO `reproduction` VALUES (1,'2024-10-04'),(2,'2024-10-04');
>>>>>>> 56dc09bf91636aff202dfdb3c8894fd5a85467d4
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'$2a$11$Tbt2UJE6H.C8EPhCylH41.xTkhWg5cnH0SKz1H6wmcQY/bUZOYBKK','luisa',NULL,'',0,NULL,'luisa@gmail','$2a$11$BGle7tBywwQFSwx0Fg3B2u'),(3,'$2a$11$TrfK.MuiCSWPnPVJ5j0zGOOLKZRmKyGyPnuiU4.QW45HLTC6lyqrS','luis',NULL,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyIjoibHVpc0BnbWFpbCIsIm5iZiI6MTczMTkzNzU0NiwiZXhwIjoxNzMxOTQxMTQ2LCJpYXQiOjE3MzE5Mzc1NDZ9.RqLjSiIO3zPzFI3T2lmQPL5iMNtxid6ep0l9Ob385vE',0,NULL,'luis@gmail','$2a$11$mvjrLpltimr7XAeTV9IDm.'),(4,'$2a$11$l4X54DhtBuQO/SdPczZpcOd.2oFWgenm3esbunCKx9siqQGFSgVpi','carla',NULL,'',0,NULL,'carla@gmail','$2a$11$Tvq4CjY/NfNeYFBcLexRZO');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `weighing`
--

DROP TABLE IF EXISTS `weighing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `weighing` (
<<<<<<< HEAD
  `Id_weighing` int NOT NULL AUTO_INCREMENT,
=======
  `Id_weighing` int NOT NULL,
>>>>>>> 56dc09bf91636aff202dfdb3c8894fd5a85467d4
  `fecha_weighing` datetime DEFAULT NULL,
  `peso_actual` varchar(250) DEFAULT NULL,
  `ganancia_peso` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`Id_weighing`)
<<<<<<< HEAD
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
=======
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
>>>>>>> 56dc09bf91636aff202dfdb3c8894fd5a85467d4
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `weighing`
--

LOCK TABLES `weighing` WRITE;
/*!40000 ALTER TABLE `weighing` DISABLE KEYS */;
INSERT INTO `weighing` VALUES (1,'2024-10-22 16:59:40','string','string');
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

<<<<<<< HEAD
-- Dump completed on 2024-11-21  0:22:17
=======
-- Dump completed on 2024-11-18 12:18:23
>>>>>>> 56dc09bf91636aff202dfdb3c8894fd5a85467d4
