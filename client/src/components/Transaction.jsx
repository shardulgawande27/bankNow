import React from "react";

const Transaction = ({ transactions = [] }) => {
  const trStyle = {
    bacKgroundColor: "#009879",
    color: "#fffff",
    textAlign: "left",
  };

  return (
    <div>
      <h2 className="text-2xl mt-8">Transaction History</h2>

      <div style={{ width: "100%" }}>
        <table
          class="  text-black p-10 mt-4"
          style={{
            borderCollapse: "collapse",
            margin: "25px 0",
            width: "100%",
            boxShadow: "0 0 20px rgba(0, 0, 0, 0.15)",
            borderRadius: "20px",
            textAlign: "left",
          }}
        >
          <thead>
            <tr style={{ trStyle }}>
              <th style={{ padding: "12px 15px" }}>Type</th>
              <th style={{ padding: "12px 15px" }}>Amount</th>
              <th style={{ padding: "12px 15px" }}>Time</th>
            </tr>
          </thead>
          <tbody className="bg-[#205bd4] text-white">
            {transactions.map((transaction) => (
              <tr
                key={transaction._id}
                style={{
                  borderBottom: "1px solid #dddddd",
                }}
              >
                <td style={{ padding: "12px 15px" }}>{transaction.type}</td>
                <td style={{ padding: "12px 15px" }}>{transaction.amount}</td>
                <td style={{ padding: "12px 15px" }}>
                  {transaction.timestamp}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transaction;
