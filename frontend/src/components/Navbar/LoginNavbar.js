import React, { Component } from "react";
import { Redirect } from "react-router";
import { Container, Typography, Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import icon from "../../image/icon.png";

const useStyles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  button: {
    margin: theme.spacing(1),
  },
  button1: {
    margin: theme.spacing(1),
    marginRight: theme.spacing(20),
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
class LandingNavbar extends Component {
  constructor() {
    super();
    this.state = {
      redirectVar: "",
    };
    this.handleHomeButtonEvent = this.handleHomeButtonEvent.bind(this);
    this.handleProfile = this.handleProfile.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
  }
  handleHomeButtonEvent = (event) => {
    event.preventDefault(); //stop refresh
    this.setState({
      redirectVar: "/dashboard",
    });
  };
  handleProfile = (event) => {
    event.preventDefault(); //stop refresh
    this.setState({
      redirectVar: "/profile",
    });
  };
  //handle logout to destroy the cookie
  handleLogOut = (event) => {
    event.preventDefault(); //stop refresh
    window.localStorage.clear();
    this.setState({
      redirectVar: "/",
    });
  };

  render() {
    const { classes } = this.props;
    let redirectVar = null;
    if (this.state.redirectVar === "/") {
      redirectVar = <Redirect to="/" />;
    }
    if (this.state.redirectVar === "/profile") {
      redirectVar = <Redirect to="/profile" />;
    }
    if (this.state.redirectVar === "/dashboard") {
      redirectVar = <Redirect to="/dashboard" />;
    }
    return (
      <div>
        {redirectVar}
        <div className={classes.root}>
          <AppBar position="static" style={{ background: "#56ccb2" }}>
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
                variant="contained"
                size="large"
                color="primary"
                className={classes.button}
                onClick={this.handleProfile}
              >
                Profile
              </Button>
              <Button
                variant="contained"
                size="large"
                color="primary"
                className={classes.button1}
                onClick={this.handleLogOut}
              >
                Log out
              </Button>
            </Toolbar>
          </AppBar>
        </div>
      </div>
    );
  }
}

export default withStyles(useStyles)(LandingNavbar);
