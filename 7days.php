<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>7 Days Forecast</title>
    <link rel="shortcut icon" href="favicon.png" type="image/x-icon">
    <link rel="shortcut icon" href="assets/favicon.png" type="image/x-icon" />
    <link rel="stylesheet" href="style.css">
    <style>
        .cityWeatherContainer2 {
            display: flex;
            margin-top: 200px;
            margin-bottom: 2000px;
        }

        .cityWeather2 {
            width: 350px;
            height: 180px;
            background-color: rgb(237, 231, 223);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            padding: 20px;
            margin-left: 20px;
        }

        .city2 {
            text-align: center;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .weatherIcon2 {
            width: 50px;
            height: 50px;
        }

        .temperature2 {
            text-align: center;
            font-size: 24px;
            margin-bottom: 10px;
        }

        .time2 {
            text-align: right;
        }

        .date2 {
            text-align: center;
        }

        .dayOfWeek2 {
            text-align: center;
            font-weight: bold;
            margin-bottom: 10px;
        }
    </style>
</head>

<body>
    <header>
        <div class="container">
            <div class="logo">
                <a href="index.html">
                    <img src="logo.png" alt="Logo" />
                </a>
            </div>
            <nav>
                <ul class="nav-links">
                    <li><a href="index.html">Home</a></li>
                    <li><a href="7days.php">7 Days Forecast</a></li>
                </ul>
            </nav>
        </div>
    </header>
    <?php
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "sumit";
    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $city = 'Leeds';

    // Loop through the past 7 days
    for ($i = 0; $i < 7; $i++) {
        $currentDate = date('Y-m-d', strtotime("-$i days"));

        // Prepare and bind parameters for the query
        $stmt = $conn->prepare("SELECT city, country, date, weatherCondition, weatherIcon, temperature, pressure, windSpeed, humidity
                            FROM weatherdata
                            WHERE city = ? AND DATE(date) = ?
                            ORDER BY date DESC
                            LIMIT 1");

        // Bind the parameters
        $stmt->bind_param("ss", $city, $currentDate);

        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();

            // Convert the date string to a DateTime object
            $date = new DateTime($row["date"]);
            // Get the day of the week
            $dayOfWeek = $date->format('l');

            // Generate HTML divs
            echo "<div class='cityWeatherContainer2'>";
            for ($j = 6; $j >= 0; $j--) { // Loop in reverse order to display the latest data on the right
                $currentDate = date('Y-m-d', strtotime("-$j days"));

                // Prepare and bind parameters for the query
                $stmt = $conn->prepare("SELECT city, country, date, weatherCondition, weatherIcon, temperature, pressure, windSpeed, humidity
                        FROM weatherdata
                        WHERE city = ? AND DATE(date) = ?
                        ORDER BY date DESC
                        LIMIT 1");

                // Bind the parameters
                $stmt->bind_param("ss", $city, $currentDate);

                $stmt->execute();
                $result = $stmt->get_result();

                if ($result->num_rows > 0) {
                    $row = $result->fetch_assoc();

                    // Convert the date string to a DateTime object
                    $date = new DateTime($row["date"]);
                    // Get the day of the week
                    $dayOfWeek = $date->format('l');

                    // Start a new container for each day
                    echo "<div class='cityWeather2'>";
                    echo "<div class='city2'>" . $row["city"] . ", " . $row["country"] . "</div>";
                    echo "<div class='dayOfWeek2'>" . $dayOfWeek . "</div>";
                    echo "<div class='weatherCondition2'>" . $row["weatherCondition"] . "</div>";
                    echo "<img class='weatherIcon2' src='http://openweathermap.org/img/w/" . $row["weatherIcon"] . ".png' alt='Weather Icon' />";
                    echo "<div class='temperature2'>" . $row["temperature"] . " &#8451;</div>";
                    echo "<div class='date2'>" . $row["date"] . "</div>";
                    echo "</div>"; // Close .cityWeather2 container
                } else {
                    echo "<div class='cityWeather2'>";
                    echo "<div class='city2'>$city</div>";
                    echo "<div class='dayOfWeek2'>" . date('l', strtotime("-$j days")) . "</div>";
                    echo "<div>No data available for this day.</div>";
                    echo "</div>"; // Close .cityWeather2 container
                }
            }
            echo "</div>"; // Close .cityWeatherContainer2
        }
    }

    $conn->close();
    ?>
</body>

</html>