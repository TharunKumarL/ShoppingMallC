import React, { useState } from "react";

const AddManagers = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    section: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/managers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage("Manager added successfully!");
        setFormData({
          name: "",
          email: "",
          section: "",
        });
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message || "Failed to add manager."}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h1>Add Manager</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
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
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Section:
            <select
              name="section"
              value={formData.section}
              onChange={handleChange}
              required
            >
              <option value="">Select Section</option>
              <option value="sports">Sports</option>
              <option value="theatre">Theatre</option>
              <option value="restaurant">Restaurant</option>
            </select>
          </label>
        </div>
        <button type="submit">Add Manager</button>
      </form>
    </div>
  );
};

export default AddManagers;
