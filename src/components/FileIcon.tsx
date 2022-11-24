import { useState } from 'react';

import { FILE_ICON } from '../constants';

type FileIconProps =  {
  extension: string;
  className?: string;
}

const FileIcon = ({ extension, className }: FileIconProps) => {
  const [isError, setIsError] = useState(false);

  if (isError) return <i className={`bx bxs-file ${className || ''}`}></i>;

  return (
    <img
      className={className || ''}
      onError={() => setIsError(true)}
      src={FILE_ICON(extension)}
      alt=''
    />
  );
};

export default FileIcon;
