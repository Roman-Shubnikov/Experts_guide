import React, { useEffect, useState } from 'react';
import {
    Div,
    Group,
    Progress,
    SimpleCell,
    
} from '@vkontakte/vkui';
import {
    TextTooltip,
} from '@vkontakte/vkui/dist/unstable';
import {
    Icon28GridLayoutOutline,
    Icon28UserCardOutline,
    Icon28ReportOutline,
    Icon28HelpCircleOutline,
} from '@vkontakte/icons'
import { useSelector } from 'react-redux';
import { enumerate } from '../functions/tools';
import { ACTIONS_NORM } from '../config';

const EpicItem = ({ story, panel, go, icon: Icon, children }) => {
    const activeStory = useSelector((state) => state.views.activeStory);
    const isActive = activeStory === story;
    return (
        <SimpleCell
            disabled={isActive}
            style={isActive ? {
                backgroundColor: "var(--button_secondary_background)",
                color: '#6f7985'
            } : { color: '#6f7985' }}
            onClick={() => go(story, panel)}
            className='subtext'
            before={<Icon />}>
            {children}
        </SimpleCell>
    )
}

export const EpicPC = props => {
    const { go, userInfo: user } = props;
    const userInfo = user.expert_info;
    const [actsWeekReal, setActsWeekReal] = useState(0);
    useEffect(() => {
        setTimeout(() => {
            setActsWeekReal(userInfo.actions_current_week)
        }, 1000)
    }, [userInfo.actions_current_week])
    return (<>
        {/* <Group>
            <SimpleCell
            style={{color: '#6f7985'}}
            href='https://vk.com/textlive2567'
            target="_blank" rel="noopener noreferrer"
            description='Узнавайте новости первым'
            before={<Icon28TextLiveOutline style={{color: '#A5ABB6'}} />}>
                Орден экспертов
            </SimpleCell>
        </Group> */}
        <Group>
            <TextTooltip text={
                ACTIONS_NORM - userInfo.actions_current_week > 0 ?('Осталось оценить ' + (ACTIONS_NORM - userInfo.actions_current_week) + ' ' + 
                enumerate(ACTIONS_NORM - userInfo.actions_current_week, ['публикация', 'публикации', 'публикаций'])) : 
                "Вы достигли порога"}>
                <Div>
                    <div className='infoblock'>
                        <div className='infoblock_item'>
                            Вы оценили {userInfo.actions_current_week} {enumerate(userInfo.actions_current_week, ['публикация', 'публикации', 'публикаций'])}
                        </div>
                        <Progress
                        className={(actsWeekReal >= ACTIONS_NORM) ? 'progressbar_big_height green_progressbar' : 'progressbar_big_height blue_progressbar'}
                        value={Math.min(actsWeekReal / ACTIONS_NORM * 100, 100)}
                        />
                    </div>
                </Div>
            </TextTooltip>
        </Group>
        <Group>
            <EpicItem
                go={go}
                story='home'
                panel='home'
                icon={Icon28GridLayoutOutline}
            >
                Тематические ленты
            </EpicItem>
            <EpicItem
                go={go}
                story='searchInfo'
                panel='searchInfo'
                icon={Icon28UserCardOutline}
            >
                Участники
            </EpicItem>
            <EpicItem
                go={go}
                story='reports'
                panel='reports'
                icon={Icon28ReportOutline}
            >
                Пожаловаться
            </EpicItem>
            <EpicItem
                go={go}
                story='help'
                panel='help'
                icon={Icon28HelpCircleOutline}
            >
                Помощь
            </EpicItem>
        </Group></>
    )
}