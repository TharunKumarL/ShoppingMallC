import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../../App.css";
import "../css/Create_Sport.css";
import { Link } from 'react-router-dom';

const Create_Sport = () => {
    const submit_url = 'http://localhost:5000/sport/owner/create';
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        label: '',
        body: '',
        cost: '',
        address: '', 
        contact_mail: '', 
        slot_timings: [''],
        date: ''
    }); 

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState(null); // State for error messages

    const handleChange = (e, index) => {
        const { name, value } = e.target;

        if (name === 'slot_timings') {
            const slots = [...formData.slot_timings];
            slots[index] = value;
            setFormData({ ...formData, slot_timings: slots });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    }; 

    const addSlot = () => {
        setFormData({ ...formData, slot_timings: [...formData.slot_timings, ''] });
    };

    const removeSlot = (index) => {
        const slots = formData.slot_timings.filter((_, i) => i !== index);
        setFormData({ ...formData, slot_timings: slots });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(formData); // Logging formData for debugging

        try {
            const response = await fetch(submit_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setIsSubmitted(true);
                navigate("/sport/owner");
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to submit');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred while submitting the form');
        }
    };

    if (isSubmitted) {
        return null; // Ensure no further rendering after navigation
    }

    return (
        <div className='Create_Sport'>
            <div className='Back'>
                <Link to="/sport/owner"> Back </Link>
            </div>
            <div className="create_sport">

                <form onSubmit={handleSubmit}>
                    <label>Type</label>
                    <input
                        type="text"
                        name="label"
                        value={formData.label}
                        onChange={handleChange}
                        placeholder="Eg: Cricket, Football, Hockey"
                        required
                    />

                    <label>Description</label>
                    <input
                        type="text"
                        name="body"
                        value={formData.body}
                        onChange={handleChange}
                        required
                    />

                    <label>Cost</label>
                    <input
                        type="number"
                        name="cost"
                        value={formData.cost}
                        onChange={handleChange}
                        required
                    />

                    <label>Address</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                    />

                    <label>Contact Email</label>
                    <input
                        type="email"
                        name="contact_mail"
                        value={formData.contact_mail}
                        onChange={handleChange}
                        required
                    />

                    <label>Date</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        required
                    />

                    <label>Timing Slots</label>
                    {formData.slot_timings.map((slot, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                            <input
                                type="text"
                                name="slot_timings"
                                value={slot}
                                onChange={(e) => handleChange(e, index)}
                                required
                            />
                            <button type="button" onClick={() => removeSlot(index)} style={{ marginLeft: '8px' }}>
                                Remove
                            </button>
                        </div>
                    ))}

                    <button type="button" onClick={addSlot}>
                        Add another slot
                    </button>

                    <button type="submit">Submit</button>
                </form>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </div>
    );
};

export default Create_Sport;
