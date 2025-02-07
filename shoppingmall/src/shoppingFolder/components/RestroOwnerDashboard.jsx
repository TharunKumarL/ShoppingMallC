// Importing necessary libraries
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/RestroOwnerDashboard.css'; // Basic CSS

const RestroOwnerDashboard = () => {
    const [tables, setTables] = useState([]);
    const [tableName, setTableName] = useState('');
    const [tableCapacity, setTableCapacity] = useState(1);
    const [tableLocation, setTableLocation] = useState('');

    useEffect(() => {
        // Fetching table data from backend
        axios.get('/api/tables')
            .then(response => setTables(response.data))
            .catch(error => console.error('Error fetching tables:', error));
    }, []);

    const addTable = () => {
        const newTable = {
            name: tableName,
            capacity: tableCapacity,
            location: tableLocation,
        };

        axios.post('/api/tables', newTable)
            .then(response => {
                setTables([...tables, response.data]);
                setTableName('');
                setTableCapacity(1);
                setTableLocation('');
            })
            .catch(error => console.error('Error adding table:', error));
    };

    return (
        <div className="dashboard">
            <h1>Restaurant Owner Dashboard</h1>

            <div className="add-table">
                <h2>Add a New Table</h2>
                <input
                    type="text"
                    placeholder="Table Name"
                    value={tableName}
                    onChange={(e) => setTableName(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Capacity"
                    value={tableCapacity}
                    onChange={(e) => setTableCapacity(Math.min(Math.max(e.target.value, 1), 10))}
                />
                <input
                    type="text"
                    placeholder="Location"
                    value={tableLocation}
                    onChange={(e) => setTableLocation(e.target.value)}
                />
                <button onClick={addTable}>Add Table</button>
            </div>

            <div className="table-list">
                <h2>All Tables</h2>
                {tables.length === 0 ? (
                    <p>No tables available.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Capacity</th>
                                <th>Location</th>
                                <th>Available</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tables.map((table) => (
                                <tr key={table._id}>
                                    <td>{table.name}</td>
                                    <td>{table.capacity}</td>
                                    <td>{table.location}</td>
                                    <td>{table.isAvailable ? 'Yes' : 'No'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default RestroOwnerDashboard;
