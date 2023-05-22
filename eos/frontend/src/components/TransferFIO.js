import React, { useState } from "react";
import "./common.css"; // Import CSS file

const TransferFIO = () => {
  const [senderEmail, setSenderEmail] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [amount, setAmount] = useState(0);

  const handleSenderEmailChange = (e) => {
    setSenderEmail(e.target.value);
  };

  const handleReceiverEmailChange = (e) => {
    setReceiverEmail(e.target.value);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleTransfer = () => {
    if (!senderEmail) {
      alert("Please enter your email!");
    }
    if (senderEmail && receiverEmail && amount) {
      // Perform transfer logic here
      alert("Transfer successful!");
    }
  };

  return (
    <div className="form-container">
      <h2>Transfer FIO token</h2>
      <input
        type="email"
        value={senderEmail}
        onChange={handleSenderEmailChange}
        placeholder="Enter your email"
        className="email-input"
      />
      <input
        type="email"
        value={receiverEmail}
        onChange={handleReceiverEmailChange}
        placeholder="Enter receiver's email"
        className="email-input"
      />
      <input
        type="number"
        value={amount}
        onChange={handleAmountChange}
        placeholder="Enter amount"
        className="email-input"
      />
      <button onClick={handleTransfer} className="register-button">
        Transfer
      </button>
    </div>
  );
};

export default TransferFIO;
