export default function Table({ columns = [], data = [] }) {
  return (
    <div className="transactions-table-wrap">
      <table className="transactions-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column) => (
                <td key={`${rowIndex}-${column}`}>{row[column]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
