<!DOCTYPE HTML>
<?php   
    class F1Strategy {

        protected $server;
        protected $user;
        protected $pass;
        protected $dbname;

        public function __construct(){
            $this->server = "localhost";
            $this->user = "DBUSER2024";
            $this->pass = "DBPSWD2024";
            $this->dbname = "f1strategy";
        }

        // Función para crear la base de datos y las tablas leyendo línea por línea del archivo f1strategy.sql
        public function createDatabase() {
            $conn = new mysqli($this->server, $this->user, $this->pass);
            if (($file = fopen("f1strategy.sql", 'r')) !== false) {
                $sql = "";
                while (($line = fgets($file)) !== false) {
                    $line = trim($line);
                    if (empty($line) || strpos($line, "--") === 0 || strpos($line, "/*") === 0) {
                        continue;
                    }
                    // Agrupar comando SQL hasta que encontremos un ;
                    $sql .= $line;
                    if (substr($line, -1) === ";") {
                        $conn->query($sql);
                        $sql = ""; // Resetear para la siguiente instrucción
                    }
                }
                fclose($file);
                echo "<p>Importación completada</p>";
            } else {
                echo "<p>Error al abrir el archivo que inicializa la base de datos</p>";
            }
            $conn->close();
        }

        // Función para importar datos de un archivo CSV a la base de datos
        public function import_csv() {
            $conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
            $csvFile = $_FILES['importedCsv']['tmp_name'];
            $showErrors = false;

            if (($handle = fopen($csvFile, "r")) !== false) {
                while (($data = fgetcsv($handle, 1000, ",")) !== false) {
                    try {
                        switch ($data[0]) {
                            case "carrera": // id,pais,circuito,fecha,num_vueltas
                                $stmt = $conn->prepare("INSERT INTO carrera (id, pais, circuito, fecha, num_vueltas) VALUES (?, ?, ?, ?, ?)");
                                $stmt->bind_param("isssi", $data[1], $data[2], $data[3], $data[4], $data[5]);
                                break;
                            case "escuderia": // id,nombre,sede.presupuesto
                                $stmt = $conn->prepare("INSERT INTO escuderia (id, nombre, sede, presupuesto) VALUES (?, ?, ?, ?)");
                                $stmt->bind_param("issi", $data[1], $data[2], $data[3], $data[4]);
                                break;
                            case "piloto": // id,nombre,pais,edad
                                $stmt = $conn->prepare("INSERT INTO piloto (id, nombre, pais, edad) VALUES (?, ?, ?, ?)");
                                $stmt->bind_param("issi", $data[1], $data[2], $data[3], $data[4]);
                                break;
                            case "piloto_escuderia": // escuderia_id,piloto_id
                                $stmt = $conn->prepare("INSERT INTO piloto_escuderia (escuderia_id, piloto_id) VALUES (?, ?)");
                                $stmt->bind_param("ii", $data[1], $data[2]);
                                break;
                            case "resultado": // carrera_id,piloto_id,posicion
                                $stmt = $conn->prepare("INSERT INTO resultado (carrera_id, piloto_id, posicion) VALUES (?, ?, ?)");
                                $stmt->bind_param("iii", $data[1], $data[2], $data[3]);
                                break;
                        }
                        $stmt->execute();
                        $stmt->close();
                    } catch (Exception $e) {
                        // No llenar la pantalla de errores, simplemente mostrar que ha habido un error
                        $showErrors = true;
                    }
                }
                fclose($handle);
                if ($showErrors) {
                    echo "<p>Algunos datos no se han podido importar correctamente debido a inconsistencias con la base de datos</p>";
                }
                echo "<p>Importación completada</p>";
            } else {
                echo "<p>Error al importar los datos a la base de datos</p>";
            }
            $conn->close(); 
        }

        // Función para exportar los datos de la base de datos como un archivo CSV
        public function export_csv() {
            $conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
            $fileName = $_POST['fileName'] . ".csv";
            $outputFile = fopen($fileName, "w");

            // Obtener todas las tablas de la base de datos
            $tablesResult = $conn->query("SHOW TABLES");
            while ($tableRow = $tablesResult->fetch_array()) {
                $tableName = $tableRow[0];
                $dataResult = $conn->query("SELECT * FROM $tableName");
                if ($dataResult->num_rows > 0) {
                    while ($row = $dataResult->fetch_assoc()) {
                        $line = array_merge([$tableName], array_values($row));
                        fputcsv($outputFile, $line, ",");
                    }
                }
            }
            fclose($outputFile);
            $conn->close();
            echo "<p>Datos exportados correctamente a <strong>$fileName</strong>.</p>";
        }
    }
?>
<html lang="es">
<head>
    <meta charset="UTF-8" />
    <title>F1 Desktop</title>
    <link rel="icon" href="../multimedia/imagenes/favicon.ico" sizes="48x48">
    <meta name="author" content="Vicente Megido García (UO294013)" />
    <meta name="description" content="Ejercicio extra de PHP con base de datos: F1Strategy" />
    <meta name="keywords" content="F1, Fórmula 1" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" type="text/css" href="../estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="../estilo/layout.css" />
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
            <a href="../viajes.php" title="Ir a Viajes">Viajes</a>
            <a class="active" href="../juegos.html" title="Ir a Juegos">Juegos</a>
        </nav>
    </header>
    <p>Estás en: <a href="../index.html" title="Ir a Inicio">Inicio</a> >> <a href="../juegos.html" title="Ir a Juegos">Juegos</a> >> F1Strategy</p>
    <main>
        <h2>F1Strategy: Analiza los resultados de la F1</h2>
        <menu>
            <li><a href="../memoria.html" title="Ir a Juego de Memoria">Memoria</a></li>
            <li><a href="../semaforo.php" title="Ir a Juego de Reacción">Reacción</a></li>
            <li><a href="../api.html" title="Ir a Juego extra de APIs">API</a></li>
            <li><a href="libre.php" title="Ir al ejercicio extra de PHP F1Strategy">F1Strategy</a></li>
        </menu>
        <!-- Botón para crear de cero e inicializar la base de datos -->
        <form method="post" action="libre.php">
            <label>Destruir, crear desde cero e inicializar la base de datos : </label>
            <button type="submit" name="initializeDb">Inicializar base de datos</button>
        </form>
        <?php
            $f1Strategy = new F1Strategy();
            if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['initializeDb'])) {
                $f1Strategy->createDatabase();
            }
        ?>
        <!-- Input para seleccionar el fichero CSV para importar datos a la base de datos -->
        <form method="post" action="libre.php" enctype="multipart/form-data">
            <label for="importCsv">Selecciona un archivo para importar los datos a la base de datos: </label>
            <input type="file" id="importCsv" name="importedCsv" accept=".csv" />
            <button type="submit" name="importCsv">Importar datos</button>
        </form>
        <?php
            $f1Strategy = new F1Strategy();
            if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['importCsv'])) {
                $f1Strategy->import_csv();
            }
        ?>
        <!-- Botón para exportar la base de datos a un fichero CSV -->
        <form method="post" action="libre.php">
            <label for="fileName">Exportar estado de la base de datos a archivo .csv: </label>
            <input type="text" id="fileName" name="fileName" placeholder="Nombre archivo" required />
            <button type="submit" name="exportToCsv">Exportar base de datos</button>
        </form>
        <?php
            $f1Strategy = new F1Strategy();
            if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['exportToCsv'])) {
                $f1Strategy->export_csv();
            }
        ?>
    </main>
</body>
</html>