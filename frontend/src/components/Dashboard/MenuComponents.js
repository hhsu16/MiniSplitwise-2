import React, { Component } from "react";
import "../../App.css";
import { Redirect } from "react-router";
import { withStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import { Button, Paper } from "@material-ui/core";

const useStyles = (theme) => ({
  root: {
    marginLeft: theme.spacing(20),
  },
  paper: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(2),
    textAlign: "center",
    backgroundColor: "#e6f5e9",
  },
  item: {
    margin: theme.spacing(1),
  },
  btn: {
    width: "100%",
    flexGrow: 1,
    backgroundColor: "#7e9683",
  },
});

class MenuComponents extends Component {
  constructor() {
    super();
    this.state = {
      redirectVar: "",
    };
  }
  //onclick buttons
  clickDashboard = (e) => {
    e.preventDefault();
    this.setState({
      redirectVar: "/dashboard",
    });
  };
  clickActivity = (e) => {
    e.preventDefault();
    this.setState({
      redirectVar: "/activities",
    });
  };
  clickGroups = (e) => {
    e.preventDefault();
    this.setState({
      redirectVar: "/mygroups",
    });
  };

  render() {
    const { classes } = this.props;
    let redirectVar = null;
    if (this.state.redirectVar === "/dashboard") {
      redirectVar = <Redirect to="/dashboard" />;
    }
    if (this.state.redirectVar === "/activities") {
      redirectVar = <Redirect to="/activities" />;
    }
    if (this.state.redirectVar === "/mygroups") {
      redirectVar = <Redirect to="/mygroups" />;
    }
    return (
      <div>
        {redirectVar}
        <div className={classes.root}>
          <Paper className={classes.paper}>
            <ListItem className={classes.item}>
              <Button
                variant="contained"
                color="primary"
                className={classes.btn}
                onClick={this.clickDashboard}
              >
                Dashboard
              </Button>
            </ListItem>
            <ListItem className={classes.item}>
              <Button
                variant="contained"
                color="primary"
                className={classes.btn}
                onClick={this.clickActivity}
              >
                Recent Activity
              </Button>
            </ListItem>
            <ListItem className={classes.item}>
              <Button
                variant="contained"
                color="primary"
                className={classes.btn}
                onClick={this.clickGroups}
              >
                Groups
              </Button>
            </ListItem>
          </Paper>
        </div>
      </div>
    );
  }
}

export default withStyles(useStyles)(MenuComponents);
