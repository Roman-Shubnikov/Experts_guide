import React from 'react';
import {
	Group,
    Div,
    Subhead,
    Button,

} from '@vkontakte/vkui';


export const PostGroup = props => {
    const { goPanel } = props.callbacks;
    return(
        <Group>
            <Div style={{textAlign: 'center'}}>
                <Button size='l' style={{marginBottom: 15, width: '100%'}}
                onClick={() => {
                    goPanel('home', 'createposts', true)
                }}>
                    Перейти к публикации
                </Button>
                <Subhead style={{color: '#6f7985'}}>
                    После заполнения, контент отобразится в нужном блоке.
                    Теги в постах теперь не нужны.
                </Subhead>
            </Div>
        </Group>
    )
}