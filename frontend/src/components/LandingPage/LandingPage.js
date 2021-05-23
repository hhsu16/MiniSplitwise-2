import React, { Component } from "react";
import cookie from "react-cookies";
import { Redirect } from "react-router";
import { withStyles } from "@material-ui/core/styles";
import { Typography, Button } from "@material-ui/core";
import image from "../../image/image.jpg";
import foot from "../../image/foot.jpg";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import icon from "../../image/icon.png";

const useStyles = (theme) => ({
  image: {
    textAlign: "center",
  },
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

//create the Navbar Component
class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectVar: null,
    };
    this.handleHomeButtonEvent = this.handleHomeButtonEvent.bind(this);
    this.handleLogIn = this.handleLogIn.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
  }
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
    const { classes } = this.props;
    let redirectVar = null;
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
        <br />
        <div className={classes.image}>
          <img src={image} alt="image" />
          <br />
          <br />
        </div>
        <div>
          <img src={foot}></img>
        </div>
      </div>
    );
  }
}

export default withStyles(useStyles)(LandingPage);
