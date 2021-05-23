import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import './Dashboard.css';

import { groups } from '../../util/api';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userGroups: this.props.data.groups,
      renderModalDelete: this.props.renderModalDelete,
      renderModalEdit: this.props.renderModalEdit,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  async handleClick(id) {
    const response = await groups.getOne(id);
    const group = response.data;
    this.props.getSelectedGroup(group);

    this.setState({
      selectedGroup: group.data,
    });
  }

  render() {
    const { match } = this.props;
    return (
      <>
        <h1>My groups</h1>
        {this.state.userGroups.map((e) => {
          return (
            <>
              <hr />
              <div className="row m-1 d-flex justify-content-center">
                <div className="col-md-7 d-flex flex-column mt-1">
                  <Link
                    onClick={() => this.handleClick(e._id)}
                    to={`${match.url}/${e._id}/pessoas`}
                    className="btn btn-outline-secondary "
                  >
                    {e.groupName} - {e.description}
                  </Link>
                </div>
                <div className="col-md-4 p-0 ml-1 d-flex flex-row justify-content-center mt-1">
                  <button className="btn btn-secondary mr-1">Report</button>
                  <button
                    data-toggle="modal"
                    data-target={`#editButton${e._id}`}
                    className="btn btn-warning mr-1"
                  >
                    Edit
                  </button>
                  <button
                    data-toggle="modal"
                    data-target={`#deleteButton${e._id}`}
                    className="btn btn-danger"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {this.props.renderModalDelete(e.groupName, e._id, 'dashboard')}
              {this.props.renderModalEdit(e, 'dashboard')}
            </>
          );
        })}
        <Route
          path={`${match.path}/:id`}
          render={({ match }) => {
            return (
              <div>
                {' '}
                <h1>{match.params.id}</h1>
              </div>
            );
          }}
        />
      </>
    );
  }
}

export default Dashboard;
