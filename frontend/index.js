import 'regenerator-runtime/runtime'
import { Counter } from './near-interface';
import { Wallet } from './near-wallet'

// When creating the wallet you can choose to create an access key, so the user
// can skip signing non-payable methods when interacting with the contract
const wallet = new Wallet({ createAccessKeyFor: process.env.CONTRACT_NAME })

// Abstract the logic of interacting with the contract to simplify your project
const counter = new Counter({ contractId: process.env.CONTRACT_NAME, walletToUse: wallet });

// Setup on page load
window.onload = async () => {
  const isSignedIn = await wallet.startUp();

  if (isSignedIn){
    signedInFlow()
  }else{
    signedOutFlow()
  }

  updateUI()
}

// Log in and log out users using NEAR Wallet
document.querySelector('.sign-in .btn').onclick = () => { wallet.signIn() }
document.querySelector('.sign-out .btn').onclick = () => { wallet.signOut() }

// Display the signed-out-flow container
function signedOutFlow() {
  document.querySelector('.sign-in').style.display = 'block';
  document.querySelectorAll('.interact').forEach(button => button.disabled = true)
}

// Displaying the signed in flow container and display counter
async function signedInFlow() {
  document.querySelector('.sign-out').style.display = 'block';
  document.querySelectorAll('.interact').forEach(button => button.disabled = false)
}

// Buttons - Interact with the Smart contract
document.querySelector('#plus').addEventListener('click', async () => {
  resetUI();
  await counter.increment();
  await updateUI();
});

document.querySelector('#minus').addEventListener('click', async  () => {
  resetUI();
  await counter.decrement();
  await updateUI();
});
document.querySelector('#a').addEventListener('click', async  () => {
  resetUI();
  await counter.reset();
  await updateUI();
});

// Update and Reset UI
async function updateUI(){
  let count = await counter.getValue();
  
  document.querySelector('#show').classList.replace('loader','number');
  document.querySelector('#show').innerText = count === undefined ? 'calculating...' : count;
  document.querySelector('#left').classList.toggle('eye');

  if (count >= 0) {
    document.querySelector('.mouth').classList.replace('cry','smile');
  } else {
    document.querySelector('.mouth').classList.replace('smile','cry');
  }

  if (count > 20 || count < -20) {
    document.querySelector('.tongue').style.display = 'block';
  } else {
    document.querySelector('.tongue').style.display = 'none';
  }
}

function resetUI(){
  document.querySelector('#show').classList.replace('number','loader');
  document.querySelector('#show').innerText = '';
}

// Animations
document.querySelector('#c').addEventListener('click', () => {
  document.querySelector('#left').classList.toggle('eye');
});
document.querySelector('#b').addEventListener('click', () => {
  document.querySelector('#right').classList.toggle('eye');
});
document.querySelector('#d').addEventListener('click', () => {
  document.querySelector('.dot').classList.toggle('on');
});