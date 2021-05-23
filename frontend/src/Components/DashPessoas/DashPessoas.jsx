import React, { Component } from 'react';
import DashNavbar from '../DashNavbar/DashNavbar';
import { groups } from '../../util/api';

class DashPessoas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedGroup: {},
      newMember: ' ',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    // this.props.addMember = this.props.addMember.bind(this);
  }
  handleChange(event) {
    const { value } = event.target;
    this.setState({ newMember: value });
    //teste
  }
  handleSubmit(event) {
    event.preventDefault();
    console.log('oi, submit!');
    let str = this.state.newMember;
    str = str.replace(/\s{2,}/g, ' ');
    if (str === ' ') {
      console.log('oi');
      return;
    }
    let _id, members;
    if (str[0] === ' ') {
      str.slice(0, 1);
      console.log('meu grupo selecionado:', this.props.selectedGroup);
      // pegar o grupo selecionado, atualizar o array de membros, devolver o objeto para o put da api
      _id = this.props.selectedGroup._id;
      members = this.props.selectedGroup.members;
      if (_id && members) {
        members.push(str);
        const groupCopy = { ...this.props.selectedGroup };
        console.log('meu groupCopy:', groupCopy);
        groupCopy.members = members;
        const response = groups.put(_id, groupCopy);
        console.log('resposta do put:', response);
      }
    } else {
      _id = this.props.selectedGroup._id;
      members = this.props.selectedGroup.members;
      if (_id && members) {
        members.push(str);
        const groupCopy = { ...this.props.selectedGroup };
        console.log('meu groupCopy:', groupCopy);
        groupCopy.members = members;
        const response = groups.put(_id, groupCopy);
        console.log('resposta do put:', response);
      }
      this.setState({
        newMember: ' ',
      });
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    if (Object.keys(this.props.selectedGroup).length === 0) {
      const response = await groups.getOne(this.props.match.params.id);
      const group = response.data;
      this.props.getSelectedGroup(group);
    }
    console.log('props no dashpessoas:', this.props);
  }

  render() {
    const { id: paramId } = this.props.match.params;
    let membersArray = [];
    if (Array.isArray(this.props.selectedGroup.members)) {
      membersArray = this.props.selectedGroup.members;
    }
    return (
      <>
        <DashNavbar paramId={paramId} />
        <div className="dashMainContent mx-4">
          <h2>Add people:</h2>
          <form
            onSubmit={this.handleSubmit}
            className="dashAddBills d-flex justify-content-between align-items-end flex-wrap"
          >
            <div className="form-group text-left col-lg-4 mt-1 mb-0 p-0">
              Name:
              <input
                type="text"
                className="form-control"
                id="newMemberName"
                name="name"
                onChange={this.handleChange}
                required
              />
            </div>
            {/* <div className="form-group text-left col-lg-5 mb-0 mt-1 p-0">
              Contato:
              <input
                type="text"
                className="form-control"
                id="newMemberContact"
                name="contact"
                value={this.state.newMember.contact}
                placeholder={"E-mail ou Telefone para contato"}
                onChange={this.handleChange}
              />
            </div> */}
            <button
              type="submit"
              value="submit"
              className="btn btn-warning mt-2 col-lg-2"
            >
              Submit
            </button>
          </form>
          <hr />

          <div className="dashBillsList">
            <div className="row">
              {membersArray
                .sort((a, b) => a.localeCompare(b))
                .map((e, i) => {
                  return (
                    <>
                      <div key={i} className="col-lg-6 p-0 my-1">
                        <button className="btn btn-outline-secondary col-10">
                          {e}
                        </button>{' '}
                        <button
                          className="btn btn-danger col-1"
                          onClick={() => this.props.renderModalDelete(e, e)}
                          type="button"
                          data-toggle="modal"
                          data="teste"
                          data-target={`#deleteButton${e}`}
                        >
                          {' '}
                          X{' '}
                        </button>
                        {this.props.renderModalDelete(e, e, 'member')}
                      </div>
                    </>
                  );
                })}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default DashPessoas;
