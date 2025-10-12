import { useEffect, useState } from 'react';

import styles from '@/styles/app.module.css';
import { useNear } from '@/hooks/useNear';
import { CounterContract } from '@/config';

export default function Home() {
  const { signedAccountId, callFunction, viewFunction } = useNear();

  const [number, setNumber] = useState<number>(0);
  const [numberIncrement, setNumberIncrement] = useState<number>(0);

  const [leftEyeVisible, setLeftEyeVisible] = useState<boolean>(true);
  const [rightEyeVisible, setRightEyeVisible] = useState<boolean>(true);
  const [tongueVisible, setTongueVisible] = useState<boolean>(false);
  const [dotOn, setDotOn] = useState<boolean>(true);

  const [globalInterval, setGlobalInterval] = useState<ReturnType<typeof setInterval> | null>(null);

  // Fetch number initially and set interval
  useEffect(() => {
    fetchNumber();

    const interval = setInterval(fetchNumber, 1500);
    setGlobalInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  // Handle debounced increment
  useEffect(() => {
    if (globalInterval) clearInterval(globalInterval);

    const timeout = setTimeout(() => {
      if (numberIncrement === 0) return;

      const incrementValue = numberIncrement;
      setNumberIncrement(0);

      callFunction({
        contractId: CounterContract,
        method: 'increment',
        args: { number: incrementValue },
      }).finally(() => {
        fetchNumber();
        const interval = setInterval(fetchNumber, 1500);
        setGlobalInterval(interval);
      });
    }, 500);

    return () => clearTimeout(timeout);
  }, [numberIncrement]);

  const fetchNumber = async () => {
    setDotOn(true);
    const num = await viewFunction({ contractId: CounterContract, method: 'get_num' });
    setNumber(num as number);
    setDotOn(false);
  };

  type Method = 'increment' | 'decrement' | 'reset';
  const call = (method: Method) => async () => {
    switch (method) {
      case 'increment':
        setNumberIncrement(prev => prev + 1);
        setNumber(prev => prev + 1);
        break;
      case 'decrement':
        setNumberIncrement(prev => prev - 1);
        setNumber(prev => prev - 1);
        break;
      case 'reset':
        setNumberIncrement(0);
        setNumber(0);
        await callFunction({ contractId: CounterContract, method: 'reset' });
        await fetchNumber();
        break;
    }
  };

  return (
    <main className={styles.main}>
      <h2 className="title">This global counter lives in the NEAR blockchain!</h2>

      {!signedAccountId && (
        <div className="sign-in">
          <p>You'll need to sign in to interact with the counter:</p>
        </div>
      )}

      <div className="scene">
        <div className="gameboy">
          <div className="body-shape shadow"></div>
          <div className="body-shape side"></div>
          <div className="body-shape front">
            <div className="screen">
              <div className={dotOn ? 'dot on' : 'dot off'}></div>
              <div className="face">
                <div className="eyes-row">
                  <div id="left" className={leftEyeVisible ? 'closed eye' : 'closed'}>
                    <div className="pupil"></div>
                  </div>
                  <div id="right" className={rightEyeVisible ? 'closed eye' : 'closed'}>
                    <div className="pupil"></div>
                  </div>
                </div>
                <div className="mouth-row">
                  <div className={`mouth ${number >= 0 ? 'smile' : 'cry'}`}></div>
                  <div className={`tongue ${tongueVisible ? 'show' : ''}`}></div>
                </div>
              </div>
              <div id="show" className="number">{number}</div>
            </div>

            <div className="buttons">
              <div className="row">
                <button
                  id="plus"
                  className="interact arrows"
                  onClick={call('increment')}
                  disabled={!signedAccountId}
                >
                  <div className="left"></div>
                  <div className="updown"></div>
                </button>
                <button
                  id="minus"
                  className="interact arrows"
                  onClick={call('decrement')}
                  disabled={!signedAccountId}
                >
                  <div className="right"></div>
                </button>
              </div>

              <div className="selects row">
                <div className="ab">
                  <button
                    id="a"
                    className="interact r a"
                    onClick={call('reset')}
                    disabled={!signedAccountId}
                  >
                    RS
                  </button>
                  <button id="b" className="r b" onClick={() => setRightEyeVisible(!rightEyeVisible)}>
                    RE
                  </button>
                  <button id="c" className="r c" onClick={() => setLeftEyeVisible(!leftEyeVisible)}>
                    LE
                  </button>
                  <button id="d" className="r d" onClick={() => setTongueVisible(!tongueVisible)}>
                    L
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
