import React, { Component } from 'react';
import { auth } from '../../util/api';

export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
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

  async handleFormSubmit(event) {
    event.preventDefault();
    const { username, password } = this.state;
    try {
      const { data, status } = await auth.signup(username, password);
      console.log(
        'data: ', data,
        'status: ', status, 
      )
      if (status !== 200) {
        this.setState({
          error: data.message,
          username: '',
          password: '',
        });
        return;
      } else {
        this.props.getUser(data);
        this.props.history.push("/groups");
        this.setState({
          error: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  render() {
    return (
      <div
      // className="modal fade"
      // id="signupbutton"
      // tabIndex="-1"
      // role="dialog"
      // aria-labelledby="exampleModalCenterTitle"
      // aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Signup</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
                <br />
                  {this.state.error && this.state.error}
            <div className="modal-body">
              <form onSubmit={this.handleFormSubmit}>
                <div className="form-group">
                  <label htmlFor="recipient-usuario" className="col-form-label">
                    Username:
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="recipient-usuario"
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
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

/*

<div
          // className="modal fade"
          // id="signupbutton"
          // tabIndex="-1"
          // role="dialog"
          // aria-labelledby="exampleModalCenterTitle"
          // aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Dados para cadastro</h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={this.handleSignUpFormSubmit}>
                  <div className="form-group">
                    <label
                      htmlFor="recipient-usuario"
                      className="col-form-label"
                    >
                      Usuário:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="recipient-usuario"
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
                      Senha:
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
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-dismiss="modal"
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary">
                      CRIAR
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

*/
