import React from 'react';
import {
    usePlatform,
    VKCOM,
    Group,
    Spacing,

} from "@vkontakte/vkui"
import {
	Icon28FireOutline,
	Icon28MoneyWadOutline,
	Icon28MarketOutline,
	Icon28WalletOutline,
	Icon28ArchiveOutline,
	Icon28ListOutline,
    Icon28MortarOutline,
} from '@vkontakte/icons'
import {
    GENERAL_LINKS, 
} from "../config"
import CellMenu from './CellMenu';

const menuBlocs = [
    {
        title: 'Об огне Прометея', 
        icon: Icon28FireOutline, 
        link: GENERAL_LINKS.prometeus,
        color: '#F15C44',
        separator: true,
    },
    {
        title: 'Баллы экспертов и магазин', 
        icon: Icon28MoneyWadOutline, 
        link: GENERAL_LINKS.scores,
        color: '#4BB34B',
    },
    {
        title: 'Магазин', 
        icon: Icon28MarketOutline, 
        link: GENERAL_LINKS.market,
        color: '#FFA000',
    },
    {
        title: 'Заказы', 
        icon: Icon28MortarOutline, 
        link: GENERAL_LINKS.orders,
        color: '#FFA000',
    },
    {
        title: 'Детализация счета', 
        icon: Icon28WalletOutline, 
        link: GENERAL_LINKS.billing,
        color: '#3888F1',
        separator: true,
    },
    {
        title: 'Предложить идею для справочника', 
        icon: Icon28ArchiveOutline, 
        link: GENERAL_LINKS.ideas_for_guide,
        color: '#76787A',
    },
    
]
const specialMenuNotVKCOM = [
    {
        title: 'Предложить тематику', 
        icon: Icon28ListOutline, 
        link: GENERAL_LINKS.ideas,
        color: '#7265FC',
    },
]

export default props => {
    const platform = usePlatform();
    const isVKCOM = platform === VKCOM;
    return(
        <Group>{
        menuBlocs.map((Val, i) => 
        <React.Fragment key={i}>
            <CellMenu
            href={Val.link}
            color={!isVKCOM ? Val.color : 'var(--accent)'}
            Icon={Val.icon}>
                {Val.title}
            </CellMenu>
            {Val.separator && isVKCOM && <Spacing separator />}
        </React.Fragment>)}
        {!isVKCOM && specialMenuNotVKCOM.map((Val, i) => 
        <CellMenu
        key={i}
        href={Val.link}
        color={Val.color}
        Icon={Val.icon}>
            {Val.title}
        </CellMenu>)
        }</Group>
    )
}