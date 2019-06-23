import * as React from 'react';
import { ChannelProvider } from '../app';

type iTimeMessage = {
  response: String;
  time: number;
};

const Main: React.FC<any> = ({ children }) => {
  const [time, setTime] = React.useState(0);
  const [running, setRunning] = React.useState(false);
  const { channel } = React.useContext(ChannelProvider);
  // const context = React.useContext(TimeContext);
  React.useEffect(() => {
    channel.on('new_time', (msg: iTimeMessage) => {
      setRunning(true);
      setTime(msg.time);
    });

    channel.on('stop_time', msg => {
      setRunning(false);
      console.log('stopped');
    });

    // channel.push('start_timer', {});
    return () => {
      channel.leave();
    };
  }, []);

  const resetTimer = () => {
    startTimer();
  };

  const stopTimer = () => {
    setRunning(false);
    channel.push('stop_timer', {});
  };

  const startTimer = () => {
    channel.push('stop_timer', {});
    setTimeout(() => {
      setRunning(true);
      channel.push('start_timer', {});
    }, 700);
  };

  return (
    <main role="main" className="container">
      <div>{time || ''}</div>
      <div>
        <button onClick={running ? resetTimer : startTimer}>
          {running ? 'Reset' : 'Start'} Time
        </button>
      </div>
      <div>
        <button onClick={stopTimer}>Stop Time</button>
      </div>
    </main>
  );
};

export default Main;
