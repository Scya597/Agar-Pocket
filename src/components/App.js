import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import uuid from 'uuid/v1';
import LoginBox from './loginBox';
import Pixi from '../game/Pixi';


class App extends Component {
  constructor() {
    super();
    this.state = {
      endpoint: 'localhost:8080',
      login: 0,
      name: '',
    };
    const { endpoint } = this.state;
    this.id = uuid();
    this.socket = socketIOClient(endpoint, { query: { uuid: this.uuid } });
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin(name) {
    console.log('handle');
    this.setState({ login: 1, name });
  }

  render() {
    return (
      <div>
        {this.state.login === 1
          ? <Pixi socket={this.socket} uuid={this.id} name={this.name} />
          : <LoginBox handlelogin={this.handleLogin} socket={this.socket} uuid={this.uuid} />}
      </div>
    );
  }
}

export default App;
