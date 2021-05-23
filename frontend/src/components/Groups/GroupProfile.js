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
import backend from "../../backendConfig";
import MenuComponents from "../Dashboard/MenuComponents";
import LoginNavbar from "../Navbar/LoginNavbar";
import gql from "graphql-tag";
import { Query, withApollo } from "react-apollo";

const UPDATE_GROUP_QUERY = gql`
  mutation ($origin_groupname: String, $groupname: String) {
    updateGroupProfile(
      origin_groupname: $origin_groupname
      groupname: $groupname
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

class GroupProfile extends Component {
  //call the constructor method
  constructor(props) {
    //Call the constrictor of Super class i.e The Component
    super(props);
    //maintain the state required for this component
    this.state = {
      groupname: JSON.parse(localStorage.getItem("groupDetail")).groupname,
      useremail: localStorage.getItem("email"),
      groupimage: JSON.parse(localStorage.getItem("groupDetail")).groupimage,
      file: "",
      redirectVar: "",
    };
    //Bind the handlers to this class
    this.handleBack = this.handleBack.bind(this);
    this.groupnameChangeHandler = this.groupnameChangeHandler.bind(this);
    this.imageChangeHandler = this.imageChangeHandler.bind(this);
    this.submitProfile = this.submitProfile.bind(this);
    this.submitImage = this.submitImage.bind(this);
  }

  //handlers
  handleBack = (e) => {
    e.preventDefault();
    this.setState({
      redirectVar: "/grouppage",
    });
  };
  groupnameChangeHandler = (e) => {
    this.setState({
      groupname: e.target.value,
    });
  };
  imageChangeHandler = (e) => {
    this.setState({
      file: e.target.files[0],
    });
  };
  //submit image
  submitImage = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", this.state.file);
    console.log(this.state.file);
    if (this.state.file) {
      const uploadConfig = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      axios
        .post(
          `${backend}/images/group/${this.state.groupname}`,
          formData,
          uploadConfig
        )
        .then((response) => {
          alert("Image uploaded successfully!");
          this.setState({
            groupimage: response.data,
          });
        })
        .catch((err) => {
          console.log(err);
          alert("Fail to upload image! Please choose a file");
        });
    } else {
      alert("Fail to upload image! Please choose a file");
    }
  };
  //validate user input
  validateInput = () => {
    const input_name = this.state.groupname;
    const error = document.getElementById("errorMsg");
    let isValid = true;
    if (!input_name) {
      error.textContent = "Group name can not be empty";
      isValid = false;
    }
    return isValid;
  };
  //submit button
  submitProfile = (e) => {
    e.preventDefault();
    if (this.validateInput()) {
      axios.defaults.withCredentials = true;
      this.props.client
        .mutate({
          mutation: UPDATE_GROUP_QUERY,
          variables: {
            origin_groupname: JSON.parse(localStorage.getItem("groupDetail"))
              .groupname,
            groupname: this.state.groupname,
          },
        })
        .then((response) => {
          console.log("inside success");
          console.log("response in update profile group ", response.data);
          if (response.data.updateGroupProfile.success === true) {
            console.log("success", response);
            alert("Successfully updated group name!");
          } else if (response.data.updateGroupProfile.success === false) {
            alert(
              "Fail to update! Group name exists, please use another name!"
            );
          }
        })
        .catch((error) => {
          alert("Fail to update! Group name exists, please use another name!");
          console.log(error);
        });
    }
  };

  render() {
    const { classes } = this.props;
    console.log(this.state);
    let redirectVar = null;
    var imageSrc = `${backend}/images/group/${this.state.groupimage}`;
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
                      Edit Group Profile
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
                      <div class="custom-file" style={{ width: "90%" }}>
                        <input
                          type="file"
                          class="custom-file-input"
                          name="image"
                          accept="image/*"
                          onChange={this.imageChangeHandler}
                        />
                      </div>
                      <br />
                      <br />
                      <Button
                        type="submit"
                        variant="primary"
                        onClick={this.submitImage}
                      >
                        Upload
                      </Button>
                      <br />
                      <br />
                    </Form.Row>
                    <Grid container spacing={3}>
                      <Grid item xs={6}>
                        <Form.Group controlId="formGroupname">
                          <Form.Label>
                            Group new name shall be called...
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="groupname"
                            value={this.state.groupname}
                            onChange={this.groupnameChangeHandler}
                            placeholder="Enter the new groupname"
                          />
                        </Form.Group>
                      </Grid>
                    </Grid>
                    <Button
                      variant="primary"
                      type="submit"
                      onClick={this.submitProfile}
                    >
                      Save
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

export default withApollo(withStyles(useStyles)(GroupProfile));
