import React from 'react';
import { 
    Group,
    usePlatform,
    VKCOM,
    CellButton,

} from "@vkontakte/vkui"
import {
    Icon28HomeOutline,
} from '@vkontakte/icons';
const ButtonBack = props => {
    const platform = usePlatform();
    return(
        <>
        {platform === VKCOM && <Group>
            <CellButton
            centered
            onClick={() => props.setActivePanel('home')}
            before={<Icon28HomeOutline />}>
                Главная
            </CellButton>
        </Group>}
        </>
    )
}


export default ButtonBack;