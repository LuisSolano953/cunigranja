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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cage`
--

LOCK TABLES `cage` WRITE;
/*!40000 ALTER TABLE `cage` DISABLE KEYS */;
INSERT INTO `cage` VALUES (1,'01',1),(2,'02',1),(3,'03',1),(5,'04',3),(6,'05',2),(7,'06',2),(8,'07',1),(9,'y5656',67567);
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entrada`
--

LOCK TABLES `entrada` WRITE;
/*!40000 ALTER TABLE `entrada` DISABLE KEYS */;
INSERT INTO `entrada` VALUES (1,'2025-04-20 00:00:00',5,30000,12,150000,320);
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feeding`
--

LOCK TABLES `feeding` WRITE;
/*!40000 ALTER TABLE `feeding` DISABLE KEYS */;
INSERT INTO `feeding` VALUES (3,'2025-04-20 00:00:00','23:02',100,12,22,1,319.7),(4,'2025-04-21 00:00:00','23:09',100,12,22,1,319.6);
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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `food`
--

LOCK TABLES `food` WRITE;
/*!40000 ALTER TABLE `food` DISABLE KEYS */;
INSERT INTO `food` VALUES (12,'purina','Existente',35000,'kg',319.6);
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
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `health`
--

LOCK TABLES `health` WRITE;
/*!40000 ALTER TABLE `health` DISABLE KEYS */;
INSERT INTO `health` VALUES (5,'vacunacion','2025-04-08','aplicacion de vitaminas',25000,1),(8,'string','2025-04-22','string',2147483647,7),(9,'weqweq','2025-04-22','trtrtertr',2222,3),(10,'qwee','2025-04-22','eqeqwe',2221,5),(11,'qweqwe','2025-04-22','weqeq',22112,3),(12,'ewew','2025-04-22','weqweq',11223,4),(13,'qqweqeqwe','2025-04-22','qeeqe',12312,5),(14,'qeqweqw','2025-04-22','qqwqweqw',1312312,5),(15,'wqwqqw','2025-04-22','qqww',1111,5),(16,'2|2122','2025-04-22','wqwqw',1111,5),(17,'qeqwe','2025-04-22','qwqeqwe',122233,1),(18,'qwqw','2025-04-22','wqwqw',11223,1),(19,'ssasS','2025-04-22','qwqww',222121,1),(20,'eqweqwe','2025-04-22','qwewew',424232,1),(21,'qeweq','2025-04-22','eqeqwe',3132,1),(22,'eqeqweqw','2025-04-22','qeqeqweq',131321,1),(23,'qwqwq','2025-04-22','wwqqwq',11212,1),(24,'dasdasd','2025-04-22','sdasdasd',22121,1),(25,'qwwqwe','2025-04-22','eqweqw',12212,1),(26,'dasdsd','2025-04-22','daddasd',211233,1),(27,'121212123','2025-04-22','dadasda',1212,1);
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mortality`
--

LOCK TABLES `mortality` WRITE;
/*!40000 ALTER TABLE `mortality` DISABLE KEYS */;
INSERT INTO `mortality` VALUES (1,'suicidio mortal','2025-04-16 00:00:00',24,1),(2,'infarto','2025-04-16 00:00:00',22,1),(3,'hh','2025-04-16 00:00:00',22,1),(4,'ewe','2025-04-16 00:00:00',22,1),(5,'yyy','2025-04-16 00:00:00',22,1),(6,'kk','2025-04-16 00:00:00',23,1);
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
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rabbit`
--

LOCK TABLES `rabbit` WRITE;
/*!40000 ALTER TABLE `rabbit` DISABLE KEYS */;
INSERT INTO `rabbit` VALUES (22,'olivia','2025-04-12 00:00:00',12,'Hembra','Activo',13,9,5),(23,'marlon','2025-04-12 00:00:00',5,'Macho','Activo',20,1,5),(24,'kevin','2025-04-16 00:00:00',12,'Macho','Activo',12,9,6),(25,'carla','2025-04-16 00:00:00',12,'Hembra','Activo',12,9,5),(26,'assasa','2025-04-21 00:00:00',12,'Macho','Inactivo',12,10,1);
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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `race`
--

LOCK TABLES `race` WRITE;
/*!40000 ALTER TABLE `race` DISABLE KEYS */;
INSERT INTO `race` VALUES (1,'Nueva Zelanda'),(3,'Mariposa'),(4,'Chinchilla'),(9,'Ruso Californiano'),(10,'Chinchilla'),(11,'Ruso Californiano'),(12,'Chinchilla');
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reproduction`
--

LOCK TABLES `reproduction` WRITE;
/*!40000 ALTER TABLE `reproduction` DISABLE KEYS */;
INSERT INTO `reproduction` VALUES (5,'2025-04-22',34,23,11,25);
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
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `weighing`
--

LOCK TABLES `weighing` WRITE;
/*!40000 ALTER TABLE `weighing` DISABLE KEYS */;
INSERT INTO `weighing` VALUES (18,'2025-04-17 05:01:00',7,23,1,12),(19,'2025-04-17 15:37:00',8,23,1,13),(20,'2025-04-23 04:19:00',1,22,1,13);
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

-- Dump completed on 2025-05-03 13:12:00
