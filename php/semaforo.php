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
            $this->dbname = "record";
        }

        public function guardarRecord($name, $surname, $level, $time) {
            $conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
            if ($conn->connect_error) {
                die("Connection failed: " . $conn->connect_error);
            }
            $stmt = $conn->prepare("INSERT INTO registro (nombre, apellido, nivel, tiempo) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("ssdd", $name, $surname, $level, $time);
            $stmt->execute();
            $stmt->close();
            $conn->close();
        }

        public function getTopRegistros($difficulty) {
            $conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
            $stmt = $conn->prepare("SELECT nombre, apellido, tiempo FROM registro WHERE nivel = ? ORDER BY tiempo ASC LIMIT 10");
            $stmt->bind_param("d", $difficulty);
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
    <link rel="icon" href="../multimedia/imagenes/favicon.ico" sizes="48x48">
    <meta name="author" content="Vicente Megido García (UO294013)" />
    <meta name="description" content="Juego de reacción: Semáforo de F1" />
    <meta name="keywords" content="F1, Fórmula 1" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="../estilo/semaforo_grid.css" />
    <link rel="stylesheet" type="text/css" href="../estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="../estilo/layout.css" />
    <script src="../js/semaforo.js"></script>
</head>
<body>
    <header>
        <h1><a href="../index.html" title="Ir a la página principal">F1 Desktop</a></h1>
        <nav>
            <a href="../index.html" title="Ir a Inicio">Inicio</a>
            <a href="../piloto.html" title="Ir a Piloto">Piloto</a>
            <a href="../noticias.html" title="Ir a Noticias">Noticias</a>
            <a href="../calendario.html" title="Ir a Calendario">Calendario</a>
            <a href="../meteorología.html" title="Ir a Meteorología">Meteorología</a>
            <a href="../circuito.html" title="Ir a Circuito">Circuito</a>
            <a href="viajes.php" title="Ir a Viajes">Viajes</a>
            <a class="active" href="../juegos.html" title="Ir a Juegos">Juegos</a>
        </nav>
    </header>
    <p>Estás en: <a href="../index.html" title="Ir a Inicio">Inicio</a> >> <a href="../juegos.html" title="Ir a Juegos">Juegos</a> >> Reacción</p>
    <main>
        <?php
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $record = new Record();
                $record->guardarRecord($_POST['nombre'], $_POST['apellido'], $_POST['nivel'], $_POST['tiempo']);
            }
        ?>
        <script>
            semaforo = new Semaforo();
        </script>
        <?php
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $record = new Record();
                $currentDifficulty = $_POST['nivel'];
                $records = $record->getTopRegistros($currentDifficulty);
                echo "<ul>";
                foreach ($records as $rec) {
                    echo "<li>{$rec['nombre']} {$rec['apellido']} - {$rec['tiempo']}s</li>";
                }
                echo "</ul>";
            }
        ?>
    </main>
</body>
</html>