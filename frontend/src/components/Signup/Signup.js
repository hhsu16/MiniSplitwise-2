import React, { Component } from "react";
import "../../App.css";
import axios from "axios";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import icon from "../../image/icon.png";
import { Typography, Button } from "@material-ui/core";
import gql from "graphql-tag";
import { Query, withApollo } from "react-apollo";

const SIGNUP_QUERY = gql`
  mutation (
    $username: String
    $email: String
    $password: String
    $phone: String
    $currency: String
    $timezone: String
    $language: String
    $image: String
  ) {
    signup(
      username: $username
      email: $email
      password: $password
      phone: $phone
      currency: $currency
      timezone: $timezone
      language: $language
      image: $image
    ) {
      success
    }
  }
`;

const useStyles = (theme) => ({
  root: {
    flexGrow: 1,
    marginRight: theme.spacing(20),
    marginTop: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(1),
  },
  menuButton: {
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(20),
  },
  title: {
    flexGrow: 1,
    fontSize: 25,
  },
});

//Define a Login Component
class Signup extends Component {
  //call the constructor method
  constructor(props) {
    //Call the constrictor of Super class i.e The Component
    super(props);
    //maintain the state required for this component
    this.state = {
      username: "",
      email: "",
      password: "",
      authFlag: false,
      redirectVar: "",
    };
    //Bind the handlers to this class
    this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
    this.emailChangeHandler = this.emailChangeHandler.bind(this);
    this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
    this.submitRegister = this.submitRegister.bind(this);
    this.handleHomeButtonEvent = this.handleHomeButtonEvent.bind(this);
    this.handleLogIn = this.handleLogIn.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
  }
  //Call the Will Mount to set the auth Flag to false
  componentWillMount() {
    this.setState({
      authFlag: false,
    });
  }
  //username change handler to update state variable with the text entered by the user
  usernameChangeHandler = (e) => {
    this.setState({
      username: e.target.value,
    });
  };
  //email change handler to update state variable with the text entered by the user
  emailChangeHandler = (e) => {
    this.setState({
      email: e.target.value,
    });
  };
  //password change handler to update state variable with the text entered by the user
  passwordChangeHandler = (e) => {
    this.setState({
      password: e.target.value,
    });
  };
  //validate input not empty and email format
  validateRegister = () => {
    const inputs = document.querySelectorAll("input");
    const error = document.getElementById("errorMsg");
    let isValid = true;
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].value == "") {
        error.textContent = "Please enter your " + inputs[i].name;
        isValid = false;
        break;
      }
    }
    return isValid;
  };
  validateEmail = () => {
    const inputs = document.querySelectorAll("input");
    const error = document.getElementById("errorMsg");
    var emailFormat =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    let isValid = true;
    if (!inputs[1].value.match(emailFormat)) {
      error.textContent =
        "Your email format is invalid, please use user@google format";
      isValid = false;
    }
    return isValid;
  };
  //submit Register handler to send a request to the node backend
  submitRegister = (e) => {
    //prevent page from refresh
    e.preventDefault();
    console.log(this.state);
    if (this.validateRegister() && this.validateEmail()) {
      axios.defaults.withCredentials = true;
      //make a post request with the user data
      this.props.client
        .mutate({
          mutation: SIGNUP_QUERY,
          variables: {
            username: this.state.username,
            email: this.state.email,
            password: this.state.password,
            phone: "",
            currency: "USD($)",
            timezone: "(GMT-08:00)Pacific Time",
            language: "English",
            image: "",
          },
        })
        .then((response) => {
          console.log("inside success", response.data);
          if (response.data.signup.success === true) {
            localStorage.setItem("email", this.state.email);
            this.setState({
              redirectVar: "/dashboard",
            });
            alert("Successfully sign up!");
            console.log(response);
          } else if (response.data.signup.success === false) {
            alert("Fail to sign up. The email is already exist!");
            console.log(response);
          }
        })
        .catch((error) => {
          console.log("In error");
          alert("Fail to sign up. The email is already exist!");
          console.log(error);
        });
    }
  };
  handleHomeButtonEvent = (event) => {
    this.setState({
      redirectVar: "/",
    });
  };
  handleLogIn = (event) => {
    this.setState({
      redirectVar: "/login",
    });
  };
  handleSignUp = (event) => {
    this.setState({
      redirectVar: "/signup",
    });
  };

  render() {
    //redirect based on successful login
    let redirectVar = null;
    const { classes } = this.props;
    const error = document.getElementById("errorMsg");
    //successfully signup then goto dashboard
    if (this.state.redirectVar === "/dashboard") {
      redirectVar = <Redirect to="/dashboard" />;
    }
    if (this.state.redirectVar === "/") {
      redirectVar = <Redirect to="/" />;
    }
    if (this.state.redirectVar === "/login") {
      redirectVar = <Redirect to="/login" />;
    }
    if (this.state.redirectVar === "/signup") {
      redirectVar = <Redirect to="/signup" />;
    }
    return (
      <div>
        {redirectVar}
        <div className={classes.root}>
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              onClick={this.handleHomeButtonEvent}
            >
              <Avatar alt="Splitwise" src={icon} />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Splitwise
            </Typography>
            <Button
              variant="outlined"
              size="large"
              color="primary"
              className={classes.button}
              onClick={this.handleLogIn}
            >
              {" "}
              Log in
            </Button>
            <Button
              variant="contained"
              size="large"
              color="primary"
              className={classes.button}
              onClick={this.handleSignUp}
            >
              Sign up
            </Button>
          </Toolbar>
        </div>
        <div class="container">
          <div class="login-form">
            <div class="main-div">
              <div class="panel">
                <h2>Sign Up</h2>
                <p>Welcome to Splitwise</p>
              </div>
              <div class="form-group">
                <input
                  onChange={this.usernameChangeHandler}
                  type="text"
                  class="form-control"
                  name="username"
                  placeholder="Username"
                  required={true}
                />
              </div>
              <div class="form-group">
                <input
                  onChange={this.emailChangeHandler}
                  type="email"
                  class="form-control"
                  name="email"
                  placeholder="Email Address"
                  required={true}
                />
              </div>
              <div class="form-group">
                <input
                  onChange={this.passwordChangeHandler}
                  type="password"
                  class="form-control"
                  name="password"
                  placeholder="Password"
                  required={true}
                />
              </div>
              <button onClick={this.submitRegister} class="btn btn-primary">
                Sign Up
              </button>
              <br />
              <br />
              <div className="error" id="errorMsg" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withApollo(withStyles(useStyles)(Signup));
