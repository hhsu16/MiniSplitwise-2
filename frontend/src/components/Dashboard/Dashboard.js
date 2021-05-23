import React, { Component } from "react";
import "../../App.css";
import axios from "axios";
import { Redirect } from "react-router";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { Button, Paper } from "@material-ui/core";
import { Form } from "react-bootstrap";
import Toolbar from "@material-ui/core/Toolbar";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  List,
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { withStyles } from "@material-ui/core/styles";
import NumberFormat from "react-number-format";
import LoginNavbar from "../Navbar/LoginNavbar";
import MenuComponents from "./MenuComponents";
import gql from "graphql-tag";
import { Query, withApollo } from "react-apollo";

const OWELIST_QUERY = gql`
  query ($useremail: String) {
    getowelist(useremail: $useremail) {
      useroweemail
      userowedemail
      balance
    }
  }
`;

const OWEDLIST_QUERY = gql`
  query ($useremail: String) {
    getowedlist(useremail: $useremail) {
      useroweemail
      userowedemail
      balance
    }
  }
`;

const SETTLE_UP_QUERY = gql`
  mutation ($useremail: String, $email: String) {
    settleup(useremail: $useremail, email: $email) {
      success
    }
  }
`;

const useStyles = (theme) => ({
  root: {
    flexGrow: 1,
    margin: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(1),
    marginRight: theme.spacing(20),
  },
  title: {
    flexGrow: 1,
    fontSize: 30,
    fontWeight: "bold",
  },
  table: {
    fontSize: 15,
    fontWeight: "bold",
  },
  text: {
    flexGrow: 1,
    fontSize: 13,
  },
  message: {
    flexGrow: 1,
    fontSize: 10,
    fontWeight: "bold",
  },
  dialogtext: {
    flexGrow: 1,
    fontSize: 13,
    fontWeight: "bold",
  },
});

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      useremail: localStorage.getItem("email"),
      currencysymbol: "",
      //for owe/owed list and total
      owelist: [],
      owedlist: [],
      totalowe: 0,
      totalowed: 0,
      //for settle up
      email: "",
      open: false,
    };
    this.handleSettleUp = this.handleSettleUp.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.emailChangeHandler = this.emailChangeHandler.bind(this);
  }
  //get from balance table
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
    //getOweList
    axios.defaults.withCredentials = true;
    this.props.client
      .query({
        query: OWELIST_QUERY,
        variables: {
          useremail: this.state.useremail,
        },
      })
      .then((response) => {
        console.log("inside success");
        console.log("response data in get owe list", response.data);
        let owelistlist = response.data.getowelist;
        let totalowe = 0;
        owelistlist.map((listing) => {
          totalowe += parseFloat(listing.balance);
        });
        this.setState({
          owelist: owelistlist,
          totalowe: totalowe,
        });
      })
      .catch((error) => {
        console.log(error);
      });
    //getOwedList
    this.props.client
      .query({
        query: OWEDLIST_QUERY,
        variables: {
          useremail: this.state.useremail,
        },
      })
      .then((response) => {
        console.log("inside success");
        console.log("response data in get owed list", response.data);
        let owedlistlist = response.data.getowedlist;
        let totalowed = 0;
        owedlistlist.map((listing) => {
          totalowed += parseFloat(listing.balance);
        });
        this.setState({
          owedlist: owedlistlist,
          totalowed: totalowed,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  //settle up button
  handleClickOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.setState({ open: false });
  };
  emailChangeHandler = (e) => {
    this.setState({
      email: e.target.value,
    });
  };
  validateInput = () => {
    const input = this.state.email;
    const error = document.getElementById("errorMsg");
    let isValid = true;
    if (!input) {
      error.textContent = "Email can not be empty";
      isValid = false;
    }
    return isValid;
  };
  handleSettleUp = (event) => {
    event.preventDefault(); //stop refresh
    if (this.validateInput()) {
      axios.defaults.withCredentials = true;
      this.props.client
        .mutate({
          mutation: SETTLE_UP_QUERY,
          variables: {
            useremail: this.state.useremail,
            email: this.state.email,
          },
        })
        .then((response) => {
          console.log("inside success", response.data);
          if (response.data.settleup.success === true) {
            alert("Successfully settle up");
            window.location.href = "/dashboard";
            console.log(response);
          } else if (response.data.settleup.success === false) {
            alert("Fail to settle up! The user does not exists");
            console.log(response);
          }
        })
        .catch((error) => {
          console.log("In error");
          alert("Fail to settle up! The user does not exists");
          console.log(error);
        });
    }
  };

  render() {
    const { classes } = this.props;
    console.log(this.state);
    let redirectVar = null;
    if (!localStorage.getItem("email")) {
      redirectVar = <Redirect to="/" />;
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
                </Grid>
                <Grid item xs={8}>
                  <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                      Dashboard
                    </Typography>
                    <Button
                      variant="contained"
                      size="large"
                      color="primary"
                      className={classes.button}
                      onClick={this.handleClickOpen}
                    >
                      Settle up
                    </Button>
                    <Dialog
                      fullWidth
                      maxWidth="xs"
                      open={this.state.open}
                      onClose={this.handleClose}
                      aria-labelledby="form-dialog-title"
                    >
                      <DialogTitle>Settle Up</DialogTitle>
                      <DialogContent>
                        <DialogContentText className={classes.dialogtext}>
                          To whom you want to settle up with? Please enter the
                          email
                        </DialogContentText>
                        <Form>
                          <Form.Group controlId="formDescription">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                              type="text"
                              name="email"
                              value={this.state.email}
                              onChange={this.emailChangeHandler}
                              placeholder="Enter the email"
                            />
                          </Form.Group>
                        </Form>
                        <div className="error" id="errorMsg" />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                          Cancel
                        </Button>
                        <Button onClick={this.handleSettleUp} color="primary">
                          Submit
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </Toolbar>
                  <Typography className={classes.table}>
                    <Grid container spacing={3}>
                      <Grid item xs={4}>
                        Total Balance
                      </Grid>
                      <Grid item xs={4}>
                        You Owe
                      </Grid>
                      <Grid item xs={4}>
                        You Are Owed
                      </Grid>
                    </Grid>
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={4}>
                      <NumberFormat
                        value={(
                          this.state.totalowed - this.state.totalowe
                        ).toFixed(2)}
                        displayType={"text"}
                        thousandSeparator={true}
                        prefix={this.state.currencysymbol}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <NumberFormat
                        value={(this.state.totalowe - 0).toFixed(2)}
                        displayType={"text"}
                        thousandSeparator={true}
                        prefix={this.state.currencysymbol}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <NumberFormat
                        value={(this.state.totalowed - 0).toFixed(2)}
                        displayType={"text"}
                        thousandSeparator={true}
                        prefix={this.state.currencysymbol}
                      />
                    </Grid>
                  </Grid>
                  <br />
                  <br />
                  <Divider />
                  <br />
                  <Grid container spacing={3}>
                    <Grid item xs={5}>
                      <List>
                        {!this.state.owelist.length && (
                          <Typography className={classes.message}>
                            You do not owe anything...
                          </Typography>
                        )}
                        {this.state.owelist.map((listing, index) => {
                          return (
                            <Accordion>
                              <AccordionDetails>
                                <Typography className={classes.text}>
                                  You owe:{" "}
                                  <NumberFormat
                                    value={listing.balance}
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    prefix={this.state.currencysymbol}
                                  />{" "}
                                  To {listing.userowedemail}
                                </Typography>
                              </AccordionDetails>
                            </Accordion>
                          );
                        })}
                      </List>
                    </Grid>
                    <Divider orientation="vertical" flexItem />
                    <Grid item xs={5}>
                      <List>
                        {!this.state.owedlist.length && (
                          <Typography className={classes.message}>
                            You are not owed anything...
                          </Typography>
                        )}
                        {this.state.owedlist.map((listing, index) => {
                          return (
                            <Accordion>
                              <AccordionDetails>
                                <Typography className={classes.text}>
                                  {listing.useroweemail} Owes you:{" "}
                                  <NumberFormat
                                    value={listing.balance}
                                    displayType={"text"}
                                    thousandSeparator={true}
                                    prefix={this.state.currencysymbol}
                                  />
                                </Typography>
                              </AccordionDetails>
                            </Accordion>
                          );
                        })}
                      </List>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default withApollo(withStyles(useStyles)(Dashboard));
