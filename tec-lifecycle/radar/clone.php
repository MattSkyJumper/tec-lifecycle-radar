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

$radarId = $_GET['radarId'];
$radarName = $_GET['radarName'];
//echo "radarId: " . $radarId . " new radar name: " . $radarName;

$config_ini = parse_ini_file("../conf/config.ini");
$dbconn = mysqli_connect($config_ini['host'], $config_ini['user'], $config_ini['pwd'], $config_ini['dbname']);
if (!$dbconn) {
  exit("DB-Connection error: " . mysqli_connect_error());
} else {
  //echo "DB Connection ok.<br>";
}

// escapen
$radarId = mysqli_real_escape_string($dbconn, $radarId);
$radarName = mysqli_real_escape_string($dbconn, $radarName);

$sql_radar_insert = "INSERT INTO RADAR(Name, FK_CATEGORY) SELECT '$radarName', FK_CATEGORY FROM RADAR WHERE ID='$radarId'";
$result = mysqli_query($dbconn, $sql_radar_insert) or die("Insert radar did not work: " . mysqli_error());
 
$sql = "SELECT LAST_INSERT_ID() as ID";
$result = mysqli_query($dbconn, $sql) or die("Select did not work: " . mysqli_error());

$radar_id_new = mysqli_fetch_object($result); 
$radar_new_id = $radar_id_new->ID;
 
$sql_radarelements_insert = "INSERT INTO RADARELEMENT(Name, Stage, Relevance, Xtend, Ytend, Description, FK_RADAR) SELECT Name, Stage, Relevance, Xtend, Ytend, Description, '$radar_new_id' FROM RADARELEMENT where FK_RADAR='$radarId'";
$result = mysqli_query($dbconn, $sql_radarelements_insert) or die("Insert radar elements did not work: " . mysqli_error());

echo json_encode($radar_id_new);

mysqli_close($dbconn);
?>
