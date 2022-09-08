/* Talking with a contract often involves transforming data, we recommend you to encapsulate that logic into a class */

export class Counter{

  constructor({contractId, walletToUse}){
    this.wallet = walletToUse
    this.contractId = contractId
  }

  async increment(){
    return await this.wallet.callMethod({contractId: this.contractId, method: "increment"})
  }

  async decrement(){
    return await this.wallet.callMethod({contractId: this.contractId, method: "decrement"})
  }

  async reset(){
    return await this.wallet.callMethod({contractId: this.contractId, method: "reset"})
  }

  async getValue(){
    return await this.wallet.viewMethod({contractId: this.contractId, method: "get_num"});
  }
}