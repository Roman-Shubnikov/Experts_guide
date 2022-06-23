import React, { useState, useEffect, useRef, useCallback } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { SkeletonTheme } from "react-loading-skeleton";
import {
	View, 
	ScreenSpinner, 
	AdaptivityProvider, 
	AppRoot, 
	ConfigProvider,
	ViewWidth,
	VKCOM,
	usePlatform,
	Platform,
	useAdaptivity,
	SplitLayout,
	SplitCol,
	Epic,
	Tabbar,
	CellButton,
	FixedLayout,
	ModalCard,
	ModalRoot,
	Button,

} from '@vkontakte/vkui';
import {
	Icon28BrainOutline,
	Icon56NewsfeedOutline,

} from '@vkontakte/icons'
import '@vkontakte/vkui/dist/vkui.css';
import "@vkontakte/vkui/dist/unstable.css";
import './styles/styles.css';
import { calculateAdaptivity } from './functions/calcAdaptivity';
import { 
	CreatePosts,
	Reports,
	Profile,
	UsersInfoGet,
	Loader,
	Home,
	Curators,
	Topics,
	Help,
	HelpCategories,
	HelpCreateCategory,
	HelpCreateQuestion,
	HelpQuestion,
	Disconnect,

} from './panels';
import { ACTIONS_NORM, API_URL, APP_ID, ICON_TOPICS, TOPICS } from './config';
import { enumerate, errorAlertCreator, getKeyByValue } from './functions/tools';
import { useDispatch, useSelector } from 'react-redux';
import { accountActions, storActions, viewsActions } from './store/main';
import { useNavigation } from './hooks';
const scheme_params = {

	bright_light: { "status_bar_style": "dark", "action_bar_color": "#FFFFFF", 'navigation_bar_color': "#FFFFFF" },
	space_gray: { "status_bar_style": "light", "action_bar_color": "#19191A", 'navigation_bar_color': "#19191A" }
  }
