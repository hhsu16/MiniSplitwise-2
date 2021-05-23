import React, { Component } from 'react';
import { groups } from '../../util/api'; // Groups component from API service

class ReportsBills extends Component {
  constructor(props) {
    super(props);
    this.state = { message: '', groupAllExpenses: [] };
  }

  componentDidUpdate(prevProps) {
    if (this.props.groupId !== prevProps.groupId) {
    groups
      .getBills(this.props.groupId) //props do Id do grupo;
      .then((qryObj) => {
        // console.log('componentDidMount', qryObj);
        this.setState(
          { message: qryObj.data.message, groupAllExpenses: qryObj.data.groupAllExpenses },
          // () => console.log('ReportBills - this.state:', this.state)
        );
      })
      .catch((error) => console.log('erro ReportBills', error));
    }
  }

  componentDidMount() {
    groups
      .getBills(this.props.groupId) //props do Id do grupo;
      .then((qryObj) => {
        console.log('componentDidMount', qryObj);
        this.setState(
          { message: qryObj.data.message, groupAllExpenses: qryObj.data.groupAllExpenses },
          // () => console.log('ReportBills - this.state:', this.state)
        );
      })
      .catch((error) => console.log('erro ReportBills', error));
  }

  render() {
    if (this.state.groupAllExpenses) {
      //Conditional return
      return (
        <div>
          <p>All group expenses</p>

          <div className="resultTable table-responsive-md">
            <table className="table table3 table-striped">
              <thead>
                <tr>
                  <th scope="col">Total</th>
                  <th scope="col">Description</th>
                  <th scope="col">Dollar</th>
                </tr>
              </thead>
              <tbody>
                {/* Map que recebe os registros da API e cria uma row de tabela - vide exemplo abaixo */}
                {this.state.groupAllExpenses.map((qry, idx) => {
                  return (
                    <tr key={idx}>
                      <td>{qry.split.paidBy}</td>
                      <td>{qry.description}</td>
                      <td>{qry.value}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <br />
          <hr />
          <br />
        </div>
      );
    } else {
      //Conditional return FALSE
      return (
        <div>
          <h1>Carregando...</h1>
        </div>
      );
    }
  }
}

export default ReportsBills;
