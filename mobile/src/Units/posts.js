import React, { useCallback, useEffect, useState } from 'react';
import {
	Group,
    PanelSpinner,
    Avatar,
    Placeholder,
    SimpleCell,

} from '@vkontakte/vkui';
import { API_URL } from '../config';
import { useDispatch, useSelector } from 'react-redux';
import { storActions } from '../store/main';


let scrollPostsStyle = {height: 252, overflowY: 'scroll'};

export const Posts = props => {
    const dispatch = useDispatch();
    const setPosts = useCallback((data) => dispatch(storActions.setPosts(data)), [dispatch]);
    const [posts_well, setPosts_well] = useState(null);
    const { activeTopic } = useSelector(state => state.account);
    const { posts } = useSelector(state => state.stor);
    const { goDisconnect } = props.navigation;
    const getPosts = () => {
        fetch(API_URL + 'method=posts.get&' + window.location.search.replace('?', ''))
            .then(data => {console.log(JSON.stringify(data)); return data})
			.then(data => data.json())
			.then(data => {
				setPosts(data.response)
			})
			.catch(e => goDisconnect(e))
    }
    useEffect(() => {
        getPosts()
        // eslint-disable-next-line
    }, [])
    useEffect(() => {
        if(!posts) return
        let new_posts = [...posts.items];
        new_posts = new_posts.filter(i => (i.topic === activeTopic) || (i.topic === 'all'));
        setPosts_well(new_posts);
    }, [posts, activeTopic])
    return(
        <Group>
            <div style={posts_well && posts_well.length > 3 ? scrollPostsStyle : {}}>
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
            </div>
            
        </Group>
    )
}