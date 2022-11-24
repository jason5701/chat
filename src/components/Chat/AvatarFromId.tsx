import { DEFAULT_AVATAR, IMAGE_PROXY } from '../../constants';
import { useUserInfo } from '../../hooks/useUserInfo';
import Skeleton from '../Skeleton';

type AvatarFromIdProps = {
  uid: string;
  size?: number;
};

const AvatarFromId = ({ uid, size }: AvatarFromIdProps) => {
  const { data, loading, error } = useUserInfo([uid]);

  if (loading)
    return (
      <Skeleton
        className='rounded-full'
        style={{ width: size, height: size }}
      ></Skeleton>
    );

  if (error)
    return (
      <img
        src={DEFAULT_AVATAR}
        className='rounded-full'
        style={{ width: size, height: size }}
        alt=''
      />
    );

  return (
    <img
      title={data?.[0].data()?.displayName}
      style={{ width: size, height: size }}
      className='rounded-full object-cover'
      src={IMAGE_PROXY(data?.[0].data()?.photoURL)}
      alt=''
    />
  );
};

export default AvatarFromId;
