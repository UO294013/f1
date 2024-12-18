-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 17-12-2024 a las 19:44:49
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `f1strategy`
--

DROP DATABASE IF EXISTS `f1strategy`;

CREATE DATABASE IF NOT EXISTS `f1strategy` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `f1strategy`;
DROP TABLE IF EXISTS `carrera`;
DROP TABLE IF EXISTS `escuderia`;
DROP TABLE IF EXISTS `piloto`;
DROP TABLE IF EXISTS `piloto_escuderia`;
DROP TABLE IF EXISTS `resultado`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrera`
--

CREATE TABLE `carrera` (
  `id` int(11) NOT NULL,
  `pais` varchar(100) NOT NULL,
  `circuito` varchar(100) NOT NULL,
  `fecha` date NOT NULL,
  `num_vueltas` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `carrera`
--

INSERT INTO `carrera` (`id`, `pais`, `circuito`, `fecha`, `num_vueltas`) VALUES
(100, 'España', 'Circuito de la Universidad de Oviedo', '2024-01-05', 60),
(101, 'Corea del Sur', 'Circuito Internacional de Corea', '2024-01-12', 55),
(102, 'Francia', 'Circuito de Paul Ricard', '2024-01-19', 53);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `escuderia`
--

CREATE TABLE `escuderia` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `sede` varchar(50) NOT NULL,
  `presupuesto` decimal(10,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `escuderia`
--

INSERT INTO `escuderia` (`id`, `nombre`, `sede`, `presupuesto`) VALUES
(100, 'Uniovi F1', 'Oviedo', 1000),
(101, 'Chevrolet', 'Detroit', 280000000),
(102, 'Lamborghini', "Sant'Agata Bolognese", 350000000);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `piloto`
--

CREATE TABLE `piloto` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `pais` varchar(50) NOT NULL,
  `edad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `piloto`
--

INSERT INTO `piloto` (`id`, `nombre`, `pais`, `edad`) VALUES
(100, 'Vicente Megido', 'España', 20),
(101, 'Lionel Messi', 'Argentina', 37),
(102, 'Cristiano Ronaldo', 'Portugal', 39);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `piloto_escuderia`
--

CREATE TABLE `piloto_escuderia` (
  `escuderia_id` int(11) NOT NULL,
  `piloto_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `piloto_escuderia`
--

INSERT INTO `piloto_escuderia` (`escuderia_id`, `piloto_id`) VALUES
(100, 100),
(101, 101),
(102, 102);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `resultado`
--

CREATE TABLE `resultado` (
  `carrera_id` int(11) NOT NULL,
  `piloto_id` int(11) NOT NULL,
  `posicion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `resultado`
--

INSERT INTO `resultado` (`carrera_id`, `piloto_id`, `posicion`) VALUES
(100, 100, 1),
(100, 101, 2),
(100, 102, 3);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `carrera`
--
ALTER TABLE `carrera`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `escuderia`
--
ALTER TABLE `escuderia`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `piloto`
--
ALTER TABLE `piloto`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `piloto_escuderia`
--
ALTER TABLE `piloto_escuderia`
  ADD PRIMARY KEY (`escuderia_id`,`piloto_id`);

--
-- Indices de la tabla `resultado`
--
ALTER TABLE `resultado`
  ADD PRIMARY KEY (`carrera_id`,`piloto_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `carrera`
--
ALTER TABLE `carrera`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=103;

--
-- AUTO_INCREMENT de la tabla `escuderia`
--
ALTER TABLE `escuderia`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=103;

--
-- AUTO_INCREMENT de la tabla `piloto`
--
ALTER TABLE `piloto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=103;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `piloto_escuderia`
--
ALTER TABLE `piloto_escuderia`
  ADD CONSTRAINT `piloto_escuderia_ibfk_1` FOREIGN KEY (`escuderia_id`) REFERENCES `escuderia` (`id`),
  ADD CONSTRAINT `piloto_escuderia_ibfk_2` FOREIGN KEY (`piloto_id`) REFERENCES `piloto` (`id`),
  ADD CONSTRAINT `unique_piloto` UNIQUE (`piloto_id`);

--
-- Filtros para la tabla `resultado`
--
ALTER TABLE `resultado`
  ADD CONSTRAINT `resultado_ibfk_1` FOREIGN KEY (`carrera_id`) REFERENCES `carrera` (`id`),
  ADD CONSTRAINT `resultado_ibfk_2` FOREIGN KEY (`piloto_id`) REFERENCES `piloto` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
