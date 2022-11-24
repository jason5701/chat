import { doc } from 'firebase/firestore';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../Firebase';
import { useDocumentQuery } from '../../hooks/useDocumnetQuery';
import Alert from '../Alert';

type ReplyBadgeProps = {
  messageId: string;
};

const ReplyBadge = ({ messageId }: ReplyBadgeProps) => {
  const { id: conversationid } = useParams();
  const [isAlertOpened, setIsAlertOpened] = useState(false);

  const { data, loading, error } = useDocumentQuery(
    `message-${messageId}`,
    doc(db, 'conversations', conversationid as string, 'messages', messageId)
  );

  if (loading || error)
    return <div className='h-10 w-20 rounded-lg bg-[#4E4F50]'></div>;

  return (
    <>
      <div
        onClick={() => {
          const el = document.querySelector(`#message-${messageId}`);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
          else setIsAlertOpened(true);
        }}
        className='cursor-pointer rounded-lg bg-[#4E4F50] p-2 opacity-60'
      >
        {data?.data()?.type === 'text' ? (
          <p>{data?.data()?.content}</p>
        ) : data?.data()?.type === 'image' ? (
          'An Image'
        ) : data?.data()?.type === 'file' ? (
          'A File'
        ) : data?.data()?.type === 'sticker' ? (
          'A Sticker'
        ) : (
          'Message Has Been Removed'
        )}
      </div>
      <Alert
        isOpened={isAlertOpened}
        setIsOpened={setIsAlertOpened}
        text='Cannot Find Your Message. Try to Scroll Up to Load More'
      />
    </>
  );
};

export default ReplyBadge;
