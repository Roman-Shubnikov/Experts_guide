import React from 'react';

import {
	Icon28PaletteOutline,
    Icon28BasketballBallOutline,
    Icon28CameraOutline,
    Icon28MusicOutline,
    Icon28PlaneOutline,
    Icon28MovieReelOutline,
    Icon28Smiles2Outline,
    Icon28TshirtOutline,
    Icon28GameOutline,
    Icon28LaptopOutline,
    Icon28CancelCircleOutline,
    Icon28KeyboardOutline,
    Icon28BugOutline,
    Icon28DonateOutline,
    Icon28PincodeLockOutline,
    Icon28BoxHeartOutline,
    Icon28UserSquareOutline,
    Icon28MoneyWadOutline,
    Icon28BuildingOutline,
    Icon28WorkOutline,
    Icon28LocationMapOutline,
    Icon28WarningTriangleOutline,
    Icon28ReportOutline,
    Icon28BrainOutline,
    Icon28FavoriteOutline,
    Icon28CoinsOutline,
    Icon28FireOutline,
    Icon28EducationOutline,
    Icon28DiamondOutline,
    Icon28StorefrontOutline,
    Icon28LightbulbStarOutline,
    Icon28DiscountOutline,
    Icon28StarsOutline,
    Icon28StickerOutline,

} from '@vkontakte/icons'
import { It_28, Sience_28 } from './img/icons';
// import 
export const APP_ID = 7536939;
export const GROUP_EXPERTS_ID = 182611749;
export const GROUP_FAN_EXPERTS_ID = 206651170;
export const API_URL = 'https://xelene.ru/experts_guide/php/index.php?';
export const GENERAL_LINKS = {
    group_fan: 'https://vk.com/clubvkexperts',
    fan_website: 'https://vk.link/clubvkexperts',
    bingo_game: 'https://vk.com/wall-206651170?q=%23bingo',
    group_official_community: 'https://vk.com/write-182611749',
    group_official: 'https://vk.com/vkexperts',
    group_fan_community: 'https://vk.com/write-206651170',
    scores: 'https://vk.com/@vkexperts-shop-and-incentive-points',
    experts_card: 'https://vk.com/app7171491',
    market: 'https://vk.com/market-182611749',
    billing: 'https://vk.com/market?act=balance&owner_id=-182611749',
    prometeus: 'https://vk.com/@authors-prometheus',
    ideas: 'https://vk.com/topic-182611749_40299290',
    more_about_experts: 'https://vk.com/blog/themefeeds',
    ideas_for_guide: 'https://vk.com/topic-206651170_48189045',
    who_experts: 'https://vk.com/faq18060',
    theme_feed: 'https://vk.com/blog/themefeeds',
    orders: 'https://vk.com/market?act=orders&owner_id=-182611749',
    curators: 'https://vk.com/@clubvkexperts-kuratory',
    achievements: 'https://vk.com/topic-206651170_48253467',
    premoderation: 'https://vk.com/pages?oid=-206651170&p=Премодерация',
    expert_rules: 'https://vk.com/@vkexperts-rules',
    points: 'https://vk.com/@vkexperts-shop-and-incentive-points',
    feedback: 'https://vk.com/app5619682_-206651170#592988',
    info_expers: 'https://vk.com/@vkexperts-kto-takie-eksperty-vkontakte',
}
const WALL_SEARCH_BASE = 'https://vk.com/wall-206651170?q=%23'
export const BASE_LINKS_MENU = {
    reports_info: 'https://vk.com/clubvkexperts?w=wall-206651170_191',
    achievements: 'https://vk.com/@clubvkexperts-achievements',
    news: WALL_SEARCH_BASE + 'news',
    updates: WALL_SEARCH_BASE + 'update',
    interactive: WALL_SEARCH_BASE + 'interactive_',
    podcasts: WALL_SEARCH_BASE + 'podcast_',
    materials: WALL_SEARCH_BASE + 'material_',
    plots: WALL_SEARCH_BASE + 'plots_',
    music: WALL_SEARCH_BASE + 'compilation_',
}
export const TOPICS = {
    style: 'Стиль',
    sport: 'Спорт',
    art: 'Арт',
    humor: 'Юмор',
    it: 'IT',
    games: 'Игры',
    music: 'Музыка',
    cinema: 'Кино',
    science: 'Наука',
    photo: 'Фото',
    tourism: 'Туризм',
    // all: 'Все тематики',
}

