import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {

  state = {
    storageValue: 0,
    tempValue: 0,
    web3: null,
    accounts: null,
    contract: null
  };

  componentDidMount = async () => {
    try {

      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();

      console.log("neteworkId: ", networkId);

      const deployedNetwork = SimpleStorageContract.networks[networkId];

      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      console.log("Accounts:" , accounts);

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };




  runExample = async () => {

    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    //await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };


  setAmount(event) {
    event.preventDefault();
    let self = this;
    const { accounts, contract } = this.state;
    var value = event.target.value;
    // await contract.methods.set(value).send({ from: accounts[0] });
    this.state.contract.methods.set(value).send({ from: accounts[0] })
    .then(function(result) {
        console.log("Successfully incremented balance : " + JSON.stringify(result));
        self.setState({ storageValue: value });
    });

  }

  incrementAmount = async(event) => {
    event.preventDefault();
    const { accounts, contract } = this.state;

    var increment =  Number(this.state.tempValue);
    var storedValue = Number(this.state.storageValue);
    var value = storedValue+increment;

    await contract.methods.set(value).send({ from: accounts[0] });
    // Get the value from the contract to prove it worked.

    const response = await contract.methods.get().call();
    // Update state with the result.
    this.setState({ storageValue: response });
  }

  handleChangeAmount = async(event) => {
    event.preventDefault();
    var value = event.target.value;
    this.setState({ tempValue: value });
  }

  render() {

    const inputStyle = { padding: '5px', marginLeft: '30px', marginRight: '30px' };
    const accountsStyle = { fontSize: 16, marginBottom: '15px' };

    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
          <form>
              <div className="form-control">
                  <label htmlFor="text">Add Amount: </label>
                  <input style={inputStyle} type="text" value={this.state.value}  onChange={this.handleChangeAmount.bind(this)}
                  placeholder="Enter Amount ...">
                  </input>
                  <button id="Set Bal" onClick={this.incrementAmount.bind(this)}>Increment Amount</button>
              </div>

              <div className="form-control">
                <label htmlFor="text">New Amount: </label>
                <input style={inputStyle} type="text" value={this.state.value}  onChange={this.handleChangeAmount.bind(this)}
                placeholder="Enter Amount ...">
                </input>
                <button id="Set Bal" onClick={this.setAmount.bind(this)}>Set Amount</button>
            </div>
          </form>

          <div style = {accountsStyle} className="row">
              <div className="col-md-4">
                  <p style = {accountsStyle} > The stored value is now: {this.state.storageValue} </p>
              </div>
          </div>

      </div>
    );
  }
}

export default App;
