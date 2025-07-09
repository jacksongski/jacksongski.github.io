<?php
$dbhost = "sql734.main-hosting.eu";
$dbuser = "u488779263_jacksongski";
$dbpass = "database4Gsk!";
$dbname = "u488779263_gliski";
	
//Connect to MySQL Server
$connection = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname);

if (mysqli_connect_errno()) {
    echo "Failed to connect to database: " . mysqli_connect_error();
    exit;
  }

//build query
$query = "SELECT * FROM ShellData";
$result = mysqli_query($connection, $query);
if (empty($result)) {
    printf("Something went wrong when querying the database.");
}
$all = mysqli_fetch_all($result);
$json = json_encode($all);
echo ($json);
mysqli_close($connection_mysql);
