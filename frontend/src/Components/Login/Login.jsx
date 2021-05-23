import React, { Component } from 'react';
import { auth } from '../../util/api';

import { groups } from '../../util/api';

import { Redirect } from 'react-router-dom';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectToReferrer: false,
      username: '',
      password: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  // TODO: depois do login, os dados do grupo ainda não estão carregados!
  // TODO: O app está resolvendo a rota como se o usuário não estivesse logado (batendo na private route e redirecionando
  async handleFormSubmit(event) {
    event.preventDefault();
    const { username, password } = this.state;
    try {
      const { data, status } = await auth.login(username, password);
      console.log(status);
      if (status !== 200) {
        this.setState({
          error: data.message,
          username: '',
          password: '',
        });
        return;
      }
      this.setState({
        redirectToReferrer: true,
        error: false,
      });
      this.props.getUser(data);
      // const { location } = this.props;
      // if (!location.state) {
      //   this.props.history.push('/groups');
      // }
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    // no sucesso, redireciona de onde ele veio ou leva ele de volta para login
    const { from } = this.props.location.state || {
      from: { pathname: '/groups' },
    };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer) {
      console.log('redirect do login:', from);
      return <Redirect to={from} />;
    }

    return (
      <div>
        <div>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Login</h5>
              </div>
              <div className="modal-body">
                <br />
                {this.state.error && this.state.error}
                <form onSubmit={this.handleFormSubmit}>
                  <div className="form-group">
                    <label htmlFor="recipient-user" className="col-form-label">
                      Username:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="recipient-user"
                      name="username"
                      value={this.state.username}
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label
                      htmlFor="recipient-password"
                      className="col-form-label"
                    >
                      Password:
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="recipient-password"
                      name="password"
                      value={this.state.password}
                      onChange={this.handleChange}
                    />
                  </div>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <input
                    type="submit"
                    value="Submit"
                    className="btn btn-primary"
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
