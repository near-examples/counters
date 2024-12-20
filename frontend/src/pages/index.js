import { useEffect, useState, useContext, useRef } from 'react';

import styles from '@/styles/app.module.css';
import { NearContext } from '@/context';
import { CounterContract } from '@/config';

export default function Home() {
  const { wallet, signedAccountId } = useContext(NearContext);
  const [number, setNumber] = useState(0);
  const [numberIncrement, setNumberIncrement] = useState(0);

  const [leftEyeVisible, setLeftEyeVisible] = useState(true);
  const [rightEyeVisible, setRightEyeVisible] = useState(true);
  const [dotOn, setDotOn] = useState(false);

  useEffect(() => {
    const getData = setTimeout(() => {
      if(numberIncrement == 0) return; 
      wallet.callMethod({ contractId: CounterContract, method:'increment',args: { number: numberIncrement }}).then(async () => {
        await fetchNumber();
      })
      setNumberIncrement(0)
    }, 2000)

    return () => clearTimeout(getData)
  }, [numberIncrement])

  const fetchNumber = async () => {
      const num = await wallet.viewMethod({ contractId: CounterContract, method: "get_num" });
      setNumber(num);
  }

  useEffect(() => {
    fetchNumber();
  }, []);

  const call = (method) => async () => {
    const methodToState = {
      increment: () => {
        setNumberIncrement(numberIncrement + 1)
        setNumber(number + 1)
      },
      decrement: () => {
        setNumberIncrement(numberIncrement - 1)
        setNumber(number - 1)
      },
      reset: async() => {
        setNumberIncrement(0)
        setNumber(0)
        wallet.callMethod({ contractId: CounterContract, method:'reset' }).then(async () => {
          await fetchNumber();
        })
      },
    }

    methodToState[method]?.();
  }

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
              <div className={dotOn ? 'dot on' : 'dor'}></div>
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
                  <div className={`tongue ${number > 5 || number < -5 ? "show" : ""}`}></div>
                </div>
              </div>
              <div id="show" className="number">{number}</div>
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
                  <button id="d" className="r d" onClick={() => setDotOn(!dotOn)}>L</button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}