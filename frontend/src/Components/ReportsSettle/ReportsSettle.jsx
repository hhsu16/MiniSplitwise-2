import React, { Component } from 'react';
import { groups } from '../../util/api'; // Groups component from API service

class ReportsSettle extends Component {
  constructor(props) {
    super(props);
    this.state = { message: '', groupAllSettles: [] };
  }


  componentDidUpdate(prevProps) {
    if (this.props.groupId !== prevProps.groupId) {
    groups
      .getSettles(this.props.groupId) //props do Id do grupo;
      .then((qryObj) => {
        // console.log('ReportsSettle - componentDidUpdate - qryObj', qryObj);
        this.setState(
          { message: qryObj.data.message, groupAllSettles: qryObj.data.groupAllSettles },
          () => console.log('ReportsSettle - componentDidUpdate - this.state:', this.state)
        );
      })
      .catch((error) => console.log('ERRO ReportBills - componentDidUpdate: ', error));
    }
  }

  componentDidMount() {
    groups
      .getSettles(this.props.groupId) //props do Id do grupo;
      .then((qryObj) => {
        console.log('ReportBills - componentDidMount - this.state', qryObj);
        this.setState(
          { message: qryObj.data.message, groupAllSettles: qryObj.data.groupAllSettles },
          () => console.log('ReportBills - componentDidMount - this.state:', this.state)
        );
      })
      .catch((error) => console.log('ERRO ReportBills - componentDidMount - this.state', error));
  }

  render() {
    if (this.state.groupAllSettles) {
      //Conditional return
      return (
        <div>
          <p>Payments to be made:</p>
{/*             "_id": "5e3c401e67966a77c0fb599d",
            "owner": "5e39a5dcd92dfc45cc871308",
            "paidBy": "Batman",
            "paidTo": "WonderWoman",
            "value": 10,
            "__v": 0 */}


          <div className="resultTable table-responsive-md">
            <table className="table table3 table-striped">
              <thead>
                <tr>
                  <th scope="col">Dollar</th>
                  <th scope="col">Paid by</th>
                  <th scope="col">Paid for</th>
                </tr>
              </thead>
              <tbody>
                {/* Map que recebe os registros da API e cria uma row de tabela - vide exemplo abaixo */}
                {this.state.groupAllSettles.map((qry, idx) => {
                  return (
                    <tr key={idx}>
                      <td>{qry.value}</td>
                      <td>{qry.paidBy}</td>
                      <td>{qry.paidTo}</td>
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

export default ReportsSettle;
