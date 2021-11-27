import React, { useState, useEffect, useCallback } from 'react';
import {
	Panel,
	PanelHeader,
	Group,
	Button,
	Select,
	FormItem,
    FormLayout,
	Input,
	PanelHeaderBack,


} from '@vkontakte/vkui';
import { storActions } from '../store/main';
import { useDispatch, useSelector } from 'react-redux';
import { isEmptyObject } from 'jquery';
import { API_URL, TOPICS } from '../config';

export const CreatePosts = props => {
	const dispatch = useDispatch();
	const [topic, setTopic] = useState('');
	const [format, setFormat] = useState('');
	const [link, setLink] = useState('');
	const [fetching, setFetch] = useState(false);
	const { goDisconnect, setPopout } = props.navigation;
	const { showErrorAlert } = props.callbacks;
	const { topics, formats } = useSelector(state => state.stor);
	const setTopics = useCallback((data) => dispatch(storActions.setTopics(data)), [dispatch]);
	const setFormats = useCallback((data) => dispatch(storActions.setFormats(data)), [dispatch]);

	const createPost = () => {
		setFetch(true)
		fetch(API_URL + 'method=posts.create&' + window.location.search.replace('?', ''),
		{
            method: 'post',
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify({
                'link': link,
				'topic_id': Number.parseInt(topic),
				'format_id': Number.parseInt(format),
            })
            })
			.then(data => data.json())
			.then(data => {
				if(data.response){
					setTimeout(() => {
						setFetch(false);
						window.history.back();
					}, 1000)
					
				} else {
					showErrorAlert(data.error.message)
				}
				
			})
			.catch(e => goDisconnect())
	}
	
	useEffect(() => {
		// setPopout(<ScreenSpinner />)
		fetch(API_URL + 'method=service.getTopics&' + window.location.search.replace('?', ''))
			.then(data => data.json())
			.then(data => {
				setTopics(data.response)
			})
			.catch(e => goDisconnect())
		fetch(API_URL + 'method=service.getFormats&' + window.location.search.replace('?', ''))
			.then(data => data.json())
			.then(data => {
				setFormats(data.response);
			})
			.catch(e => goDisconnect())
		// eslint-disable-next-line
	}, [])
	useEffect(() => {
		if(!isEmptyObject(formats) && !isEmptyObject(topics)){
			setPopout(null)
		}
		// eslint-disable-next-line
	}, [formats, topics])
    return(
        <Panel id={props.id}>
            <PanelHeader left={<PanelHeaderBack onClick={() => window.history.back()} />}>
				Публикация записи
            </PanelHeader>
            <Group>
                <FormLayout>
					<FormItem top='Тематика'>
						<Select 
						value={topic}
						onChange={e => setTopic(e.currentTarget.value)}
						options={topics ? topics.map(i => ({label: TOPICS[i.topic_name], value: i.id})) : []} />
					</FormItem>
                    <FormItem top='Ссылка на запись'>
						<Input onChange={e => setLink(e.currentTarget.value)} value={link} />
					</FormItem>
					<FormItem top='Формат'>
						<Select
						onChange={e => setFormat(e.currentTarget.value)}
						options={formats ? formats.map(i => ({label: i.name, value: i.id})) : []} />
					</FormItem>
					<FormItem>
						<Button
						loading={fetching}
						onClick={() => {
							createPost()
						}}>
							Опубликовать
						</Button>
					</FormItem>
                </FormLayout>
            </Group>
        </Panel>
    )
}