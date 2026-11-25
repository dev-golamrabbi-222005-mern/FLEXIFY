export interface SessionMessage {
  id: string;
  sender: string;
  senderName?: string;
  text: string;
  timestamp: string | Date;
}

export interface SessionParticipant {
  id: string;
  name: string;
  role: "host" | "attendee";
  avatar?: string;
}

export interface LiveSession {
  _id?: string;
  id?: string;
  title: string;
  host: string;
  hostName?: string;
  scheduledTime: string;
  status: "scheduled" | "live" | "ended";
  roomUrl?: string;
  participantsCount?: number;
}

export interface SocketUpdatePayload {
  sessionId: string;
  type: "message" | "join" | "leave" | "status";
  data: any;
}
