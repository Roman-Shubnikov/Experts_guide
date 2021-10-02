import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'
import { 
    Panel,
    Group,
    Placeholder,
    usePlatform,
    VKCOM,
    PanelHeader,
    Header,
    Avatar,
    PanelSpinner,
    Div,
    Tooltip,
    Tappable,
    SimpleCell,
    RichCell,
    Progress,
    Spacing,
    Footer,
    useAppearance,

} from "@vkontakte/vkui"
import {
    Icon12Chevron,
    Icon28ListCheckOutline,
    Icon28StatisticsOutline,
    Icon28ArchiveOutline,
    Icon16Crown,

} from '@vkontakte/icons';
import { ACTIONS_NORM, BASE_ARTICLE_TOPIC_LINK, TOPICS } from '../config';
import { enumerate, getKeyByValue } from '../functions/tools';
const Achievements = props => {
    const { achievements, vkInfoUser, userInfo } = props; 
    const platform = usePlatform();
    const appearence = useAppearance();
    const [tooltipShow, setToolTipState] = useState(false);
    const [actsWeekReal, setActsWeekReal] = useState(0);
    const [mouseOndescr, setMouseOndescr] = useState(false);
    const isVKHOVER = !(platform === VKCOM)
    useEffect(() => {
        setTimeout(() => {
            setActsWeekReal(userInfo.actions_current_week)
        }, 1000)
    }, [userInfo.actions_current_week])
    return(
        <Panel id={props.id}>
            {platform !== VKCOM && 
            <PanelHeader>Профиль</PanelHeader>}
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
                before={<Avatar size={72} src={vkInfoUser.photo_max_orig} />}>
                    <div style={{display: 'flex'}}>
                        {`${vkInfoUser.first_name} ${vkInfoUser.last_name}`} {userInfo.is_best && <Icon16Crown className='crown crown_profile' />}
                    </div>
                    
                </RichCell>
            </Group> 
            <Group>
            <Div>
                <div className='infoblock'>
                    <div className='infoblock_item'>
                        Вы оценили <span style={{color: appearence === 'light' ? 'black' : 'var(--white)' ,fontWeight: 500}}>{userInfo.actions_current_week} {enumerate(userInfo.actions_current_week, ['запись', 'записи', 'записей'])}</span> на этой неделе
                    </div>
                    <div className='infoblock_item'>
                        {ACTIONS_NORM}
                    </div>
                </div>
                
                <Progress 
                className={(actsWeekReal >= ACTIONS_NORM) ? 'progressbar_big_height green_progressbar' : 'progressbar_big_height blue_progressbar'}
                value={actsWeekReal / ACTIONS_NORM *100}
                />
                <div className='infoblock_item infoblock_item-bottom'>
                    {ACTIONS_NORM - userInfo.actions_current_week > 0 ?('Для преодоления порога необходимо оценить ещё ' + (ACTIONS_NORM - userInfo.actions_current_week) + ' ' + 
                    enumerate(ACTIONS_NORM - userInfo.actions_current_week, ['запись', 'записи', 'записей'])): 
                    "Вы достигли порога, не сбавляйте темп"}
                </div>
                
            </Div>
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
            <Group header={<Header indicator={achievements?.length >0 ? achievements?.length: null}>Достижения</Header>}>
            {achievements === null ? <PanelSpinner/> :
            achievements?.length >0 ? 
                <Div className={'achievements' + (platform === VKCOM ? ' achievements-vkcom':'')} style={{paddingTop: 0}}>
                    {achievements?.map((val, i) => 
                    <Tooltip
                    mode="light"
                    key={val.id}
                    text={val.description}
                    isShown={tooltipShow === i}
                    onClose={() => setToolTipState(false)}
                    offsetX={10}>
                        <Tappable
                        className='achievements_item'
                        onClick={() => setToolTipState(i)}>
                            <Avatar
                            style={{margin: '0 auto'}} 
                            shadow={false} 
                            size={platform === VKCOM ? 89 : 90} 
                            src={val.photo} 
                            alt={val.placeholder} />
                        </Tappable>
                        
                    </Tooltip> 
                    )}
                    
                </Div>
                : 
                    <Placeholder>Пока у вас нет достижений ¯\_(ツ)_/¯</Placeholder>}
                
            </Group>
            <Footer>
                <a href='https://vk.com/topic-206651170_48260713'
                target="_blank" rel="noopener noreferrer">Сообщить об ошибке</a> · <a
                href="https://vk.com/topic-206651170_48189045"
                target="_blank" rel="noopener noreferrer">Предложить идею</a>
            </Footer>
        </Panel>
    )
}
Achievements.propTypes = {
    achievements: PropTypes.array,
}
export default Achievements;