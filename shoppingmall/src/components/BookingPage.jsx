import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function BookingPage() {
    const { tableId } = useParams();
    const [table, setTable] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTableDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/get-table/${tableId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch table details.');
                }
                const result = await response.json();
                setTable(result);
            } catch (err) {
                console.error(err);
                setError('Error loading table details.');
            } finally {
                setLoading(false);
            }
        };

        fetchTableDetails();
    }, [tableId]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/book-table`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...formData, tableId }),
            });

            if (response.ok) {
                navigate('/bookrestaurant/confirmation'); // Redirect to BookingConfirmation page
            } else {
                throw new Error('Failed to book the table.');
            }
        } catch (err) {
            console.error(err);
            alert(err.message); // Optional error handling for debugging
        }
    };

    if (loading) {
        return <p>Loading table details...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h1>Booking for Table: {table.name || `Table ${tableId}`}</h1>
            <p><strong>Capacity:</strong> {table.capacity}</p>
            <p>
                <strong>Status:</strong> {table.isAvailable ? 'Available' : 'Not Available'}
            </p>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Phone:
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                </div>
                <button type="submit" disabled={!table.isAvailable}>
                    {table.isAvailable ? 'Book Table' : 'Table Not Available'}
                </button>
            </form>
        </div>
    );
}

export default BookingPage;
