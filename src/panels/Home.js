import React, { useCallback, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import {
    Avatar,
	Panel,
	Group,
    Placeholder,
    Div,
    UsersStack,
    PanelSpinner
} from '@vkontakte/vkui';
import { API_URL, TOPICS, TOPIC_ICONS_PATH } from '../config';
import { CuratorsTopic, Posts, ScoreTopic } from '../Units';
import { useDispatch, useSelector } from 'react-redux';
import { accountActions } from '../store/main';
import { enumerate } from '../functions/tools';
export const Home = props => {
    const dispatch = useDispatch();
    const { activeTopic, user, tokenSearch, friends_topics} = useSelector((state) => state.account)
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
            .catch(e => {
                console.log(e);
                // setUserFriends(false);
            })
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
    return(
        <Panel id={props.id}>
            <div style={{display: 'flex'}}>
                <Group style={{width: '40%', marginRight: 14}}>
                    <Div style={{display: 'flex'}}>
                        <Avatar size={72} src={TOPIC_ICONS_PATH + '/' + activeTopic + '.png'} />
                        <Div style={{padding: '28px 20px'}}>{TOPICS[activeTopic]}</Div>
                    </Div>
                </Group>
                <Group style={{width: '60%'}}>
                    <Div style={{height: 75}}>
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
                            : <PanelSpinner height={75} size='medium' />}
                    </Div>
                </Group>
            </div>
            <CuratorsTopic />
            <ScoreTopic />
            <Posts 
            navigation={props.navigation} />
        </Panel>
    )
}

