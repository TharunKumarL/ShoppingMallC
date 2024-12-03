import React from 'react';
import { useParams } from 'react-router-dom';

function RestaurentDetails() {
  const { id } = useParams();

  const [tables, setTables] = React.useState([]);

  React.useEffect(() => {
    const fetchTables = async () => {
      const response = await fetch(`http://localhost:5000/api/get-tables/${id}`);
      const result = await response.json();
      setTables(result);
    };
    fetchTables();
  }, [id]);

  if (!tables.length) {
    return <p>Loading tables...</p>;
  }

  return (
    <div>
      <h1>{tables[0].name}</h1>
      <p>{tables[0].description}</p>
      <p><strong>Cuisine:</strong> {tables[0].cuisine}</p>
      <p><strong>Price Range:</strong> {tables[0].price}</p>
      <p><strong>Dietary Options:</strong> {tables[0].dietary}</p>
      <p><strong>Seating Type:</strong> {tables[0].seating}</p>
      <h2>Tables</h2>
      <ul>
        {tables.map((table) => (
          <li key={table._id}>{table.name} ({table.capacity})</li>
        ))}
      </ul>
    </div>
  );
}

export default RestaurentDetails;
