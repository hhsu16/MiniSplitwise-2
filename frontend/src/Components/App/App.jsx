import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { auth } from '../../util/api';
import { groups } from '../../util/api';
// Components
import Index from '../Index/Index'; // isso precisa morrer
import Navbar from '../Navbar/Navbar';

import Login from '../Login/Login';
import Signup from '../Signup/Signup';

import Dashboard from '../Dashboard/Dashboard';

import Pessoas from '../DashPessoas/DashPessoas';
import Despesas from '../DashDespesas/DashDespesas';
import Acertos from '../DashAcertos/DashAcertos';
import DeleteModal from '../Modal/DeleteModal';
import EditModal from '../Modal/EditModal';
import PrivateRoute from '../PrivateRoute/PrivateRoute';
import Reports from '../Reports/Reports';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isAuth: false,
      groups: [],
      selectedGroup: {},
    };
    this.addExpense = this.addExpense.bind(this);
    this.addSettle = this.addSettle.bind(this);
    this.renderModalDelete = this.renderModalDelete.bind(this); //TODOS OS DELETES ESTAO AQUI
    this.getUser = this.getUser.bind(this);
    this.fetchGroups = this.fetchGroups.bind(this);
    this.getSelectedGroup = this.getSelectedGroup.bind(this);
    this.getGroups = this.getGroups.bind(this);
  }

  componentDidMount() {
    this.fetchGroups();
  }

  async fetchUser() {
    if (this.state.isAuth === false) {
      try {
        const loggedInUser = await auth.isAuth();
        this.setState({
          user: loggedInUser,
          isAuth: true,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  getUser(userObj) {
    if (userObj === null) {
      this.setState({
        user: null,
        isAuth: false,
      });
    } else {
      this.setState({
        user: userObj,
        isAuth: true,
      });
    }
  }

  getSelectedGroup(groupObj) {
    if (groupObj === null) {
      this.setState({
        selectedGroup: null,
      });
    } else {
      this.setState({
        selectedGroup: groupObj,
      });
    }
  }

  async fetchGroups() {
    if (this.state.groups.length === 0) {
      try {
        const response = await groups.getAll();
        const { status, data } = response;
        if (status !== 200) {
          console.log('Erro api', data);
        } else {
          this.setState({
            groups: data,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  getGroups(groups) {
    if (groups === null) {
      this.setState({
        groups: [],
      });
    } else {
      this.setState({
        groups,
      });
    }
  }

  createGroup(newGroup) {
    this.state.groups.push(newGroup);
  }

  deleteOneElement = (elementID) => {
    //TODO deletar por ID ou ... name se for o caso do members
    // const index = this.state.selectedGroup.members.indexOf(memberID);
    // if (index > -1) {
    //   this.state.selectedGroup.members.splice(index, 1);
    // } return message = "Can not find ID Member";
  };
  renderModalEdit = (element, thisPage) => (
    <EditModal
      element={element}
      iAmInThisPage={thisPage}
      editGroup={
        (this.editGroup = (idOfGroupToEdit, newInfo) => {
          groups.put(idOfGroupToEdit, newInfo);
        })
      }
    />
  );
  renderModalDelete = (midleText, element, thisPage) => (
    <DeleteModal
      midleText={midleText}
      element={element}
      iAmInThisPage={thisPage}
      removeGroup={
        (this.removeGroup = (idOfGroupToRemove) => {
          // console.log('ESSE É O ID DO GRUPO PARA REMOVER', idOfGroupToRemove);
          groups.delete(idOfGroupToRemove);
        })
      }
      removeMember={
        (this.removeMember = (memberToRemove) => {
          console.log('ESSE É O MEMBRO PARA REMOVER', memberToRemove);
          const groupCopy = { ...this.state.selectedGroup };
          console.log(groupCopy);
          const membersArr = groupCopy.members;
          membersArr.splice(membersArr.indexOf(memberToRemove), 1);
          groupCopy.members = membersArr;
          groups.put(this.state.selectedGroup._id, groupCopy);
        })
      }
      removeExpense={
        (this.removeExpense = (expenseInfo) => {
          const { _id, group, description, value, split } = expenseInfo;
          groups.deleteExpense(group, _id);
        })
      }
      removeSettle={
        (this.removeSettle = (settleToRemove) => {
          const { _id, group, value, paidBy, paidTo } = settleToRemove;
          groups.deleteSettle(group, _id);
        })
      }
    />
  );

  addGroup = (newGroup) => {
  };

  addExpense = (newExpense) => {
    const { group, description, value, split } = newExpense;
    groups.createExpense(group, { description, value, split });
  };

  editExpense = (idOfExpenseToEdit, newInfo) => {
    const { group, description, value, split } = newInfo;
    groups.putExpense(group, idOfExpenseToEdit, { description, value, split });
  };

  editSettle = (idOfSettleToEdit, newInfo) => {
    const { group, value, paidBy, paidTo } = newInfo;
    groups.putSettle(group, idOfSettleToEdit, { value, paidBy, paidTo });
  };

  addSettle = (newSettle) => {
    const { group, value, paidBy, paidTo } = newSettle;
    groups.createSettle(group, { value, paidBy, paidTo });
  };

  render() {
    this.fetchUser();
    // this.fetchGroups();
    return (
      <div className="App">
        <Navbar
          getSelectedGroup={this.getSelectedGroup}
          userInSession={this.state.user}
          getUser={this.getUser}
          authed={this.state.isAuth}
          groups={this.state.groups}
          addGroup={this.addGroup}
        />
        {this.state.isAuth ? (
          <Switch>
            <Route
              exact
              path="/groups/:id/reports"
              render={(props) => {
                return (
                  <Reports
                    // data={this.state}
                    {...props}
                  />
                );
              }}
            />
            <Route
              exact
              path="/login"
              render={(props) => {
                return (
                  <Login
                    getUser={this.getUser}
                    getGroups={this.getGroups}
                    {...props}
                  />
                );
              }}
            />
            <Route
              exact
              path="/signup"
              render={(props) => {
                return <Signup getUser={this.getUser} {...props} />;
              }}
            />
            <Route
              exact
              path="/"
              render={() => <Index getUser={this.getUser} />}
            />
            <Route
              exact
              path="/groups"
              render={(props) => {
                return (
                  <Dashboard
                    getSelectedGroup={this.getSelectedGroup}
                    data={this.state}
                    renderModalDelete={this.renderModalDelete}
                    renderModalEdit={this.renderModalEdit}
                    {...props}
                  />
                );
              }}
            />
            <Route
              exact
              path="/groups/:id/pessoas"
              render={(props) => {
                return (
                  <Pessoas
                    {...props}
                    getSelectedGroup={this.getSelectedGroup}
                    selectedGroup={this.state.selectedGroup}
                    renderModalDelete={this.renderModalDelete}
                    renderModalEdit={this.renderModalEdit}
                  />
                );
              }}
            />
            <Route
              exact
              path="/groups/:id/despesas"
              render={(props) => {
                return (
                  <Despesas
                    {...props}
                    oneGroup={this.state.selectedGroup}
                    renderModalDelete={this.renderModalDelete}
                    editExpense={this.editExpense}
                    addExpense={this.addExpense}
                  />
                );
              }}
            />
            <Route
              exact
              path="/groups/:id/acertos"
              render={(props) => {
                return (
                  <Acertos
                    {...props}
                    oneGroup={this.state.selectedGroup}
                    renderModalDelete={this.renderModalDelete}
                    addSettle={this.addSettle}
                    editSettle={this.editSettle}
                  />
                );
              }}
            />
          </Switch>
        ) : (
          <Switch>
            <Route
              exact
              path="/login"
              user={this.state.user}
              render={(props) => (
                <Login
                  getUser={this.getUser}
                  getGroups={this.getGroups}
                  {...props}
                />
              )}
            />
            <Route
              exact
              path="/signup"
              user={this.state.user}
              render={(props) => <Signup getUser={this.getUser} {...props} />}
            />
            <Route
              exact
              path="/"
              user={this.state.user}
              render={(props) => <Index getUser={this.getUser} {...props} />}
            />
            <Route
              exact
              path="/groups/:id/reports"
              render={(props) => {
                return (
                  <Reports
                    // data={this.state}
                    {...props}
                  />
                );
              }}
            />
            <PrivateRoute
              exact
              path="/groups"
              authed={this.state.isAuth}
              component={Dashboard}
              data={this.state}
            />
          </Switch>
        )}
      </div>
    );
  }
}

export default App;
