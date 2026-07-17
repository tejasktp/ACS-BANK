function formatNumber(value) {
  return new Intl.NumberFormat("en-IN").format(value ?? 0);
}

export default function Dashboard({ transactionData }) {
  const stats = transactionData
    ? [
        {
          title: "Total transactions",
          value: formatNumber(transactionData.TOTAL_TRANSACTIONS),
          subtitle: "All card networks",
        },
        {
          title: "Success rate",
          value: `${transactionData.SR ?? 0}%`,
          subtitle: "Transaction success",
        },
        {
          title: "Mastercard transactions",
          value: formatNumber(transactionData.MASTERCARD_TRANSACTION),
          subtitle: "Mastercard volume",
        },
        {
          title: "Visa transactions",
          value: formatNumber(transactionData.VISA_TRANSACTIONS),
          subtitle: "Visa volume",
        },
      ]
    : [
        { title: "Total transactions", value: "0", subtitle: "No data available" },
        { title: "Success rate", value: "0%", subtitle: "No data available" },
        { title: "Mastercard transactions", value: "0", subtitle: "No data available" },
        { title: "Visa transactions", value: "0", subtitle: "No data available" },
      ];

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <p className="small-label">DASHBOARD</p>
          <h2>Admin overview</h2>
          <p className="page-description">
            Transaction summary from login response
            {transactionData?.USER_MK_TYPE ? ` (Maker type: ${transactionData.USER_MK_TYPE})` : ""}.
          </p>
        </div>
      </div>

      <div className="summary-grid">
        {stats.map((item) => (
          <div key={item.title} className="summary-card">
            <div className="summary-label">{item.title}</div>
            <div className="summary-value">{item.value}</div>
            <div className="summary-subtitle">{item.subtitle}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
