import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
position: fixed;
z-index: 1000;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
`;

const Item = styled.div`
margin: 4px auto;
padding: 8px 20px;
border-radius: 4px;
box-shadow: 4px 8px 12px rgb(0 0 0 / 15%);
background: rgba(255,255,255,.94);
font-weight: 500;
font-size: 16px;
cursor: default;
`;

interface Message {
    text: string,
    key: string,
    timer?: ReturnType<typeof setTimeout>
}

interface api {
    push: Function
}

const Toast: api = {
    push: () => {}
};

const ToastContainer : React.FC = () : JSX.Element => {
    const [items, setItems] = useState<Message[]>([]);
    const itemsRef = useRef<Message[]>(items);
    const MS = 3000;
    
    useEffect(() => {
        itemsRef.current = items;
    }, [items]);

    Toast.push = (item: Message) => {
        const i = items.findIndex((m: Message) => item.key === m.key);
        if ( i > -1 ) {
            const newItems = items.concat();
            const o = newItems[i];
            o.text = item.text;
            o.timer = resetTimer(o.timer, o.key);
            setItems(newItems);
        } else {
            const newItems = items.concat();
            item.timer = resetTimer(undefined, item.key);
            newItems.push(item)
            setItems(newItems);
        }
    }

    const resetTimer = (t: undefined | ReturnType<typeof setTimeout>, key: string): ReturnType<typeof setTimeout> => {
        t && clearTimeout(t);
        return setTimeout(() => {
            hide(key);
        }, MS);
    }

    const hide = (key: string) => {
        const i = itemsRef.current.findIndex((item: Message) => key === item.key);
        
        if ( i > -1 ) {
            const newItems = itemsRef.current.concat();
            const timer = newItems[i].timer;
            timer && clearTimeout(timer);
            newItems.splice(i, 1);
            setItems(o => {
                return newItems;
            });
        }
    }

    return <Container>
        {
            items.map((t: Message, i: number) => {
                return <Item key={ t.key }
                    onClick={ () => { hide(t.key) } }
                    className="flex">{ t.text }</Item>
            })
        }
    </Container>
}


export { Toast };
export default ToastContainer;