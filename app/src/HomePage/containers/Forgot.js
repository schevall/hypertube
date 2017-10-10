import axios from 'axios';
import React, { Component } from 'react';
import InputForgot from '../components/InputForgot.js';

class Forgot extends Component {

  state = {
    password: '',
    successMessage: '',
    error: [],
  }

  handleChange = ({ target: { name, value } }) => this.setState({ [name]: value, error: [] });

  sendMail = (event) => {
    event.preventDefault();
    const { email } = this.state;
    const url = '/api/forgot';
    axios.post(url, { email: email.trim() })
    .then(({ data: { error } }) => {
      if (error.length === 0) {
        this.setState({
          error,
          successMessage: 'An email has been sent to reset your password.',
        });
      } else {
        this.setState({ error, successMessage: '' });
      }
    })
    .catch(err => console.error('Error: ', err));
  }

  componentWillReceiveProps(nextProps) {
    const { message } = nextProps;
    this.setState({ error: message });
  }

  render() {
    const { error, successMessage } = this.state;

    return (
      <div>
        <InputForgot
          handleSubmit={this.sendMail}
          handleChange={this.handleChange}
          error={error}
          successMessage={successMessage}
        />
      </div>
    );
  }
}

export default Forgot;