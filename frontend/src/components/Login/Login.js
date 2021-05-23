import React, { Component } from "react";
import "../../App.css";
import { Redirect } from "react-router";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import icon from "../../image/icon.png";
import { Typography, Button } from "@material-ui/core";
import axios from "axios";
import gql from "graphql-tag";
import { Query, withApollo } from "react-apollo";

const LOGIN_QUERY = gql`
  query LoginQuery($email: String, $password: String) {
    login(email: $email, password: $password) {
      email
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
class Login extends Component {
  //call the constructor method
  constructor(props) {
    //Call the constrictor of Super class i.e The Component
    super(props);
    //maintain the state required for this component
    this.state = {
      email: "",
      password: "",
      authFlag: false,
      redirectVar: "",
    };
    //Bind the handlers to this class
    this.emailChangeHandler = this.emailChangeHandler.bind(this);
    this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
    this.submitLogin = this.submitLogin.bind(this);
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
  //validate input email and password not empty and email format
  validateLogin = () => {
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
    if (!inputs[0].value.match(emailFormat)) {
      error.textContent =
        "Your email format is invalid, please use user@google format";
      isValid = false;
    }
    return isValid;
  };
  submitLogin = (e) => {
    e.preventDefault();
    console.log(this.state);
    if (this.validateLogin() && this.validateEmail()) {
      axios.defaults.withCredentials = true;
      this.props.client
        .query({
          query: LOGIN_QUERY,
          variables: {
            email: this.state.email,
            password: this.state.password,
          },
        })
        .then((response) => {
          console.log("inside success");
          console.log("response", response.data);
          localStorage.setItem("email", response.data.login.email);
          this.setState({
            redirectVar: "/dashboard",
          });
          console.log(response);
        })
        .catch((error) => {
          console.log("In error");
          console.log(error);
          alert("Incorrect Credentials");
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
    console.log(this.state);
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
                <h2>Welcome to Splitwise</h2>
                <p>Please enter your email and password</p>
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
              <button onClick={this.submitLogin} class="btn btn-primary">
                Log in
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

//export Login Component
export default withApollo(withStyles(useStyles)(Login));
