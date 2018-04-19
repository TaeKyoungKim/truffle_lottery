import React, { Component } from 'react'
import LotteryContract from '../build/contracts/Lottery.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  // lotteryContractInstance;

  constructor(props) {
    super(props)

    this.state = {
      manager: "",
      web3: null,
      currentAddress: "",
      players: [],
      value: "",
      message: "",
      balance: ""
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.


    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  async instantiateContract() {

    const contract = require('truffle-contract')
    const lotteryContract = contract(LotteryContract)
    lotteryContract.setProvider(this.state.web3.currentProvider)

    //지갑 정보를 획득
    this.state.web3.eth.getAccounts(async (error, accounts) => {
      console.log(error, accounts);
      this.setState({ currentAddress: accounts[0] });

      this.lotteryContractInstance = await lotteryContract.deployed();
      const players = await this.lotteryContractInstance.getPlayers.call();
      const manager = await this.lotteryContractInstance.manager.call();
      let contractAddr = this.lotteryContractInstance.address;
      console.log(contractAddr);
      // const balance = await this.state.web3.eth.getBalance(this.lotteryContractInstance.options.address);
      // await this.state.web3.eth.getBalance(contractAddr);      
      this.state.web3.eth.getBalance(contractAddr, (err, result) => {     
        let balance = this.state.web3.fromWei(result,"ether") + " ether";
        this.setState({ balance })
      });

      this.setState({ manager, players, message: "연결성공" });
    });

  }

  onSubmit = async (event) => {
      event.preventDefault();

      console.log(this.state.currentAddress);

      if(this.state.value <= 0.01) {
        alert('0.01 보다 높게 넣어주세요.');
        return;
      }

      let value = this.state.web3.toWei(this.state.value, 'ether');

      //enter 실행
      try {
        await this.lotteryContractInstance.enter({
              from:this.state.currentAddress, 
              value,
              gas: 3000000
            });
      } catch ( error) {
        console.log(error);
      }

      const players = await this.lotteryContractInstance.getPlayers.call();
      console.log("player length = " + players.length);

      this.setState({message: "베팅 성공"});
  }

  onClick = async (event) => {
    event.preventDefault();

    console.log(this.state.currentAddress);

    if(this.state.manager != this.state.currentAddress) {
      alert("관리자만 승자 뽑을수 있습니다.");
    }

    await this.lotteryContractInstance.pickWinner({
            from:this.state.currentAddress,
            gas: 3000000
          });

    const winnerPlayer = await this.lotteryContractInstance.getWinnerPlayer.call();    

    this.setState({message: "승자 : " + winnerPlayer});
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Lottery with Truffle framework</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <p>현재 지갑 주소는 { this.state.currentAddress } 입니다. </p>
              <p>관리자는 {this.state.manager} 입니다.</p>
              <p>현재배팅 금액은 { this.state.balance } 입니다.</p>
              <p>현재 맴버는 { this.state.players.length } 명이 베팅중입니다. </p>

              <form onSubmit = {this.onSubmit}>
                <h2>베팅하기</h2>
                <p>
                  베팅금액 : <input type="{this.state.value}" onChange={event => this.setState({ value: event.target.value })} />
                </p>
                <button>베팅하기</button>
              </form>
              <br/>
              <div>
                <button onClick = {this.onClick} >승자 뽑기</button>
              </div>  
              <h1>로그 : {this.state.message}</h1>
            </div>            
          </div>
        </main>
      </div>
    );
  }
}

export default App
