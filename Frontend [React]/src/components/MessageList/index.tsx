import styles from './styles.module.scss'
import { api } from '../../services/api'
import { useEffect, useState } from 'react'
import io from 'socket.io-client'

import logoImg from '../../assets/logo.svg'

type MessageProps = {
    id: string
    text: string
    user: {
        name: string
        avatar_url: string
    }
}

const messagesQueue: MessageProps[] = []

const socket = io('http://localhost:4000')

socket.on('new_message', (newMessage: MessageProps) => {
    messagesQueue.push(newMessage)
})

export function MessageList() {
    const [messages, setMessages] = useState<MessageProps[]>([])

    useEffect(() => {
        const timer = setInterval(() => {
            if (messagesQueue.length > 0) {
                setMessages((prevState) =>
                    [messagesQueue[0], prevState[0], prevState[1]].filter(Boolean)
                )
                messagesQueue.shift()
            }
        }, 3000)
    }, [])

    useEffect(() => {
        api.get<MessageProps[]>('messages/last3').then((response) => {
            setMessages(response.data)
        })
    }, [])

    return (
        <div className={styles.messageListWrapper}>
            <img src={logoImg} alt="DoWhile 2021" />

            <ul className={styles.messageList}>
                {messages.map((messages) => {
                    return (
                        <li className={styles.message} key={messages.id}>
                            <p>{messages.text}</p>
                            <div className={styles.messageUser}>
                                <div className={styles.userImage}>
                                    <img
                                        src={messages.user.avatar_url}
                                        alt={`${messages.user.name} Avatar`}
                                    />
                                </div>
                                <span>{messages.user.name}</span>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
