import React, { Component } from "react";

import MessageDataService from "services/message.service";

import Message from "./message.component";

export default class MessagesList extends Component {
  constructor(props) {
    super(props);
    this.onChangeSearchRelated = this.onChangeSearchRelated.bind(this);
    this.setActiveMessage = this.setActiveMessage.bind(this);
    this.searchRelated = this.searchRelated.bind(this);

    this.state = {
      messages: [],
      currentMessage: null,
      currentIndex: -1,
      searchRelated: "",
    };
  }

  onChangeSearchRelated(e) {
    const searchRelated = e.target.value;

    this.setState({
      searchRelated,
    });
  }

  setActiveMessage(message, index) {
    this.setState({
      currentMessage: message,
      currentIndex: index,
    });
  }

  searchRelated() {
    this.setState({
      currentMessage: null,
      currentIndex: -1,
    });

    const { searchRelated } = this.state;

    MessageDataService.findRelated(searchRelated)
      .then((response) => {
        response.json().then((json) => {
          this.setState({
            messages: json,
          });
          console.log(json);
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    const {
      searchRelated,
      messages,
      currentMessage,
      currentIndex,
    } = this.state;

    return (
      <div className="list row">
        <div className="col-md-8">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search related"
              value={searchRelated}
              onChange={this.onChangeSearchRelated}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={this.searchRelated}
              >
                Search
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <h4>Messages List</h4>
          <ul className="list-group">
            {messages ?
              messages.map((message, index) => (
                <button
                  type="button"
                  className={`list-group-item ${(index === currentIndex ? "active" : "")}`}
                  onClick={() => {
                    this.setActiveMessage(message, index);
                  }}
                  key={message.signature}
                >
                  {message.label}
                </button>
              )) : null}
          </ul>
        </div>
        <div className="col-md-6">
          {currentMessage ? (
            <Message message={currentMessage} />
          ) : (
            <div>
              <br />
              <p>Please click on a Message...</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}
