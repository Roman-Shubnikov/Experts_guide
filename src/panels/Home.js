import React, { useEffect, useState } from 'react';
import { 
	Panel, 
	Button, 
	Group, 
	SimpleCell, 
	Placeholder,
	RichCell,
	Avatar,
	Footer,
	Div,
	ScreenSpinner,
	Counter,
} from '@vkontakte/vkui';
import {
	Icon28FireOutline,
	Icon56NotebookCheckOutline,
	Icon28MoneyWadOutline,
	Icon28MarketOutline,
	Icon28WalletOutline,
	Icon28StudOutline,
	Icon28PodcastOutline,
	Icon28LikeOutline,
	Icon28Square4Outline,
	Icon28TextLiveOutline,
	Icon56ErrorTriangleOutline,
	Icon28ArchiveOutline,
	Icon56UsersOutline,
	Icon16Verified,
} from '@vkontakte/icons'
import experts_community from '../img/experts_community.png'
import fun_experts_community from '../img/fun_experts_community.png'
import { BASE_LINKS_MENU, GENERAL_LINKS, SCORE_POSITION_COLORS, TOPICS } from '../config';
import { enumerate, getKeyByValue } from '../functions/tools';
export default props => {
	const [scoreData, setScoreData] = useState(null);
	const linksConstructor = (base_link) => {
		return base_link + props.activeTopic + BASE_LINKS_MENU.suffix;
	}
	const scoreGenerator = () => {
		let render_score = [];
		for(let i=0;i<scoreData[props.activeTopic].length;i++){
			let user_info = scoreData[props.activeTopic][i];
			let user_data = scoreData.users_data[user_info.user_id];
			let name = user_data.first_name + " " + user_data.last_name;
			let topic_name = user_info.topic_name;
			let actions_current_week = user_info.actions_current_week;
			
			render_score.push(
				<SimpleCell
				expandable
				href={'https://vk.com/id' + user_info.user_id}
				target="_blank" rel="noopener noreferrer"
				key={user_info.user_id}
				before={<Avatar src={user_data.photo_max_orig} />}
				description={topic_name + ' · ' + actions_current_week.toLocaleString() + ' ' + enumerate(actions_current_week, ['оценённый', 'оценённых', 'оценённых'])+' постов'}
				after={<Counter style={{background: SCORE_POSITION_COLORS[i]}}>{i+1}</Counter>}>
					{name}
				</SimpleCell>
			)
		}
		return render_score;
	}
	useEffect(() => {
		if(props.isExpert){
			fetch('https://cors.roughs.ru/https://c3po.ru/api/experts.getTop?token=9h3d83h8r8ehe9xehd93u')
			.then(data => data.json())
			.then(data => {
				let sliced_data = {}
				for(let i =0; i<data.keys.length;i++){
					sliced_data[getKeyByValue(TOPICS, data.keys[i])] = data[data.keys[i]].slice(0,3);
				}
				sliced_data['users_data'] = data.users_data;
				setScoreData(sliced_data)
			})
			.catch(err => console.log(err))
		}
		
	}, [props.isExpert])
	return(
	<Panel id={props.id}>
		{props.isExpert === null ? <ScreenSpinner /> : props.isExpert || 
		<Group>
			<Placeholder
			icon={<Icon56ErrorTriangleOutline />}
			action={
				<Button
				size='m'
				mode='tertiary'
				href={GENERAL_LINKS.who_experts}
				target="_blank" rel="noopener noreferrer">
					Кто такие эксперты?
				</Button>
			}>
				Вы не являетесь экспертом ВКонтакте
			</Placeholder>
		</Group>
		
		}
		{props.isExpert === null ? <ScreenSpinner /> : props.isExpert &&
		<>{getKeyByValue(TOPICS, props.userInfo.topic_name) === props.activeTopic ? <Group>
			<Placeholder
			icon={<Icon56NotebookCheckOutline />}
			action={<Button
					size='m'
					href={GENERAL_LINKS.community}
					target="_blank" rel="noopener noreferrer"
					mode='primary'>
						Да, хочу курировать тематику
					</Button>}>
				Вы представитель тематики: {props.userInfo.topic_name}? 
			</Placeholder>
			
		</Group> :
		<Group>
			<Placeholder
			icon={<Icon56UsersOutline />}>
					Если ваш знакомый хочет курировать данный раздел, попросите его подать заявку через сообщения сообщества
			</Placeholder>
		</Group>}
		<Group>
			<SimpleCell
			before={<Icon28FireOutline />}
			expandable
			target="_blank" rel="noopener noreferrer"
			href={GENERAL_LINKS.prometeus}>
				Об огне Прометея
			</SimpleCell>
			<SimpleCell
			expandable
			target="_blank" rel="noopener noreferrer"
			href={GENERAL_LINKS.scores}
			before={<Icon28MoneyWadOutline />}>
				Баллы экспертов и магазин
			</SimpleCell>
			<SimpleCell
			expandable
			target="_blank" rel="noopener noreferrer"
			href={GENERAL_LINKS.market}
			before={<Icon28MarketOutline />}>
				Магазин
			</SimpleCell>
			<SimpleCell
			expandable
			target="_blank" rel="noopener noreferrer"
			href={GENERAL_LINKS.billing}
			before={<Icon28WalletOutline />}>
				Детализация счета
			</SimpleCell>
			<SimpleCell
			expandable
			target="_blank" rel="noopener noreferrer"
			href={GENERAL_LINKS.ideas_for_guide}
			before={<Icon28ArchiveOutline />}>
				Предложить идею для справочника
			</SimpleCell>
		</Group>
		<Group header={<SimpleCell disabled description='Обновлен в течении недели'>Рейтинг</SimpleCell>}>
			{scoreData === null ? <ScreenSpinner />:
			scoreData && scoreGenerator()}

		</Group></>}

		<Group>
			{props.isExpert === null ? <ScreenSpinner /> : props.isExpert ?
			<RichCell
			disabled
			multiline
			before={<Avatar size={72} src={fun_experts_community}></Avatar>}
			actions={
				<Button size='m'
				href='https://vk.com/clubvkexperts'
				target="_blank" rel="noopener noreferrer">
					Перейти в сообщество
				</Button>
			}
			caption='Закрытый неофициальный клуб экспертов ВКонтакте. Здесь
			происходит вся магия: мы публикуем информационный контент
			для экспертов, чтобы улучшить ценность контент-индустрии
			курируемой тематической ленты.'>
				Клуб экспертов ВКонтакте
			</RichCell>
			:
			<RichCell
			multiline
			disabled
			before={<Avatar size={72} src={experts_community}></Avatar>}
			actions={
				<Button size='m'
				href='https://vk.me/vkexperts'
				target="_blank" rel="noopener noreferrer"
				>
					Подать заявку в сообщество
				</Button>
			}
			caption='Вступите в ряды экспертов ВКонтакте и отмечайте лучшие публикации
			своей тематической ленты.'>
				<div style={{display: 'flex'}}>Эксперты ВКонтакте <Icon16Verified className='verified' /></div>
			</RichCell>}
		</Group>
		{props.isExpert === null ? <ScreenSpinner /> : props.isExpert &&
		<Group>
			<SimpleCell
			expandable
			target="_blank" rel="noopener noreferrer"
			href={linksConstructor(BASE_LINKS_MENU.interactive)}
			before={<Icon28StudOutline />}>
				Интерактив
			</SimpleCell>
			<SimpleCell
			expandable
			target="_blank" rel="noopener noreferrer"
			href={linksConstructor(BASE_LINKS_MENU.podcasts)}
			before={<Icon28PodcastOutline />}>
				Подкасты
			</SimpleCell>
			<SimpleCell
			expandable
			target="_blank" rel="noopener noreferrer"
			href={linksConstructor(BASE_LINKS_MENU.materials)}
			before={<Icon28LikeOutline />}>
				Полезный материал
			</SimpleCell>
			<SimpleCell
			expandable
			target="_blank" rel="noopener noreferrer"
			href={linksConstructor(BASE_LINKS_MENU.plots)}
			before={<Icon28Square4Outline />}>
				Сюжеты
			</SimpleCell>
			<SimpleCell
			expandable
			disabled
			style={{opacity: '.4'}}
			before={<Icon28TextLiveOutline />}>
				Репортажи
			</SimpleCell>
			<Div>
				<Footer style={{textAlign: 'left', margin: 0}}>
					Если у вас появилась ошибка «Вы не можете просматривать стену этого сообщества» перейдите в клуб экспертов ВКонтакте и подайте заявку.
				</Footer>
			</Div>
			
		</Group>}

	</Panel>
	);
}

