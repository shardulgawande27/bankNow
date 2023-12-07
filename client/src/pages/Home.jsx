// Home.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import profile from "./../assets/profile.jpg";
import Input from "../components/Input";
import Transaction from "../components/Transaction";

const Home = () => {
  const [username, setUsername] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState("");

  useEffect(() => {
    // Fetch user data on component mount
    fetchUserData();
  }, []);

  const fetchUserData = () => {
    // Fetch user data from your backend API
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token"); // Replace with actual key
    axios
      .get(`http://localhost:3001/home/`, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((res) => {
        console.log("Response from the server:", res.data);
        const { username, accountDetails } = res.data;
        const { accountNumber, balance, transaction } = accountDetails[0];

        setUsername(username);
        setAccountNumber(accountNumber);
        setBalance(balance);
        setTransactions(transaction);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <Navbar />
      <div className="w-full h-screen bg-white text-black flex justify-center items-center relative">
        <div
          className="absolute left-0 top-20 bg-[#205bd4] text-white h-[500px] w-[300px] items-center flex flex-col"
          style={{ borderRadius: "0px 20px 20px 0px" }}
        >
          <h2 className="text-3xl mt-8">Welcome, {username}!</h2>
          <img
            src={profile}
            alt=""
            srcset=""
            style={{ width: "50%" }}
            className="mt-8"
          />
          <p className="mt-8 font-semibold text-xl">
            Account Number: {accountNumber}
          </p>

          <p className="mt-8 font-semibold text-xl">
            Account Balance: {balance}
          </p>
        </div>
        <div className="accountDetails flex flex-col justify-center absolute top-20">
          <Input
            accountNumber={accountNumber}
            onTransaction={(data) => console.log(data)}
          />
          <div style={{ width: "150%" }}>
            <Transaction transactions={transactions} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