export const chatLinks = {
    it: 'https://vk.me/join/AJQ1d1bzRhbFR/gROKii0Ezb',
    art: 'https://vk.me/join/AJQ1d0RsHBYCRIR_PrZwO3PJ',
    games: 'https://vk.cc/aaKiHP',
    cinema: 'https://vk.me/join/AJQ1d1fmExYQcbY1Ia5AVpJq',
    music: 'https://vk.me/join/AJQ1dzCvFRYKud924/6tMx82',
    science: 'https://vk.me/join/AJQ1d90MORbY0Se9Ihv1hiRy',
    sport : 'https://vk.me/join/AJQ1d_cTNBbIacntLjA9voly',
    style: 'https://vk.me/join/AJQ1d_vtEhbpMd517XkoHstY',
    tourism: 'https://vk.me/join/AJQ1d6ZHGxYiLKjYpj60/Zre',
    photo: 'https://vk.me/join/AJQ1dzgdChY/3pP6bMVkwOvm',
    humor: 'https://vk.me/join/AJQ1d2UFNRbztL2NrVDP/33/',
}

export const BASE_ARTICLE_TOPIC_LINK = 'https://vk.com/@clubvkexperts-';
export const TOPIC_LINKS_PHOTOS_PATH = process.env.PUBLIC_URL + '/img/photos_links'
export const ACTIONS_NORM = 700;

export const ICON_TOPICS = [
    {icon: Icon28PaletteOutline, topic: 'Арт', color: '#FF3347'},
    {icon: Icon28BasketballBallOutline, topic: 'Спорт', color: '#FFA000'},
    {icon: It_28, topic: 'IT', color: '#3F8AE0'},
    {icon: Icon28CameraOutline, topic: 'Фото', color: '#3F8AE0'},
    {icon: Icon28MusicOutline, topic: 'Музыка', color: '#AA65F0'},
    {icon: Icon28PlaneOutline, topic: 'Туризм', color: '#FF3347'},
    {icon: Icon28MovieReelOutline, topic: 'Кино', color: '#76787A'},
    {icon: Icon28Smiles2Outline, topic: 'Юмор', color: '#FFA000'},
    {icon: Icon28TshirtOutline, topic: 'Стиль', color: '#3F8AE0'},
    {icon: Icon28GameOutline, topic: 'Игры', color: '#4BB34B'},
    {icon: Sience_28, topic: 'Наука', color: '#76787A'},
]

export const SCORE_POSITION_COLORS = [
    '#FFD54F',
    '#B0BEC5',
    '#FFA726',
]

