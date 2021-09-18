import React from 'react';
import {
    Avatar,
	VKCOM,
	usePlatform,
	Panel,
	Group,
	Button,
	SimpleCell,
	Text,
	Spacing,
    Title,
    RichCell,
    HorizontalScroll,
} from '@vkontakte/vkui';
import {
	Icon28DiamondOutline,
    Icon28NewsfeedOutline,
    Icon28NameTagOutline,

} from '@vkontakte/icons'
import Gradient from '../components/Gradient';
import Logo from '../img/logo_experts_color_28.svg'
import Support_ava from '../img/Support_ava.svg'
import fun_experts_community from '../img/fun_experts_community.jpg'
import { BASE_LINKS_MENU, GENERAL_LINKS, GROUP_DESCRIPTIONS } from '../config';
import Card_curators from '../img/cards/curators.svg'
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
                <Gradient>
                    <img alt='Эксперты' src={Logo} style={{width: 96, height: 96, marginBottom: 10}} />
                    <Title level="2" weight='bold' style={{marginBottom: 8}}>
                        Справочник эксперта
                    </Title>
                    <Text weight='regular' style={{color: '#818C99', fontSize: 16}}>
                        Ваш гид в мире контент-индустрии
                    </Text>
                </Gradient>
                <Spacing size={11} />
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
                        img={Card_curators}
                        onClick={() => props.setActivePanel('curators')}
                        type='button' />
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