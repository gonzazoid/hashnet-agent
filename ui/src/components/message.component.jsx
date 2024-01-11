import React from "react";

export default ({ message }) => (
  <div>
    <div className="edit-form">
      <h4>Message</h4>
      <div className="form-group">
        <label htmlFor="label">
          Label
          <input
            type="text"
            className="form-control"
            id="label"
            value={message.label}
            disabled
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
            value={message.nonce}
            disabled
          />
        </label>
      </div>
      <div className="form-group">
        <label htmlFor="hash">
          Hash
          <input
            type="text"
            className="form-control"
            id="hash"
            value={message.hash}
            disabled
          />
        </label>
      </div>
      <div className="form-group">
        <label htmlFor="publicKey">
          Public key
          <input
            type="text"
            className="form-control"
            id="publicKey"
            value={message.publicKey}
            disabled
          />
        </label>
      </div>
      <div className="form-group">
        <label htmlFor="signature">
          Signature
          <input
            type="text"
            className="form-control"
            id="signature"
            value={message.signature}
            disabled
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
            value={message.relatedTo || ""}
            disabled
          />
        </label>
      </div>
    </div>
  </div>
);
