import React, { Component } from "react";
import "../../App.css";
import axios from "axios";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  List,
} from "@material-ui/core";
import { Button, Paper } from "@material-ui/core";
import NumberFormat from "react-number-format";
import gql from "graphql-tag";
import { Query, withApollo } from "react-apollo";

const GROUP_MEMBER_QUERY = gql`
  query ($groupname: String) {
    groupmember(groupname: $groupname) {
      useremail
    }
  }
`;

const GROUP_BALANCE_QUERY = gql`
  query ($groupname: String) {
    groupbalance(groupname: $groupname) {
      useroweemail
      userowedemail
      balance
    }
  }
`;

const useStyles = (theme) => ({
  root: {
    marginLeft: theme.spacing(20),
  },
  paper: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(2),
    textAlign: "center",
    backgroundColor: "#f7fabe",
  },
  item: {
    margin: theme.spacing(1),
  },
  title: {
    flexGrow: 1,
    fontSize: 13,
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
});

class GroupBalanceComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupname: JSON.parse(localStorage.getItem("groupDetail")).groupname,
      useremail: localStorage.getItem("email"),
      currencysymbol: "",
      groupmemberlist: [],
      owelist: [],
    };
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
        this.setState({
          groupmemberlist: response.data.groupmember,
        });
      })
      .catch((error) => {
        console.log(error);
      });
    //get group balance
    this.props.client
      .query({
        query: GROUP_BALANCE_QUERY,
        variables: {
          groupname: this.state.groupname,
        },
      })
      .then((response) => {
        console.log("inside success");
        console.log("response data in get group balance", response.data);
        this.setState({
          owelist: response.data.groupbalance,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const { classes } = this.props;
    console.log(this.state);
    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Typography variant="h6" className={classes.title}>
            Group Members
          </Typography>
          <Grid item xs={12}>
            {this.state.groupmemberlist.length == 1 && (
              <Typography className={classes.message}>
                No Other group members...
              </Typography>
            )}
            {this.state.groupmemberlist.map((listing, index) => {
              return <p className={classes.text}>{listing.useremail}</p>;
            })}
          </Grid>
          <Divider />
          <Typography variant="h6" className={classes.title}>
            Group Balances
          </Typography>
          <Typography variant="h6" className={classes.text}>
            (Summary of User Owes to each other)
          </Typography>
          {this.state.owelist.map((items, index) => {
            return (
              <div>
                <li>
                  {items.useroweemail} Owes{" "}
                  <NumberFormat
                    value={items.balance}
                    displayType={"text"}
                    thousandSeparator={true}
                    prefix={this.state.currencysymbol}
                  />{" "}
                  to {items.userowedemail}
                </li>
              </div>
            );
          })}
        </Paper>
      </div>
    );
  }
}

export default withApollo(withStyles(useStyles)(GroupBalanceComponent));
