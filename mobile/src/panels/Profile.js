import React from 'react';
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
    Avatar,
    Progress,
    Subhead,
    Div,
    Card,
    Separator,
    Header,

} from "@vkontakte/vkui"
import {
    Icon12Chevron,
    Icon28ListCheckOutline,
    Icon28StatisticsOutline,
    Icon28ArchiveOutline,
    Icon16Crown,
    Icon28MessageOutline,
	Icon28NameTagOutline,
	Icon28MoneyWadOutline,
	Icon28StorefrontOutline,
	Icon28InboxOutline,
	Icon28WalletOutline,
	Icon28MessagesOutline,
	Icon28LogoVkOutline,
    Icon16Verified,
    Icon28MessageUnreadOutline,
} from '@vkontakte/icons';
import { ACTIONS_NORM, BASE_ARTICLE_TOPIC_LINK, chatLinks, GENERAL_LINKS, TOPICS } from '../config';
import { enumerate, getKeyByValue } from '../functions/tools';
import { useSelector } from 'react-redux';


const Profile = props => {
    const { vkInfoUser, userInfo } = props; 
    const platform = usePlatform();
    const {activeTopic} = useSelector((state) => state.account);
    const isVKHOVER = !(platform === VKCOM);
    
    const processCount = (count) => {
        if(count === 0) return 'нет записей';
        return count;
    }
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
                caption={<div 
                        style={{display:'flex'}}>
                            Ваша тематика: {userInfo.topic_name} <Icon12Chevron className='profile-chevron' />
                        </div>}
                before={<Avatar alt='ava' src={vkInfoUser.photo_200} size={72} />}>
                    <div style={{display: 'flex'}}>
                        {`${vkInfoUser.first_name} ${vkInfoUser.last_name}`} {userInfo.is_best && <Icon16Crown className='crown crown_profile' />}
                    </div>
                    
                </RichCell>
                <Div>
                    <Card>
                        <Div style={{paddingTop: 25, paddingBottom: 25}}>
                            <div style={{display: 'flex', justifyContent: 'center'}}>
                                <Subhead style={{marginBottom: 20, color: 'var(--dynamic_gray)', fontSize: 14}}>
                                    Вы оценили {userInfo.actions_current_week} {enumerate(userInfo.actions_current_week, ['публикацию', 'публикации', 'публикаций'])} за неделю
                                </Subhead>
                            </div>
                            
                            <Progress value={Math.min(100, userInfo.actions_current_week/ACTIONS_NORM)} 
                            className={'progressbar_big_height' + (userInfo.actions_current_week/ACTIONS_NORM >= 100 ? ' green_progressbar' : '')} />
                        </Div>
                        
                    </Card>
                </Div>
                <SimpleCell 
                href={chatLinks[activeTopic]}
                target="_blank" rel="noopener noreferrer"
                before={<Icon28MessageOutline />}>
                    Чат тематики
                </SimpleCell>
                <SimpleCell 
                href={'https://vk.me/join/_F7ANwUkF9PvMqQzpLOiImCokwc_Ct7oaTw='}
                target="_blank" rel="noopener noreferrer"
                before={<Icon28MessageUnreadOutline />}>
                    Флудилка
                </SimpleCell>
                <Spacing>
                    <Separator />
                </Spacing>
                <SimpleCell
                disabled
                after={processCount(userInfo.actions_current_day)}
                before={<Icon28StatisticsOutline />}
                >
                    Сегодня
                </SimpleCell>
                <Spacing separator={true} />
                <SimpleCell
                disabled
                after={processCount(userInfo.actions_current_week)}
                before={<Icon28ListCheckOutline />}
                >
                    Неделю
                </SimpleCell>
                <SimpleCell
                disabled
                after={processCount(userInfo.actions_previous_week)}
                before={<Icon28ListCheckOutline />}
                >
                    Прошлая неделя
                </SimpleCell>
                <SimpleCell
                disabled
                after={processCount(userInfo.actions_current_month)}
                before={<Icon28ListCheckOutline />}
                >
                    Месяц
                </SimpleCell>
                <Spacing separator={true} />
                <SimpleCell
                disabled
                after={processCount(userInfo.actions_count)}
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
            <Group header={<Header>Сообщества и сервисы</Header>}>
                <SimpleCell
                multiline
                href='https://vk.com/vkexperts'
                description='Рабочее сообщество экспертов'
                target="_blank" rel="noopener noreferrer"
                before={<Avatar size={48} alt='ava'
                src={'https://sun9-33.userapi.com/s/v1/if1/bPTORBtBV6MARMNNnxVRvb14kboqQHoilOWpP0SRjwxscH8wgej7dnBje6tp48G7OELmE88w.jpg?size=50x50&quality=96&crop=117,114,924,924&ava=1'} />}>
                    <div style={{display: 'flex'}}>
                        Эксперты ВКонтакте
                    <Icon16Verified className='verified' />
                    </div> 
                </SimpleCell>
                <SimpleCell
                multiline
                description='Юмористические материалы'
                href='https://vk.com/keksperts'
                target="_blank" rel="noopener noreferrer"
                before={<Avatar size={48} alt='ava'
                src={'https://sun9-32.userapi.com/s/v1/ig1/FkGtEkgihJ7vADbFbdnHFp1KC_Lzl6v7B2WMOzgu4NcZp9IKRkH5EhjG2dF-EpYhxk27NhYu.jpg?size=50x50&quality=96&crop=130,91,859,859&ava=1'} />}>
                    Контакты ВЭксперте
                </SimpleCell>
                <SimpleCell
                multiline
                description='Объединение активистов'
                href='https://vk.com/clubvkexperts'
                target="_blank" rel="noopener noreferrer"
                before={<Avatar size={48} alt='ava'
                src={'https://sun9-85.userapi.com/s/v1/ig2/zD7sJdhi-WwR3XfllpKXI4dwrbTRkIYFgKKd5y_AlaM-JqE-T6SyUw1Knn9ATWEcliLRoxI5yiLWIxbodowUv8aL.jpg?size=50x50&quality=95&crop=0,0,1000,1000&ava=1'} />}>
                    Клуб экспертов
                </SimpleCell>
                <SimpleCell
                multiline
                description='Сервис для получения подробной информации об активности эксперта'
                href='https://vk.com/diexp'
                target="_blank" rel="noopener noreferrer"
                before={<Avatar size={48} alt='ava'
                src={'https://sun9-62.userapi.com/s/v1/ig2/EkLdl7ukkCuXPNRYVvvpIznhR5dbfgaPL3_TUihDsPtzJxEMj_ZcdRiHFKMUBRza2yPXXFc_55GjayUKZ4aK1B_H.jpg?size=50x50&quality=95&crop=0,0,807,807&ava=1'} />}>
                    InfoExperts - Статистика Экспертов
                </SimpleCell>
            </Group>
        </Panel>
    )
}
Profile.propTypes = {
    achievements: PropTypes.array,
}
export {Profile};