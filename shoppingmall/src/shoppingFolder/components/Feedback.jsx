import { useState } from 'react';
import '../components/css/feedback.css'

function Feedback() {
  const [formData, setFormData] = useState({
    username: '',
    rating: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.rating || !formData.message) {
      alert('All fields are required');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        alert('Feedback submitted successfully!');
        setFormData({
          username: '',
          rating: '',
          message: '',
        });
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while submitting feedback.');
    }
  };

  return (
    <div className="feedback-form-container">
      <form className="feedback-form" onSubmit={handleSubmit}>
        <h2>Feedback Form</h2>
        
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        
        <div className="checkbox-group">
          <label>Your Rating:</label>
          <label>
            <input
              type="radio"
              name="rating"
              value="Good"
              onChange={handleChange}
              checked={formData.rating === 'Good'}
            />{' '}
            Good
          </label>
          <label>
            <input
              type="radio"
              name="rating"
              value="Bad"
              onChange={handleChange}
              checked={formData.rating === 'Bad'}
            />{' '}
            Bad
          </label>
          <label>
            <input
              type="radio"
              name="rating"
              value="Average"
              onChange={handleChange}
              checked={formData.rating === 'Average'}
            />{' '}
            Average
          </label>
          <label>
            <input
              type="radio"
              name="rating"
              value="Excellent"
              onChange={handleChange}
              checked={formData.rating === 'Excellent'}
            />{' '}
            Excellent
          </label>
        </div>

        <textarea
          name="message"
          placeholder="Your message"
          value={formData.message}
          onChange={handleChange}
          required
        ></textarea>

        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
}

export default Feedback;
