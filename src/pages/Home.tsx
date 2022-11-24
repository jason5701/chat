import { FC } from 'react';
import Sidebar from '../components/Home/Sidebar';

const Home: FC = () => {
  return (
    <div className='flex'>
      <Sidebar />
      <div className='hidden flex-grow flex-col items-center justify-center gap-3 md:!flex'>
        <h1 className='text-center'>Select a Conversation to Start Chatting</h1>
      </div>
    </div>
  );
};

export default Home;
