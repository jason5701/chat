import { ConversationInfo, MessageItem } from '../../types';

type LeftMessageProps = {
  message: MessageItem;
  conversation: ConversationInfo;
  index: number;
  docs: any[];
  replyInfo: any;
  setReplyInfo: (value: any) => void;
};

const LeftMessage = ({
  message,
  conversation,
  index,
  docs,
  setReplyInfo,
}: LeftMessageProps) => {
  return <></>;
};

export default LeftMessage;
