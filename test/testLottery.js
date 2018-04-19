var Lottery = artifacts.require("./Lottery.sol");

contract('Lottery', function(accounts) {

  var battingEther = 0.01;  

  //enter ok
  it("...should enter with some ether" , async () => {
    let instance = await Lottery.deployed();
    //enter
    await instance.enter({ from: accounts[0], value: web3.toWei(0.02, "ether")} );
    //players
    let players = await instance.getPlayers();

    //check account
    assert.equal(players[0], accounts[0], "Entered account is not matched");

  });

  it("...should pick a winner" , async () => {
    let instance = await Lottery.deployed();
    //enter
    let value = web3.toWei(0.02, "ether");

    console.log(value);

    //20000000000000000
    //200000000000000000

    await instance.enter({ from: accounts[0], value } );
    //players
    let players = await instance.getPlayers();

    let balance = await web3.eth.getBalance(accounts[0]).toNumber();

    await instance.pickWinner({ from: accounts[0] });    
    let finalBalance = await web3.eth.getBalance(accounts[0]).toNumber();
    
    assert.equal(finalBalance > balance, true, "pickWinner should transfer the money to account[0]");
  });

});