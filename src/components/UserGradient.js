import React from 'react';
import PropTypes from 'prop-types'
import { 
	Button, 
	Group, 
	SimpleCell, 
	Avatar,
	Title,
	Gradient,
    SizeType,
    useAdaptivity,
    Text,
    Placeholder,
    Header,
} from '@vkontakte/vkui';	

import {
	Icon28ListOutline,
    Icon28StatisticsOutline,
    Icon28NewsfeedOutline,
    Icon28ArchiveOutline,
    Icon16Crown,
} from '@vkontakte/icons'
import { enumerate, getHumanyTime, recog_number } from '../functions/tools';
import { ENUMERATE_VARIANTS } from '../config';

const UserGradient = props => {
    const {placeHolderText, userSearchedInfo, isExpert} = props;
    const vkInfo = userSearchedInfo[0];
    const apiInfo = isExpert && userSearchedInfo[1];
    const sizeX = useAdaptivity().sizeX
    return(
        <>
        <Group>
        <Gradient style={{
            margin: sizeX === SizeType.REGULAR ? '-7px -7px 0 -7px' : 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: 32,
        }}>
            <Avatar size={96} src={vkInfo.photo_100} alt='ava' />
            <Title style={{ marginBottom: 8, marginTop: 20, display: 'flex'}} level="2" weight="medium">
                {vkInfo.first_name} {vkInfo.last_name}
                {apiInfo.is_best && <Icon16Crown className='crown crown_user-gradient' />}
            </Title>
            <Text style={{ marginBottom: 24, color: 'var(--text_secondary)'}}>
                {vkInfo.last_seen && getHumanyTime(vkInfo.last_seen.time).datetime} 
            </Text>
            <Button
            target="_blank" rel="noopener noreferrer"
            href={'https://vk.com/' + vkInfo.screen_name}
            size="m" 
            mode="secondary">Перейти в профиль</Button>
        </Gradient>
            {isExpert ? 
            <Group mode='plain' header={<Header>Общая информация об эксперте</Header>}>
                <SimpleCell
                disabled
                before={<Icon28ListOutline />}
                after={apiInfo.topic_name}>
                    Курируемая тематика
                </SimpleCell>
                <SimpleCell
                disabled
                before={<Icon28StatisticsOutline />}
                after={apiInfo.position}>
                    Позиция в рейтинге
                </SimpleCell>
            </Group> :
            <Group mode='plain'>
                <Placeholder>
                    {placeHolderText}
                </Placeholder>
            </Group>}
        </Group>
        
        {isExpert && 
        <Group header={<Header>Дополнительная информация</Header>}>
            <SimpleCell
            disabled
            before={<Icon28NewsfeedOutline />}
            after={apiInfo.actions_current_day + ' ' + enumerate(apiInfo.actions_current_day, ENUMERATE_VARIANTS.posts)}>
                Посты за сегодня
            </SimpleCell>
            <SimpleCell
            disabled
            before={<Icon28ArchiveOutline />}
            after={recog_number(apiInfo.actions_count) + ' ' + enumerate(apiInfo.actions_count, ENUMERATE_VARIANTS.posts)}>
                Посты за все время
            </SimpleCell>
        </Group>}
        </>
    )
}

UserGradient.propTypes = {
    placeHolderText: PropTypes.node.isRequired,
    userSearchedInfo: PropTypes.array.isRequired,
    isExpert: PropTypes.bool.isRequired,

}

export default UserGradient;