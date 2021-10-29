import React from 'react';
import bridge from '@vkontakte/vk-bridge';
import {
    Avatar,
	VKCOM,
	usePlatform,
	Panel,
	Group,
	Button,
	SimpleCell,
	Spacing,
    RichCell,
    HorizontalScroll,
    Placeholder
} from '@vkontakte/vkui';
import {
	Icon28DiamondOutline,
    Icon28NewsfeedOutline,
    Icon28NameTagOutline,
    Icon28GlobeOutline,
    Icon16Chevron,
    Icon56CompassCircleFillPurple,
    Icon28EmployeeOutline,
    Icon28BookOutline,
    Icon28GameOutline,
} from '@vkontakte/icons'
import Support_ava from '../img/Support_ava.svg'
import fun_experts_community from '../img/fun_experts_community.jpg'
import { BASE_LINKS_MENU, GENERAL_LINKS, GROUP_DESCRIPTIONS } from '../config';
import Card_news from '../img/cards/news.svg'
import Card_updates from '../img/cards/updates.svg'
import Card_community from '../img/cards/experts_community.svg'
import Card_achievements from '../img/cards/achievements.svg'
import Card_reports from '../img/cards/reports.svg'
import CardGalery from '../components/CardGalery';
const Home = props => {
    const platform = usePlatform();
    return(
        <Panel id={props.id}>
            <Group>
                <Placeholder
                icon={<Icon56CompassCircleFillPurple />}
                header='Справочник эксперта'>
                    Ваш гид в мире контент-индустрии
                </Placeholder>
                <Spacing size={11} separator='top' />
                <Group mode='plain'>
                    <SimpleCell
                    before={<Icon28DiamondOutline />}
                    multiline
                    disabled
                    description="Сохранили всё самое важное в справочнике эксперта ВКонтакте,
                    чтобы вы были в курсе всего важного из данной сферы">
                        Ценность справочника
                    </SimpleCell>
                    <SimpleCell
                    before={<Icon28NewsfeedOutline />}
                    multiline
                    disabled
                    description="Читайте и узнавайте новое об контент-индустрии, 
                    тематических лентах и о программе экспертов">
                        Эксклюзивный контент
                    </SimpleCell>
                    <SimpleCell
                    before={<Icon28NameTagOutline />}
                    multiline
                    disabled
                    description="Без лишних кнопок и действий — переходите в служебный раздел
                    экспертов ВКонтакте">
                        Карточка эксперта
                    </SimpleCell>
                </Group>
            </Group>
            <Group className='blue_Group'>
                <SimpleCell
                disabled
                multiline
                href={platform === VKCOM ? undefined : GENERAL_LINKS.group_fan_community}
                target="_blank" rel="noopener noreferrer"
                after={platform === VKCOM && <Button size='m' style={{backgroundColor: '#93C1F5'}}
                href={GENERAL_LINKS.group_fan_community}
                target="_blank" rel="noopener noreferrer"
                >Задать вопрос</Button>}
                description="Наши кураторы на связи"
                before={<Avatar shadow={false} className='avatar' size={48} src={Support_ava}>
                    <div className='avatar_online'></div>
                </Avatar>}
                >
                    Нужна помощь?
                </SimpleCell>
            </Group>
            <Group>
                <HorizontalScroll showArrows getScrollToLeft={i => i - 230} getScrollToRight={i => i + 230}>
                
                    <div style={{display: 'flex'}}>
                        <CardGalery 
                        img={Card_news}
                        href={BASE_LINKS_MENU.news}
                        type='link' />
                        <CardGalery 
                        img={Card_achievements}
                        href={BASE_LINKS_MENU.achievements}
                        type='link' />
                        <CardGalery 
                        img={Card_reports}
                        href={BASE_LINKS_MENU.reports_info}
                        type='link' />
                        <CardGalery 
                        img={Card_community}
                        href={GENERAL_LINKS.group_official}
                        type='link' />
                        <CardGalery 
                        img={Card_updates}
                        href={BASE_LINKS_MENU.updates}
                        type='link' />
                        
                        
                    </div>
                    
                </HorizontalScroll>
            </Group>
            <Group>
                <SimpleCell
                before={<Icon28GlobeOutline />}
                after={<Icon16Chevron />}
                href={GENERAL_LINKS.fan_website}
                target="_blank" rel="noopener noreferrer">
                    Сайт
                </SimpleCell>
                <SimpleCell
                before={<Icon28GameOutline />}
                after={<Icon16Chevron />}
                href={GENERAL_LINKS.bingo_game}
                target="_blank" rel="noopener noreferrer">
                    Бинго
                </SimpleCell>
                <SimpleCell
                before={<Icon28EmployeeOutline />}
                after={<Icon16Chevron />}
                onClick={() => props.goPanel('curators', 'curators', true)}
                >
                    Кураторы
                </SimpleCell>
                <SimpleCell
                before={<Icon28BookOutline />}
                after={<Icon16Chevron />}
                onClick={() => bridge.send(
                    'VKWebAppOpenApp',
                    {
                        app_id: 7971136,
                        location: ''
                    }
                )}>
                    Правила программы
                </SimpleCell>
            </Group>
            <Group>
				<RichCell
				disabled
				multiline
				before={<Avatar size={72} src={fun_experts_community}></Avatar>}
				actions={
					<Button size='m'
					href={GENERAL_LINKS.group_fan}
					target="_blank" rel="noopener noreferrer">
						{platform === VKCOM ? 'Перейти в сообщество' : 'Перейти'}
					</Button>
				}
				caption={platform === VKCOM ? 
				GROUP_DESCRIPTIONS.pc.fun 
				: 
				GROUP_DESCRIPTIONS.mobile.fun}>
					Клуб экспертов ВКонтакте
				</RichCell>
			</Group>
        </Panel>
    )
}


export default Home;