var backTimeout = false;
const platformname = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
const App = () => {
	const dispatch = useDispatch();
	const { 
		user: userInfo, 
		schemeSettings: {scheme}, 
		activeTopic, 
		tokenSearch
	} = useSelector((state) => state.account);
	const modalClose = () => setActiveModal(null);
	const { setActiveScene, goPanel, setHash, setActiveModal, currentModal } = useNavigation();
	const { activeStory, historyPanels, snackbar, activePanel, need_epic } = useSelector((state) => state.views)
	const setHistoryPanels = useCallback((history) => dispatch(viewsActions.setHistory(history)), [dispatch]);
	const setCuratorsData = useCallback((data) => dispatch(accountActions.setCurators(data)), [dispatch]);
  	
	const setActiveTopic = useCallback((data) => dispatch(accountActions.setActiveTopic(data)), [dispatch]);
	const setTokenSearch = useCallback((data) => dispatch(accountActions.setTokenSearch(data)), [dispatch]);
	const setScoreData = useCallback((data) => dispatch(storActions.setScoreData(data)), [dispatch]);
	const setTopics = useCallback((data) => dispatch(storActions.setTopics(data)), [dispatch]);
	const [vkInfoUser, setVkInfoUser] = useState(null);
	
	const [achievements, setAchievements] = useState(null);
	const [isExpert, setIsExpert] = useState(null);
	const [popout, setPopout] = useState(<ScreenSpinner size='large' />);
	const [actsWeek, setActsWeek] = useState(0);
	
	const platformvkui = usePlatform();
	const platform = useRef();
	const viewWidthVk = useAdaptivity().viewWidth;
	const isDesktop = useRef();
	const hasHeader = useRef()

	
	const goDisconnect = (e) => {
		console.log(e)
		goPanel('disconnect', 'disconnect');
	}
	const showErrorAlert = (error = null, action = null) => {
		errorAlertCreator(setPopout, error, action)
	}
	const Init = useCallback(async () => {
		const brigeSchemeChange = (params) => {
			// bridge.send("VKWebAppSetViewSettings", params);
		  }
		bridge.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				let new_scheme = data.scheme ? data.scheme : 'client_light';
				dispatch(accountActions.setScheme({ scheme: new_scheme}))
				if(platformname){
					switch (new_scheme) {
						case 'bright_light':
						  brigeSchemeChange(scheme_params.bright_light)
						  break;
						case 'space_gray':
						  brigeSchemeChange(scheme_params.space_gray)
						  break;
						default:
						  brigeSchemeChange(scheme_params.bright_light)
					}
				}
				
			}
		});
		
		
		async function fetchData(token) {
			const user = await bridge.send('VKWebAppGetUserInfo');
			setVkInfoUser(user);
			fetch(API_URL + 'method=account.get&' + window.location.search.replace('?', ''))
			.then(data => data.json())
			.then(data => {
				if(!data.result) throw Error('no data')
				let info = data.response.expert_info;
				setIsExpert(info.is_expert)
				let useri = info.info;
				setAchievements(data.response.achievements)
				if(useri.actions_current_week >= ACTIONS_NORM) {
					setActsWeek(700);
				}else{
					setTimeout(() => {
						setActsWeek(useri.actions_current_week)
					},500)
				}
				if(info.is_expert) setActiveTopic(getKeyByValue(TOPICS, useri.topic_name));
				let finalUser = data.response;
				finalUser.expert_info = useri
				finalUser.vk_info = user;
				dispatch(accountActions.setUser(finalUser))
				if(info.is_expert) {
					goPanel('home', 'home', true, true)
					
					fetch(API_URL + `method=service.getActivists&` + window.location.search.replace('?', ''))
					.then(data => data.json())
					.then(curators_data => {
						bridge.send('VKWebAppCallAPIMethod', {
							method: 'users.get',
							params: {
								user_ids: curators_data.response.slice().toString(),
								fields: 'photo_100,screen_name,online',
								v: "5.131", 
								access_token: token,
							}
						})
						.then((data) => {
							let vk_curators_info = [...data.response]
							fetch(API_URL + `method=experts.getInfo&` + window.location.search.replace('?', ''),
							{
								method: 'post',
								headers: { "Content-type": "application/json; charset=UTF-8" },
								body: JSON.stringify({
									user_ids: curators_data.response.slice().toString()
								})
							})
							.then(data => data.json())
							.then(data => {
								let modify_data = [...data.response]
								modify_data = modify_data.map(i => i.info)
								vk_curators_info = vk_curators_info.map((item) => {
									let new_item = {...item};
									new_item.topic = modify_data.find((i) => i.user_id === item.id).topic_name
									return new_item
								})
								setCuratorsData(vk_curators_info)
							})
							.catch(e => console.log(e))
						})
					})
					.catch(e => console.log(e))

					fetch(API_URL + 'method=experts.getTop&' + window.location.search.replace('?', ''))
						.then(data => data.json())
						.then(data => {
							data = data.response
							let sliced_data = {}
							for(let i =0; i<data.keys.length;i++) {
								sliced_data[getKeyByValue(TOPICS, data.keys[i])] = data[data.keys[i]];
							}
							sliced_data['users_data'] = data.users_data;
							setScoreData(sliced_data)
						})
						.catch(err => console.log(err))

					fetch(API_URL + 'method=service.getTopics&' + window.location.search.replace('?', ''))
					.then(data => data.json())
					.then(data => {
						setTopics(data.response)
					})
					.catch(e => goDisconnect(e))
						
				}else {
					dispatch(viewsActions.setNeedEpic(false))
					goPanel('topics', 'topics', true, true)
				}
				
				setPopout(null);
				
				bridge.send("VKWebAppSendPayload", {"group_id": 206651170, "payload": {'action': 'openapp', "is_expert": info['is_expert'], 'poshil_naher': 'kozel'}});
			})
			.catch(err => {setPopout(null);goDisconnect(err)})
			
		}
		await bridge.send("VKWebAppInit");
		bridge.send("VKWebAppGetAuthToken", {"app_id": APP_ID, "scope": ""})
			.then(token => {
				setTokenSearch(token.access_token);
				console.log(token);
				fetchData(token.access_token);
				
			})
		
			// eslint-disable-next-line
	}, [])
	useEffect(() => {
		Init()

	}, [Init]);
	const goBack = useCallback(() => {
		let history = [...historyPanels]
		if(!backTimeout) {
		  backTimeout = true;
		  if (history.length <= 1) {
			  bridge.send("VKWebAppClose", {"status": "success"});
		  } else {
			if(history[history.length] >= 2) {
			  bridge.send('VKWebAppDisableSwipeBack');
			}
			setHash('');
			history.pop()
			let {view, panel} = history[history.length - 1];
			setActiveScene(view, panel)
			setPopout(<ScreenSpinner />)
			setTimeout(() => {
				setPopout(null)
			  }, 500)
		  }
		  setHistoryPanels(history)
		  setTimeout(() => {backTimeout = false;}, 500)
		  
		}else{
		  window.history.pushState({ ...history[history.length - 1] }, history[history.length - 1].panel );
		}
	  }, [historyPanels, setHistoryPanels, setActiveScene, setHash])
	const handlePopstate = useCallback((e) => {
		e.preventDefault();
		goBack();
	  }, [goBack]);
	useEffect(() => {
	  if (platformname) {
		platform.current = platformvkui;
	  } else {
		platform.current = Platform.VKCOM;
	  }
	}, [platformvkui])

	useEffect(() => {
		window.addEventListener('popstate', handlePopstate);
		return () => {
		  window.removeEventListener('popstate', handlePopstate)
		}
	  }, [handlePopstate])
	
	useEffect(() => {
	  hasHeader.current = platform.current !== VKCOM;
	  isDesktop.current = viewWidthVk >= ViewWidth.SMALL_TABLET;
	}, [viewWidthVk, platform])

	const getActualTopic = () => {
		let my_topic_index = ICON_TOPICS.findIndex((val, i) => val.topic === userInfo.expert_info.topic_name)
		let iconTopics_actual = ICON_TOPICS.slice();
		if(isExpert && my_topic_index !== -1){
			let my_topic = iconTopics_actual.splice(my_topic_index, 1);
			iconTopics_actual.unshift(my_topic[0])
		}
		return iconTopics_actual;
	}

	
	
	const callbacks = {showErrorAlert, goPanel}
	const navigation = {goDisconnect, setPopout}
	const Views = [
		<View id='home' activePanel={activePanel} key='home'>
			<Home
			id='home'
			navigation={navigation}
			goPanel={goPanel}
			/>
			<CreatePosts
			id='createposts'
			navigation={navigation}
			callbacks={callbacks} />
		</View>,
		<View id='topics' activePanel={activePanel} key='topics'>
			<Topics id='topics'
			activeTopic={activeTopic}
			vkInfoUser={vkInfoUser} 
			isExpert={isExpert}
			userInfo={userInfo.expert_info}
			actsWeek={actsWeek}
			getActualTopic={getActualTopic}
			setActiveTopic={setActiveTopic} />
		</View>,
		<View id='curators' activePanel={activePanel} key='curators'>
			<Curators
			id='curators'
			tokenSearch={tokenSearch} />
		</View>,
		<View id='searchInfo' activePanel={activePanel} key='searchInfo'>
			<UsersInfoGet
			id='searchInfo'
			tokenSearch={tokenSearch} />
		</View>,
		<View id='profile' activePanel={activePanel} key='profile'>
			<Profile 
			id='profile'
			userInfo={userInfo.expert_info}
			vkInfoUser={vkInfoUser}
			goPanel={goPanel}
			achievements={achievements} />
		</View>,
		<View id='reports' activePanel={activePanel} key='reports'>
			<Reports
			userInfo={userInfo.expert_info}
			tokenSearch={tokenSearch}
			showErrorAlert={showErrorAlert}
			id='reports' />
		</View>,
		<View id='help' activePanel={activePanel} key='help'>
			<Help
			navigation={navigation}
			callbacks={callbacks}
			id='helpQuestions' />
			<HelpCategories
			id='help'
			navigation={navigation}
			callbacks={callbacks} />
			<HelpCreateCategory
			id='faqCreateCategory'
			navigation={navigation}
			callbacks={callbacks} />
			<HelpCreateQuestion
			id='faqCreateQuestion'
			navigation={navigation}
			callbacks={callbacks} />
			<HelpQuestion
			id='faqQuestion'
			navigation={navigation}
			callbacks={callbacks} />

		</View>,
		<Disconnect id='disconnect' restart={Init} key='disconnect' />,
		<View id='loader' activePanel={activePanel} key='loader'>
			<Loader 
			id='load' />
		</View>,
	];
	const modals = (
		<ModalRoot
		onClose={modalClose}
		activeModal={currentModal}>
		  <ModalCard
			id='answers'
			onClose={modalClose}
			icon={<Icon56NewsfeedOutline />}
			header={(ACTIONS_NORM - userInfo.expert_info?.actions_current_week < 0) ? "Порог достигнут" : 
			'Вы оценили ' + userInfo.expert_info?.actions_current_week + " " + enumerate(userInfo.expert_info?.actions_current_week, ['запись', 'записи', 'записей'])}
			subheader={(ACTIONS_NORM - userInfo.expert_info?.actions_current_week < 0) ? 
			<p><b>Порог достигнут.</b><br/>
			<br/>Но это не повод расслабляться. Публикации интересных авторов не ждут.</p> : "Для преодоления порога необходимо оценить ещё " +
			  (ACTIONS_NORM - userInfo.expert_info?.actions_current_week) +
			  " " + enumerate(userInfo.expert_info?.actions_current_week, ['запись', 'записи', 'записей'])}
			actions={<Button mode='primary' stretched size='l' onClick={modalClose}>Понятно</Button>}>
		  </ModalCard>
		</ModalRoot>
	  )
	return (
		
		<ConfigProvider scheme={scheme} platform={platform.current}>
			
			<AppRoot>
				<SplitLayout
					modal={modals}
					style={{ justifyContent: "center" }}
					popout={popout}>
					
					<SplitCol
					width='100%'
					maxWidth='100%'>
						<SkeletonTheme color={['bright_light', 'vkcom_light'].indexOf(scheme) !== -1 ? undefined : '#232323'} 
						highlightColor={['bright_light', 'vkcom_light'].indexOf(scheme) !== -1 ? undefined : '#6B6B6B'}>
						<Epic activeStory={activeStory}
						tabbar={need_epic && 
							<Tabbar>
								{isExpert && <CellButton
								before={<Icon28BrainOutline />}
								onClick={() => bridge.send(
									'VKWebAppOpenApp',
									{
										app_id: 7171491,
										location: ''
									}
								)}>
									Моя карточка эксперта
								</CellButton>}
							</Tabbar>
						}>
							
							{Views}
							<FixedLayout>
							{isExpert && <CellButton
								before={<Icon28BrainOutline />}
								onClick={() => bridge.send(
									'VKWebAppOpenApp',
									{
										app_id: 7171491,
										location: ''
									}
								)}>
									Моя карточка эксперта
								</CellButton>}
							</FixedLayout>
						</Epic>
						</SkeletonTheme>
					</SplitCol>
					{/* {userInfo.expert_info &&
					<SplitCol fixed width="280px" maxWidth="280px">
						<Panel id='menu_epic'>
							{hasHeader.current && <PanelHeader/>}
							{activeStory === "help" && activePanel === 'help' && faqActiveTab === "list" && 
							<HelpCategories
							navigation={navigation}
							callbacks={callbacks}
							id='help' />
							}
							{activeStory === "home" && <Group>
								{genRightMenu()}
							</Group>}
							{activeStory === 'profile' && <Group>
								<SimpleCell 
								href={GENERAL_LINKS.info_expers}
								target="_blank" rel="noopener noreferrer"
								before={<Icon28NameTagOutline />}
								className='subtext'>
									Информация
								</SimpleCell>
								<SimpleCell 
								href={GENERAL_LINKS.expert_rules}
								target="_blank" rel="noopener noreferrer"
								before={<Icon28LogoVkOutline />}
								className='subtext'>
									Правила программы
								</SimpleCell>
								<Spacing separator />
								<SimpleCell 
								href={GENERAL_LINKS.points}
								target="_blank" rel="noopener noreferrer"
								before={<Icon28MoneyWadOutline />}
								className='subtext'>
									Баллы экспертов
								</SimpleCell>
								<SimpleCell 
								href={GENERAL_LINKS.market}
								target="_blank" rel="noopener noreferrer"
								before={<Icon28StorefrontOutline />}
								className='subtext'>
									Магазин
								</SimpleCell>
								<SimpleCell 
								href={GENERAL_LINKS.orders}
								target="_blank" rel="noopener noreferrer"
								before={<Icon28InboxOutline />}
								className='subtext'>
									Заказы
								</SimpleCell>
								<SimpleCell 
								href={GENERAL_LINKS.billing}
								target="_blank" rel="noopener noreferrer"
								before={<Icon28WalletOutline />}
								className='subtext'>
									Детализация счёта
								</SimpleCell>
								<Spacing separator />
								<SimpleCell 
								href={GENERAL_LINKS.feedback}
								target="_blank" rel="noopener noreferrer"
								before={<Icon28MessagesOutline />}
								className='subtext'>
									Обратная связь
								</SimpleCell>
							</Group>}
						</Panel>
					</SplitCol>} */}
					{snackbar}
				</SplitLayout>
			</AppRoot>
		
		</ConfigProvider>
		
	);
}
export default () => (
	<AdaptivityProvider viewWidth={ calculateAdaptivity( document.documentElement.clientWidth, document.documentElement.clientHeight).viewWidth}>
    	<App />
  	</AdaptivityProvider>
);
