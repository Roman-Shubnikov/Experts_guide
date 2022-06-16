import React from 'react';
import {
	Group,
	Header,
    PanelSpinner,
    Placeholder,
    HorizontalScroll,
    HorizontalCell,
    Avatar,

} from '@vkontakte/vkui';
import { useSelector } from 'react-redux';


export const ScoreTopic = props => {
    const { activeTopic } = useSelector((state) => state.account)
    const { score: scoreData } = useSelector(state => state.stor);
    return(
        
        <Group header={<Header>Активные эксперты</Header>}>
            {scoreData === null ? <PanelSpinner height={116} /> : 
            scoreData[activeTopic].length === 0 ?
            <Placeholder>В данный момент, активных экспертов нет нет</Placeholder> :
            <HorizontalScroll showArrows getScrollToLeft={i => i - 120} getScrollToRight={i => i + 120}>
                <div style={{ display: 'flex' }}>
                    
                    {scoreData[activeTopic].map(item => {
                        let user_data = scoreData['users_data'][item.user_id]
                        return(
                            <HorizontalCell key={item.user_id} 
                            style={{whiteSpace: 'pre-wrap'}}
                            header={user_data.first_name + '\n' + user_data.last_name}
                            target="_blank" rel="noopener noreferrer"
                            href={'https://vk.com/id' + user_data.id}
                            >
                                <Avatar size={56} src={user_data.photo_max_orig} />
                            </HorizontalCell>
                        )
                    }) 
                    }
                </div>
            </HorizontalScroll>
            }
        </Group>
    )
}