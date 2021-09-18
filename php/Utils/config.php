<?php

ini_set( 'date.timezone', 'UTC' ); // Время по гринвичу

class CONFIG {
	const DB_HOST = '188.225.45.112';
	const DB_NAME = 'experts_guide';
	const DB_USER = 'jedi';
	const DB_PASS = 'RTJ2fa2041';
	const DEV = false;
	
	const ONLINE_TIME = 300;
	
	const ITEMS_PER_PAGE = 100; // Количество элементов на одной странице
	const MAX_ITEMS_COUNT = 30;
	const MAX_REPORTS_NOT_MODERATE = 5;
	

	const ACHIEV_PATH = 'https://xelene.ru/road/php/img/achievements';
	const LINK_APP = 'https://vk.com/jedi_road_app';
	const API_EXPERTS_ADDRESS = 'https://c3po.ru/api';
	const API_EXPERTS_TOKEN = '9h3d83h8r8ehe9xehd93u';


	const APP_ID = 7409818;
	const SECRET_KEY = 'oArcb3ehkuKVix2VIhrL';
	const VK_APP_TOKEN = '9f78d3779f78d3779f78d377329f01c15b99f789f78d377fe5c37549faf71fee285ecfb';
	
	const FLOOD_CONTROL = 25;
	const FLOOD_CONTROL_BAN = 60;
	const MAX_TEXT_LENGTH = 2000;
	const MIN_TEXT_LENGTH = 6;


	const REGEXP_VALID_NAME = "/^[a-zа-яё0-9_ ]*$/ui";
	const REGEXP_VALID_TEXT = "/^[a-zа-яё0-9_ \.,\"':!?+=\-\/]*$/ui";
	const REGEXP_VALID_HEX_COLOR = "/^#[a-z0-9]{3,6}$/ui";

	const TIMES = [
		'month' => 2592000
	];

	const ADMINS = [
		526444378,
		413636725,
	];
	
	const ERRORS = [

		// System
		0 => 'Неизвестная ошибка.',
		1 => 'Не переданы необходимые параметры.',
		2 => 'Один или несколько из переданных параметров имеют неверный тип.',
		3 => 'Вы превысили лимит запросов и заблокированы на 60 секунд.',
		4 => 'Неверные параметры запуска.',
		5 => 'Ваш аккаунт заблокирован :-(.',
		6 => 'Ошибка работы с базой. Попробуйте позже.',
		7 => 'У пользователя уже есть активная блокировка.',
		8 => 'Строка поиcка не может быть пустой',
		9 => 'Неизвестное значение параметра',
		10 => 'Ошибка интерфейса',

		//Reports
		100 => 'Текст соддержит недопустимые символы',
		101 => 'Вы привысили лимит подачи жалоб ('. CONFIG::MAX_REPORTS_NOT_MODERATE .'), дождитесь их рассмотрения',
		102 => 'Неизвестная причяина жалобы',
		103 => 'Недопустимая длина контента (не более'.CONFIG::MAX_TEXT_LENGTH.' и не менее '.CONFIG::MIN_TEXT_LENGTH.')',

		// Server

		403 => 'Доступ запрещен.',
		404 => 'Объект не найден.',
		405 => 'Метод не найден.',
	];
}

