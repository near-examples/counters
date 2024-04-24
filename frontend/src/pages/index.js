import Image from 'next/image';
import styles from '@/styles/app.module.css';
import { CounterContract } from '@/config';
import { useStore } from '@/layout';
import { useEffect, useState } from 'react';

export default function Home() {
  const { wallet, signedAccountId} = useStore();
  const [number, setNumber] = useState(0);
  const [updateUI, setUpdateUI] = useState(false)

  const [leftEyeVisible, setLeftEyeVisible] = useState(true);
  const [rightEyeVisible, setRightEyeVisible] = useState(true);
  const [dotOn, setDotOn] = useState(false);
  let mouth = "smile";
  let hasShowtongue = false


  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    setLoggedIn(!!signedAccountId);
  }, [signedAccountId]);

  useEffect(() => {
    if (!wallet) return;
    const fetchNumber = async () => {
      const num = await wallet.viewMethod({ contractId: CounterContract, method: "get_num" });
      setNumber(num);
    }
    fetchNumber();
  }, [wallet, updateUI]);

 
  if (number >= 0) {
    mouth = 'smile' ;
  } else {
    mouth = 'cry';
  }

  if (number > 20 || number < -20) {
    hasShowtongue = true;
  } 

  const callMethod = (method) => async () => {
    await wallet.callMethod({ contractId: CounterContract, method })
    setUpdateUI(!updateUI);
  }

  
  const toggleLeftEye = () => {
    setLeftEyeVisible(!leftEyeVisible);
  };

  const toggleRightEye = () => {
    setRightEyeVisible(!rightEyeVisible);
  };

  const toggleDot = () => {
    setDotOn(!dotOn);
  };


  return (
    <main className={styles.main}>
      <h1 className='title'>This counter lives in the NEAR blockchain!</h1>
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
                  <div className={`mouth ${mouth}`}></div>
                  <div className={`tongue ${hasShowtongue?"show":""}`}></div>
                </div>
              </div>
              <div id="show" className="number">{number}</div>
            </div>
            <div className="buttons">
              <div className="row">
                <button id="plus" className="interact arrows" onClick={callMethod('increment')} disabled={!loggedIn}>
                  <div className="left">
                  </div>
                  <div className="updown">
                  </div>
                </button>
                <button id="minus" className="interact arrows" onClick={callMethod('decrement')} disabled={!loggedIn}>
                  <div className="right">
                  </div>
                </button>
              </div>
              <div className="selects row">
                <div className="ab">
                  <button id="a" className="interact r a" onClick={callMethod('reset')} disabled={!loggedIn}>RS</button>
                  <button id="b" className="r b" onClick={toggleRightEye}>RE</button>
                  <button id="c" className="r c" onClick={toggleLeftEye}>LE</button>
                  <button id="d" className="r d" onClick={toggleDot}>L</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {!loggedIn && <div class="sign-in" >
          <p>You'll need to sign in to interact with the counter:</p>
      </div>}
      </div>
    </main>
  );
}