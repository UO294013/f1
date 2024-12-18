<!DOCTYPE HTML>
<?php   
    class Record {

        protected $server;
        protected $user;
        protected $pass;
        protected $dbname;

        public function __construct(){
            $this->server = "localhost";
            $this->user = "DBUSER2024";
            $this->pass = "DBPSWD2024";
            $this->dbname = "records";
        }

        public function guardarRecord($nombre, $apellidos, $nivel, $tiempo) {
            $conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
            $stmt = $conn->prepare("INSERT INTO registro (nombre, apellidos, nivel, tiempo) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("ssdd", $nombre, $apellidos, $nivel, $tiempo);
            $stmt->execute();
            $stmt->close();
            $conn->close();
        }

        public function getTopRegistros($nivel) {
            $conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
            $stmt = $conn->prepare("SELECT nombre, apellidos, tiempo FROM registro WHERE nivel = ? ORDER BY tiempo ASC LIMIT 10");
            $stmt->bind_param("d", $nivel);
            $stmt->execute();
            $result = $stmt->get_result();
            $records = $result->fetch_all(MYSQLI_ASSOC);
            $stmt->close();
            $conn->close();
            return $records;
        }
    }
?>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <title>F1 Desktop</title>
    <link rel="icon" href="multimedia/imagenes/favicon.ico" sizes="48x48">
    <meta name="author" content="Vicente Megido Garcia (UO294013)" />
    <meta name="description" content="Juego de reacción: Semáforo de F1" />
    <meta name="keywords" content="F1, Fórmula 1" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="estilo/semaforo_grid.css" />
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <script src="js/semaforo.js"></script>
</head>
<body>
    <header>
        <h1><a href="index.html" title="Ir a la página principal">F1 Desktop</a></h1>
        <nav>
            <a href="index.html" title="Ir a Inicio">Inicio</a>
            <a href="piloto.html" title="Ir a Piloto">Piloto</a>
            <a href="noticias.html" title="Ir a Noticias">Noticias</a>
            <a href="calendario.html" title="Ir a Calendario">Calendario</a>
            <a href="meteorologia.html" title="Ir a Meteorologia">Meteorologia</a>
            <a href="circuito.html" title="Ir a Circuito">Circuito</a>
            <a href="viajes.php" title="Ir a Viajes">Viajes</a>
            <a class="active" href="juegos.html" title="Ir a Juegos">Juegos</a>
        </nav>
    </header>
    <p>Estás en: <a href="index.html" title="Ir a Inicio">Inicio</a> >> <a href="juegos.html" title="Ir a Juegos">Juegos</a> >> Reacción</p>
    <main>
        <menu>
            <li><a href="memoria.html" title="Ir a Juego de Memoria">Memoria</a></li>
            <li><a href="semaforo.php" title="Ir a Juego de Reacción">Reacción</a></li>
            <li><a href="api.html" title="Ir a Juego extra de APIs">API</a></li>
            <li><a href="php/libre.php" title="Ir al ejercicio extra de PHP F1Strategy">F1Strategy</a></li>
        </menu>
        <script>
            semaforo = new Semaforo();
        </script>
        <?php
            if ($_SERVER['REQUEST_METHOD'] == 'POST') {
                $record = new Record();
                $nombre = $_POST["nombre"];
                $apellidos = $_POST["apellidos"];
                $nivel = $_POST["nivel"];
                $tiempo = $_POST["tiempo"];
                $record->guardarRecord($nombre, $apellidos, $nivel, $tiempo);
                $topRecords = $record->getTopRegistros($nivel);
                if (!empty($topRecords)) {
                    echo "<section><h3>Top 10 Mejores registros para la dificultad {$nivel}:</h3><ol>";
                    foreach ($topRecords as $rec) {
                        echo "<li>Nombre: {$rec['nombre']} {$rec['apellidos']} - Tiempo: {$rec['tiempo']} segundos</li>";
                    }
                    echo "</ol></section>";
                } else {
                    echo "<p>Aún no hay registros guardados para esta dificultad</p>";
                }
            }
        ?>
    </main>
</body>
</html>