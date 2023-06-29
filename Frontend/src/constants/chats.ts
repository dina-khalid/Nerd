import { ChatType, IChat } from "../components/ChatBubble"
import { v4 as uuidv4 } from "uuid"

export const defaultChats: IChat[] = [
  {
    id: uuidv4(),
    text: "Hi, What would you like to discuss today :)?",
    type: ChatType.SYSTEM,
    isDefault: true,
  },


]
