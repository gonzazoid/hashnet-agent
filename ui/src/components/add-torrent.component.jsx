import React, { Component } from "react";

import TorrentService from "services/torrent.service";

export default class AddTorrent extends Component {
  constructor(props) {
    super(props);
    this.onChangeUrl = this.onChangeUrl.bind(this);
    this.saveUrl = this.saveUrl.bind(this);

    this.state = this.getDefaultState();
  }

  onChangeUrl(e) {
    this.setState({
      url: e.target.value,
    });
  }

  getDefaultState() {
    return {
      url: "",
    };
  }

  saveUrl() {
    const {
      url,
    } = this.state;

    TorrentService.addTorrentByMagnetUrl(url);
  }

  render() {
    const { url } = this.state;
    return (
      <div className="submit-form">
        <div>
          <div className="form-group">
            <label htmlFor="message">
              magnet url
              <input
                type="text"
                className="form-control"
                id="message"
                required
                value={url}
                onChange={this.onChangeUrl}
                name="message"
              />
            </label>
          </div>

          <button type="button" onClick={this.saveUrl} className="btn btn-success">
            Submit
          </button>
        </div>
      </div>
    );
  }
}