export const GROUP_DESCRIPTIONS = {
    pc: {
        fun: <span>Неофициальное сообщество, где активисты рассказывать что-то
        новое для экспертов о контент-индустрии и тематических лентах.</span>,

    official: <span>
            Вступите в ряды экспертов ВКонтакте и отмечайте лучшие публикации
			своей тематической ленты.
        </span>
    },
    mobile: {
        fun: 'На страже оригинального контента',
        official: '',
    }
}
export const ENUMERATE_VARIANTS = {
    posts: ['пост', 'поста', 'постов'],
}
export const CURATOR_PATTERN = 'Куратор тематики ';
export const ARTICLE_IMAGE = TOPIC_LINKS_PHOTOS_PATH + '/article.png'
export const TOPICS_LINKS = {
    it: [
        {
            title: 'кринжологи VK • hype talks', 
            descr: 'Неофициальная беседа', 
            link: 'https://vk.me/join/AJQ1d0g9Hhh_mY/eO9YWiVtn',
            img: TOPIC_LINKS_PHOTOS_PATH + '/chat.jpg',
            text_button: 'Открыть',
        },
        {
            title: 'Правила оценки постов', 
            descr: 'Статья', 
            link: 'https://vk.com/@keksperts-it-guide',
            img: TOPIC_LINKS_PHOTOS_PATH + '/',
            isArticle: true,
        },
    ],
    art: [
        {
            title: 'Эксперты: Арт', 
            descr: 'Неофициальное сообщество', 
            link: 'https://vk.com/club190570695',
            img: TOPIC_LINKS_PHOTOS_PATH + '/art_comm.jpg',
            text_button: 'Перейти',
        },
        {
            title: 'Вопросы и ответы', 
            descr: 'Статья', 
            link: 'https://vk.com/@vkexpertsart-voprosy-i-otvety',
            img: TOPIC_LINKS_PHOTOS_PATH + '/',
            isArticle: true,
        },
        {
            title: 'Правила оценки', 
            descr: 'Статья', 
            link: 'https://vk.com/@vkexpertsart-pravila-ocenki',
            img: TOPIC_LINKS_PHOTOS_PATH + '/',
            isArticle: true,
        },
    ],
    games: [
        {
            title: 'Эксперты: Игры', 
            descr: 'Неофициальное сообщество', 
            link: 'https://vk.com/gameexperts',
            img: TOPIC_LINKS_PHOTOS_PATH + '/games_comm.jpg',
            text_button: 'Перейти',
        },
        {
            title: 'F.A.Q.', 
            descr: 'Статья', 
            link: 'https://vk.com/@gameexperts-faq-game',
            img: TOPIC_LINKS_PHOTOS_PATH + '/',
            isArticle: true,
        },
    ],
    cinema: [],
    music: [
        {
            title: 'Эксперты VK | Музыка', 
            descr: 'Неофициальное сообщество', 
            link: 'https://vk.com/exp_muz',
            img: TOPIC_LINKS_PHOTOS_PATH + '/music_comm.jpg',
            text_button: 'Перейти',
        },
        {
            title: 'Рекомендации к оцениванию публикаций', 
            descr: 'Статья', 
            link: 'https://vk.com/@exp_muz-gide',
            img: TOPIC_LINKS_PHOTOS_PATH + '/',
            isArticle: true,
        },
    ],
    science: [],
    sport : [
        {
            title: 'Советы по оцениваю постов', 
            descr: 'Статья', 
            link: 'https://vk.com/@dyumiin-faqforsport',
            img: TOPIC_LINKS_PHOTOS_PATH + '/',
            isArticle: true,
        },
    ],
    style: [
        {
            title: '«Сломанная лапка, ожерелье, диадема»', 
            descr: 'Статья', 
            link: 'https://vk.com/@sevochika-statya-dlya-experta-stilya',
            img: TOPIC_LINKS_PHOTOS_PATH + '/',
            isArticle: true,
        },
    ],
    tourism: [],
    photo: [
        {
            title: 'Гайд по фотоленте', 
            descr: 'Статья', 
            link: 'https://vk.com/@efrektal-gaid-po-fotolente',
            img: TOPIC_LINKS_PHOTOS_PATH + '/',
            isArticle: true,
        },
        {
            title: 'Эфректал', 
            descr: 'Неофициальное сообщество', 
            link: 'https://vk.com/efrektal',
            img: TOPIC_LINKS_PHOTOS_PATH + '/photo_comm.jpg',
            text_button: 'Перейти',
        },
        {
            title: 'Эфректалчат', 
            descr: 'Неофициальная беседа',
            link: 'https://vk.me/join/AJQ1dw5R7hfduzzBmioax07a',
            img: TOPIC_LINKS_PHOTOS_PATH + '/photo_chat.jpg',
            text_button: 'Открыть',
        },
    ],
    humor: [
        {
            title: 'Юмористическое шоу «ВКонтакте.ру»', 
            descr: 'Статья', 
            link: 'https://vk.com/@keksperts-humor-guide',
            img: TOPIC_LINKS_PHOTOS_PATH + '/',
            isArticle: true,
        },
        {
            title: 'кринжологи VK • hype talks', 
            descr: 'Неофициальная беседа',
            link: 'https://vk.me/join/AJQ1d0g9Hhh_mY/eO9YWiVtn',
            img: TOPIC_LINKS_PHOTOS_PATH + '/chat.jpg',
            text_button: 'Открыть',
        },
    ],
}
export const ExpertsIcons28 = {
    0: Icon28CancelCircleOutline,
    1: Icon28BoxHeartOutline,
    2: Icon28KeyboardOutline,
    3: Icon28BuildingOutline,
    4: Icon28LocationMapOutline,
    5: Icon28UserSquareOutline,
    6: Icon28BugOutline,
    7: Icon28DonateOutline,
    8: Icon28MoneyWadOutline,
    9: Icon28LaptopOutline,
    10: Icon28PincodeLockOutline,
    11: Icon28WorkOutline,
    12: Icon28WarningTriangleOutline,
    13: Icon28ReportOutline,
    14: Icon28BrainOutline,
    15: Icon28FavoriteOutline,
    16: Icon28CoinsOutline,
    17: Icon28FireOutline,
    18: Icon28EducationOutline,
    19: Icon28DiamondOutline,
    20: Icon28StorefrontOutline,
    21: Icon28LightbulbStarOutline,
    22: Icon28DiscountOutline,
    23: Icon28StarsOutline,
    24: Icon28StickerOutline,
}
export const TOPIC_ICONS_PATH = process.env.PUBLIC_URL + '/img/topics'
export const PERMISSIONS = {
    expert: 0,
    moderator: 1,
    activist: 2,
    admin: 20,
};