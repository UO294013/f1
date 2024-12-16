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
            $conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
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
                        if ($conn->query($sql) === false) {
                            echo "Error ejecutando: $sql <br> Error: " . $conn->error . "<br>";
                        } else {
                            echo "Ejecutado correctamente: $sql <br>";
                        }
                        $sql = ""; // Resetear para la siguiente instrucción
                    }
                }
                fclose($file);
                echo "Importación completada.<br>";
            } else {
                echo "Error al abrir el archivo que inicializa la base de datos.<br>";
            }
        }

        // Función para importar datos de un archivo CSV a la base de datos
        public function import_csv($filePath, $columns) {
            $conn = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
            // Abrir el CSV
            if (($file = fopen($filePath, 'r')) !== false) {
                $header = fgetcsv($file);
                if (!$header || !in_array('tabla', $header)) {
                    echo "El archivo CSV debe incluir una columna 'tabla' para indicar el destino de cada fila.<br>";
                    fclose($file);
                    return false;
                }
        
                // Leer cada fila del archivo
                while (($row = fgetcsv($file)) !== false) {
                    $data = array_combine($header, $row);

                    // Verificar que la tabla especificada existe
                    $table = $data['tabla'];
                    if (!isset($tableColumns[$table])) {
                        echo "Tabla desconocida: $table. Saltando fila.<br>";
                        continue;
                    }

                    // Filtrar datos para esta tabla
                    $columns = $columns[$table];
                    $values = [];
                    foreach ($columns as $column) {
                        $values[] = $data[$column] ?? null;
                    }

                    // Preparar la consulta de inserción
                    $placeholders = implode(',', array_fill(0, count($columns), '?'));
                    $sql = "INSERT INTO $table (" . implode(',', $columns) . ") VALUES ($placeholders)";
                    $stmt = $conn->prepare($sql);

                    if ($stmt) {
                        $stmt->bind_param(str_repeat('s', count($values)), ...$values);
                        if (!$stmt->execute()) {
                            echo "Error al insertar datos en la tabla $table: " . $stmt->error . "<br>";
                        } else {
                            echo "Fila insertada correctamente en la tabla $table.<br>";
                        }
                    } else {
                        echo "Error al preparar la consulta para la tabla $table: " . $conn->error . "<br>";
                    }
                }
            fclose($file);
            echo "Importación completada.<br>";
            } else {
                echo "Error al abrir el archivo $filePath.<br>";
            }
        }
    }

    $f1Strategy = new F1Strategy();

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['initializeDb'])) {
        $f1Strategy->createDatabase();
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['importCsv'])) {
        $f1Strategy->createDatabase();
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['exportToCsv'])) {
        $f1Strategy->createDatabase();
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
            <a href="viajes.php" title="Ir a Viajes">Viajes</a>
            <a class="active" href="../juegos.html" title="Ir a Juegos">Juegos</a>
        </nav>
    </header>
    <p>Estás en: <a href="../index.html" title="Ir a Inicio">Inicio</a> >> <a href="../juegos.html" title="Ir a Juegos">Juegos</a> >> F1Strategy</p>
    <main>
        <h2>F1Strategy: Analiza los resultados de la F1</h2>
        <menu>
            <li><a href="../memoria.html" title="Ir a Juego de Memoria">Memoria</a></li>
            <li><a href="semaforo.php" title="Ir a Juego de Reacción">Reacción</a></li>
            <li><a href="../api.html" title="Ir a Juego extra de APIs">API</a></li>
            <li><a href="libre.php" title="Ir al ejercicio extra de PHP F1Strategy">F1Strategy</a></li>
        </menu>
        <!-- Botón para crear de cero e inicializar la base de datos -->
        <form method="post" action="libre.php">
            <label>Destruir, crear desde cero e inicializar la base de datos : </label>
            <button type="submit" name="initializeDb">Inicializar base de datos</button>
        </form>
        <!-- Input para seleccionar el fichero CSV para importar datos a la base de datos -->
        <form method="post" action="libre.php">
            <label>Selecciona un archivo para importar los datos a la base de datos: </label>
            <input type="file" name="importCsv" accept=".csv" />
        </form>
        <!-- Botón para exportar la base de datos a un fichero CSV -->
        <form method="post" action="libre.php">
            <label for="fileName">Exportar estado de la base de datos a archivo .csv: </label>
            <input type="text" id="fileName" placeholder="Nombre archivo" required />
            <button type="submit" name="exportToCsv">Exportar base de datos</button>
        </form>
    </main>
</body>
</html>