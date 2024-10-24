import "./App.css";
import React, { useEffect, useState } from "react";
import web3 from "./web3"
import lottery from "./lottery"


function App () {
    const [manager, setManager] = useState('');
    const [players, setPlayers] = useState([]);
    const [balance, setBalance] = useState('');
    const [value, setValue] = useState('');
    const [message, setMessage] = useState('');

    const onSubmit = async (event) =>{
      event.preventDefault();
      const accounts = await web3.eth.getAccounts();
      setMessage('Waiting for the transaction to be success...')
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei(value, 'ether'),
      })
      setMessage('You are now in the Contest!!!')
    }
    
    const onClick = async () =>{
      const accounts = await web3.eth.getAccounts();
      console.log(accounts[0])
      setMessage('Waiting for the transaction to be success...')
      await lottery.methods.pickWinner().send({
        from: accounts[0],
      })
      setMessage('A winner has been picked!!!')
    }

    useEffect(() => {
      const fetchManager = async () => {
        const manager = await lottery.methods.manager().call();
        const players = await lottery.methods.getPlayers().call();
        const balance = await web3.eth.getBalance(lottery.options.address);
        setManager(manager);
        setPlayers(players);
        setBalance(balance);
        console.log(players)
      };

      fetchManager();
    }, []);
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>This is the Contest Manger: {manager} <br/>
          There are currently {players.length} people entered, <br/>
          competing to win {web3.utils.fromWei(balance, 'ether')} Ether!
        </p>
        <hr />
        <form onSubmit={onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label htmlFor="">Amount of ether to Enter</label> <br />
            <input type="text" value={value} onChange={ (e) => setValue(e.target.value)} />
          </div>
          <button>Enter Context</button>
        </form>
        <hr />

        <h4>Ready to pick a winner?</h4>
        <button onClick={onClick}>Pick a winner</button>

        <hr />
        <h1>{message}</h1>
      </div>
    );
  }
export default App;
