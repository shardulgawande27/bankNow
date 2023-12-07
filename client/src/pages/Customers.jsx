import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Transaction from "../components/Transaction";
import { Navigate, useNavigate, Link } from "react-router-dom";

const Customers = () => {
  const [banker, setBanker] = useState({});
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    const token = localStorage.getItem("token");

    axios
      .get(`http://localhost:3001/customers`, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((res) => {
        console.log("Response from server", res.data);
        const { banker, customers } = res.data;
        setBanker(banker);
        setCustomers(customers);
      })
      .catch((error) => {
        console.error("Error fetching request", error);
      });
  };

  const handleCustomerClick = (customer) => {
    console.log("Selected customer:", customer);

    setSelectedCustomer(customer);
  };

  return (
    <div>
      <Navbar />
      <div className="text-center">
        <h2 className="text-2xl mt-8">Banker: {banker.username}</h2>

        <div>
          <h3 className="text-xl mt-4 ">Customers:</h3>
          <ul className="cursor-pointer flex justify-center gap-8 mt-8">
            {customers.map((customer) => (
              <li
                key={customer._id}
                onClick={() => handleCustomerClick(customer)}
                className="p-3 bg-[#205bd4] text-white rounded-lg"
              >
                {customer.username} - Balance:{" "}
                {customer.accounts && customer.accounts.length > 0
                  ? customer.accounts[0].balance
                  : "N/A"}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {selectedCustomer &&
        selectedCustomer.accounts &&
        selectedCustomer.accounts.length > 0 && (
          <div className="text-center ">
            <h3 className="text-xl mt-4">
              Transactions for {selectedCustomer.username}:
            </h3>
            <div
              style={{ width: "50%", margin: "0 auto", overflow: "hidden" }}
              className="text-center"
            >
              <Transaction
                transactions={selectedCustomer.accounts[0].transactions}
              />
            </div>
          </div>
        )}
    </div>
  );
};

export default Customers;
