export class Contract{
  wallet;

  constructor({wallet}){
    this.wallet = wallet
  }

  async counterIncrement(){
    return await this.wallet.callMethod({method: "increment"})
  }

  async counterDecrement(){
    return await this.wallet.callMethod({method: "decrement"})
  }

  async counterReset(){
    return await this.wallet.callMethod({method: "reset"})
  }

  async getCounter(){
    return await this.wallet.viewMethod({method: "get_num"});
  }
}