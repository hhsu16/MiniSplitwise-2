import React, { Component } from 'react';
import DashNavbar from '../DashNavbar/DashNavbar';
import './DashAcertos.css';

class DashAcertos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      group: this.props.oneGroup,
      members: this.props.oneGroup.members,
      settles: this.props.oneGroup.settles,
      renderModalDelete: this.props.renderModalDelete,
      errorMessage: '',
      newSettle: {
        _id: null,
        group: this.props.oneGroup._id,
        value: 0,
        paidBy: '',
        paidTo: '',
      },
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // TODO: ARRUMAR NAS 3
  // async getSingleGroup() {
  //   const { params } = this.props.match;
  //   const group = await groups.getOne(params.id);

  //   console.log('group:', group)
  //   this.setState({
  //     group: group.data,
  //   });
  // }

  editSettle = (e) => {
    let { newSettle } = this.state;
    newSettle = e;

    this.setState({ newSettle: newSettle });
  };
  handleChange(event) {
    let newErrorMessage = '';
    const { name, value } = event.target;
    const newSettleCopy = { ...this.state.newSettle };
    newSettleCopy[name] = value;
    newSettleCopy.value = +newSettleCopy.value;

    this.setState(
      { newSettle: newSettleCopy, errorMessage: newErrorMessage },
      console.log(this.state.newSettle)
    );
  }
  handleSubmit(event) {
    event.preventDefault();
    let newErrorMessage = '';
    if (
      this.state.newSettle.paidBy === '' ||
      this.state.newSettle.paidTo === ''
    ) {
      newErrorMessage = 'Por favor, preencha todos os dados';
    } else if (this.state.newSettle.paidBy === this.state.newSettle.paidTo) {
      event.preventDefault();
      newErrorMessage = 'Não é possível pagar a si mesmo';
    } else {
      const copyNewSettle = { ...this.state.newSettle };
      copyNewSettle._id
        ? this.props.editSettle(this.state.newSettle._id, this.state.newSettle)
        : this.props.addSettle(this.state.newSettle);
      copyNewSettle._id = null;
      copyNewSettle.value = 0;
      copyNewSettle.paidBy = '';
      copyNewSettle.paidTo = '';
      this.setState({ newSettle: copyNewSettle });
    }
    this.setState({ errorMessage: newErrorMessage });
  }
  render() {
    const { id: paramId } = this.props.match.params;
    return (
      <>
        <DashNavbar
          paramId={paramId}
          description={this.state.group.description}
          groupName={this.state.group.groupName}
        />

        <div className="dashMainContent">
          {/* <!-- Add Settle --> */}
          <h2>Add new settle:</h2>
          <form className="dashAddBills d-flex justify-content-between align-items-end flex-wrap px-4">
            <div className="form-group text-left col-lg-3 mt-1 mb-0 p-0">
            Paid:
              <select
                onChange={this.handleChange}
                name="paidBy"
                className="form-control"
                value={this.state.newSettle.paidBy}
                required
              >
                <option value="">Select a name</option>
                {[...this.state.members]
                  .sort((a, b) => a.localeCompare(b))
                  .map((member) => {
                    return <option value={member}>{member}</option>;
                  })}
              </select>
            </div>
            <div className="form-group text-left col-lg-3 mb-0 mt-1 p-0">
              Receive:
              <select
                onChange={this.handleChange}
                name="paidTo"
                className="form-control"
                value={this.state.newSettle.paidTo}
                required
              >
                <option value="">Select a name</option>
                {[...this.state.members]
                  .sort((a, b) => a.localeCompare(b))
                  .map((member) => {
                    return <option value={member}>{member}</option>;
                  })}
              </select>
            </div>
            <div className="form-group text-left col-lg-2 mb-0 mt-1 p-0">
              Dollar:
              <input
                onChange={this.handleChange}
                type="number"
                name="value"
                className="form-control"
                min="0.00"
                max="10000.00"
                step="0.01"
                id="acertoValor"
                placeholder="R$ 10,00"
                value={this.state.newSettle.value}
                required
              />
            </div>
            <button
              onClick={this.handleSubmit}
              type="submit"
              className="btn btn-warning mt-2 col-lg-2"
            >
              Submit
            </button>
          </form>
          <div
            className="zindex-modal alert alert-warning bg-transparent m-2 py-auto px-auto noBorder"
            role="alert"
          >
            {this.state.errorMessage}
          </div>
          <hr />

          <div className="dashSettleList row">
            {[...this.state.settles].map((e) => {
              return (
                <div className="col-lg p-0 ml-0 dashComponents">
                  <div className="col-9 p-0">
                    <button className="btn btn-outline-secondary boxComponent">
                      {e.paidBy} pagou para {e.paidTo} o valor de R${e.value}
                    </button>
                  </div>
                  <div className="col-2 p-0">
                    <button
                      className="btn btn-warning buttonOptions"
                      type="button"
                      onClick={() => this.editSettle(e)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger buttonOptions"
                      type="button"
                      data-toggle="modal"
                      data-target={`#deleteButton${e._id}`}
                    >
                      Delete
                    </button>
                    {this.props.renderModalDelete(
                      `O pagamento de ${e.paidBy} para ${e.paidTo}`,
                      e,
                      'settle'
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }
}

export default DashAcertos;
