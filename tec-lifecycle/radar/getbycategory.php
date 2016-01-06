<?php

$catId = $_GET['catId'];
//echo "cat id: " . $catId;
//$db = connectToDb();
$config_ini = parse_ini_file("../conf/config.ini");
$dbconn = mysqli_connect($config_ini['host'], $config_ini['user'], $config_ini['pwd'], $config_ini['dbname']);
//$dbconn = mysqli_connect("db550253833.db.1and1.com", "dbo550253833", "ftbhlp_15", "db550253833");
if (!$dbconn) {
  exit("DB-Connection error: " . mysqli_connect_error());
} else {
  //echo "DB Connection ok.<br>";
}

$sql = "SELECT ID,Name FROM RADAR WHERE FK_CATEGORY='$catId'";
$result = mysqli_query($dbconn, $sql) or die("Select did not work: " . mysqli_error());

$dbcontentarray;
$dbidx = 0;

while ($row = mysqli_fetch_array($result, MYSQL_NUM)) { 
    $dbcontentarray[$dbidx] = array("id" => $row[0], "name" => $row[1]); 
    $dbidx += 1;
    //printf("ID: %s  Name: %s", $row[0], $row[1]);
}  

echo json_encode($dbcontentarray);

mysqli_close($dbconn);
?>
