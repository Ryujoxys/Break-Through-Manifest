export interface Question {
  id: string;
  text: string;
  timestamp: Date;
}

export interface Answer {
  id: string;
  questionId: string;
  text: string;
  timestamp: Date;
}

export interface DifyApiResponse {
  answer: string;
  conversation_id?: string;
  message_id?: string;
}

export type RootStackParamList = {
  Input: undefined;
  Answer: {
    question: string;
    answer: string;
    isStreaming?: boolean;
  };
};
