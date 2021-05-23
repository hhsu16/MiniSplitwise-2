import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class DashNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ID: this.props.ID,
      groupName: this.props.groupName,
      description: this.props.description,
    };
  }
  render() {
    const { paramId } = this.props;
    return (
      <>
        <h1>
          Grupo: {this.props.groupName}
          <h5>{this.props.description}</h5>
        </h1>

        <div className="dashContent row py-0 my-2">
          <div
            className="btn-group btn-group-toggle mx-auto my-0"
            data-toggle="buttons"
          >
            <NavLink
              to={`/groups/${paramId}/pessoas`}
              className="btn btn-outline-secondary btn-yellow-dashboard"
            >
              <input type="radio" name="options" id="dashPessoas" />
              Peoples
            </NavLink>

            <NavLink
              to={`/groups/${paramId}/despesas`}
              className="btn btn-outline-secondary btn-yellow-dashboard"
            >
              <input type="radio" name="options" id="dashDespesas" />
              Expenses
            </NavLink>

            <NavLink
              to={`/groups/${paramId}/acertos`}
              className="btn btn-outline-secondary btn-yellow-dashboard"
            >
              <input type="radio" name="options" id="dashAcertos" />
              Settle
            </NavLink>
          </div>
        </div>
        <hr className="my-2" />
      </>
    );
  }
}

export default DashNavbar;
