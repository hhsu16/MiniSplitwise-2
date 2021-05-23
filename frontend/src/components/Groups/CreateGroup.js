import React, { Component } from "react";
import "../../App.css";
import axios from "axios";
import { Redirect } from "react-router";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
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
import LoginNavbar from "../Navbar/LoginNavbar";
import MenuComponents from "../Dashboard/MenuComponents";
import backend from "../../backendConfig";
import { Toolbar } from "@material-ui/core";
import gql from "graphql-tag";
import { Query, withApollo } from "react-apollo";

const CREATE_GROUP_QUERY = gql`
  mutation ($groupname: String, $useremail: String, $groupimage: String) {
    createGroup(
      groupname: $groupname
      useremail: $useremail
      groupimage: $groupimage
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

class CreateGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupname: "",
      useremail: localStorage.getItem("email"),
      groupimage: "default",
      redirectVar: "",
    };
    this.handleBack = this.handleBack.bind(this);
    this.groupnameChangeHandler = this.groupnameChangeHandler.bind(this);
    this.createNewGroup = this.createNewGroup.bind(this);
  }
  //handlers
  handleBack = (e) => {
    e.preventDefault();
    this.setState({
      redirectVar: "/mygroups",
    });
  };
  groupnameChangeHandler = (e) => {
    this.setState({
      groupname: e.target.value,
    });
  };
  //validate input
  validateInput = () => {
    const input_name = this.state.groupname;
    const error = document.getElementById("errorMsg");
    let isValid = true;
    if (!input_name) {
      error.textContent = "Your group name can not be empty";
      isValid = false;
    }
    return isValid;
  };
  //create button
  createNewGroup = (e) => {
    e.preventDefault();
    if (this.validateInput()) {
      axios.defaults.withCredentials = true;
      //make a post request with the user data
      this.props.client
        .mutate({
          mutation: CREATE_GROUP_QUERY,
          variables: {
            groupname: this.state.groupname,
            useremail: this.state.useremail,
            groupimage: this.state.groupimage,
          },
        })
        .then((response) => {
          console.log("inside success", response.data);
          if (response.data.createGroup.success === true) {
            alert("Successfully created the new group!");
            window.location.href = "./mygroups";
            console.log(response);
          } else if (response.data.createGroup.success === false) {
            alert("Fail to create the group. The name is already exist!");
            console.log(response);
          }
        })
        .catch((error) => {
          console.log("In error");
          alert("Fail to create the group. The name is already exist!");
          console.log(error);
        });
    }
  };

  render() {
    const { classes } = this.props;
    //if not logged in go to login page
    let redirectVar = null;
    var imageSrc = `${backend}/images/group/${this.state.groupimage}`;
    if (!localStorage.getItem("email")) {
      redirectVar = <Redirect to="/" />;
    }
    if (this.state.redirectVar === "/mygroups") {
      redirectVar = <Redirect to="/mygroups" />;
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
                      Create a New Group
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
                  <Form>
                    <Form.Row>
                      <Card style={{ width: "20rem" }}>
                        <Card.Img variant="top" src={imageSrc} />
                      </Card>
                      <br />
                      <br />
                    </Form.Row>
                    <Grid container spacing={3}>
                      <Grid item xs={6}>
                        <Form.Group controlId="formGroupname">
                          <Form.Label>My group shall be called...</Form.Label>
                          <Form.Control
                            type="text"
                            name="groupname"
                            value={this.state.groupname}
                            onChange={this.groupnameChangeHandler}
                            placeholder="Enter the groupname"
                          />
                        </Form.Group>
                      </Grid>
                    </Grid>
                    <Button
                      variant="primary"
                      type="submit"
                      onClick={this.createNewGroup}
                    >
                      Create
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

export default withApollo(withStyles(useStyles)(CreateGroup));
