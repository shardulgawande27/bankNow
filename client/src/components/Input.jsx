import React, { useState } from "react";
import axios from "axios";

const Input = ({ accountNumber, onTransaction }) => {
  const [amount, setAmount] = useState("");

  const handleDeposit = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3001/transactions/deposit",
        { accountNumber, amount },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      onTransaction(response.data);
      setAmount("");
    } catch (error) {
      console.error("Error depositing:", error);
    }
  };

  const handleWithdraw = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3001/transactions/withdraw",
        { accountNumber, amount },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      onTransaction(response.data);
      setAmount("");
    } catch (error) {
      console.error("Error withdrawing:", error);
    }
  };

  return (
    <div className="input mt-8 flex flex-col">
      <div className="input">
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mr-2 p-2"
          style={{ width: "150%", border: "1px solid grey" }}
        />
      </div>

      <div className="buttons  mt-8">
        <button onClick={handleDeposit} className="bg-green-500 text-white p-2">
          Deposit
        </button>
        <button
          onClick={handleWithdraw}
          className="bg-red-500 text-white p-2 ml-5 "
        >
          Withdraw
        </button>
      </div>
    </div>
  );
};

export default Input;
