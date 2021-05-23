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
import { Grid, Typography } from "@material-ui/core";
import { Redirect } from "react-router";
import LoginNavbar from "../Navbar/LoginNavbar";
import backend from "../../backendConfig";
import gql from "graphql-tag";
import { Query, withApollo } from "react-apollo";

const PROFILE_QUERY = gql`
  query ($email: String) {
    profile(email: $email) {
      username
      email
      phone
      currency
      timezone
      language
      image
    }
  }
`;

const UPDATE_PROFILE_QUERY = gql`
  mutation (
    $origin_email: String
    $email: String
    $username: String
    $phone: String
    $currency: String
    $timezone: String
    $language: String
  ) {
    updateProfile(
      origin_email: $origin_email
      email: $email
      username: $username
      phone: $phone
      currency: $currency
      timezone: $timezone
      language: $language
    ) {
      success
    }
  }
`;

const useStyles = (theme) => ({
  root: {
    marginLeft: theme.spacing(25),
    marginRight: theme.spacing(25),
    marginTop: theme.spacing(5),
  },
  title: {
    flexGrow: 1,
    fontSize: 25,
  },
});

class Profile extends Component {
  //call the constructor method
  constructor(props) {
    //Call the constrictor of Super class i.e The Component
    super(props);
    //maintain the state required for this component
    this.state = {
      user_id: "",
      username: "",
      email: "",
      phone: "",
      currency: "",
      timezone: "",
      language: "",
      image: "default",
      file: "",
    };
    //Bind the handlers to this class
    this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
    this.emailChangeHandler = this.emailChangeHandler.bind(this);
    this.phoneChangeHandler = this.phoneChangeHandler.bind(this);
    this.currencyChangeHandler = this.currencyChangeHandler.bind(this);
    this.timezoneChangeHandler = this.timezoneChangeHandler.bind(this);
    this.languageChangeHandler = this.languageChangeHandler.bind(this);
    this.imageChangeHandler = this.imageChangeHandler.bind(this);
    this.submitImage = this.submitImage.bind(this);
    this.submitProfile = this.submitProfile.bind(this);
  }
  componentDidMount() {
    axios.defaults.withCredentials = true;
    this.props.client
      .query({
        query: PROFILE_QUERY,
        variables: {
          email: localStorage.getItem("email"),
        },
      })
      .then((response) => {
        console.log("inside success");
        console.log("response data in user profile", response.data);
        this.setState({
          username: response.data.profile.username,
          email: response.data.profile.email,
          phone: response.data.profile.phone,
          currency: response.data.profile.currency,
          timezone: response.data.profile.timezone,
          language: response.data.profile.language,
          image: response.data.profile.image || this.state.image,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  //handlers
  usernameChangeHandler = (e) => {
    this.setState({
      username: e.target.value,
    });
  };
  emailChangeHandler = (e) => {
    this.setState({
      email: e.target.value,
    });
  };
  phoneChangeHandler = (e) => {
    this.setState({
      phone: e.target.value,
    });
  };
  currencyChangeHandler = (e) => {
    this.setState({
      currency: e.target.value,
    });
  };
  timezoneChangeHandler = (e) => {
    this.setState({
      timezone: e.target.value,
    });
  };
  languageChangeHandler = (e) => {
    this.setState({
      language: e.target.value,
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
          `${backend}/images/user/${this.state.email}`,
          formData,
          uploadConfig
        )
        .then((response) => {
          alert("Image uploaded successfully!");
          this.setState({
            image: response.data,
          });
        })
        .catch((err) => {
          console.log(err);
          alert("Fail to upload image");
        });
    } else {
      alert("Fail to upload image! Please choose a file");
    }
  };
  //validate user email input
  validateEmail = () => {
    const inputs = this.state.email;
    const error = document.getElementById("errorMsg");
    var emailFormat =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    let isValid = true;
    if (!inputs) {
      error.textContent = "Your email can not be empty";
      isValid = false;
    } else if (!inputs.match(emailFormat)) {
      error.textContent =
        "Your email format is invalid, please use user@google format";
      isValid = false;
    }
    return isValid;
  };
  //validate user phonenumber input
  validatePhone = () => {
    const inputs = this.state.phone;
    const error = document.getElementById("errorMsg");
    var phoneFormat = /^\d{10}$/;
    let isValid = true;
    if (!inputs) {
      isValid = true;
    } else if (!inputs.match(phoneFormat)) {
      error.textContent =
        "Your phone format is invalid, please enter 10 digits without space";
      isValid = false;
    }
    return isValid;
  };
  //submit Register handler to send a request to the node backend
  submitProfile = (e) => {
    //prevent page from refresh
    e.preventDefault();
    if (this.validateEmail() && this.validatePhone()) {
      let originEmail = localStorage.getItem("email");
      axios.defaults.withCredentials = true;
      this.props.client
        .mutate({
          mutation: UPDATE_PROFILE_QUERY,
          variables: {
            origin_email: originEmail,
            username: this.state.username,
            email: this.state.email,
            phone: this.state.phone,
            currency: this.state.currency,
            timezone: this.state.timezone,
            language: this.state.language,
          },
        })
        .then((response) => {
          console.log("inside success");
          console.log("response in update profile user ", response.data);
          if (response.data.updateProfile.success === true) {
            console.log("success", response);
            localStorage.setItem("email", this.state.email);
            alert("Successfully updated profile!");
          } else if (response.data.updateProfile.success === false) {
            alert("Fail to update! Email exists, please use another email!");
          }
        })
        .catch((error) => {
          alert("Fail to update! Email exists, please use another email!");
          console.log(error);
        });
    }
  };

  render() {
    const { classes } = this.props;
    //if not logged in go to login page
    let redirectVar = null;
    console.log(this.state);
    localStorage.setItem("currency", this.state.currency);
    var imageSrc = `${backend}/images/user/${this.state.image}`;
    if (!localStorage.getItem("email")) {
      redirectVar = <Redirect to="/" />;
    }
    return (
      <div>
        {redirectVar}
        <LoginNavbar />
        <div className={classes.root}>
          <Typography variant="h6" className={classes.title}>
            My Account
          </Typography>
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
                <Form.Group controlId="formUsername">
                  <Form.Label>Your name: {this.state.username}</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={this.state.username}
                    onChange={this.usernameChangeHandler}
                    placeholder="Enter new username"
                  />
                </Form.Group>
              </Grid>
              <Grid item xs={6}>
                <Form.Group controlId="formCurrency">
                  <Form.Label>
                    Your default currency: {this.state.currency}
                  </Form.Label>
                  <Form.Control
                    as="select"
                    onChange={this.currencyChangeHandler}
                    value={this.state.currency}
                    defaultValue="USD($)"
                  >
                    <option value="USD($)">USD($)</option>
                    <option value="KWD(KWD)">KWD(KWD)</option>
                    <option value="BHD(BD)">BHD(BD)</option>
                    <option value="GBP(£)">GBP(£)</option>
                    <option value="EUR(€)">EUR(€)</option>
                    <option value="CAD($)">CAD($)</option>
                  </Form.Control>
                </Form.Group>
              </Grid>
              <Grid item xs={6}>
                <Form.Group controlId="formEmail">
                  <Form.Label>
                    Your email address: {this.state.email}
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={this.state.email}
                    onChange={this.emailChangeHandler}
                    placeholder="Enter new email address"
                  />
                </Form.Group>
              </Grid>
              <Grid item xs={6}>
                <Form.Group controlId="formTimezone">
                  <Form.Label>Your time zone: {this.state.timezone}</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={this.timezoneChangeHandler}
                    value={this.state.timezone}
                    defaultValue="(GMT-08:00)Pacific Time"
                  >
                    <option value="(GMT-12:00)International Date Line West">
                      (GMT-12:00)International Date Line West
                    </option>
                    <option value="(GMT-11:00)American Samoa">
                      (GMT-11:00)American Samoa
                    </option>
                    <option value="(GMT-10:00)Hawaii">(GMT-10:00)Hawaii</option>
                    <option value="(GMT-09:00)Alaska">(GMT-09:00)Alaska</option>
                    <option value="(GMT-08:00)Pacific Time">
                      (GMT-08:00)Pacific Time
                    </option>
                    <option value="(GMT-07:00)Arizona">
                      (GMT-07:00)Arizona
                    </option>
                    <option value="(GMT-06:00)Central Time">
                      (GMT-06:00)Central Time
                    </option>
                    <option value="(GMT-05:00)Eastern Time">
                      (GMT-05:00)Eastern Time
                    </option>
                    <option value="(GMT-04:00)Atlantic Time">
                      (GMT-04:00)Atlantic Time
                    </option>
                    <option value="(GMT-03:00)Greenland">
                      (GMT-03:00)Greenland
                    </option>
                    <option value="(GMT-02:00)Mid-Atlantic">
                      (GMT-02:00)Mid-Atlantic
                    </option>
                    <option value="(GMT-01:00)Azores">(GMT-01:00)Azores</option>
                    <option value="(GMT+00:00)London">(GMT+00:00)London</option>
                    <option value="(GMT+01:00)Berlin">(GMT+01:00)Berlin</option>
                    <option value="(GMT+02:00)Jerusalem">
                      (GMT+02:00)Jerusalem
                    </option>
                    <option value="(GMT+03:00)Moscow">(GMT+03:00)Moscow</option>
                    <option value="(GMT+04:00)Baku">(GMT+04:00)Baku</option>
                    <option value="(GMT+05:00)Mumbai">(GMT+05:00)Mumbai</option>
                    <option value="(GMT+06:00)Astana">(GMT+06:00)Astana</option>
                    <option value="(GMT+07:00)Hanoi">(GMT+07:00)Hanoi</option>
                    <option value="(GMT+08:00)Beijing">
                      (GMT+08:00)Beijing
                    </option>
                    <option value="(GMT+09:00)Tokyo">(GMT+09:00)Tokyo</option>
                    <option value="(GMT+10:00)Sydney">(GMT+10:00)Sydney</option>
                    <option value="(GMT+11:00)Magadan">
                      (GMT+11:00)Magadan
                    </option>
                    <option value="(GMT+07:00)Fiji">(GMT+07:00)Fiji</option>
                  </Form.Control>
                </Form.Group>
              </Grid>

              <Grid item xs={6}>
                <Form.Group controlId="formPhone">
                  <Form.Label>Your phone number: {this.state.phone}</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={this.state.phone}
                    onChange={this.phoneChangeHandler}
                    placeholder="Enter new phone number"
                  />
                </Form.Group>
              </Grid>
              <Grid item xs={6}>
                <Form.Group controlId="formLanguage">
                  <Form.Label>
                    Your default language: {this.state.language}
                  </Form.Label>
                  <Form.Control
                    as="select"
                    onChange={this.languageChangeHandler}
                    value={this.state.language}
                    defaultValue="English"
                  >
                    <option value="English">English</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="Arabic">Arabic</option>
                  </Form.Control>
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
        </div>
      </div>
    );
  }
}

export default withApollo(withStyles(useStyles)(Profile));
