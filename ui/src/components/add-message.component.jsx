import React, { Component } from "react";

import MessageDataService from "services/message.service";

export default class AddMessage extends Component {
  constructor(props) {
    super(props);
    this.onChangeMessage = this.onChangeMessage.bind(this);
    this.onChangeLabel = this.onChangeLabel.bind(this);
    this.onChangeNonce = this.onChangeNonce.bind(this);
    this.onChangeRelatedTo = this.onChangeRelatedTo.bind(this);
    this.saveMessage = this.saveMessage.bind(this);
    this.newMessage = this.newMessage.bind(this);

    this.state = this.getDefaultState();
  }

  onChangeMessage(e) {
    this.setState({
      message: e.target.value,
    });
  }

  onChangeLabel(e) {
    this.setState({
      label: e.target.value,
    });
  }

  onChangeNonce(e) {
    this.setState({
      nonce: e.target.value,
    });
  }

  onChangeRelatedTo(e) {
    this.setState({
      relatedTo: e.target.value,
    });
  }

  getDefaultState() {
    return {
      message: "",
      label: "",
      nonce: "",
      relatedTo: "",
    };
  }

  saveMessage() {
    const {
      message,
      label,
      nonce,
      relatedTo,
    } = this.state;

    const data = {
      label,
      nonce,
      relatedTo,
    };

    MessageDataService.createHashEntity(message)
      .then((hash) => {
        console.log("HASH!!! ", hash);
        data.hash = hash;
        MessageDataService.createSignedEntity(data)
          .then((response) => {
            console.log(response.data);
          })
          .catch((e) => {
            console.log(e);
          });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  newMessage() {
    this.setState(this.getDefaultState());
  }

  render() {
    const {
      submitted,
      message,
      label,
      nonce,
      relatedTo,
    } = this.state;
    return (
      <div className="submit-form">
        {submitted ? (
          <div>
            <h4>You submitted successfully!</h4>
            <button type="button" className="btn btn-success" onClick={this.newMessage}>
              Add
            </button>
          </div>
        ) : (
          <div>
            <div className="form-group">
              <label htmlFor="message">
                message
                <input
                  type="text"
                  className="form-control"
                  id="message"
                  required
                  value={message}
                  onChange={this.onChangeMessage}
                  name="message"
                />
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="label">
                Label
                <input
                  type="text"
                  className="form-control"
                  id="label"
                  required
                  value={label}
                  onChange={this.onChangeLabel}
                  name="label"
                />
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="nonce">
                Nonce
                <input
                  type="text"
                  className="form-control"
                  id="nonce"
                  required
                  value={nonce}
                  onChange={this.onChangeNonce}
                  name="nonce"
                />
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="relatedTo">
                Related to
                <input
                  type="text"
                  className="form-control"
                  id="relatedTo"
                  required
                  value={relatedTo}
                  onChange={this.onChangeRelatedTo}
                  name="relatedTo"
                />
              </label>
            </div>

            <button type="button" onClick={this.saveMessage} className="btn btn-success">
              Submit
            </button>
          </div>
        )}
      </div>
    );
  }
}
