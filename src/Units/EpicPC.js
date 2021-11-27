import React from 'react';
import {
	Group,
	SimpleCell,

} from '@vkontakte/vkui';
import {
	Icon28GridLayoutOutline,
	Icon28UserCardOutline,
	Icon28ReportOutline,
	Icon28HelpCircleOutline,
    Icon28TextLiveOutline,
} from '@vkontakte/icons'
import { useSelector } from 'react-redux';

const EpicItem = ({story, panel, go, icon: Icon, children}) => {
    const activeStory = useSelector((state) => state.views.activeStory);
    const isActive = activeStory === story;
    return(
        <SimpleCell
            disabled={isActive}
            style={isActive ? {
                backgroundColor: "var(--button_secondary_background)",
                borderRadius: 8,
                color: '#6f7985'
            } : {color: '#6f7985'}}
            onClick={() => go(story, panel)}
            before={<Icon style={{color: '#A5ABB6'}} />}>
                {children}
        </SimpleCell>
    )
}

export const EpicPC = props => {
    const { go } = props;
    return(<>
        <Group>
            <SimpleCell
            style={{color: '#6f7985'}}
            href='https://vk.com/textlive2567'
            target="_blank" rel="noopener noreferrer"
            description='Узнавайте новости первым'
            before={<Icon28TextLiveOutline style={{color: '#A5ABB6'}} />}>
                Орден экспертов
            </SimpleCell>
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