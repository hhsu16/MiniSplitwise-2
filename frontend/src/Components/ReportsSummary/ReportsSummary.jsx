import React, { Component } from 'react';
import { groups } from '../../util/api'; // Groups component from API service

class ReportsSummary extends Component {
  constructor(props) {
    super(props);
    this.state = { msg: '', balances: [] };
    // this.getBalances = this.getBalances.bind(this)
  }
 
  componentDidUpdate(prevProps) {
    if (this.props.groupId !== prevProps.groupId) {
    groups
      .getBalances(this.props.groupId) //props do Id do grupo;
      .then((qryObj) => {
        // console.log('ReportSummary - componentDidUpdate - qryObj', qryObj);
        this.setState(
          { msg: qryObj.data.msg, balances: qryObj.data.queryResult },
          () => console.log('ReportSummary - componentDidUpdate - this.state:', this.state)
        );
      })
      .catch((error) => console.log('erro ReportBills', error));
    }
  }
 
  /*
   TODO: No componentDidMount, quando troca o grupo na navbar, não atualiza a view. Com o componentDidUpdate, atualiza, mas bate na API a todo instante! E
  */
 
  componentDidMount() {
    // this.getBalances();
    groups
      .getBalances(this.props.groupId) //props do Id dlocalhost:500o grupo;
      .then((qryObj) => {
        // console.log('ReportSummary - componentDidMount - qryObj', qryObj);
        this.setState(
          { msg: qryObj.data.msg, balances: qryObj.data.queryResult },
            // () => console.log('ReportSummary - componentDidMount - this.state', this.state)
        );
      })
      .catch((error) => console.log('erro ReportSummary', error));
  }

  // async getBalances() {
  //   const qryObj = await groups.getBalance(this.props.groupId);
  //   this.setState({
  //     msg: qryObj.data.msg,
  //     balances: qryObj.data.queryResult,
  //   });
  // }

  render() {
    // this.getBalances();
    if (this.state.balances) {
      //Conditional return
      return (
        <div>
          <p>Summary of accounts per participant:</p>

          <div className="resultTable table-responsive-md">
            <table className="table table6 table-striped">
              <thead>
                <tr>
                  <th scope="col">Total</th>
                  <th scope="col">Spent</th>
                  <th scope="col">Consume</th>
                  <th scope="col">Paid</th>
                  <th scope="col">Receive</th>
                  <th scope="col">Balance</th>
                </tr>
              </thead>
              <tbody>
                {/* Map que recebe os registros da API e cria uma row de tabela - vide exemplo abaixo */}
                {this.state.balances.map((qry, idx) => {
                  return (
                    <tr key={idx}>
                      <td>{qry.member}</td>
                      <td>{qry.expensePaid}</td>
                      <td>{qry.share}</td>
                      <td>{qry.settlePaid}</td>
                      <td>{qry.settleReceived}</td>
                      <td>{qry.balance}</td>
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

export default ReportsSummary;
