<?php
include_once './config/database.php';
include_once '../config.php';


header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST,GET,PUT,DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");


$databaseService = new DatabaseService();
$conn = $databaseService->getConnection();
$requestMethod=$_SERVER["REQUEST_METHOD"];

function getMethod($conn){

   
        http_response_code(200);
        $query = 'SELECT * FROM content ORDER BY id desc';
        $stmt = $conn->prepare( $query );
        
        if($stmt->execute()){

            $responseData = array();
            $i=0;
            while($row = $stmt->fetch(PDO::FETCH_ASSOC)){
                array_push( $responseData, $row );
            }

            
            http_response_code(200);
            echo json_encode(array("message" => $responseData));
            exit();
        }
        else{
            http_response_code(400);
            echo json_encode(array("message" => "Something went wrong!"));
            exit();
        }


  

}

switch($requestMethod){
    case 'GET':     return getMethod($conn);
    default: 
        header("HTTP/1.0 405 Method Not Allowed");
        break;
}


















?>
