export interface ChatRoomType {
    "id": number
    "name": string // "employee_2_customer_2",
    "employee_id": number
    "customer_id": number
    "created_at": string
    "updated_at": string
    "isOnline": boolean | undefined
}

export type ChatRoomsType = ChatRoomType[]

export interface ChatMessageType {
    "id": number
    "body": string
    "employee_id": number
    "customer_id": number
    "chat_room_id": number
    "created_at": symbol
    "updated_at": symbol
    "sender_type": null | 'customer' | 'employee'
}

export interface UserDataType {
    "id": number
    "name": string
    "email": string
    "created_at": string
    "updated_at": string
    "online": boolean
}