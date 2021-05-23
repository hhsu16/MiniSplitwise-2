import React, { Component } from "react";
import "../../App.css";
import axios from "axios";
import { Redirect } from "react-router";
import Grid from "@material-ui/core/Grid";
import {
  Container,
  Col,
  Row,
  Form,
  Button,
  ButtonGroup,
  Card,
} from "react-bootstrap";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  List,
  Typography,
} from "@material-ui/core";
import Toolbar from "@material-ui/core/Toolbar";
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

const MYINVITATIONS_QUERY = gql`
  query ($useremail: String) {
    myinvitations(useremail: $useremail) {
      _id
      useremail
      inviteduseremail
      groupname
      isaccepted
    }
  }
`;

const ACCEPT_INVITATION_QUERY = gql`
  mutation (
    $_id: String
    $groupname: String
    $inviteduseremail: String
    $isaccepted: Boolean
  ) {
    acceptInvitation(
      _id: $_id
      groupname: $groupname
      inviteduseremail: $inviteduseremail
      isaccepted: $isaccepted
    ) {
      success
    }
  }
`;

const DECLINE_INVITATION_QUERY = gql`
  mutation ($_id: String) {
    declineInvitation(_id: $_id) {
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
  root1: {
    marginLeft: theme.spacing(20),
  },
  item: {
    margin: theme.spacing(1),
  },
  btn: {
    width: "100%",
    flexGrow: 1,
    backgroundColor: "#7e9683",
  },
  paper: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(2),
    textAlign: "center",
  },
  title: {
    flexGrow: 1,
    fontSize: 30,
    fontWeight: "bold",
  },
  detail: {
    flexGrow: 1,
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
  },
  list: {
    marginTop: theme.spacing(1),
    width: "100%",
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  column: {
    flexBasis: "50%",
  },
  column1: {
    flexBasis: "100%",
  },
  message: {
    marginLeft: 25,
    flexGrow: 1,
    fontSize: 20,
  },
});

class MyGroups extends Component {
  constructor(props) {
    super(props);
    this.state = {
      grouplist: [],
      invitationlist: [],
      redirectVar: "",
    };
    this.handleCreate = this.handleCreate.bind(this);
    this.handleAccept = this.handleAccept.bind(this);
    this.handleDecline = this.handleDecline.bind(this);
  }
  componentDidMount() {
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
    //get my invitation list
    this.props.client
      .query({
        query: MYINVITATIONS_QUERY,
        variables: {
          useremail: localStorage.getItem("email"),
        },
      })
      .then((response) => {
        console.log("inside success");
        console.log("response data in get my invitations", response.data);
        let invitelist = response.data.myinvitations;
        let invitearray = [];
        //show the invitation that isaccepted=false
        invitelist.map((listing) => {
          if (!listing.isaccepted) {
            invitearray.push(listing);
          }
          this.setState({ invitationlist: invitearray });
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  //handler
  handleCreate = (event) => {
    event.preventDefault(); //stop refresh
    this.setState({
      redirectVar: "/create",
    });
  };
  handleAccept = (event) => {
    let groupInvite = JSON.parse(localStorage.getItem("groupInvite"));
    axios.defaults.withCredentials = true;
    this.props.client
      .mutate({
        mutation: ACCEPT_INVITATION_QUERY,
        variables: {
          _id: groupInvite._id,
          groupname: groupInvite.groupname,
          inviteduseremail: groupInvite.inviteduseremail,
          isaccepted: groupInvite.isaccepted,
        },
      })
      .then((response) => {
        console.log("inside success", response.data);
        if (response.data.acceptInvitation.success === true) {
          alert("Successfully join the group");
          window.location.href = "/mygroups";
          console.log(response);
        } else if (response.data.acceptInvitation.success === false) {
          alert("Fail to join the group");
          console.log(response);
        }
      })
      .catch((error) => {
        console.log("In error");
        alert("Fail to join the group");
        console.log(error);
      });
  };
  handleDecline = (event) => {
    let groupInvite = JSON.parse(localStorage.getItem("groupInvite"));
    axios.defaults.withCredentials = true;
    this.props.client
      .mutate({
        mutation: DECLINE_INVITATION_QUERY,
        variables: {
          _id: groupInvite._id,
        },
      })
      .then((response) => {
        console.log("inside success", response.data);
        if (response.data.declineInvitation.success === true) {
          alert("Successfully decline the group");
          window.location.href = "/mygroups";
          console.log(response);
        } else if (response.data.declineInvitation.success === false) {
          alert("Fail to decline the group");
          console.log(response);
        }
      })
      .catch((error) => {
        console.log("In error");
        alert("Fail to decline the group");
        console.log(error);
      });
  };

  render() {
    const { classes } = this.props;
    //if not logged in go to login page
    console.log(this.state);
    let redirectVar = null;
    if (!localStorage.getItem("email")) {
      redirectVar = <Redirect to="/" />;
    }
    if (this.state.redirectVar === "/create") {
      redirectVar = <Redirect to="/create" />;
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
                      My Groups
                    </Typography>
                    <Button
                      variant="contained"
                      size="large"
                      color="primary"
                      onClick={this.handleCreate}
                    >
                      Create a group
                    </Button>
                    <div className="error" id="errorMsg" />
                  </Toolbar>
                  <List className={classes.list}>
                    {!this.state.grouplist.length && (
                      <Typography className={classes.message}>
                        You have not joined any group...Start creating one!
                      </Typography>
                    )}
                    {console.log(this.state.grouplist)}
                    {this.state.grouplist.map((listing, index) => {
                      return (
                        <Accordion>
                          <AccordionDetails>
                            <div className={classes.column}>
                              <Typography
                                variant="h6"
                                className={classes.detail}
                              >
                                Group Name: {listing.groupname}
                              </Typography>
                            </div>
                            <div className={classes.column} />
                            <div className={classes.column} />
                            <div className={classes.column} />
                            <div className={classes.column} />
                            <div className={classes.column}>
                              <Button
                                variant="contained"
                                size="large"
                                color="primary"
                                onClick={() => {
                                  localStorage.setItem(
                                    "groupDetail",
                                    JSON.stringify(listing)
                                  );
                                  this.setState({
                                    redirectVar: "/grouppage",
                                  });
                                }}
                              >
                                Details
                              </Button>
                            </div>
                          </AccordionDetails>
                          <br />
                        </Accordion>
                      );
                    })}
                  </List>
                  <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                      My Group Invitations
                    </Typography>
                  </Toolbar>
                  <List className={classes.list}>
                    {!this.state.invitationlist.length && (
                      <Typography className={classes.message}>
                        No invitation yet...
                      </Typography>
                    )}
                    {console.log(this.state.invitationlist)}
                    {this.state.invitationlist.map((listing, index) => {
                      return (
                        <Accordion>
                          <AccordionDetails>
                            <div className={classes.column1}>
                              <Typography
                                variant="h6"
                                className={classes.detail}
                              >
                                Group Name: {listing.groupname}
                              </Typography>
                            </div>
                            <div className={classes.column1} />
                            <div className={classes.column1}>
                              <Typography
                                variant="h6"
                                className={classes.detail}
                              >
                                Invite From: {listing.useremail}
                              </Typography>
                            </div>
                            <div className={classes.column1} />
                            <div className={classes.column1} />
                            <div className={classes.column1}>
                              <Button
                                variant="contained"
                                size="large"
                                color="primary"
                                onClick={() => {
                                  localStorage.setItem(
                                    "groupInvite",
                                    JSON.stringify(listing)
                                  );
                                  this.handleAccept();
                                }}
                              >
                                Accept
                              </Button>
                            </div>
                            <div className={classes.column1}>
                              <Button
                                variant="contained"
                                size="large"
                                color="primary"
                                onClick={() => {
                                  localStorage.setItem(
                                    "groupInvite",
                                    JSON.stringify(listing)
                                  );
                                  this.handleDecline();
                                }}
                              >
                                Decline
                              </Button>
                            </div>
                          </AccordionDetails>
                          <br />
                        </Accordion>
                      );
                    })}
                  </List>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default withApollo(withStyles(useStyles)(MyGroups));
