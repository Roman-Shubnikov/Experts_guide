import React, { useCallback, useEffect, useState } from 'react';
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
    Div,
    Card,
    Separator,
    Header,
    HorizontalScroll,
    Tabs,
    TabsItem,
    Counter,
    PanelSpinner,
    MiniInfoCell,
    Placeholder,

} from "@vkontakte/vkui"
import {
    Icon12Chevron,
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
    Icon20CheckCircleOutline,
    Icon24DoneOutline,
    Icon20Info,
    Icon20ErrorCircleOutline,
    Icon20WalletOutline,
    Icon24BrainOutline,

} from '@vkontakte/icons';
import { BASE_ARTICLE_TOPIC_LINK, chatLinks, GENERAL_LINKS, TOPICS } from '../config';
import { enumerate, getKeyByValue } from '../functions/tools';
import { useDispatch, useSelector } from 'react-redux';
import { useApi, useNavigation } from '../hooks';
import { accountActions } from '../store/main';
import clsx from 'clsx';
const WEEK_DAYS = {
    0: 'Понедельник',
    1: 'Вторник',
    2: 'Среда',
    3: 'Четверг',
    4: 'Пятница',
    5: 'Суббота',
    6: 'Воскресенье',
}

const Profile = props => {
    const dispatch = useDispatch();
    const { vkInfoUser, userInfo } = props; 
    const platform = usePlatform();
    const { setActiveModal } = useNavigation();
    const { fetchApi } = useApi();
    const {activeTopic, statistic_user} = useSelector((state) => state.account);
    const setStatistic = useCallback((payload) => dispatch(accountActions.setStatistic(payload)), [dispatch])
    const getCurrentDay = () => {
        let day = new Date().getDay();
        return day === 0 ? 6 : day-1;
    }
    const [selectedDay, setSelectedDay] = useState(''+getCurrentDay());
    const isVKHOVER = !(platform === VKCOM);
    const dayData = statistic_user && statistic_user[selectedDay];
    
    const isDay = () => {
        return getCurrentDay()+'' === selectedDay;
    }

    useEffect(() => {
        fetchApi('stat.get')
        .then(res => {
            let stat = {};
            for(let i = 0; i < res.length;i++) {
                stat[res[i].week_day] = res[i];
            }
            setStatistic(stat);
        })
    }, [fetchApi, setStatistic])
    const getDaysWithoutSkips = () => {
        let days = 0;
        let days_list = [];
        let days_user = Object.keys(statistic_user).sort((a,b) => a - b);
        let curr_day = days_user[0];

        for(let j = 0; j < days_user.length;j++) {
            days = 0;
            for(let i = 0; i < days_user.length;i++) {
                if(curr_day < days_user[i] - 1) break;
                curr_day = days_user[i];
                if(statistic_user[days_user[i]].actions_day > 0) {
                    days += 1;
                }
            }
            days_list.push(days);

        }
        return Math.max.apply(null, days_list);
    }

    const getProbablyScore = () => {
        let is_active = userInfo.is_active;
        let posts = Number(userInfo.expert_info.actions_current_week >= 700);
        let days = getDaysWithoutSkips();
        return (is_active + posts) * days;
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
                href={BASE_ARTICLE_TOPIC_LINK + getKeyByValue(TOPICS, userInfo.expert_info.topic_name)}
                target="_blank" rel="noopener noreferrer"
                caption={<div 
                        style={{display:'flex'}}>
                            Ваша тематика: {userInfo.expert_info.topic_name} <Icon12Chevron className='profile-chevron' />
                        </div>}
                before={<Avatar alt='ava' src={vkInfoUser.photo_200} size={72} />}>
                    <div style={{display: 'flex'}}>
                        {`${vkInfoUser.first_name} ${vkInfoUser.last_name}`} {userInfo.expert_info.is_best && <Icon16Crown className='crown crown_profile' />}
                    </div>
                    
                </RichCell>
                <Tabs>
                    <HorizontalScroll>
                        {Object.keys(WEEK_DAYS).map((v) => 
                        <TabsItem
                        key={v}
                        selected={v === selectedDay}
                        onClick={() => setSelectedDay(v)}>
                            {WEEK_DAYS[v]}
                        </TabsItem>)}
                    </HorizontalScroll>
                </Tabs>
                
                <Div>
                    {statistic_user ? dayData ?
                    <Card>
                        <Div style={{paddingTop: 10, paddingBottom: 10, fontSize: 13}}>
                            <MiniInfoCell
                            className='no-icon'
                            after={
                            <Counter
                            mode='primary'>из 100</Counter>
                            }>
                                Вы оценили {dayData.actions_day} {enumerate(dayData.actions_day, 
                                    ['публикацию', 'публикации', 'публикаций'])}
                            </MiniInfoCell>
                            <MiniInfoCell
                            className='no-icon'>
                                <Progress value={Math.min(100, dayData.actions_day)} 
                                className={clsx('progressbar_big_height', {green_progressbar: dayData.actions_day >= 100, red_progressbar: !isDay() && dayData.actions_day < 10})} />
                            </MiniInfoCell>
                            {dayData.actions_day >= 100 ? <MiniInfoCell
                            className='green no-padding'
                            before={<Icon20CheckCircleOutline className='green' />}>
                                Дневная норма выполнена
                            </MiniInfoCell>:
                            <MiniInfoCell
                            className={clsx({red: !isDay()}, 'no-padding')}
                            before={<Icon20ErrorCircleOutline className={clsx({red: !isDay()})} />}>
                                Дневная норма не выполнена
                            </MiniInfoCell>
                            }
                            {dayData.actions_day >= 10 ? <MiniInfoCell
                            className='green no-padding' 
                            before={<Icon24DoneOutline className='green' width={20} height={20} />}>
                                Активный день засчитан
                            </MiniInfoCell>:
                            <MiniInfoCell
                            className={clsx({red: !isDay()}, 'no-padding')}
                            before={<Icon20ErrorCircleOutline className={clsx({red: !isDay()})} />}>
                                Активный день не засчитан
                            </MiniInfoCell>}
                            
                        </Div>
                        
                    </Card>
                    :
                    <Card>
                        <Div style={{paddingTop: 10, paddingBottom: 10}}>
                            <Placeholder style={{height: 128}}>
                                Нет данных на этот день
                            </Placeholder>
                        </Div>
                        
                    </Card>
                    :
                    <PanelSpinner />}
                </Div>
                
                {statistic_user && <>{userInfo.expert_info.actions_current_week < 700 ? <MiniInfoCell
                before={<Icon20ErrorCircleOutline />}>
                    Недельная норма не выполнена
                </MiniInfoCell>:
                <MiniInfoCell
                className='green'
                before={<Icon20ErrorCircleOutline />}>
                    Недельная норма выполнена
                </MiniInfoCell>
                }
                {userInfo.is_active ? <MiniInfoCell
                before={<Icon24BrainOutline width={20} height={20} />}>
                    На этой неделе Вы активный эксперт
                </MiniInfoCell>:null}
                <MiniInfoCell
                before={<Icon20WalletOutline />}>
                    Вероятность вознаграждения: {getProbablyScore()} {enumerate(getProbablyScore(), ['балл', 'балла', 'баллов'])}
                </MiniInfoCell>
                <MiniInfoCell
                before={<Icon20Info />}
                mode="more"
                onClick={() => setActiveModal('statistic_user')}
                >
                    Подробная статистика
                </MiniInfoCell>
                </>}
                <Spacing>
                    <Separator />
                </Spacing>
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
                description='Идеалист'
                href='https://vk.com/ded_us'
                target="_blank" rel="noopener noreferrer"
                before={<Avatar size={48} alt='ava'
                src={'https://sun9-70.userapi.com/s/v1/ig2/a9-5u5nLB-uyx0hKTFi78eLcynHkuVbe-3S6flzFGadYX3gPkdYMg0Oazf0u7ZOZs1yB6RVkkarNWmgUq0P6vriB.jpg?size=200x200&quality=96&crop=0,0,1201,1201&ava=1'} />}>
                    Михаил Измайлов
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