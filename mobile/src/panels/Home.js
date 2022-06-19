import React, { useState, useCallback } from 'react';
import {
    Avatar,
	Panel,
	Group,
    Div,
    CellButton,
    Text,
    PanelHeader,
    PanelHeaderButton,
    SimpleCell,
    PanelHeaderContent,
    List,
    PanelHeaderContext,
    IconButton,
    Badge,
} from '@vkontakte/vkui';
import { ARTICLE_IMAGE, GENERAL_LINKS, ICON_TOPICS, TOPICS, TOPICS_LINKS, TOPIC_ICONS_PATH } from '../config';
import { CuratorsTopic, Posts, ScoreTopic } from '../Units';
import { useDispatch, useSelector } from 'react-redux';
import { enumerate, getKeyByValue } from '../functions/tools';
import {
    Icon16ArrowTriangleDown,
    Icon16ArrowTriangleUp,
    Icon16Minus,
    Icon24Add,
    Icon28UserCircleOutline,
    Icon28UserCardOutline,
    Icon16Dropdown,
    Icon28HelpCircleOutline,
} from '@vkontakte/icons';
import { useNavigation } from '../hooks';
import { accountActions } from '../store/main';


export const Home = props => {
    const dispatch = useDispatch();
    const { onEpicTap } = useNavigation();
    const { activeTopic, user} = useSelector((state) => state.account)
    const setActiveTopic = useCallback((data) => dispatch(accountActions.setActiveTopic(data)), [dispatch]);
    const { posts, topics } = useSelector(state => state.stor);
    const [contextOpened, setContext] = useState(false);
    const getArrows = () => {
        if(!topics) return;
        let counters = {};
        let counter_list = [];
        for(let i=0;i<topics.length;i++) {
            if(topics[i].topic_name === 'all') continue;
            counter_list.push(topics[i].count)
            counters[topics[i].topic_name] = topics[i].count
        }
        let max_count = getKeyByValue(counters, Math.max.apply(null, counter_list));
        let min_count = getKeyByValue(counters, Math.min.apply(null, counter_list));

        if(activeTopic === min_count) return <Icon16ArrowTriangleDown className='icon-name red' />
        if(activeTopic === max_count) return <Icon16ArrowTriangleUp className='icon-name green' />
        return <Icon16Minus className='icon-name' style={{color: '#A3ADB8'}} />
    }
    const getActualTopic = () => {
		let my_topic_index = ICON_TOPICS.findIndex((val, i) => val.topic === user.expert_info.topic_name)
		let iconTopics_actual = ICON_TOPICS.slice();
		if(user.expert_info.is_expert && my_topic_index !== -1){
			let my_topic = iconTopics_actual.splice(my_topic_index, 1);
			iconTopics_actual.unshift(my_topic[0])
		}
		return iconTopics_actual;
	}
    const genContext = () => {
		let iconTopics_actual = getActualTopic();
		return(
            iconTopics_actual.map(Val => 
            <SimpleCell
            badge={Val.topic === user.expert_info.topic_name && <Badge />}
            onClick={() => setActiveTopic(getKeyByValue(TOPICS, Val.topic))}
            key={Val.topic}
            before={<Val.icon />}>
                {Val.topic}
            </SimpleCell>
                )
			
		)
	}
    return(
        <Panel id={props.id}>
            <PanelHeader
            before={
                <>
                    <PanelHeaderButton
                    aria-label="Профиль"
                    data-story='profile'
                    onClick={onEpicTap}>
                        <Icon28UserCircleOutline />
                    </PanelHeaderButton>
                    <PanelHeaderButton
                    aria-label="Участники"
                    data-story='searchInfo'
                    onClick={onEpicTap}>
                        <Icon28UserCardOutline />
                    </PanelHeaderButton>
                </>
            }>
                <PanelHeaderContent
                      aside={
                        <Icon16Dropdown
                          style={{
                            transform: `rotate(${
                                contextOpened ? "180deg" : "0"
                            })`,
                          }}
                        />
                      }
                      onClick={() => setContext(p => !p)}
                    >
                      {TOPICS[activeTopic]}
                </PanelHeaderContent>
            </PanelHeader>
            <PanelHeaderContext
            opened={contextOpened}
            onClick={() => setContext(p => !p)}>
                <List>
                    {genContext()}
                </List>
                
            </PanelHeaderContext>
            <Group>
                <SimpleCell
                disabled
                after={<IconButton data-story="help" onClick={onEpicTap}>
                    <Icon28HelpCircleOutline style={{color: 'var(--accent)'}} />
                    </IconButton>}
                before={<Avatar size={72} src={TOPIC_ICONS_PATH + '/' + activeTopic + '.png'} />}
                description={posts ? posts.count[activeTopic] === 0 ? 'нет постов' : posts.count[activeTopic] + ' ' + enumerate(posts.count[activeTopic], ['пост', 'поста', 'постов']) : '...'}>
                    <div style={{display: 'flex'}}>{TOPICS[activeTopic]} {getArrows()}</div>
                </SimpleCell>
            </Group>
            <Group>
                {TOPICS_LINKS[activeTopic].length > 0 ? TOPICS_LINKS[activeTopic].map((val, i) => 
                <SimpleCell
                href={val.link}
                target="_blank" rel="noopener noreferrer"
                key={i}
                description={val.descr}
                before={<Avatar 
                size={48}
                alt={activeTopic}
                src={val.isArticle ? ARTICLE_IMAGE : val.img} />}>
                    {val.title}
                </SimpleCell>):
                    <div>
                        <Div>
                        <Text style={{color: 'var(--subtext)'}}>Пока тут нет контента, связанного с этой тематической лентой,
                            но если у вас такой есть, мы можем обсудить его публикацию в этом блоке</Text>
                        </Div>
                        
                        <CellButton
                            target="_blank" rel="noopener noreferrer"
                            href={GENERAL_LINKS.group_fan_community}
                            before={
                            <Avatar shadow={false} size={48}>
                                <Icon24Add />
                            </Avatar>
                            }
                        >
                            Переговорить с активистами
                        </CellButton>
                    </div>
                    
                    }
            </Group>
            <CuratorsTopic />
            <ScoreTopic />
            <Posts 
            navigation={props.navigation} />
        </Panel>
    )
}

