<?php
/*
Copyright 2015 Matthias Wittum

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed 
on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for 
the specific language governing permissions and limitations under the License. 
*/

$json = file_get_contents('php://input'); 
$obj = json_decode($json, TRUE);
$radarname = $obj["name"];
$radarcatfk = $obj["categoryId"];

$config_ini = parse_ini_file("../conf/config.ini");
$dbconn = mysqli_connect($config_ini['host'], $config_ini['user'], $config_ini['pwd'], $config_ini['dbname']);
if (!$dbconn) {
  exit("DB-Connection error: " . mysqli_connect_error());
} else {
  //  echo "DB Connection ok.<br>";
}

// escapen
$radarname = mysqli_real_escape_string($dbconn, $radarname);
$radarcatfk = mysqli_real_escape_string($dbconn, $radarcatfk);

$insert_sql = "INSERT INTO RADAR ( Name, FK_CATEGORY ) VALUES ( '$radarname', '$radarcatfk' );";
$resultOfInsert = mysqli_query($dbconn, $insert_sql) or die("Insert did not work: " . mysqli_error($dbconn));

$sql = "SELECT * FROM RADAR WHERE Name='$radarname'";
$result = mysqli_query($dbconn, $sql) or die("Select did not work: " . mysqli_error($dbconn));

$radarentry = mysqli_fetch_object($result); 

echo json_encode($radarentry);

mysqli_close($dbconn);
?>
