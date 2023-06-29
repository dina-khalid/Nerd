import React, { createRef, useEffect, useRef, useState } from "react"
import { ChatInput, StyledChat } from "./styles"
import { v4 as uuidv4 } from "uuid"
import { TransitionGroup, CSSTransition } from "react-transition-group"

import { defaultChats } from "../../constants/chats"

import { Icon } from "../../components/Icon"
import ChatBubble, { ChatType, IChat } from "../../components/ChatBubble"

import AskQuestion from "../../components/Sender/AskQuestion" // Import the AskQuestion component

type Props = {
  chatAnimationDelay: number
}

const TRANSITION_DELAY = 100

const Chat: React.FC<Props> = ({ chatAnimationDelay }) => {
  const [chats, setChats] = useState<IChat[]>(defaultChats)
  const [animate, setAnimate] = useState(false)

  const inputRef = createRef<HTMLInputElement>()
  const chatsEndRef = useRef<HTMLDivElement>(null)

  // Scrolling to the bottom of chats container
  // and animating the chat bubbles
  useEffect(() => {
    if (!chatsEndRef.current) return
    chatsEndRef.current.scrollIntoView({ behavior: "smooth" })
  }, [chats])

  // Starting the text bubble animation
  useEffect(() => {
    setAnimate(true)
  }, [])

  const inputChatHandler = () => {
    if (!inputRef.current) return

    const text = inputRef.current.value.trim()
    if (text === "") return

    inputRef.current.value = ""
    inputRef.current.focus()

    const chat = {
      id: uuidv4(),
      text: text,
      type: ChatType.USER,
    }
    setChats((prev) => [...prev, chat])

    // Send user input to the backend and handle response
    sendUserInputToBackend(text)
  }

  const sendUserInputToBackend = (input: string) => {
    // Send the user input to the backend using a fetch or Axios request
    fetch("http://localhost:5000/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: input,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the backend and update the chat with the answer
        const answer = data.answer || "Sorry, no answer found."
        const chat = {
          id: uuidv4(),
          text: answer,
          type: ChatType.SYSTEM,
        }
        setChats((prev) => [...prev, chat])
      })
      .catch((error) => {
        console.error("Error:", error)
      })
  }

  return (
    <StyledChat>
      <TransitionGroup component="ul">
        <>
          {chats.map((chat, index) => (
            <CSSTransition
              in={animate}
              key={chat.id}
              classNames="chat-bubble"
              timeout={{
                enter: chat.isDefault
                  ? chatAnimationDelay * (index + 1)
                  : TRANSITION_DELAY,
              }}
           
              >
              <ChatBubble text={chat.text} type={chat.type} />
            </CSSTransition>
          ))}
        </>
        <div ref={chatsEndRef} />
      </TransitionGroup>
      <ChatInput>
        <input
          ref={inputRef}
          type="text"
          placeholder="Ask something..."
          onKeyDown={(e) => e.key !== "Enter" || inputChatHandler()}
        />
        <button onClick={() => inputChatHandler()}>
          <Icon src="send.svg" />
        </button>
      </ChatInput>
    </StyledChat>
  )
}
export default  Chat ;