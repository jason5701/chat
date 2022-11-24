import { HTMLProps } from 'react';

const Skeleton = ({ className, ...others }: HTMLProps<HTMLDivElement>) => {
  return (
    <div className={`animate-pulse bg-gray-500 ${className}`} {...others}></div>
  );
};

export default Skeleton;
