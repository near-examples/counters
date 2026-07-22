import { useEffect, useState } from 'react';

import styles from '@/styles/app.module.css';
import { useNearWallet } from 'near-connect-hooks';
import { CounterContract } from '@/config';


export default function Home() {
	const { signedAccountId, callFunction, viewFunction } = useNearWallet();
  // `number` is only ever what the contract says; clicks accumulate in
  // `pendingDelta` and are rendered on top, so polling can't clobber them.
  const [number, setNumber] = useState(0);
  const [pendingDelta, setPendingDelta] = useState(0);

  const [leftEyeVisible, setLeftEyeVisible] = useState(true);
  const [rightEyeVisible, setRightEyeVisible] = useState(true);
  const [tongueVisible, setTongueVisible] = useState(false);
  const [dotOn, setDotOn] = useState(true);

  useEffect(() => {
    fetchNumber();
    const interval = setInterval(fetchNumber, 1500);
    return () => clearInterval(interval);
  }, [])

  useEffect(() => {
    // Debounce: send the accumulated delta once the user stops clicking
    const getData = setTimeout(() => {
      if (pendingDelta === 0) return;

      const delta = pendingDelta;
      callFunction({ contractId: CounterContract, method: 'increment', args: { number: delta } })
        .finally(() => {
          // On success or failure, drop what we sent and re-sync with the chain
          setPendingDelta((d) => d - delta);
          fetchNumber();
        })

    }, 500)

    return () => clearTimeout(getData);
  }, [pendingDelta])

  const fetchNumber = async () => {
    setDotOn(true);
    console.log("fetching number")
    const num = await viewFunction({ contractId: CounterContract, method: "get_num" });
    setNumber(num);
    setDotOn(false);
  }

  const call = (method) => async () => {
    const methodToState = {
      increment: () => setPendingDelta((d) => d + 1),
      decrement: () => setPendingDelta((d) => d - 1),
      reset: () => {
        setPendingDelta(0)
        setNumber(0)
        callFunction({ contractId: CounterContract, method: 'reset' })
          .finally(fetchNumber)
      },
    }

    methodToState[method]?.();
  }

  const displayed = number + pendingDelta;

  return (
    <main className={styles.main}>
      <h2 className='title'>This global counter lives in the NEAR blockchain!</h2>
      {!signedAccountId && <div className="sign-in" >
        <p>You'll need to sign in to interact with the counter:</p>
      </div>}
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
                  <div className={`mouth ${displayed >= 0 ? 'smile' : 'cry'}`}></div>
                  <div className={`tongue ${tongueVisible ? "show" : ""}`}></div>
                </div>
              </div>
              <div id="show" className="number" style={{ opacity: pendingDelta !== 0 ? 0.6 : 1 }}>{displayed}</div>
            </div>
            <div className="buttons">
              <div className="row">
                <button id="plus" className="interact arrows" onClick={call('increment')} disabled={!signedAccountId}>
                  <div className="left">
                  </div>
                  <div className="updown">
                  </div>
                </button>
                <button id="minus" className="interact arrows" onClick={call('decrement')} disabled={!signedAccountId}>
                  <div className="right">
                  </div>
                </button>
              </div>
              <div className="selects row">
                <div className="ab">
                  <button id="a" className="interact r a" onClick={call('reset')} disabled={!signedAccountId}>RS</button>
                  <button id="b" className="r b" onClick={() => setRightEyeVisible(!rightEyeVisible)}>RE</button>
                  <button id="c" className="r c" onClick={() => setLeftEyeVisible(!leftEyeVisible)}>LE</button>
                  <button id="d" className="r d" onClick={() => setTongueVisible(!tongueVisible)}>L</button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}