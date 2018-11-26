export class ChatRoom {
    constructor(public roomId: String, public adminId: String, public roomName: String, public status: Boolean) {
        this.roomId = roomId;
        this.adminId = adminId;
        this.roomName = roomName;
        this.status = status;
    }
}