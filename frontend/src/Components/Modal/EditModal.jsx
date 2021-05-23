import React, { Component } from 'react';
// import CheckBox from '../DashDespesas/Checkbox';
// import { groups } from '../../util/api';

class EditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      iAmInThisPage: this.props.iAmInThisPage,
      element: this.props.element,
      editGroup: this.props.editGroup, //(idOfGroupToRemove, info)
      newInfoGroup: {
        groupName: this.props.element.groupName,
        description: this.props.element.description,
        date: this.props.element.date,
      },
    };
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange = (event) => {
    //"dashboard"
    const newInfoGroup = { ...this.state.newInfoGroup };
    const { name, value } = event.target;
    newInfoGroup[name] = value;

    this.setState({ newInfoGroup: newInfoGroup });

    //"expense"
    // const newInfoExpense = {...this.state.newInfoExpense};
    // const { name, value } = event.target;
    // newInfoExpense[name] = value;

    // this.setState({newInfoExpense: newInfoExpense});
  };
  whatIsMyPage = (iAmInThisPage) => {
    switch (iAmInThisPage) {
      case 'dashboard':
        this.state.editGroup(this.state.element._id, this.state.newInfoGroup);
        break;
      case 'member':
        // this.state.editMember(this.state.element); --- one day
        break;
      case 'expense':
        // this.props.editExpense(); --- one day
        break;
      case 'settle':
        console.log('Error');
        break;
      default:
        console.log('Delete mode is not defined');
        break;
    }
  };
  renderThis(actualPage) {
    switch (actualPage) {
      case 'dashboard':
        return (
          <div className="modal-body">
            <form>
              <div className="form-group text-left ">
                <label htmlFor="groupName" className="col-form-label">
                Group's name:
                </label>
                <input
                  onChange={this.handleChange}
                  type="text"
                  value={this.state.newInfoGroup.groupName}
                  className="form-control"
                  id="groupName"
                  name="groupName"
                />
                <label htmlFor="description" className="col-form-label">
                Description:
                </label>
                <input
                  onChange={this.handleChange}
                  type="text"
                  value={this.state.newInfoGroup.description}
                  className="form-control"
                  id="description"
                  name="description"
                />
                <label htmlFor="date" className="col-form-label">
                  Date of the event:
                </label>
                <input
                  onChange={this.handleChange}
                  type="date"
                  value={this.state.newInfoGroup.date}
                  className="form-control"
                  id="date"
                  name="date"
                />
              </div>
            </form>
          </div>
        );
      case 'expense':
      default:
        break;
    }
  }
  render() {
    return (
      <>
        <div
          className="modal fade"
          id={`editButton${this.state.element._id}`}
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit form</h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>

              {this.renderThis(this.state.iAmInThisPage)}

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  {' '}
                  Cancel{' '}
                </button>
                <button
                  onClick={() => this.whatIsMyPage(this.state.iAmInThisPage)}
                  data-dismiss="modal"
                  type="button"
                  className="btn btn-primary"
                >
                  {''}Edit{' '}
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default EditModal;
