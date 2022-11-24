import { useState } from 'react';
import ImageView from '../ImageView';
import { useParams } from 'react-router-dom';
import { useCollectionQuery } from '../../hooks/useCollectionQuery';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../Firebase';
import { Spin } from 'react-cssfx-loading';

const ImageItem = ({ src }: { src: string }) => {
  const [isImageViewOpened, setIsImageViewOpened] = useState(false);

  return (
    <>
      <img
        onClick={() => setIsImageViewOpened(true)}
        className='h-[100px] w-[100px] cursor-pointer object-cover transition duration-300 hover:brightness-75'
        src={src}
        alt=''
      />
      <ImageView
        src={src}
        isOpened={isImageViewOpened}
        setIsOpened={setIsImageViewOpened}
      />
    </>
  );
};

const Image = () => {
  const { id: conversationId } = useParams();

  const { data, loading, error } = useCollectionQuery(
    `images-${conversationId}`,
    query(
      collection(db, 'conversations', conversationId as string, 'messages'),
      where('type', '==', 'image'),
      orderBy('createdAt', 'desc')
    )
  );

  if (loading || error)
    return (
      <div className='flex h-80 items-center justify-center'>
        <Spin />
      </div>
    );

  if (data?.empty)
    return (
      <div className='h-80 py-3'>
        <p className='text-center'>No image found</p>
      </div>
    );

  return (
    <div className='flex h-80 flex-wrap content-start gap-4 overflow-y-auto overflow-x-hidden p-4'>
      {data?.docs.map((image) => (
        <ImageItem key={image.id} src={image.data().content} />
      ))}
    </div>
  );
};

export default Image;
