<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>7 Days Forecast</title>
    <link rel="shortcut icon" href="assets/favicon.png" type="image/x-icon" />
    <link rel="stylesheet" href="style.css">
    <style>
        .cityWeatherContainer2 {
            display: flex;
            margin-top: 200px;
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

    // Calculate the date 7 days ago from today
    $sevenDaysAgo = date('Y-m-d', strtotime('-7 days'));

    // SQL query to select one data entry for each day in the past 7 days
    $sql = "SELECT city, country, date, weatherIcon, temperature
            FROM weatherdata
            WHERE city = 'Leeds' AND date >= '$sevenDaysAgo'
            GROUP BY date";

    $result = $conn->query($sql);

    // Generate HTML divs
    if ($result->num_rows > 0) {
        echo "<div class='cityWeatherContainer2'>";
        while ($row = $result->fetch_assoc()) {
            // Convert the date string to a DateTime object
            $date = new DateTime($row["date"]);
            // Get the day of the week
            $dayOfWeek = $date->format('l');
            
            echo "<div class='cityWeather2'>
                <div class='city2'>" . $row["city"] . ", " . $row["country"] . "</div>
                <div class='dayOfWeek2'>" . $dayOfWeek . "</div>
                <img class='weatherIcon2' src='http://openweathermap.org/img/w/" . $row["weatherIcon"] . ".png' alt='Weather Icon' />
                <div class='temperature2'>" . $row["temperature"] . " &#8451;</div>
                <div class='date2'>" . $row["date"] . "</div>
              </div>";
        }
        echo "</div>";
    } else {
        echo "No data available.";
    }

    $conn->close();
    ?>
</body>
</html>
