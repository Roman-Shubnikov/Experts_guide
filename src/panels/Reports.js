import React, { useEffect, useState } from 'react';
import Skeleton from "react-loading-skeleton";
import bridge from '@vkontakte/vk-bridge';
import { 
    Panel,
    Group,
    Placeholder,
    Div,
    Link,
    Subhead,
    FormLayout,
    FormItem,
    Input,
    Textarea,
    Button,
    Checkbox,
    Radio,
    Spacing,
    VKCOM,
    usePlatform,
    PanelHeader,
} from "@vkontakte/vkui"
import {
    Icon56CheckCircleOutline,
} from '@vkontakte/icons';
import { API_URL, GENERAL_LINKS } from '../config';
import { getIdByLink } from '../functions/tools';
const Reports = props => {
    const [reasons, setReasons] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const [reason, setReason] = useState(1);
    const [link_vk, setLinkVk] = useState('');
    const [comment, setComment] = useState('');
    const [content, setContent] = useState('');
    const [isDone, setIsDone] = useState(false);
    const [check1, setCheck1] = useState(true);
    const [check2, setCheck2] = useState(true);
    const platform = usePlatform();
    
    useEffect(() => {
        fetch(API_URL + 'method=reports.getReasons&' + window.location.search.replace('?', ''))
        .then(data => data.json())
        .then(data => {
            setReasons(data.response)
        })
        .catch(e => {

        })
    }, [])
    const sendReport = () => {
        setLoading(true)
        getIdByLink(link_vk, props.tokenSearch)
        .then(uid => {
            fetch(API_URL + 'method=reports.send&' + window.location.search.replace('?', ''), 
            {
            method: 'post',
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify({
                'vk_id': uid,
                'comment': comment,
                'reason': reason,
                'content': content,
            })
            })
            .then(data => data.json())
            .then(data => {
                if(data.result){
                    bridge.send(
                        "VKWebAppSendPayload", 
                        {group_id: 206651170, 
                        payload: {
                            action: 'send_report',
                            reporter_id: props.userInfo.id,
                            user_id: uid,
                            comment: comment,
                            reason: reason,
                            content: content,
                        }
                    });
                    setIsDone(true)
                } else {
                    props.showErrorAlert(data.error.message)
                }
                setLoading(false)
            })
            .catch(e => {
                props.showErrorAlert('Пользователь не найден')
                setLoading(false)
            })
        })
    }
    const validateComment = (title) => {
        if(title.length > 0){
          let valid = ['error', 'Текст должен быть не больше 2000 и не меньше 6 символов' ];
          if(title.length <= 2000 && title.length > 5){
            if(/^[a-zA-ZА-Яа-я0-9_ё .,"':!?*+=\-/]*$/ui.test(title)){
              valid = ['valid', '']
            }else{
              valid = ['error', 'Текст не должен содержать спец. символы'];
            }
          }

          return valid
        }
        return ['default', '']

      }
    const validateLinkVk = (title) => {
        if(title.length > 0){
            let valid = ['error', 'Ссылка должена быть не меньше 5 символов' ];
            if(title.length >= 5){
                if(isNaN(title)){
                    valid = ['error', 'Некорректная ссылка'];
                    if(/vk\.com\/.+/.test(title) || /[a-z]+/.test(title)){
                        valid = ['valid', '']
                    }
              }else{
                valid = ['valid', ''];
              }
            }
  
            return valid
          }
          return ['default', '']
    }
    return(
        <Panel id={props.id}>
            {platform !== VKCOM && 
            <PanelHeader>Репорты</PanelHeader>}
            {!isDone ? <Group>
                <FormLayout>
                    <FormItem top="Ссылка на эксперта"
                    bottom={validateLinkVk(link_vk)[1]}
                    status={validateLinkVk(link_vk)[0]}>
                        <Input 
                        value={link_vk}
                        onChange={e => setLinkVk(e.currentTarget.value)}
                        placeholder="Введите ссылку" 
                        maxLength="100" />
                    </FormItem>
                    <FormItem top="Комментарий"
                    bottom={validateComment(comment)[1]}
                    status={validateComment(comment)[0]}>
                        <Textarea 
                        value={comment}
                        onChange={e => setComment(e.currentTarget.value)}
                        placeholder='Опишите причину жалобы'
                        maxLength="100" />
                    </FormItem>
                    <Div>
                        <Subhead weight='regular' style={{color: '#6F7985'}}>
                            Выберите критерий, который нарушил эксперт
                        </Subhead>
                    </Div>
                    
                    {reasons === null ? 
                    <Div style={{display: 'flex', flexDirection: 'column', paddingBottom:0, paddingTop: 0}}>
                        {Array(6).fill().map((e, i)=><Skeleton key={i} style={{padding: '0 16px', margin: '8px 0'}} height={20} width={120} />)}
                    </Div>
                    :
                    reasons.map((val, i) => 
                    <Radio key={val.id}
                    checked={reason === val.id}
                    onChange={() => setReason(val.id)}>
                        {val.reason}
                    </Radio>)}
                    <Spacing size={14} />
                    <FormItem top="Контент (необязательно)"
                    bottom={validateComment(content)[1]}
                    status={validateComment(content)[0]}>
                        <Textarea 
                        value={content}
                        onChange={e => setContent(e.currentTarget.value)}
                        placeholder='Укажите ссылки на беседы, сообщества, профили, относящиеся к данной жалобе'
                        maxLength="100" />
                    </FormItem>
                    <Checkbox checked={check1} onChange={() => setCheck1(p => !p)}>
                        Я ознакомлен с <Link
                        href={GENERAL_LINKS.expert_rules}
                        target="_blank" rel="noopener noreferrer">
                            правилами программы</Link> экспертов ВКонтакте
                    </Checkbox>
                    <Checkbox checked={check2} onChange={() => setCheck2(p => !p)}>
                        Я соглашаюсь с условиями <Link
                        href={GENERAL_LINKS.premoderation}
                        target="_blank" rel="noopener noreferrer"
                        >премодерацией жалоб</Link>
                    </Checkbox>
                    <FormItem style={{display:'flex', justifyContent: 'center'}}>
                        <Button
                        loading={isLoading}
                        onClick={() => sendReport()}
                        size='l' disabled={!(check2 && check1 && 
                        validateLinkVk(link_vk)[0] === 'valid' && 
                        validateComment(comment)[0] === 'valid')}>
                            Отправить жалобу
                        </Button>
                    </FormItem>
                </FormLayout>
            </Group> 
            : 
            <Group>
                <Placeholder 
                header='Спасибо!'
                icon={<Icon56CheckCircleOutline style={{color: '#5A9EFF'}} />}>
                    Жалоба пройдет премодерацию, после чего отправится администрации программы экспертов.
                </Placeholder>
            </Group>}

            
        </Panel>
    )
}

export default Reports;