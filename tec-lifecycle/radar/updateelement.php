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
$elementid = $obj["id"];
$elementname = $obj["name"];
$elementstage = $obj["stage"];
$elementrelevance = $obj["relevance"];
$elementxtend = $obj["xtend"];
$elementytend = $obj["ytend"];
$elementdesc = $obj["desc"];
$elementtecradarid = $obj["tecradarid"];
$elementcategoryid = $obj["categoryid"];

$config_ini = parse_ini_file("../conf/config.ini");
$dbconn = mysqli_connect($config_ini['host'], $config_ini['user'], $config_ini['pwd'], $config_ini['dbname']);
if (!$dbconn) {
  exit("DB-Connection error: " . mysqli_connect_error());
} else {
  //echo "DB Connection ok.<br>";
}

// escapen
$elementid = mysqli_real_escape_string($dbconn, $elementid);
$elementname = mysqli_real_escape_string($dbconn, $elementname);
$elementstage = mysqli_real_escape_string($dbconn, $elementstage);
$elementrelevance = mysqli_real_escape_string($dbconn, $elementrelevance);
$elementxtend = mysqli_real_escape_string($dbconn, $elementxtend);
$elementytend = mysqli_real_escape_string($dbconn, $elementytend);
$elementdesc = mysqli_real_escape_string($dbconn, $elementdesc);
$elementtecradarid = mysqli_real_escape_string($dbconn, $elementtecradarid);
$elementcategoryid = mysqli_real_escape_string($dbconn, $elementcategoryid);

$update_sql = "UPDATE RADARELEMENT SET Name='$elementname', Stage='$elementstage', Relevance='$elementrelevance', Xtend='$elementxtend', Ytend='$elementytend', Description='$elementdesc' WHERE ID='$elementid';";
$resultOfInsert = mysqli_query($dbconn, $update_sql) or die("Update did not work: " . mysqli_error());


$sql = "SELECT ID from RADARELEMENT WHERE ID='$elementid'";
$result = mysqli_query($dbconn, $sql) or die("Select did not work: " . mysqli_error());

$radarelemententry = mysqli_fetch_object($result); 

echo json_encode($radarelemententry);

mysqli_close($dbconn);
?>
