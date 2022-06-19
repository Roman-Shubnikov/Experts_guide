import React, { useEffect, useState } from 'react';
import bridge from '@vkontakte/vk-bridge';
import PropTypes from 'prop-types'
import { 
	Button, 
	Group, 
	SimpleCell, 
	Avatar,
    Placeholder,
    Header,
    HorizontalScroll,
    PanelSpinner,
    HorizontalCell,
    Spacing,
    RichCell,
    ButtonGroup,
    MiniInfoCell,

} from '@vkontakte/vkui';	

import {
    Icon16Crown,
    Icon28LockOutline,
    Icon20WorkOutline,
    Icon20StatisticsOutline,
    Icon20NotebookCheckOutline,
    Icon20ListAddOutline,
    Icon28AchievementCircleFillBlue,
    Icon20Check,
} from '@vkontakte/icons'
import { enumerate, recog_number } from '../functions/tools';
import { API_URL, ENUMERATE_VARIANTS, PERMISSIONS } from '../config';
const UserGradient = props => {
    const {placeHolderText, userSearchedInfo, isExpert, tokenSearch} = props;
    const vkInfo = userSearchedInfo[0];
    const apiInfo = isExpert && userSearchedInfo[1];
    const [userFriends, setUserFriends] = useState(null);
    const isActivist = userSearchedInfo[1] && userSearchedInfo[1].permissions >= PERMISSIONS.activist
    useEffect(() => {
        const getFriends = () => {
            bridge.send('VKWebAppCallAPIMethod', {
				method: 'friends.get',
				params: {
					user_id: vkInfo.id,
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
                setUserFriends(experts.slice(0, 100))
            })
            .catch(e => {
                setUserFriends(false);
            })
        }
        setTimeout(() => {
            getFriends();
        }, 3000)
        
    }, [vkInfo, tokenSearch])
    
    return(
        <>
        <Group>
            <RichCell
            before={<Avatar 
                shadow={false}
                size={72} src={vkInfo.photo_100} alt='ava'>
                    {isActivist && <Icon28AchievementCircleFillBlue
                    style={{position: 'absolute', right: 0, bottom: 0}} />}
                </Avatar>}
            disabled
            caption={isExpert && apiInfo ? "Эксперт" : placeHolderText}
            actions={<ButtonGroup>
                <Button
                target="_blank" rel="noopener noreferrer"
                href={'https://vk.com/' + vkInfo.screen_name}
                size="m" 
                mode='primary'>Открыть профиль</Button>
                <Button
                target="_blank" rel="noopener noreferrer"
                href={'https://vk.com/' + vkInfo.screen_name}
                size="m" 
                mode="secondary">Написать</Button>
            </ButtonGroup>}>
                {vkInfo.first_name} {vkInfo.last_name}
                {apiInfo && apiInfo.is_best && <Icon16Crown className='crown crown_user-gradient' />}
            </RichCell>
            {isExpert && apiInfo && <>
            <Spacing />
            {isActivist && <MiniInfoCell
            before={<Icon20Check />}>
                Пользователь является активистом
            </MiniInfoCell>}
            <MiniInfoCell
            before={<Icon20WorkOutline />}>
                Тематическая лента: {apiInfo.topic_name}
            </MiniInfoCell>
            <MiniInfoCell
            before={<Icon20StatisticsOutline />}>
                Позиция в общем рейтинге: {apiInfo.position === -1 ? "Изучаем" : apiInfo.position}
            </MiniInfoCell>
            <Spacing separator />
            <MiniInfoCell
            before={<Icon20NotebookCheckOutline />}>
                Оценено публикаций сегодня: {apiInfo.actions_current_day === -1 ? "Изучаем" : apiInfo.actions_current_day + ' ' + enumerate(apiInfo.actions_current_day, ENUMERATE_VARIANTS.posts)}
            </MiniInfoCell>
            <MiniInfoCell
            before={<Icon20ListAddOutline  />}>
                Оценено публикаций за все время: {apiInfo.actions_count === -1 ? "Изучаем" : recog_number(apiInfo.actions_count) + ' ' + enumerate(apiInfo.actions_count, ENUMERATE_VARIANTS.posts)}
            </MiniInfoCell>
            </>}
        </Group>
        {isExpert && 
        <Group header={<Header
                        indicator={userFriends && userFriends.length > 0 && userFriends.length}>Эксперты в друзьях</Header>}>
            <HorizontalScroll showArrows getScrollToLeft={i => i - 120} getScrollToRight={i => i + 120}>
                <div style={{ display: 'flex' }}>
                    {userFriends === null ? <PanelSpinner /> : 
                    !userFriends ? 
                    <SimpleCell
                    multiline
                    disabled
                    before={<Icon28LockOutline style={{color: '#99A2AD'}} />}
                    className='status-block'
                    description="К сожалению, вы не можете просмотреть экспертов-друзей данного пользователя, так как у него закрытый профиль ВКонтакте">
                        Профиль закрыт
                    </SimpleCell> :
                    userFriends.length === 0 ?
                    <Placeholder>У пользователя нет друзей-экспертов</Placeholder> :
                    userFriends.map(item => {
                        return(
                            <HorizontalCell key={item.user_id} 
                            style={{whiteSpace: 'pre-wrap'}}
                            header={item.first_name + '\n' + item.last_name}
                            target="_blank" rel="noopener noreferrer"
                            href={'https://vk.com/' + item.domain}
                            >
                                <Avatar size={56} src={item.photo} />
                            </HorizontalCell>
                        )
                    })
                    }
                </div>
            </HorizontalScroll>
        </Group>}
        
        </>
    )
}

UserGradient.propTypes = {
    placeHolderText: PropTypes.node.isRequired,
    userSearchedInfo: PropTypes.array.isRequired,
    isExpert: PropTypes.bool.isRequired,
    tokenSearch: PropTypes.string.isRequired,

}

export default UserGradient;