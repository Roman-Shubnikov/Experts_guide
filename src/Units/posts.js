import React, { useEffect, useState } from 'react';
import {
	Group,
    PanelSpinner,
    Avatar,
    Placeholder,
    SimpleCell,

} from '@vkontakte/vkui';
import { API_URL } from '../config';
import { useSelector } from 'react-redux';

export const Posts = props => {
    const [posts, setPosts] = useState(null)
    const [posts_well, setPosts_well] = useState(null);
    const { activeTopic } = useSelector(state => state.account);
    const { goDisconnect } = props.navigation;
    const getPosts = () => {
        fetch(API_URL + 'method=posts.get&' + window.location.search.replace('?', ''))
			.then(data => data.json())
			.then(data => {
				setPosts(data.response)
			})
			.catch(e => goDisconnect())
    }
    useEffect(() => {
        getPosts()
        // eslint-disable-next-line
    }, [])
    useEffect(() => {
        if(!posts) return
        let new_posts = [...posts];
        new_posts = new_posts.filter(i => (i.topic === activeTopic) || (i.topic === 'all'));
        setPosts_well(new_posts);
    }, [posts, activeTopic])
    return(
        <Group>
            {posts_well ? 
            posts_well.length > 0 ?
            posts_well.map(i => 
            <SimpleCell
            key={i.id}
            before={<Avatar src={i.photo} mode='app' size={72} />}
            href={i.link}
            target="_blank" rel="noopener noreferrer"
            description={i.format}>
                {i.text}
            </SimpleCell>)
            : <Placeholder>
                Постов не найдено
            </Placeholder> :
            <PanelSpinner />
        }
        </Group>
    )
}