import React, { Component } from "react";
import "../../App.css";
import axios from "axios";
import { Redirect } from "react-router";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import { Form, Button } from "react-bootstrap";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  List,
} from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import NumberFormat from "react-number-format";
import LoginNavbar from "../Navbar/LoginNavbar";
import MenuComponents from "../Dashboard/MenuComponents";
import GroupBalanceComponent from "./GroupBalanceComponent";
import gql from "graphql-tag";
import { Query, withApollo } from "react-apollo";

const GROUP_MEMBER_QUERY = gql`
  query ($groupname: String) {
    groupmember(groupname: $groupname) {
      useremail
    }
  }
`;

const GROUP_ACTIVITY_QUERY = gql`
  query ($groupname: String) {
    groupactivity(groupname: $groupname) {
      expense
      description
      useremail
      date
      datestring
    }
  }
`;

const ADD_EXPENSE_QUERY = gql`
  mutation (
    $groupname: String
    $useremail: String
    $description: String
    $expense: String
    $groupmemberlist: String
  ) {
    addexpense(
      groupname: $groupname
      useremail: $useremail
      description: $description
      expense: $expense
      groupmemberlist: $groupmemberlist
    ) {
      success
    }
  }
`;

const LEAVE_GROUP_QUERY = gql`
  mutation ($useremail: String, $groupname: String) {
    leavegroup(useremail: $useremail, groupname: $groupname) {
      success
    }
  }
`;

const useStyles = (theme) => ({
  root: {
    flexGrow: 1,
    margin: theme.spacing(1),
  },
  margin: {
    margin: theme.spacing(1),
  },
  button: {
    marginRight: theme.spacing(1),
  },
  title: {
    flexGrow: 1,
    fontSize: 30,
    fontWeight: "bold",
  },
  dialogtext: {
    flexGrow: 1,
    fontSize: 13,
    fontWeight: "bold",
  },
  text: {
    flexGrow: 1,
    fontSize: 13,
    fontWeight: "bold",
  },
  message: {
    flexGrow: 1,
    fontSize: 20,
  },
});

class GroupPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectVar: "",
      //for toggle modal
      open: false,
      description: "",
      expense: 0,
      groupname: JSON.parse(localStorage.getItem("groupDetail")).groupname,
      useremail: localStorage.getItem("email"),
      //for balance component
      groupmemberlist: "",
      //for activity list
      groupactivitylist: [],
      currencysymbol: "",
    };
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.descriptionChangeHandler = this.descriptionChangeHandler.bind(this);
    this.expenseChangeHandler = this.expenseChangeHandler.bind(this);
    this.validateInput = this.validateInput.bind(this);
    this.handleAddExpense = this.handleAddExpense.bind(this);
    this.handleGroupProfile = this.handleGroupProfile.bind(this);
    this.handleInvite = this.handleInvite.bind(this);
    this.handleLeaveGroup = this.handleLeaveGroup.bind(this);
  }
  componentDidMount() {
    let currency = localStorage.getItem("currency");
    switch (currency) {
      case "USD($)":
        this.setState({ currencysymbol: "$" });
        break;
      case "KWD(KWD)":
        this.setState({ currencysymbol: "KWD" });
        break;
      case "BHD(BD)":
        this.setState({ currencysymbol: "BD" });
        break;
      case "GBP(£)":
        this.setState({ currencysymbol: "£" });
        break;
      case "EUR(€)":
        this.setState({ currencysymbol: "€" });
        break;
      case "CAD($)":
        this.setState({ currencysymbol: "$" });
        break;
      default:
        this.setState({ currencysymbol: "$" });
    }
    //getGroupMember
    axios.defaults.withCredentials = true;
    this.props.client
      .query({
        query: GROUP_MEMBER_QUERY,
        variables: {
          groupname: this.state.groupname,
        },
      })
      .then((response) => {
        console.log("inside success");
        console.log("response data in get groupmember", response.data);
        let memberlist = response.data.groupmember;
        let memberarray = "";
        memberlist.map((listing) => {
          memberarray += listing.useremail;
          memberarray += " ";
          console.log(memberarray);
        });
        memberarray = memberarray.slice(0, -1); // remove the last space
        this.setState({ groupmemberlist: memberarray });
      })
      .catch((error) => {
        console.log(error);
      });
    //getGroupActivity
    this.props.client
      .query({
        query: GROUP_ACTIVITY_QUERY,
        variables: {
          groupname: this.state.groupname,
        },
      })
      .then((response) => {
        console.log("inside success");
        console.log("response data in get group activity", response.data);
        let activitylist = response.data.groupactivity;
        //most recent expense on top
        activitylist.sort(function (a, b) {
          return b.date - a.date;
        });
        this.setState({
          groupactivitylist: activitylist,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  //handlers
  handleClickOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.setState({ open: false });
  };
  descriptionChangeHandler = (e) => {
    this.setState({
      description: e.target.value,
    });
  };
  expenseChangeHandler = (e) => {
    this.setState({
      expense: e.target.value,
    });
  };
  //validate input
  validateInput = () => {
    const input_description = this.state.description;
    const input_expense = this.state.expense;
    const error = document.getElementById("errorMsg");
    let isValid = true;
    if (!input_description) {
      error.textContent = "Description can not be empty";
      isValid = false;
    } else if (input_expense == 0) {
      error.textContent = "Expense can not be 0";
      isValid = false;
    }
    return isValid;
  };
  //buttons
  handleAddExpense = (event) => {
    event.preventDefault(); //stop refresh
    if (this.validateInput()) {
      axios.defaults.withCredentials = true;
      this.props.client
        .mutate({
          mutation: ADD_EXPENSE_QUERY,
          variables: {
            groupname: this.state.groupname,
            useremail: this.state.useremail,
            description: this.state.description,
            expense: this.state.expense,
            groupmemberlist: this.state.groupmemberlist,
          },
        })
        .then((response) => {
          console.log("inside success", response.data);
          if (response.data.addexpense.success === true) {
            alert("Successfully add an expense!");
            window.location.href = "/grouppage";
            console.log(response);
          } else if (response.data.addexpense.success === false) {
            alert("Fail to add an expense");
            console.log(response);
          }
        })
        .catch((error) => {
          console.log("In error");
          alert("Fail to add an expense");
          console.log(error);
        });
    }
  };
  handleGroupProfile = (event) => {
    event.preventDefault(); //stop refresh
    this.setState({
      redirectVar: "/groupprofile",
    });
  };
  handleInvite = (event) => {
    event.preventDefault(); //stop refresh
    this.setState({
      redirectVar: "/groupinvite",
    });
  };
  handleLeaveGroup = (event) => {
    event.preventDefault();
    axios.defaults.withCredentials = true;
    this.props.client
      .mutate({
        mutation: LEAVE_GROUP_QUERY,
        variables: {
          groupname: JSON.parse(localStorage.getItem("groupDetail")).groupname,
          useremail: localStorage.getItem("email"),
        },
      })
      .then((response) => {
        console.log("inside success", response.data);
        if (response.data.leavegroup.success === true) {
          alert("Successfully leave the group");
          window.location.href = "/mygroups";
          console.log(response);
        } else if (response.data.leavegroup.success === false) {
          alert("Failed to leave the group! You have not settle up the dues");
          console.log(response);
        }
      })
      .catch((error) => {
        console.log("In error");
        alert("Failed to leave the group! You have not settle up the dues");
        console.log(error);
      });
  };
  render() {
    const { classes } = this.props;
    console.log(this.state);
    let redirectVar = null;
    if (!localStorage.getItem("email")) {
      redirectVar = <Redirect to="/" />;
    }
    if (this.state.redirectVar === "/groupprofile") {
      redirectVar = <Redirect to="/groupprofile" />;
    }
    if (this.state.redirectVar === "/groupinvite") {
      redirectVar = <Redirect to="/groupinvite" />;
    }
    if (this.state.redirectVar === "/expense") {
      redirectVar = <Redirect to="/expense" />;
    }
    return (
      <div>
        {redirectVar}
        <LoginNavbar />
        <div class="container">
          <h2>Welcome to Splitwise</h2>
        </div>
        <div className={classes.root}>
          <Grid container spacing={1}>
            <Grid item xs={12} spacing={1}>
              <Grid container spacing={5}>
                <Grid item xs={4}>
                  <MenuComponents />
                  <GroupBalanceComponent />
                </Grid>
                <Grid item xs={7}>
                  <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                      Recent Expenses
                    </Typography>
                    <Button
                      variant="contained"
                      size="large"
                      color="primary"
                      className={classes.button}
                      onClick={this.handleClickOpen}
                    >
                      Add an Expense
                    </Button>
                    <Dialog
                      fullWidth
                      maxWidth="xs"
                      open={this.state.open}
                      onClose={this.handleClose}
                      aria-labelledby="form-dialog-title"
                    >
                      <DialogTitle>Add an Expense</DialogTitle>
                      <DialogContent>
                        <DialogContentText className={classes.dialogtext}>
                          With you and Group:
                          {
                            JSON.parse(localStorage.getItem("groupDetail"))
                              .groupname
                          }
                        </DialogContentText>
                        <Form>
                          <Form.Group controlId="formDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                              type="text"
                              name="description"
                              value={this.state.description}
                              onChange={this.descriptionChangeHandler}
                              placeholder="Enter the description"
                            />
                          </Form.Group>
                          <Form.Group controlId="formExpense">
                            <Form.Label>
                              Expense ({this.state.currencysymbol})
                            </Form.Label>
                            <Form.Control
                              type="number"
                              name="Expense"
                              value={this.state.expense}
                              onChange={this.expenseChangeHandler}
                              placeholder="Enter the Expense"
                            />
                          </Form.Group>
                        </Form>
                        <div className="error" id="errorMsg" />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                          Cancel
                        </Button>
                        <Button onClick={this.handleAddExpense} color="primary">
                          Save
                        </Button>
                      </DialogActions>
                    </Dialog>
                    <Button
                      variant="contained"
                      size="large"
                      color="primary"
                      className={classes.button}
                      onClick={this.handleGroupProfile}
                    >
                      Edit Group Profile
                    </Button>
                    <Button
                      variant="contained"
                      size="large"
                      color="primary"
                      className={classes.button}
                      onClick={this.handleInvite}
                    >
                      Invite User
                    </Button>
                    <Button
                      variant="contained"
                      size="large"
                      color="primary"
                      className={classes.button}
                      onClick={this.handleLeaveGroup}
                    >
                      Leave Group
                    </Button>
                  </Toolbar>
                  <List>
                    {!this.state.groupactivitylist.length && (
                      <Typography className={classes.message}>
                        No Recent Activity to Show...
                      </Typography>
                    )}
                    {this.state.groupactivitylist.map((listing, index) => {
                      return (
                        <Accordion>
                          <AccordionDetails>
                            <Grid container spacing={3}>
                              <Grid item xs={4}>
                                <Typography className={classes.text}>
                                  Description: {listing.description}
                                </Typography>
                              </Grid>
                              <Grid item xs={4}>
                                <Typography className={classes.text}>
                                  User: {listing.useremail}
                                </Typography>
                              </Grid>
                              <Grid item xs={4}>
                                <Typography className={classes.text}>
                                  Paid:
                                  <NumberFormat
                                    value={listing.expense}
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    prefix={this.state.currencysymbol}
                                  />
                                </Typography>
                              </Grid>
                              <Grid item xs={10}>
                                <Typography className={classes.text}>
                                  Date: {listing.datestring}
                                </Typography>
                              </Grid>
                            </Grid>
                          </AccordionDetails>
                        </Accordion>
                      );
                    })}
                  </List>
                  {this.state.groupactivitylist && (
                    <Typography>Most recent expenses on the top</Typography>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default withApollo(withStyles(useStyles)(GroupPage));
