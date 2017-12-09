import React, { Component } from 'react';

class LoginBox extends Component {
  constructor(props) {
    super();
    this.state = {
      userList: [],
    };
    this.socket = props.socket;
    this.uuid = props.uuid;
  }

  componentWillMount() {
    this.socket.on('getUserList', (userList) => {
      this.setState({ userList });
    });
  }

  setTitle = () => {
    console.log('set');
    this.socket.emit('setName', this.refs.text.value, this.uuid);
    this.props.handlelogin(this.refs.text.value); // update app state
    this.refs.text.value = '';
  }

  render() {
    return (
      <div className="loginRoot">
        <div className="loginMenu">
          <h1 className="loginHeader">Welcome</h1>
          <input className="loginInput" placeholder="name" ref={(input) => { this.textInput = input; }} />
          <button className="loginStart" onClick={this.setTitle}>START</button>
          <div className="loginOnline">
            <div className="loginOnlineDraw">Online</div>
            <ul className="loginOnlineul">
              {this.state.userList.map(user =>
            (<li className="loginOnlineli"> {user.name} </li>))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginBox;
