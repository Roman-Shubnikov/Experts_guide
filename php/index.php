<?php

// error_reporting(E_ALL);
// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// mysqli_report(MYSQLI_REPORT_STRICT); 


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: POST, GET, DELETE, PUT, PATCH, OPTIONS');
	header('Access-Control-Allow-Headers: token, Content-Type');
	header('Access-Control-Max-Age: 1728000');
	header('Content-Length: 0');
	header('Content-Type: text/plain');
	die();
}
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

require("Utils/config.php");
require("Utils/Show.php");
require("Utils/AccessCheck.php");
require("Utils/FludControl.php");
require("Utils.php");
require('Utils/db.php');
require('vkapi.php');

// set_exception_handler('exceptionerror');

require('api/users.php');
require('api/achievements.php');
require('api/reports.php');

session_id($_GET['vk_user_id']);
session_start();


function exceptionerror($ex)
{
	// $code = $ex->getCode();
	// $msg = $ex->getMessage();

	// if ( $code == 0 ) $msg = CONFIG::ERRORS[0];
	// $data = [
	// 	'result' => false,
	// 	'error' => [
	// 		'code' => $code,
	// 		'message' => $msg
	// 	]
	// 	];
	Show::error(0);

	// $pretty = isset($data['debug']) ? JSON_PRETTY_PRINT : 0;
	// echo json_encode( $data, JSON_UNESCAPED_UNICODE | $pretty );
}
function offset_count(int &$offset, int &$count)
{
	if ($offset < 0) $offset = 0;
	if ($count < 0) $count = CONFIG::ITEMS_PER_PAGE;

	if ($count > CONFIG::MAX_ITEMS_COUNT) $count = CONFIG::MAX_ITEMS_COUNT;
}

new AccessCheck();
new FludControl();

$params = [
	// 'settings.get' => [
	// 	'parameters' => [ --- образец
	// 		'setting' => [
	// 			'type' => 'string',
	// 			'required' => true
	// 		]
	// 	],
	// 	'perms' => CONFIG::PERMISSIONS['user']
	// ],
	'account.get' => [
		'parameters' => [],
	],
	'experts.getInfo' => [
		'parameters' => [
			'user_ids' => [
				'type' => 'string',
				'required' => true,
			]
		],
	],
	'reports.getReasons' => [
		'parameters' => [],
	],
	'reports.send' => [
		'parameters' => [
			'vk_id' => [
				'type' => 'int',
				'required' => true,
			],
			'comment' => [
				'type' => 'string',
				'required' => true,
			],
			'reason' => [
				'type' => 'int',
				'required' => true,
			],
			'content' => [
				'type' => 'string',
				'required' => false,
				'default' => '',
			],
		],
	],
	'experts.getTop' => [
		'parameters' => [],
	],
];
$user_id = (int) $_GET['vk_user_id'];
$method = $_GET['method'];

$data = file_get_contents('php://input');
$data = json_decode($data, true);

if (!$data) {
	$data = $_POST;
}

if (!isset($params[$method])) {
	Show::error(405);
}
$data = Utils::checkParams($params[$method]['parameters'], $data);

$Connect = new DB();
if(CONFIG::DEV) $user_id = 526444378;
$users = new Users($user_id, $Connect);


function getBalance()
{
	global $Connect, $user_id;
	return $Connect->db_get("SELECT money FROM users WHERE vk_user_id=?", [$user_id])[0]['money'];
}
if(in_array($users->id, CONFIG::ADMINS)) {
	error_reporting(E_ALL);
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
}


switch ($method) {

	case 'account.get':
		$res = $users->getMy();
		$apiinfo = file_get_contents(CONFIG::API_EXPERTS_ADDRESS."/experts.getInfo?user_id={$user_id}&token=".CONFIG::API_EXPERTS_TOKEN);
		if(!$apiinfo) Show::error(10);
		$apiinfo = json_decode($apiinfo, true);
		if(empty($apiinfo)) Show::error(404);
		$res['expert_info'] = $apiinfo['items'][0];
		$achiev = new Achievements($Connect);
		$Connect->query("UPDATE users set actions=? WHERE vk_id=?", 
		[$res['expert_info']['info']['actions_count'], $user_id]);
		$res['achievements'] = $achiev->getAchievements($user_id);
		Show::response($res);

	case 'experts.getInfo':
		$users = $data['user_ids'];
		$apiinfo = file_get_contents(CONFIG::API_EXPERTS_ADDRESS."/experts.getInfo?user_id={$users}&token=".CONFIG::API_EXPERTS_TOKEN);
		if(!$apiinfo) Show::error(10);
		$apiinfo = json_decode($apiinfo, true);
		if(empty($apiinfo)) Show::error(404);
		$res = $apiinfo['items'];
		Show::response($res);

	case 'experts.getTop':
		$apiinfo = file_get_contents(CONFIG::API_EXPERTS_ADDRESS."/experts.getTop?token=".CONFIG::API_EXPERTS_TOKEN);
		if(!$apiinfo) Show::error(10);
		$apiinfo = json_decode($apiinfo, true);
		Show::response($apiinfo);
	
	case 'reports.getReasons':
		$reports = new Reports($Connect);
		Show::response($reports->getReasons()[1]);

	case 'reports.send':
		$vk_id = (int)$data['vk_id'];
		$comment = (string)$data['comment'];
		$reason = (int)$data['reason'];
		$content = (string)$data['content'];
		$reports = new Reports($Connect);
		Show::response($reports->send($user_id, $vk_id, $comment, $reason, $content));
}
