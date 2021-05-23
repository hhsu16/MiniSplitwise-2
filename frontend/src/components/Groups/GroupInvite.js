import React, { Component } from "react";
import "../../App.css";
import axios from "axios";
import { withStyles } from "@material-ui/core/styles";
import {
  Container,
  Col,
  Row,
  Form,
  Button,
  ButtonGroup,
  Card,
} from "react-bootstrap";
import { Grid, Toolbar, Typography } from "@material-ui/core";
import { Redirect } from "react-router";
import MenuComponents from "../Dashboard/MenuComponents";
import LoginNavbar from "../Navbar/LoginNavbar";
import gql from "graphql-tag";
import { Query, withApollo } from "react-apollo";

const SEND_INVITE_QUERY = gql`
  mutation (
    $groupname: String
    $useremail: String
    $inviteduseremail: String
    $invitedusername: String
    $isaccepted: Boolean
  ) {
    sendInvitation(
      groupname: $groupname
      useremail: $useremail
      inviteduseremail: $inviteduseremail
      invitedusername: $invitedusername
      isaccepted: $isaccepted
    ) {
      success
    }
  }
`;

const useStyles = (theme) => ({
  root: {
    flexGrow: 1,
    margin: theme.spacing(1),
  },
  title: {
    flexGrow: 1,
    fontSize: 30,
    fontWeight: "bold",
  },
  button: {
    marginRight: theme.spacing(1),
  },
});

class GroupInvite extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupname: JSON.parse(localStorage.getItem("groupDetail")).groupname,
      useremail: localStorage.getItem("email"),
      inviteduseremail: "",
      invitedusername: "",
      isaccepted: false,
      redirectVar: "",
    };
    //Bind the handlers to this class
    this.handleBack = this.handleBack.bind(this);
    this.submitInvitation = this.submitInvitation.bind(this);
  }
  //handlers
  handleBack = (e) => {
    e.preventDefault();
    this.setState({
      redirectVar: "/grouppage",
    });
  };
  usernameChangeHandler = (e) => {
    this.setState({
      invitedusername: e.target.value,
    });
  };
  emailChangeHandler = (e) => {
    this.setState({
      inviteduseremail: e.target.value,
    });
  };
  //validate user input
  validateInput = () => {
    const inputs = document.querySelectorAll("input");
    const useremail = this.state.useremail;
    const inviteduseremail = this.state.inviteduseremail;
    const error = document.getElementById("errorMsg");
    let isValid = true;
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].value == "") {
        error.textContent = "Please enter the " + inputs[i].name;
        isValid = false;
        break;
      }
    }
    if (inviteduseremail === useremail) {
      error.textContent = "You cannot invite yourself";
      isValid = false;
    }
    return isValid;
  };
  //submit button
  submitInvitation = (e) => {
    e.preventDefault();
    if (this.validateInput()) {
      axios.defaults.withCredentials = true;
      this.props.client
        .mutate({
          mutation: SEND_INVITE_QUERY,
          variables: {
            groupname: this.state.groupname,
            useremail: this.state.useremail,
            inviteduseremail: this.state.inviteduseremail,
            invitedusername: this.state.invitedusername,
            isaccepted: this.state.isaccepted,
          },
        })
        .then((response) => {
          console.log("inside success", response.data);
          if (response.data.sendInvitation.success === true) {
            alert("Successfully sent invitation");
            console.log(response);
          } else if (response.data.sendInvitation.success === false) {
            alert("Fail to invite. The user does not already exist!");
            console.log(response);
          }
        })
        .catch((error) => {
          console.log("In error");
          alert("Fail to invite. The user does not already exist!");
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
    if (this.state.redirectVar === "/grouppage") {
      redirectVar = <Redirect to="/grouppage" />;
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
                <Grid item xs={7}>
                  <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                      Invite a User to Group
                    </Typography>
                    <Button
                      variant="contained"
                      size="large"
                      color="primary"
                      className={classes.button}
                      onClick={this.handleBack}
                    >
                      Back
                    </Button>
                  </Toolbar>
                  <br />
                  <br />
                  <Form>
                    <Grid container spacing={3}>
                      <Grid item xs={6}>
                        <Form.Group controlId="formUsername">
                          <Form.Label>Please enter the username</Form.Label>
                          <Form.Control
                            type="text"
                            name="username"
                            value={this.state.invitedusername}
                            onChange={this.usernameChangeHandler}
                            placeholder="user name (required)"
                          />
                        </Form.Group>
                      </Grid>
                      <Grid item xs={6}>
                        <Form.Group controlId="formUseremail">
                          <Form.Label>Please enter the Email</Form.Label>
                          <Form.Control
                            type="text"
                            name="useremail"
                            value={this.state.inviteduseremail}
                            onChange={this.emailChangeHandler}
                            placeholder="user email (required)"
                          />
                        </Form.Group>
                      </Grid>
                    </Grid>
                    <Button
                      variant="primary"
                      type="submit"
                      onClick={this.submitInvitation}
                    >
                      Invite
                    </Button>
                  </Form>
                  <div className="error" id="errorMsg" />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default withApollo(withStyles(useStyles)(GroupInvite));
