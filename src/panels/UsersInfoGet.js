import React, { useState } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { 
	Panel,
	Group, 
	Placeholder,
	IconButton,
	FormLayout,
	FormItem,
	Input,
	PanelSpinner,
	VKCOM,
	usePlatform,
	PanelHeader,

} from '@vkontakte/vkui';
import {
	Icon16Clear,
	Icon56BlockOutline,
	Icon56CancelCircleOutline, 
	Icon56MentionOutline,

} from '@vkontakte/icons'
import { UserGradient } from '../components';
import { API_URL } from '../config';
import { prepareQueryString, resolveScreenName } from '../functions/tools';
let lastTypingTime;
let typing = false;
let searchval = '';
const placeholderTexts = {
	default: 'Начните вводить ссылку пользователя',
	link_error: 'Недопустимый формат или неправильный адрес страницы',
	not_found: 'Данный пользователь не состоит или был исключен из программы экспертов',
	blocked: 'Данный пользователь удалён или заблокирован'
}
export default props => {
	const [searchQuery, setSearchQuery] = useState('');
	const [userSearchedInfo, setInfoUser] = useState(null);
	const [fetching, setFetching] = useState(false);
	const [isExpert, setIsExpert] = useState(false);
	const platform = usePlatform();
	const [placeHolderText,setPlaceholderText] = useState(placeholderTexts.default);
	const { tokenSearch } = props;
	const fetchUser = () => {
		setFetching(true);
		setInfoUser(null);
		setIsExpert(false);
		
		let new_user_info = [];
		searchval = prepareQueryString(searchval)
		resolveScreenName(searchval, tokenSearch).then(search_user => {
			bridge.send('VKWebAppCallAPIMethod', {
				method: 'users.get',
				params: {
					user_id: search_user,
					fields: 'photo_100,screen_name,last_seen',
					v: "5.131", 
					access_token: tokenSearch,
				}
			})
			.then(data => {
				if(data.response[0]?.deactivated) {
					setPlaceholderText(placeholderTexts.blocked);
					setInfoUser(null);
					setFetching(false);
					return;
				};
				if(data.response.length === 0) {
					setPlaceholderText(placeholderTexts.link_error);
					setFetching(false);
					return;
				}
	
				new_user_info.push(data.response[0]);
				fetch(API_URL + 'method=experts.getInfo&' + window.location.search.replace('?', ''),
				{
					method: 'post',
					headers: { "Content-type": "application/json; charset=UTF-8" },
					body: JSON.stringify({
						'user_ids': String(search_user),
					})
				})
				.then(data => data.json())
				.then(data => {
					data = data.response[0]
					console.log(data)
					if(data.is_expert){
						setIsExpert(true)
						let user = data.info;
						new_user_info.push(user);
					} else {
						setPlaceholderText(placeholderTexts.not_found)
						new_user_info.push(null);
					}
					setInfoUser(new_user_info);
					setFetching(false)
				})
				.catch(err => console.log(err))
			})
			.catch(e => {
				setFetching(false);
				setPlaceholderText(placeholderTexts.link_error)
				console.log(e)
			})
		})
		
	}
	const updateTyping = () => {
        if(!typing){
            typing = true;
            
        }
        lastTypingTime = (new Date()).getTime();
        setTimeout(() => {
            const typingTimer = (new Date()).getTime();
            const timeDiff = typingTimer - lastTypingTime;
            if (timeDiff >= 600 && typing) {
                typing = false;
                if(searchval.length === 0) {setInfoUser(null);setPlaceholderText(placeholderTexts.default); return;}
                if(searchval.length <= 0) return;
                fetchUser()
            }
        }, 600)

    }
	const getIconForPlaceholder = () => {
		if(placeHolderText === placeholderTexts.link_error) return <Icon56CancelCircleOutline />
		if(placeHolderText === placeholderTexts.default) return <Icon56MentionOutline />
		if(placeHolderText === placeholderTexts.blocked) return <Icon56BlockOutline />
	}
    return(
        <Panel id={props.id}>
			{platform !== VKCOM && 
            <PanelHeader>Участники</PanelHeader>}
            <Group>
				<FormLayout>
					<FormItem>
						<Input
						placeholder='Введите ссылку на пользователя'
						after={searchQuery!== '' && <IconButton 
							hoverMode="opacity" 
							aria-label="Очистить поле"
							onClick={() => {setSearchQuery('');searchval='';setInfoUser(null);setPlaceholderText(placeholderTexts.default)}}>
								<Icon16Clear/>
							</IconButton>}
						value={searchQuery}
						onChange={e => {
							searchval = e.currentTarget.value
                            setSearchQuery(e.currentTarget.value)
							updateTyping()
							}} />
					</FormItem>
				</FormLayout>
			</Group>
			{userSearchedInfo &&
			<UserGradient 
			placeHolderText={placeHolderText}
			userSearchedInfo={userSearchedInfo}
			isExpert={isExpert}
			tokenSearch={tokenSearch} />
			}
			{(fetching || !userSearchedInfo) && <Group>
				{fetching ? <PanelSpinner /> : 
				!userSearchedInfo && <Placeholder
				icon={getIconForPlaceholder()}>
					{placeHolderText}
				</Placeholder>}
			</Group>}
			
        </Panel>
    )
}