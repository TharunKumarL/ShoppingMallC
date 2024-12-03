import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "./css/bookingpage.css";

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

    // Fetch table and hotel details
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
                navigate('/bookrestaurant/confirmation'); 
            } else {
                throw new Error('Failed to book the table.');
            }
        } catch (err) {
            console.error(err);
            alert(err.message); 
        }
    };

    if (loading) {
        return <p className="RS-loading-message">Loading table details...</p>;
    }

    if (error) {
        return <p className="RS-error-message">{error}</p>;
    }

    return (
        <div className="RS-booking-page">
            <h1 className="RS-booking-title">Booking for Table: {table.name || `Table ${tableId}`}</h1>
            <p className="RS-booking-details">
                <strong>Capacity:</strong> {table.capacity}
            </p>
            <p className="RS-table-status">
                <strong>Status:</strong> {table.isAvailable ? 'Available' : 'Not Available'}
            </p>
            <form className="RS-booking-form" onSubmit={handleSubmit}>
                <div className="RS-form-group">
                    <label className="RS-form-label">
                        Name:
                        <input
                            type="text"
                            className="RS-form-input"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                </div>
                <div className="RS-form-group">
                    <label className="RS-form-label">
                        Phone:
                        <input
                            type="tel"
                            className="RS-form-input"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                </div>
                <div className="RS-form-group">
                    <label className="RS-form-label">
                        Email:
                        <input
                            type="email"
                            className="RS-form-input"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </label>
                </div>
                <button
                    type="submit"
                    className={`RS-form-button ${table.isAvailable ? 'RS-button-active' : 'RS-button-disabled'}`}
                    disabled={!table.isAvailable}
                >
                    {table.isAvailable ? 'Book Table' : 'Table Not Available'}
                </button>
            </form>
        </div>
    );
}

export default BookingPage;
