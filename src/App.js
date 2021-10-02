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
	Panel,
	PanelHeader,
	SplitLayout,
	SplitCol,
	Group,
	Button,
	SimpleCell,
	Text,
	Div,
	Link,
	Spacing,
	PanelSpinner,
	Epic,
	Tabbar,
	TabbarItem,
} from '@vkontakte/vkui';
import {
	Icon28BrainOutline,
	Icon28HomeOutline,
	Icon28UserCardOutline,
	Icon28ListOutline,
	Icon28ReportOutline,
	Icon28UserCircleOutline,
	Icon28HelpCircleOutline,
} from '@vkontakte/icons'
import {
	EpicMenuCell,
	ProfileInfo,
} from './components'
import '@vkontakte/vkui/dist/vkui.css';
import './styles/styles.css';
import { calculateAdaptivity } from './functions/calcAdaptivity';
import Topics from './panels/Topics';
import Curators from './panels/Curators';
import Home from './panels/Home';
import Loader from './panels/Loader';
import UsersInfoGet from './panels/UsersInfoGet';
import Profile from './panels/Profile';
import Reports from './panels/Reports';
import Help from './panels/faq/main';
import HelpCC from './panels/faq/createCategory';
import HelpCQ from './panels/faq/createQuestion';
import HelpQ from './panels/faq/question';
import HelpQL from './panels/faq/questionsList';
import Disconnect from './panels/Disconnect/main'
import { ACTIONS_NORM, API_URL, GENERAL_LINKS, ICON_TOPICS, TOPICS } from './config';
import { errorAlertCreator, getKeyByValue } from './functions/tools';
import { useDispatch, useSelector } from 'react-redux';
import { accountActions, viewsActions } from './store/main';
const scheme_params = {

	bright_light: { "status_bar_style": "dark", "action_bar_color": "#FFFFFF", 'navigation_bar_color': "#FFFFFF" },
	space_gray: { "status_bar_style": "light", "action_bar_color": "#19191A", 'navigation_bar_color': "#19191A" }
  }
