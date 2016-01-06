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

error_log("Adding Element");

$json = file_get_contents('php://input'); 
$obj = json_decode($json, TRUE);
$elementname = $obj["name"];
$elementstage = $obj["stage"];
$elementrelevance = $obj["relevance"];
$elementxtend = $obj["xtend"];
$elementytend = $obj["ytend"];
$elementdesc = $obj["desc"];
$elementtecradarid = $obj["tecradarid"];
$elementcategoryid = $obj["categoryid"];

// store results in db
$config_ini = parse_ini_file("../conf/config.ini");
$dbconn = mysqli_connect($config_ini['host'], $config_ini['user'], $config_ini['pwd'], $config_ini['dbname']);
if (!$dbconn) {
  exit("DB-Connection error: " . mysqli_connect_error($dbconn));
} else {
  //echo "DB Connection ok.<br>";
}

// escapen
$elementname = mysqli_real_escape_string($dbconn, $elementname);
$elementstage = mysqli_real_escape_string($dbconn, $elementstage);
$elementrelevance = mysqli_real_escape_string($dbconn, $elementrelevance);
$elementxtend = mysqli_real_escape_string($dbconn, $elementxtend);
$elementytend = mysqli_real_escape_string($dbconn, $elementytend);
$elementdesc = mysqli_real_escape_string($dbconn, $elementdesc);
$elementtecradarid = mysqli_real_escape_string($dbconn, $elementtecradarid);
$elementcategoryid = mysqli_real_escape_string($dbconn, $elementcategoryid);

$insert_sql = "INSERT INTO RADARELEMENT
        ( Name, Stage, Relevance, Xtend, Ytend, Description, FK_RADAR )
        VALUES
        ( '$elementname', '$elementstage', '$elementrelevance', '$elementxtend', '$elementytend', '$elementdesc', '$elementtecradarid' );";
$resultOfInsert = mysqli_query($dbconn, $insert_sql) or die("Insert did not work: " . mysqli_error($dbconn));


error_log($resultOfInsert);

$sql = "SELECT LAST_INSERT_ID() as ID";
$result = mysqli_query($dbconn, $sql) or die("Select did not work: " . mysqli_error());

$radarelemententry;

$radarelemententry = mysqli_fetch_object($result); 

echo json_encode($radarelemententry);

// add element to global list if not available
$check_sql = "SELECT 1 FROM ELEMENT_NAMES WHERE UPPER(Name)=UPPER('$elementname')";
$resultOfCheck = mysqli_query($dbconn, $check_sql) or die("Check did not work: " . mysqli_error());

$resultOne = mysqli_fetch_object($resultOfCheck);

if (is_null($resultOne)) {
   $insert2_sql = "INSERT INTO ELEMENT_NAMES(Name, FK_CATEGORY) VALUES ('$elementname', '$elementcategoryid')";
   $resultOfInsert2 = mysqli_query($dbconn, $insert2_sql) or die("Insert2 did not work: " . mysqli_error());
}
                  
mysqli_close($dbconn);
?>
