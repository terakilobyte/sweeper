import * as React from 'react';
import { ChannelProvider } from '../app';
import throttle from 'lodash/throttle';

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
      setTime(0)
    });

    // channel.push('start_timer', {});
    return () => {
      channel.leave();
    };
  }, []);

  const stopTimer = throttle(() => {
    setRunning(false);
    channel.push('stop_timer', {});
  }, 1000);

  const startTimer = throttle(() => {
    channel.push('stop_timer', {});
    setTimeout(() => {
      setRunning(true);
      channel.push('start_timer', {});
    }, 700);
  }, 1000);

  return (
    <main role="main" className="container">
      <div>{time || ''}</div>
      <div>
        <button onClick={startTimer}>
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