var backTimeout = false;
const platformname = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
const App = () => {
	const dispatch = useDispatch();
	const { user: userInfo, schemeSettings: {scheme}} = useSelector((state) => state.account)
	const { activeStory, historyPanels, snackbar, activePanel, need_epic } = useSelector((state) => state.views)
	const setHistoryPanels = useCallback((history) => dispatch(viewsActions.setHistory(history)), [dispatch]);
  	const setActiveScene = useCallback((story, panel) => dispatch(viewsActions.setActiveScene(story, panel)), [dispatch]);
	const [vkInfoUser, setVkInfoUser] = useState(null);
	const [achievements, setAchievements] = useState(null);
	const [isExpert, setIsExpert] = useState(null);
	const [popout, setPopout] = useState(<ScreenSpinner size='large' />);
	const [actsWeek, setActsWeek] = useState(0);
	const [activeTopic, setActiveTopic] = useState('art')
	const [tokenSearch, setTokenSearch] = useState('');
	
	const platformvkui = usePlatform();
	const platform = useRef();
	const viewWidthVk = useAdaptivity().viewWidth;
	const isDesktop = useRef();
	const hasHeader = useRef()

	const setHash = (hash) => {
	  if(window.location.hash !== ''){
		bridge.send("VKWebAppSetLocation", {"location": hash});
		window.location.hash = hash
	  }
	}
	const goPanel = useCallback((view, panel, forcePanel=false, replaceState=false) => {
    
		const checkVisitedView = (view) => {
		  let history = [...historyPanels];
		  history.reverse();
		  let index = history.findIndex(item => item.view === view)
		  if(index !== -1) {
		   return history.length - index
		  } else {
			return null;
		  }
		}
		const historyChange = (history, view, panel, replaceState) => {
		  if(replaceState){
			history.pop();
			history.push({view, panel });
			window.history.replaceState({ view, panel }, panel);
		  } else {
			history.push({view, panel });
			window.history.pushState({ view, panel }, panel);
		  }
		  return history;
		}
		let history = [...historyPanels];
		if(forcePanel){
		  history = historyChange(history, view, panel, replaceState)
		}else{
		  let index = checkVisitedView(view);
		  if(index !== null){
			let new_history = history.slice(0, index);
			history = new_history
			window.history.pushState({ view, panel }, panel);
			({view, panel} = history[history.length - 1])
		  } else {
			history = historyChange(history, view, panel, replaceState)
		  }
		}
		setHistoryPanels(history);
		setActiveScene(view, panel)
		bridge.send('VKWebAppEnableSwipeBack');
	  }, [setActiveScene, historyPanels, setHistoryPanels])
	const goDisconnect = () => {
		goPanel('disconnect', 'disconnect');
	}
	const showErrorAlert = (error = null, action = null) => {
		errorAlertCreator(setPopout, error, action)
	}
	const Init = useCallback(() => {
		const brigeSchemeChange = (params) => {
			bridge.send("VKWebAppSetViewSettings", params);
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
		
		bridge.send("VKWebAppInit");
		async function fetchData() {
			const user = await bridge.send('VKWebAppGetUserInfo');
			setVkInfoUser(user);
			fetch(API_URL + 'method=account.get&' + window.location.search.replace('?', ''))
			.then(data => data.json())
			.then(data => {
				if(!data.result) throw Error('no data')
				let info = data.response['expert_info'];
				setIsExpert(info['is_expert'])
				let user = info['info'];
				setAchievements(data.response.achievements)
				if(user.actions_current_week >= ACTIONS_NORM) {
					setActsWeek(700);
				}else{
					setTimeout(() => {
						setActsWeek(user.actions_current_week)
					},500)
				}
				if(info['is_expert']) setActiveTopic(getKeyByValue(TOPICS, user.topic_name));
				let finalUser = data.response;
				finalUser.expert_info = user
				dispatch(accountActions.setUser(finalUser))
				if(info['is_expert']) {
					goPanel('home', 'home', true, true)
				}else {
					dispatch(viewsActions.setNeedEpic(false))
					goPanel('topics', 'topics', true, true)
				}
				
				setPopout(null);
				
				bridge.send("VKWebAppSendPayload", {"group_id": 206651170, "payload": {'action': 'openapp', "is_expert": info['is_expert'], 'poshil_naher': 'kozel'}});
			})
			.catch(err => {setPopout(null);goDisconnect()})
			
		}
		fetchData();
		bridge.send("VKWebAppGetAuthToken", {"app_id": 7934508, "scope": ""})
			.then(data => {
				setTokenSearch(data.access_token);
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
	  }, [historyPanels, setHistoryPanels, setActiveScene])
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
			let my_topic = iconTopics_actual.splice(my_topic_index, my_topic_index+1);
			iconTopics_actual.unshift(my_topic[0])
		}
		return iconTopics_actual;
	}

	const genRightMenu = () => {
		let menu_render = [];
		let iconTopics_actual = getActualTopic();
		iconTopics_actual.forEach((val, i) => {
			let Icon = val.icon
			menu_render.push(
				<EpicMenuCell
				activePanel={activePanel}
				key={val.topic}
				disabled={!isExpert}
				activeTopic={activeTopic}
				topic={getKeyByValue(TOPICS, val.topic)}
				icon={<Icon style={{color: val.color}} />}
				goPanel={goPanel}
				setActiveTopic={setActiveTopic}>
					{val.topic}
				</EpicMenuCell>
			)
		})
		return menu_render
	}
	const onEpicTap = (e) => {
		setActiveScene(e.currentTarget.dataset.story, e.currentTarget.dataset.story);
	}
	const callbacks = {showErrorAlert, goPanel}
	const navigation = {goDisconnect}
	const Views = [
		<View id='home' activePanel={activePanel} key='home'>
			<Home
			id='home'
			goPanel={goPanel}
			/>
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
			id='help' />
			<HelpCC
			id='faqCreateCategory'
			navigation={navigation}
			callbacks={callbacks} />
			<HelpCQ
			id='faqCreateQuestion'
			navigation={navigation}
			callbacks={callbacks} />
			<HelpQ
			id='faqQuestion'
			navigation={navigation}
			callbacks={callbacks} />
			<HelpQL
			id='faqQuestions'
			navigation={navigation}
			callbacks={callbacks} />

		</View>,
		<Disconnect id='disconnect' restart={Init} key='disconnect' />,
		<View id='loader' activePanel={activePanel} key='loader'>
			<Loader 
			id='load' />
		</View>,
	];
	
	return (
		
		<ConfigProvider scheme={scheme} platform={platform.current}>
			
			<AppRoot>
				<SplitLayout
					style={{ justifyContent: "center" }}
					popout={popout}>
					
					<SplitCol
					animate={!isDesktop.current}
					spaced={isDesktop.current}
					width={isDesktop.current ? '704px' : '100%'}
					maxWidth={isDesktop.current ? '704px' : '100%'}>
						<SkeletonTheme color={scheme === 'bright_light' ? undefined : '#232323'} highlightColor={scheme === 'bright_light' ? undefined : '#6B6B6B'}>
						<Epic activeStory={activeStory}
						tabbar={!isDesktop.current && need_epic && 
							<Tabbar>
								<TabbarItem
								data-story='home'
								selected={activeStory === 'home'}
								onClick={onEpicTap}
								text='Главная'>
									<Icon28HomeOutline />
								</TabbarItem>
								<TabbarItem
								data-story='searchInfo'
								selected={activeStory === 'searchInfo'}
								onClick={onEpicTap}
								text='Участники'>
									<Icon28UserCardOutline />
								</TabbarItem>
								<TabbarItem
								data-story='topics'
								selected={activeStory === 'topics'}
								onClick={onEpicTap}
								text='Тематики'>
									<Icon28ListOutline />
								</TabbarItem>
								<TabbarItem
								data-story='reports'
								selected={activeStory === 'reports'}
								onClick={onEpicTap}
								text='Репорты'>
									<Icon28ReportOutline />
								</TabbarItem>
								<TabbarItem
								data-story='help'
								selected={activeStory === 'help'}
								onClick={onEpicTap}
								text='Помощь'>
									<Icon28HelpCircleOutline />
								</TabbarItem>
								<TabbarItem
								data-story='profile'
								selected={activeStory === 'profile'}
								onClick={onEpicTap}
								text='Профиль'>
									<Icon28UserCircleOutline />
								</TabbarItem>
							</Tabbar>
						}>
							
							{Views}
							
						</Epic>
						</SkeletonTheme>
					</SplitCol>
					{isDesktop.current && userInfo.expert_info &&
					<SplitCol fixed width="280px" maxWidth="280px">
						<Panel id='menu_epic'>
							{hasHeader.current && <PanelHeader/>}
							{isExpert === null ? <PanelSpinner /> : isExpert &&
							<><Group>
								<ProfileInfo
								activePanel={activePanel}
								actsWeek={actsWeek}
								vkInfoUser={vkInfoUser}
								userInfo={userInfo.expert_info}
								goPanel={goPanel} />
							</Group>
							<Group>
								<SimpleCell
								style={{color: '#626D7A'}}
								href={GENERAL_LINKS.experts_card}
								target="_blank" rel="noopener noreferrer"
								before={<Icon28BrainOutline style={{color: '#99A2AD'}} />}>
									Карточка эксперта
								</SimpleCell>
								<Spacing separator />
								<SimpleCell
								disabled={activeStory === 'home'}
								style={activeStory === 'home' ? {
									backgroundColor: "var(--button_secondary_background)",
									borderRadius: 8,
									color: '#626D7A'} : {color: '#626D7A'}}
								onClick={() => goPanel('home', 'home')}
								before={<Icon28HomeOutline style={{color: '#99A2AD'}} />}>
									Главная
								</SimpleCell>
								<SimpleCell
								disabled={activeStory === 'searchInfo'}
								style={activeStory === 'searchInfo' ? {
									backgroundColor: "var(--button_secondary_background)",
									borderRadius: 8,
									color: '#626D7A'} : {color: '#626D7A'}}
								onClick={() => goPanel('searchInfo', 'searchInfo')}
								before={<Icon28UserCardOutline style={{color: '#99A2AD'}} />}>
									Участники
								</SimpleCell>
								<SimpleCell
								disabled={activeStory === 'reports'}
								style={activeStory === 'reports' ? {
									backgroundColor: "var(--button_secondary_background)",
									borderRadius: 8,
									color: '#626D7A'} : {color: '#626D7A'}}
								onClick={() => goPanel('reports', 'reports')}
								before={<Icon28ReportOutline style={{color: '#99A2AD'}} />}>
									Пожаловаться
								</SimpleCell>
								<SimpleCell
								disabled={activeStory === 'help'}
								style={activeStory === 'help' ? {
									backgroundColor: "var(--button_secondary_background)",
									borderRadius: 8,
									color: '#626D7A'} : {color: '#626D7A'}}
								onClick={() => goPanel('help', 'help')}
								before={<Icon28HelpCircleOutline style={{color: '#99A2AD'}} />}>
									Помощь
								</SimpleCell>
							</Group></>}
							<Group>
								{genRightMenu()}
							</Group>
							{isExpert ? <Group>
								<Div>
									<Text style={{color: 'var(--subtext)'}}>
										Какие тематики вы хотели бы видеть в ленте <Link
											href='https://vk.com/faq18060'
											target="_blank" rel="noopener noreferrer"
											>
											Рекомендаций
											</Link>?
									</Text>
								</Div>
								<Div>
									<Button mode='secondary'
									size='l'
									stretched
									target="_blank" rel="noopener noreferrer"
									href={GENERAL_LINKS.ideas}>
										Предложить тематику
									</Button>
								</Div>
								
							</Group>: 
							<Group>
								<Div>
									<Text style={{color: 'var(--subtext)'}}>
										Тематические ленты: лучшее про Ваши увлечения
									</Text>
								</Div>
								<Div>
									<Button mode='secondary'
									size='l'
									stretched
									target="_blank" rel="noopener noreferrer"
									href={GENERAL_LINKS.more_about_experts}>
										Узнать подробнее
									</Button>
								</Div>
							</Group>}
						</Panel>
					</SplitCol>}
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
