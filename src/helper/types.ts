export interface ChatRoomType {
    "id": number
    "name":  string // "employee_2_customer_2",
    "employee_id": number
    "customer_id": number
    "created_at": string
    "updated_at": string
}

export type ChatRoomsType = ChatRoomType[]