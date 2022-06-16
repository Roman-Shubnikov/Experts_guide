import React, { useCallback, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import {
    Avatar,
	Panel,
	Group,
    Placeholder,
    Div,
    UsersStack,
    PanelSpinner,
    Subhead,
    RichCell,
    Button,
    CellButton,
    Text,
} from '@vkontakte/vkui';
import { API_URL, ARTICLE_IMAGE, GENERAL_LINKS, TOPICS, TOPICS_LINKS, TOPIC_ICONS_PATH } from '../config';
import { CuratorsTopic, Posts, ScoreTopic } from '../Units';
import { useDispatch, useSelector } from 'react-redux';
import { accountActions } from '../store/main';
import { enumerate, getKeyByValue } from '../functions/tools';
import { 
    Icon16ArrowTriangleDown,
    Icon16ArrowTriangleUp,
    Icon16Minus,
    Icon24Add,

} from '@vkontakte/icons';


export const Home = props => {
    const dispatch = useDispatch();
    const { activeTopic, user, tokenSearch, friends_topics} = useSelector((state) => state.account)
    const { posts, topics } = useSelector(state => state.stor);
    const setTopicsFriends = useCallback((data) => dispatch(accountActions.setTopicsFriends(data)), [dispatch]);
    useEffect(() => {
        const getFriends = () => {
            bridge.send('VKWebAppCallAPIMethod', {
				method: 'friends.get',
				params: {
					user_id: user.vk_id,
                    fields: 'first_name,last_name,photo_100,domain',
					v: "5.131", 
					access_token: tokenSearch,
				}
			})
            .then(async (data) => {
                let friends = data.response.items;
                let sliced_friend,curr_users,experts=[],friend_ids;
                for(let i=0;i<friends.length;i+=100){
                    sliced_friend = friends.slice(i, i+100);
                    friend_ids = sliced_friend.map(item => (item.id))
                    curr_users = await fetch(API_URL + 'method=experts.getInfo&' + window.location.search.replace('?', ''),
                    {
                        method: 'post',
                        headers: { "Content-type": "application/json; charset=UTF-8" },
                        body: JSON.stringify({
                            'user_ids': friend_ids.join(','),
                        })
                    })
                    curr_users = await curr_users.json()
                    curr_users = curr_users.response;
                    for(let j=0;j<curr_users.length;j++) {
                        if(curr_users[j].is_expert) {
                            let full_user = {...curr_users[j].info};
                            let vk_info = sliced_friend[j];
                            full_user.first_name = vk_info.first_name;
                            full_user.last_name = vk_info.last_name;
                            full_user.photo = vk_info.photo_100;
                            full_user.domain = vk_info.domain;
                            experts.push(full_user);
                        }
                    }
                }
                let new_friends_topics = {...friends_topics};
                let topics = Object.keys(TOPICS);
                for(let i=0;i<topics.length;i++) {
                    let curr_topic = topics[i];
                    new_friends_topics[curr_topic] = experts.filter((i) => (i.topic_name === TOPICS[curr_topic]))
                    
                }
                setTopicsFriends(new_friends_topics)
                // setUserFriends(experts.slice(0, 100))
            })
            // .catch(e => {
            //     console.log(e);
            //     // setUserFriends(false);
            // })
        }
        setTimeout(() => {
            getFriends();
        }, 3000)
         // eslint-disable-next-line
    }, [user, tokenSearch])
    const getNames = () => {
        let names = '';
        let experts = friends_topics[activeTopic].slice(0, 3);
        for(let i=0;i<experts.length;i++) {
            let name_expert = experts[i].first_name;
            names += name_expert;
            if(i+1 !== experts.length) {
                names += ', ';
            }
        }
        if(friends_topics[activeTopic].length !== 1) {
        names += ' и ещё ' + friends_topics[activeTopic].length + ' '
         + enumerate(friends_topics[activeTopic].length, 
            ['друг оценивает', 'друга оценивают', 'друзей оценивают']) + ' эту тематику'
        } else {
            names += ' оценивает эту тематику'
        }
        return names;
    }
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
    return(
        <Panel id={props.id}>
            <div style={{display: 'flex'}}>
                <Group style={{width: '40%', marginRight: 14}}>
                    <Div style={{display: 'flex', padding: '15px 16px'}}>
                        <Avatar size={72} src={TOPIC_ICONS_PATH + '/' + activeTopic + '.png'} />
                        <Div style={{paddingTop: 19}}><div style={{display: 'flex'}}>{TOPICS[activeTopic]} {getArrows()}</div>
                        <Subhead className='vkuiSimpleCell__description'>{posts ? posts.count[activeTopic] === 0 ? 'нет постов' : posts.count[activeTopic] + ' ' + enumerate(posts.count[activeTopic], ['пост', 'поста', 'постов']) : '...'}</Subhead></Div>
                    </Div>
                </Group>
                <Group style={{width: '60%'}}>
                    <Div style={{height: 79}}>
                        {friends_topics[activeTopic] ? 
                        friends_topics[activeTopic].length > 0 ?
                        <UsersStack
                            photos={
                                friends_topics[activeTopic].map(i => i.photo)
                            }
                            size="m"
                            count={4}
                            layout="vertical"
                            >
                                {getNames()}
                            </UsersStack> :
                            <Placeholder>
                                У вас нет друзей-экспертов в этой тематике
                            </Placeholder>
                            : <PanelSpinner height={79} size='medium' />}
                    </Div>
                </Group>
            </div>
            <Group>
                {TOPICS_LINKS[activeTopic].length > 0 ? TOPICS_LINKS[activeTopic].map((val, i) => 
                <RichCell
                key={i}
                disabled
                caption={val.descr}
                actions={
                    <Button href={val.link}
                    mode='secondary'
                    size='m'
                    target="_blank" rel="noopener noreferrer">
                        {val.isArticle ? 'Читать' : val.text_button}
                    </Button>
                }
                before={<Avatar 
                size={72}
                alt={activeTopic}
                src={val.isArticle ? ARTICLE_IMAGE : val.img} />}>
                    {val.title}
                </RichCell>):
                    <div>
                        <Div>
                        <Text style={{color: 'var(--subtext)'}}>Пока тут нет контента, связанного с этой тематической лентой,
                            но если у вас такой есть, мы можем об
                            судить его публикацию в этом блоке</Text>
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

