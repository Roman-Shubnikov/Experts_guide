import React, { useState } from 'react';
import PropTypes from 'prop-types'
import { 
    Panel,
    Group,
    usePlatform,
    VKCOM,
    PanelHeader,
    SimpleCell,
    RichCell,
    Spacing,
    PanelHeaderBack,

} from "@vkontakte/vkui"
import {
    Icon12Chevron,
    Icon28ListCheckOutline,
    Icon28StatisticsOutline,
    Icon28ArchiveOutline,
    Icon16Crown,
    Icon28Favorite,
	Icon28NameTagOutline,
	Icon28MoneyWadOutline,
	Icon28StorefrontOutline,
	Icon28InboxOutline,
	Icon28WalletOutline,
	Icon28MessagesOutline,
	Icon28LogoVkOutline,
} from '@vkontakte/icons';
import { ACTIONS_NORM, BASE_ARTICLE_TOPIC_LINK, GENERAL_LINKS, TOPICS } from '../config';
import { getKeyByValue } from '../functions/tools';


const Profile = props => {
    const { vkInfoUser, userInfo } = props; 
    const platform = usePlatform();
    const [mouseOndescr, setMouseOndescr] = useState(false);
    const isVKHOVER = !(platform === VKCOM)
    return(
        <Panel id={props.id}>
            <PanelHeader
            before={<PanelHeaderBack onClick={() => window.history.back()} />}
            >Профиль</PanelHeader>
            <Group>
                <RichCell
                hasActive={isVKHOVER}
                hasHover={isVKHOVER}
                href={BASE_ARTICLE_TOPIC_LINK + getKeyByValue(TOPICS, userInfo.topic_name)}
                target="_blank" rel="noopener noreferrer"
                onMouseEnter={() => setMouseOndescr(true)} 
                onMouseLeave={() => setMouseOndescr(false)}
                caption={<div 
                        style={{display:'flex'}}>
                            Подробнее о тематике <Icon12Chevron className='profile-chevron' style={mouseOndescr ? { transform: 'translateX(2px)'} : {}} />
                        </div>}
                before={<Icon28Favorite width={56} height={56} style={{color: userInfo.actions_current_week >= ACTIONS_NORM ? '#FFB230' : '#CCD0D6', marginRight: 12}} />}>
                    <div style={{display: 'flex'}}>
                        {`${vkInfoUser.first_name} ${vkInfoUser.last_name}`} {userInfo.is_best && <Icon16Crown className='crown crown_profile' />}
                    </div>
                    
                </RichCell>
                <SimpleCell
                disabled
                after={userInfo.actions_current_day}
                before={<Icon28StatisticsOutline />}
                >
                    За сегодня
                </SimpleCell>
                <Spacing separator={true} />
                <SimpleCell
                disabled
                after={userInfo.actions_current_week}
                before={<Icon28ListCheckOutline />}
                >
                    За неделю
                </SimpleCell>
                <SimpleCell
                disabled
                after={userInfo.actions_previous_week}
                before={<Icon28ListCheckOutline />}
                >
                    За прошлую неделю
                </SimpleCell>
                <SimpleCell
                disabled
                after={userInfo.actions_current_month}
                before={<Icon28ListCheckOutline />}
                >
                    За месяц
                </SimpleCell>
                <Spacing separator={true} />
                <SimpleCell
                disabled
                after={userInfo.actions_count}
                before={<Icon28ArchiveOutline />}
                >
                    За все время
                </SimpleCell>
                <Spacing separator={true} />
                <SimpleCell 
                href={GENERAL_LINKS.info_expers}
                target="_blank" rel="noopener noreferrer"
                before={<Icon28NameTagOutline />}>
                    Информация
                </SimpleCell>
                <SimpleCell 
                href={GENERAL_LINKS.expert_rules}
                target="_blank" rel="noopener noreferrer"
                before={<Icon28LogoVkOutline />}>
                    Правила программы
                </SimpleCell>
                <Spacing separator />
                <SimpleCell 
                href={GENERAL_LINKS.points}
                target="_blank" rel="noopener noreferrer"
                before={<Icon28MoneyWadOutline />}>
                    Баллы экспертов
                </SimpleCell>
                <SimpleCell 
                href={GENERAL_LINKS.market}
                target="_blank" rel="noopener noreferrer"
                before={<Icon28StorefrontOutline />}>
                    Магазин
                </SimpleCell>
                <SimpleCell 
                href={GENERAL_LINKS.orders}
                target="_blank" rel="noopener noreferrer"
                before={<Icon28InboxOutline />}>
                    Заказы
                </SimpleCell>
                <SimpleCell 
                href={GENERAL_LINKS.billing}
                target="_blank" rel="noopener noreferrer"
                before={<Icon28WalletOutline />}>
                    Детализация счёта
                </SimpleCell>
                <Spacing separator />
                <SimpleCell 
                href={GENERAL_LINKS.feedback}
                target="_blank" rel="noopener noreferrer"
                before={<Icon28MessagesOutline />}>
                    Обратная связь
                </SimpleCell>
            </Group>
        </Panel>
    )
}
Profile.propTypes = {
    achievements: PropTypes.array,
}
export {Profile};