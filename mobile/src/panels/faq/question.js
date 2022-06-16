import React, {useEffect, useState} from 'react';
import {
    Group,
    Panel,
    PanelHeader,
    PanelHeaderBack,
    Text,
    Title,
    Div,
    Button,
    PanelSpinner,

} from '@vkontakte/vkui';
import { Anchorme } from 'react-anchorme'
import { API_URL, GENERAL_LINKS } from '../../config';
import { useSelector } from 'react-redux';
// import { 
//     Icon28ThumbsUpOutline,

// } from '@vkontakte/icons';
export const HelpQuestion = props => {
    const { activeQuestion } = useSelector((state) => state.Faq)
    const [question, setQuestion] = useState(null);
    
    // const [liked, setLike] = useState(false);
    // const [liked2, setLike2] = useState(false);
    const { showErrorAlert } = props.callbacks;
    const { goDisconnect } = props.navigation;
    const getQuestion = () => {
        fetch(API_URL + "method=faq.getQuestionById&" + window.location.search.replace('?', ''),
        {
            method: 'post',
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify({
              'id': activeQuestion,
            })
          })
            .then(res => res.json())
            .then(data => {
            if (data.result) {
                setQuestion(data.response)
            } else {
                showErrorAlert(data.error.message)
            }
            })
            .catch(goDisconnect)
    }
    // const likeMenager = (id, pos) => {
    //     if(id === 1){
    //         if(liked2) setLike2(!pos);
    //         setLike(pos)
    //     }
    //     if(id === 2){
    //         if(liked2) setLike2(!pos);
    //     }
    // }
    useEffect(() => {
        getQuestion()
        // eslint-disable-next-line
    }, [])
    return(
        <Panel id={props.id}>
            <PanelHeader left={<PanelHeaderBack onClick={() => window.history.back()} />}>
                Вопрос
            </PanelHeader>
            {question ? <Group>
                <Div style={{paddingBottom: 0}}>
                    <Title level="2" weight="bold" style={{ marginBottom: 16 }}>
                        {question.question}
                    </Title>
                </Div>
                <Div style={{paddingTop: 0}}>
                    <Text style={{whiteSpace: "pre-wrap"}} weight='regular'>
                        <Anchorme onClick={(e) => {e.stopPropagation()}} style={{color: 'var(--dynamic_blue)'}} target="_blank" rel="noreferrer noopener">
                            {question.answer}
                        </Anchorme>
                    </Text>
                </Div>
                {(question.support_need || question.curators_need) ? <Div style={{display: 'flex'}}>
                 {question.support_need && 
                    <Button href={GENERAL_LINKS.group_fan_community}
                    style={{marginRight: 4}}
                    stretched
                    mode='secondary'
                    size='m'
                    target="_blank"
                    rel="noopener noreferrer">
                        Активисты
                    </Button>}
                    {question.curators_need && <Button href={GENERAL_LINKS.group_official_community} 
                    stretched
                    size='m'
                    mode='secondary'
                    target="_blank"
                    rel="noopener noreferrer">
                        Кураторы
                    </Button>}
                </Div> : null}
                {/* <Div style={{display: 'flex', justifyContent: 'space-around'}}>
                    <Div>
                        <Icon28ThumbsUpOutline style={{color: liked ? '#FFB73D' : 'var(--content_placeholder_icon)'}} onClick={(e) => {setLike(pv => !pv)}} width={56} height={56} />
                        
                    </Div>
                    <Div>
                        <Icon28ThumbsUpOutline onClick={() => {setLike2(pv => !pv)}}
                        style={{color: liked2 ? '#FFB73D' : 'var(--content_placeholder_icon)', transform: 'rotate(180deg)'}} width={56} height={56} />

                    </Div>
                </Div> */}
                
                
            </Group> : <PanelSpinner />}
            
        </Panel>
    )
}