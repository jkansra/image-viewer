import React from "react";
import Header from "../../common/Header";
import {
  Avatar,
  Fab,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  TextField
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import "./profile.css";

export default class Profile extends React.Component {
  constructor() {
    super();
    this.state = {
      profilePic: "",
      username: "",
      counts: {},
      fullName: "",
      updatedFullname: "",
      openModal: false,
      response: []
    };
  }
  componentDidMount() {
    const accessToken = sessionStorage.getItem("accessToken");
    if (!accessToken) {
      window.location = "/";
      return;
    }
    fetch(
      `https://api.instagram.com/v1/users/self/?access_token=${accessToken}`
    )
      .then(results => {
        return results.json();
      })
      .then(data => {
        if (data.data) {
          const { profile_picture, username, counts, full_name } = data.data;
          this.setState({
            profilePic: profile_picture,
            username: username,
            counts: counts,
            fullName: full_name
          });
        }
      });
    fetch(
      `https://api.instagram.com/v1/users/self/media/recent?access_token=${accessToken}`
    )
      .then(results => {
        return results.json();
      })
      .then(data => {
        if (data.data) {
          this.setState({ response: data.data });
        }
      });
  }
  openModal = () => {
    this.setState({ openModal: true });
  };
  closeModal = () => {
    this.setState({ openModal: false });
  };
  handleChange = (e, type) => {
    const value = e.target.value;
    const nextState = {};
    nextState[type] = value;
    this.setState(nextState);
  };
  updateFullname = () => {
    const { updatedFullname } = this.state;
    if (updatedFullname.trim() !== "") {
      this.setState({ fullName: updatedFullname });
    }
    this.setState({ openModal: false });
  };

  render() {
    const { profilePic, username, counts, fullName, openModal } = this.state;
    return (
      <div className="profile-wrapper">
        <Header url={profilePic} homepageHeader={true} goToHome={true} />
        <div className="information-section">
          <Avatar aria-label="recipe">
            <img src={profilePic} alt="profile-pic" className="profile-pic" />
          </Avatar>
          <div className="user-info">
            <p className="username">{username}</p>
            <div className="posts-info">
              <p>Posts: {counts.media}</p>
              <p>Follows: {counts.follows}</p>
              <p>Followed By: {counts.followed_by}</p>
            </div>
            <div>
              <span className="fullname">{fullName}</span>
              <Fab
                color="secondary"
                aria-label="edit"
                className="edit-btn"
                onClick={this.openModal}
              >
                <EditIcon />
              </Fab>
              <div>
                <Dialog
                  open={openModal}
                  onClose={this.closeModal}
                  aria-labelledby="form-dialog-title"
                  className="update-modal"
                >
                  <DialogTitle id="form-dialog-title">Edit</DialogTitle>
                  <DialogContent>
                    <TextField
                      margin="dense"
                      id="fullname"
                      label="Full Name *"
                      type="email"
                      fullWidth
                      onChange={e => this.handleChange(e, "updatedFullname")}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={this.updateFullname}
                      color="primary"
                      variant="contained"
                    >
                      Update
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
