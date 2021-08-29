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
    Icon28AccessibilityOutline,
    Icon28LaptopOutline,
} from '@vkontakte/icons'

export const GROUP_EXPERTS_ID = 182611749;
export const GROUP_FAN_EXPERTS_ID = 206651170;

export const GENERAL_LINKS = {
    group_fan: 'https://vk.com/clubvkexperts',
    group_official_community: 'https://vk.me/vkexperts',
    group_fan_community: 'https://vk.me/clubvkexperts',
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
}

export const BASE_LINKS_MENU = {
    interactive: 'https://vk.com/wall-206651170?q=%23interactive.',
    podcasts: 'https://vk.com/wall-206651170?q=%23podcast.',
    materials: 'https://vk.com/wall-206651170?q=%23material.',
    plots: 'https://vk.com/wall-206651170?q=%23plots.',
    music: 'https://vk.com/wall-206651170?q=%23compilation.',
    suffix: '%40clubvkexperts',
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
}

export const BASE_ARTICLE_TOPIC_LINK = 'https://vk.com/@clubvkexperts-';
export const ACTIONS_NORM = 700;

export const ICON_TOPICS = [
    {icon: Icon28PaletteOutline, topic: 'Арт', color: '#FF3347'},
    {icon: Icon28BasketballBallOutline, topic: 'Спорт', color: '#FFA000'},
    {icon: Icon28LaptopOutline, topic: 'IT', color: '#3F8AE0'},
    {icon: Icon28CameraOutline, topic: 'Фото', color: '#3F8AE0'},
    {icon: Icon28MusicOutline, topic: 'Музыка', color: '#AA65F0'},
    {icon: Icon28PlaneOutline, topic: 'Туризм', color: '#FF3347'},
    {icon: Icon28MovieReelOutline, topic: 'Кино', color: '#76787A'},
    {icon: Icon28Smiles2Outline, topic: 'Юмор', color: '#FFA000'},
    {icon: Icon28TshirtOutline, topic: 'Стиль', color: '#3F8AE0'},
    {icon: Icon28GameOutline, topic: 'Игры', color: '#4BB34B'},
    {icon: Icon28AccessibilityOutline, topic: 'Наука', color: '#76787A'},
]

export const SCORE_POSITION_COLORS = [
    '#FFD54F',
    '#B0BEC5',
    '#FFA726',
]

export const GROUP_DESCRIPTIONS = {
    pc: {
        fun: <span>Закрытый неофициальный клуб экспертов ВКонтакте. Здесь
        происходит вся магия: мы публикуем информационный контент
        для экспертов, чтобы улучшить ценность контент-индустрии
        курируемой тематической ленты.</span>,

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