import { ConversationInfo, SavedUser } from '../../types';
import { useParams } from 'react-router-dom';
import { useCollectionQuery } from '../../hooks/useCollectionQuery';
import {
  arrayUnion,
  collection,
  doc,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../../Firebase';
import { Spin } from 'react-cssfx-loading';
import { IMAGE_PROXY } from '../../constants';

type AddMembersProps = {
  conversations: ConversationInfo;
};

const AddMembers = ({ conversations }: AddMembersProps) => {
  const { id: conversationId } = useParams();

  const { data, loading, error } = useCollectionQuery(
    `all-users-except-${JSON.stringify(conversations.users)}`,
    query(
      collection(db, 'users'),
      where('uid', 'not-in', conversations.users.slice(0, 10))
    )
  );

  const addMemberHandler = (uid: string) => {
    updateDoc(doc(db, 'conversations', conversationId as string), {
      users: arrayUnion(uid),
    });
  };
  if (loading || error)
    return (
      <div className='flex h-80 items-center justify-center'>
        <Spin />
      </div>
    );

  return (
    <>
      <div className='flex h-80 flex-col items-stretch gap-4 overflow-y-auto overflow-x-hidden py-4'>
        {data?.docs
          ?.map((item) => item.data() as SavedUser)
          .map((user) => (
            <div key={user.uid} className='flex items-center gap-3 px-4'>
              <img
                className='h-10 w-10 flex-shrink-0 rounded-full object-cover'
                src={IMAGE_PROXY(user.photoURL)}
                alt=''
              />
              <div className='flex-grow'>
                <h1>{user.displayName}</h1>
              </div>
              <button onClick={() => addMemberHandler(user.uid)}>
                <i className='bx bx-plus text-2xl'></i>
              </button>
            </div>
          ))}
        {data?.empty && <p className='text-center'>No More User to Add</p>}
      </div>
    </>
  );
};

export default AddMembers;
