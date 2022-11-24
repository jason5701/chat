import { ConversationInfo, MessageItem } from '../../types';
import { useParams } from 'react-router-dom';
import { useStore } from '../../store';
import { Fragment, useRef } from 'react';
import { useState } from 'react';
import { useCollectionQuery } from '../../hooks/useCollectionQuery';
import {
  query,
  collection,
  orderBy,
  limitToLast,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../../Firebase';
import { useEffect } from 'react';
import { Spin } from 'react-cssfx-loading';
import InfiniteScroll from 'react-infinite-scroll-component';
import AvatarFromId from './AvatarFromId';
import LeftMessage from '../Message/LeftMessage';
import RightMessage from '../Message/RightMessage';

type ChatViewProps = {
  conversation: ConversationInfo;
  inputSectionOffset: number;
  replyInfo: any;
  setReplyInfo: (value: any) => void;
};

const ChatView = ({
  conversation,
  inputSectionOffset,
  replyInfo,
  setReplyInfo,
}: ChatViewProps) => {
  const { id: conversationId } = useParams();

  const currentUser = useStore((state) => state.currentUser);

  const scrollBottomRef = useRef<HTMLDivElement>(null);

  const [limitCount, setLimitCount] = useState(10);

  const { data, loading, error } = useCollectionQuery(
    `conversation-data-${conversationId}-${limitCount}`,
    query(
      collection(db, 'conversations', conversationId as string, 'messages'),
      orderBy('createdAt'),
      limitToLast(limitCount)
    )
  );

  const dataRef = useRef(data);
  const conversationIdRef = useRef(conversationId);
  const isWindowFocus = useRef(true);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    conversationIdRef.current = conversationId;
  }, [conversationId]);

  useEffect(() => {
    if (isWindowFocus.current) updateSeenStatus();

    scrollBottomRef.current?.scrollIntoView();

    setTimeout(() => {
      scrollBottomRef.current?.scrollIntoView();
    }, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.docs?.slice(-1)?.[0]?.id || '']);

  const updateSeenStatus = () => {
    if (dataRef.current?.empty) return;

    const lastDoc = dataRef.current?.docs?.slice(-1)?.[0];

    if (!lastDoc) return;

    updateDoc(doc(db, 'conversations', conversationId as string), {
      [`seen.${currentUser?.uid}`]: lastDoc.id,
    });
  };

  useEffect(() => {
    const focusHandler = () => {
      isWindowFocus.current = true;

      updateSeenStatus();
    };

    const blurHandler = () => {
      isWindowFocus.current = false;
    };

    window.addEventListener('focus', focusHandler);
    window.addEventListener('blur', blurHandler);

    return () => {
      window.removeEventListener('focus', focusHandler);
      window.removeEventListener('blur', blurHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading)
    return (
      <div className='flex flex-grow items-center justify-center'>
        <Spin />
      </div>
    );

  if (error)
    return (
      <div className='flex-grow'>
        <p className='mt-4 text-center text-gray-400'>Something went wrong</p>
      </div>
    );

  if (data?.empty)
    return (
      <div className='flex-grow'>
        <p className='mt-4 text-center text-gray-400'>
          No message recently. Start chatting now.
        </p>
      </div>
    );

  return (
    <InfiniteScroll
      dataLength={data?.size as number}
      next={() => setLimitCount((prev) => prev + 10)}
      inverse
      hasMore={(data?.size as number) >= limitCount}
      loader={
        <div className='flex justify-center py-3'>
          <Spin />
        </div>
      }
      style={{ display: 'flex', flexDirection: 'column-reverse' }}
      height={`calc(100vh - ${144 + inputSectionOffset}px)`}
    >
      <div className='flex flex-col items-stretch gap-3 pt-10 pb-1'>
        {data?.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as MessageItem))
          .map((item, index) => (
            <Fragment key={item.id}>
              {item.sender === currentUser?.uid ? (
                <RightMessage
                  replyInfo={replyInfo}
                  setReplyInfo={setReplyInfo}
                  message={item}
                />
              ) : (
                <LeftMessage
                  replyInfo={replyInfo}
                  setReplyInfo={setReplyInfo}
                  message={item}
                  index={index}
                  docs={data?.docs}
                  conversation={conversation}
                />
              )}
              {Object.entries(conversation.seen).filter(
                ([key, value]) => key !== currentUser?.uid && value === item.id
              ).length > 0 && (
                <div className='flex justify-end gap-[1px] px-8'>
                  {Object.entries(conversation.seen)
                    .filter(
                      ([key, value]) =>
                        key !== currentUser?.uid && value === item.id
                    )
                    .map(([key, value]) => (
                      <AvatarFromId key={key} uid={key} size={14} />
                    ))}
                </div>
              )}
            </Fragment>
          ))}
        <div ref={scrollBottomRef}></div>
      </div>
    </InfiniteScroll>
  );
};

export default ChatView;
