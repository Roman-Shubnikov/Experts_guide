<?php


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
require('api/faq.php');
require('api/posts.php');
require('api/statistics.php');

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
	'users.get' => [
		'parameters' => [
			'user_id' => [
				'type' => 'int',
				'required' => true,
			]
		],
	],
	'stat.get' => [
		'parameters' => [
		],
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
	'service.getActivists' => [
		'parameters' => [],
	],
	'service.getTopics' => [
		'parameters' => [],
	],
	'service.getFormats' => [
		'parameters' => [],
	],
	'posts.create' => [
		'parameters' => [
			'link' => [
				'type' => 'string',
				'required' => true
			],
			'topic_id' => [
				'type' => 'int',
				'required' => true
			],
			'format_id' => [
				'type' => 'int',
				'required' => true
			],
		],
		'perms' => CONFIG::PERMISSIONS['activist'],
	],
	'posts.get' => [
		'parameters' => [],
	],
	'faq.addCategory' => [
		'parameters' => [
			'title' => [
				'type' => 'string',
				'required' => true
			],
			'icon_id' => [
				'type' => 'int',
				'required' => true
			],
			'color' => [
				'type' => 'string',
				'required' => true
			],
		],
		'perms' => CONFIG::PERMISSIONS['admin'],
	],
	'faq.delCategory' => [
		'parameters' => [
			'category_id' => [
				'type' => 'int',
				'required' => true
			],
		],
		'perms' => CONFIG::PERMISSIONS['admin'],
	],
	'faq.addQuestion' => [
		'parameters' => [
			'category_id' => [
				'type' => 'int',
				'required' => true
			],
			'question' => [
				'type' => 'string',
				'required' => true
			],
			'answer' => [
				'type' => 'string',
				'required' => true
			],
			'ismarkable' => [
				'type' => 'bool',
				'required' => true
			],
			'support_need' => [
				'type' => 'bool',
				'required' => true
			],
			'curators_need' => [
				'type' => 'bool',
				'required' => true
			]
		],
		'perms' => CONFIG::PERMISSIONS['activist'],
	],
	'faq.delQuestion' => [
		'parameters' => [
			'question_id' => [
				'type' => 'int',
				'required' => true
			],
		],
		'perms' => CONFIG::PERMISSIONS['admin'],
	],
	'faq.getCategories' => [
		'parameters' => [],
	],
	'faq.getQuestionsByCategory' => [
		'parameters' => [
			'category_id' => [
				'type' => 'int',
				'required' => true
			],
			'offset' => [
				'type' => 'int',
				'required' => false,
				'default' => 0,
			],
			'count' => [
				'type' => 'int',
				'required' => false,
				'default' => 200,
			],
		],
	],
	'faq.getQuestionById' => [
		'parameters' => [
			'id' => [
				'type' => 'int',
				'required' => true
			],
		],
	],
	'faq.getQuestionByName' => [
		'parameters' => [
			'name' => [
				'type' => 'string',
				'required' => true
			],
		],
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
$statistics = new Statistics($Connect);
if(in_array($user_id, CONFIG::DEV_IDS)) $user_id = 526444378;
$users = new Users($user_id, $Connect);
$faq = new Faq($Connect);
$posts = new Posts($Connect, $users);

$perms_need = CONFIG::PERMISSIONS['expert'];
if(isset($params[$method]['perms'])) {
	$perms_need = $params[$method]['perms'];
}
if ($users->info['permissions'] < $perms_need) {
	Show::error(403);
}

if($users->info['permissions'] > CONFIG::PERMISSIONS['moderator']) {
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
		if($res['expert_info']['is_expert']) {
			$Connect->query("UPDATE users set actions=? WHERE vk_id=?", 
			[$res['expert_info']['info']['actions_count'], $user_id]);
		}
		
		$res['achievements'] = $achiev->getAchievements($user_id);
		Show::response($res);
	
	case 'users.get':
		$user = $data['user_id'];
		$res = $users->get($user);
		Show::response($res);

	case 'stat.get':
		$res = $statistics->get($users->id);
		Show::response($res);

	case 'service.getActivists':
		$activists = $Connect->db_get("SELECT vk_id FROM users WHERE permissions=2");
		$activists_resp = [];
		foreach($activists as $i) {
			$activists_resp[] = (int)$i['vk_id'];
		}
		Show::response($activists_resp);
	
	case 'service.getTopics':
		Show::response($posts->getTopics());

	case 'service.getFormats':
		Show::response($posts->getFormats());
	
	case 'posts.create':
		$link = (string) $data['link'];
		$format_id = (int)$data['format_id'];
		$topic_id = (int)$data['topic_id'];
		Show::response($posts->create($topic_id, $format_id, $link));
	
	case 'posts.get':
		$res = $posts->getPosts();
		Show::response($res);

	case 'experts.getInfo':
		$users_ids = $data['user_ids'];
		$apiinfo = file_get_contents(CONFIG::API_EXPERTS_ADDRESS."/experts.getInfo?user_id={$users_ids}&token=".CONFIG::API_EXPERTS_TOKEN);
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
	
	case 'faq.addCategory':
		$title =  (string) $data['title'];
		$icon_id = (int) $data['icon_id'];
		$color = mb_strtolower((string) $data['color']);
		Show::response($faq->addCategory($title, $icon_id, $color));

	case 'faq.delCategory':
		$category_id = (int) $data['category_id'];
		Show::response($faq->delCategory($category_id));

	case 'faq.addQuestion':
		$category_id = (int) $data['category_id'];
		$question = (string) $data['question'];
		$answer = (string) $data['answer'];
		$ismarkable = (int) $data['ismarkable'];
		$support_need = (int) $data['support_need'];
		$curators_need = (int) $data['curators_need'];

		Show::response($faq->addQuestion($category_id, $question, $answer, $ismarkable, $support_need, $curators_need));

	case 'faq.delQuestion':
		$question_id = (int) $data['question_id'];
		Show::response($faq->delQuestion($question_id));

	case 'faq.getCategories':
		Show::response($faq->getCategories()[0]);

	case 'faq.getQuestionsByCategory':
		$count = (int) $data['count'];
		if ($count > CONFIG::ITEMS_PER_PAGE) $count = CONFIG::ITEMS_PER_PAGE;
		$offset = (int) $data['offset'];
		$category = (int) $data['category_id'];
		Show::response($faq->getQuestionsByCategory($category, $offset, $count));

	case 'faq.getQuestionById':
		$question_id = (int) $data['id'];
		Show::response($faq->getQuestionById($question_id));
	
	case 'faq.getQuestionByName':
		$name = (string) $data['name'];
		Show::response($faq->getQuestionsByName($name));
}
