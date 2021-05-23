import React, { Component } from "react";
import "../../App.css";
import axios from "axios";
import { Redirect } from "react-router";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import ListItem from "@material-ui/core/ListItem";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import NumberFormat from "react-number-format";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  List,
} from "@material-ui/core";
import {
  Container,
  Col,
  Row,
  Form,
  Button,
  ButtonGroup,
  Card,
} from "react-bootstrap";
import { withStyles } from "@material-ui/core/styles";
import LoginNavbar from "../Navbar/LoginNavbar";
import MenuComponents from "../Dashboard/MenuComponents";
import gql from "graphql-tag";
import { Query, withApollo } from "react-apollo";

const MYGROUPS_QUERY = gql`
  query ($useremail: String) {
    mygroups(useremail: $useremail) {
      groupname
      useremail
      groupimage
    }
  }
`;

const ALL_GROUP_ACTIVITY_QUERY = gql`
  query ($useremail: String) {
    allgroupactivity(useremail: $useremail) {
      groupname
      expense
      description
      useremail
      date
      datestring
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
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
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
  pagination: {
    margin: theme.spacing(1),
    marginLeft: theme.spacing(20),
    minWidth: 150,
  },
});

class Activities extends Component {
  constructor() {
    super();
    this.state = {
      activitylist: [],
      grouplist: [],
      currencysymbol: "",
      recent: "",
      groupname: "",
      selectedgrouplist: [],
      //pagination default size is 2
      currentPage: 1,
      itemsPerPage: 2,
    };
    this.groupnameChangeHandler = this.groupnameChangeHandler.bind(this);
    this.recentChangeHandler = this.recentChangeHandler.bind(this);
    this.handleSelectRecent = this.handleSelectRecent.bind(this);
    this.handleSelectGroup = this.handleSelectGroup.bind(this);
    this.handleClick = this.handleClick.bind(this); //pagination
    this.handleChoosePage = this.handleChoosePage.bind(this);
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
    //get all activities
    this.props.client
      .query({
        query: ALL_GROUP_ACTIVITY_QUERY,
        variables: {
          useremail: localStorage.getItem("email"),
        },
      })
      .then((response) => {
        console.log("inside success");
        console.log("response data in get all group activity", response.data);
        let activitylist = response.data.allgroupactivity;
        console.log(response.data.allgroupactivity);
        //most recent expense on top
        activitylist.sort(function (a, b) {
          return b.date - a.date;
        });
        this.setState({
          activitylist: activitylist,
          selectedgrouplist: activitylist,
        });
      })
      .catch((error) => {
        console.log(error);
      });
    //get mygroups list
    axios.defaults.withCredentials = true;
    this.props.client
      .query({
        query: MYGROUPS_QUERY,
        variables: {
          useremail: localStorage.getItem("email"),
        },
      })
      .then((response) => {
        console.log("inside success");
        console.log("response data in get mygroups", response.data);
        this.setState({
          grouplist: response.data.mygroups,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  //handlers
  recentChangeHandler = (e) => {
    this.setState({
      recent: e.target.value,
    });
  };
  handleSelectRecent = () => {
    if (this.state.recent === "RecentFirst") {
      let list = this.state.selectedgrouplist;
      list.sort(function (a, b) {
        return b.date - a.date;
      });
      this.setState({
        selectedgrouplist: list,
      });
    } else if (this.state.recent === "RecentLast") {
      let list = this.state.selectedgrouplist;
      list.sort(function (a, b) {
        return a.date - b.date;
      });
      this.setState({
        selectedgrouplist: list,
      });
    }
  };
  groupnameChangeHandler = (e) => {
    this.setState({
      groupname: e.target.value,
    });
  };
  handleSelectGroup = () => {
    let list = this.state.activitylist;
    let array = [];
    for (let i = 0; i < list.length; i++) {
      if (list[i].groupname === this.state.groupname) array.push(list[i]);
    }
    this.setState({ selectedgrouplist: array });
  };
  handleClick(event) {
    this.setState({
      currentPage: Number(event.target.value),
    });
  }
  handleChoosePage(e) {
    this.setState({
      itemsPerPage: e.target.value,
    });
  }

  render() {
    const { classes } = this.props;
    const { selectedgrouplist, currentPage, itemsPerPage } = this.state;
    console.log(this.state);
    // Logic for displaying activities
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItem = selectedgrouplist.slice(
      indexOfFirstItem,
      indexOfLastItem
    );
    // Logic for displaying page numbers
    const pageNumbers = [];
    for (
      let i = 1;
      i <= Math.ceil(selectedgrouplist.length / itemsPerPage);
      i++
    ) {
      pageNumbers.push(i);
    }
    //console.log(this.state);
    //if not logged in go to login page
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
                  <FormControl className={classes.pagination}>
                    <InputLabel id="demo-simple-select-label">
                      Page Size
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      onChange={this.handleChoosePage}
                    >
                      <MenuItem value={"2"}>2</MenuItem>
                      <MenuItem value={"5"}>5</MenuItem>
                      <MenuItem value={"10"}>10</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={7}>
                  <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                      Recent Activities
                    </Typography>
                  </Toolbar>
                  <ListItem>
                    <FormControl className={classes.formControl}>
                      <InputLabel id="demo-simple-select-label">
                        Filter by GroupName
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={this.state.groupname}
                        onChange={this.groupnameChangeHandler}
                      >
                        {this.state.grouplist.map((group) => (
                          <MenuItem value={group.groupname}>
                            {group.groupname}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Button
                      variant="contained"
                      size="large"
                      color="primary"
                      onClick={this.handleSelectGroup}
                    >
                      Apply Filter
                    </Button>
                    <FormControl className={classes.formControl}>
                      <InputLabel id="demo-simple-select-label">
                        Filter by MostRecentFirst/Last
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        onChange={this.recentChangeHandler}
                      >
                        <MenuItem value={"RecentFirst"}>RecentFirst</MenuItem>
                        <MenuItem value={"RecentLast"}>RecentLast</MenuItem>
                      </Select>
                    </FormControl>
                    <Button
                      variant="contained"
                      size="large"
                      color="primary"
                      onClick={this.handleSelectRecent}
                    >
                      Apply Filter
                    </Button>
                  </ListItem>
                  <List>
                    {console.log(this.state.selectedgrouplist)}
                    {!this.state.selectedgrouplist.length && (
                      <Typography className={classes.message}>
                        No Recent Activity to Show...
                      </Typography>
                    )}
                    {currentItem.map((listing) => {
                      return (
                        <div>
                          <Accordion>
                            <AccordionDetails>
                              <Grid container spacing={3}>
                                <Grid item xs={4}>
                                  <Typography className={classes.text}>
                                    User: {listing.useremail}
                                  </Typography>
                                </Grid>
                                <Grid item xs={2}>
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
                                <Grid item xs={3}>
                                  <Typography className={classes.text}>
                                    In Group: {listing.groupname}
                                  </Typography>
                                </Grid>
                                <Grid item xs={3}>
                                  <Typography className={classes.text}>
                                    Description: {listing.description}
                                  </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                  <Typography className={classes.text}>
                                    Date: {listing.datestring}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </AccordionDetails>
                          </Accordion>
                          <Divider />
                        </div>
                      );
                    })}
                  </List>
                  <div id="page-numbers">
                    <Typography className={classes.text}>Pages:</Typography>
                    <RadioGroup
                      name="spacing"
                      aria-label="spacing"
                      onChange={this.handleClick}
                      row
                    >
                      {pageNumbers.map((number) => (
                        <FormControlLabel
                          key={number}
                          value={number}
                          control={<Radio />}
                          label={number}
                        />
                      ))}
                    </RadioGroup>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default withApollo(withStyles(useStyles)(Activities));
