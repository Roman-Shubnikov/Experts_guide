import React from 'react';
import {
    SimpleCell,
} from "@vkontakte/vkui"
import {
	Icon28StudOutline,
	Icon28PodcastOutline,
	Icon28LikeOutline,
	Icon28Square4Outline,
    Icon28ThumbsUpOutline,
    Icon28SongOutline,
} from '@vkontakte/icons'
import {
    BASE_LINKS_MENU,
} from "../config"
import CellMenu from './CellMenu';

const menu = [
    {
        title: 'Интерактив', 
        icon: Icon28StudOutline, 
        link: BASE_LINKS_MENU.interactive,
    },
    {
        title: 'Подкасты', 
        icon: Icon28PodcastOutline, 
        link: BASE_LINKS_MENU.podcasts,
    },
    {
        title: 'Полезный материал', 
        icon: Icon28LikeOutline, 
        link: BASE_LINKS_MENU.materials,
    },
    {
        title: 'Сюжеты', 
        icon: Icon28Square4Outline, 
        link: BASE_LINKS_MENU.plots,
    },
    {
        title: 'Музыкальные подборки', 
        icon: Icon28SongOutline,
        link: BASE_LINKS_MENU.music,
    },
]

const closedMenu = [
    {
        title: 'Дебаты', 
        icon: Icon28ThumbsUpOutline, 
    },
    
]
export default ({activeTopic}) => {
    const linksConstructor = (base_link) => {
		return base_link + activeTopic;
	}
    return(
            <>
            {menu.map((val, i) => 
                <CellMenu
                key={i} 
                Icon={val.icon}
                href={linksConstructor(val.link)}>
                    {val.title}
                </CellMenu>
            )}
            {closedMenu.map((Val, i) => (
                <SimpleCell
                key={Val.title}
                expandable
                disabled
                style={{opacity: '.4'}}
                before={<Val.icon />}>
                    {Val.title}
                </SimpleCell>
            ))}
            
            </>
    )

}