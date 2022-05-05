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
    Banner,

} from "@vkontakte/vkui"
import {
    Icon12Chevron,
    Icon28ListCheckOutline,
    Icon28StatisticsOutline,
    Icon28ArchiveOutline,
    Icon16Crown,
    Icon28Favorite,
} from '@vkontakte/icons';
import { ACTIONS_NORM, BASE_ARTICLE_TOPIC_LINK, TOPICS } from '../config';
import { getKeyByValue } from '../functions/tools';
import { Computer28 } from '../img/icons';


const Profile = props => {
    const { vkInfoUser, userInfo } = props; 
    const platform = usePlatform();
    const [mouseOndescr, setMouseOndescr] = useState(false);
    const isVKHOVER = !(platform === VKCOM)
    return(
        <Panel id={props.id}>
            {platform !== VKCOM && 
            <PanelHeader>Профиль</PanelHeader>}
            {platform !== VKCOM && <Group>
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
            </Group>}
            <Group>
                <Banner
                header='Мы обновили разделы'
                before={<Computer28 size={28}/>}
                subheader={'Теперь компьютерной версией заведуют новый интерфейс, а справ' +
                    'очник эксперта по прежнему можно посмотреть с мобильного устройства'}/>
            </Group>
            <Group>
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
            </Group>
        </Panel>
    )
}
Profile.propTypes = {
    achievements: PropTypes.array,
}
export {Profile};