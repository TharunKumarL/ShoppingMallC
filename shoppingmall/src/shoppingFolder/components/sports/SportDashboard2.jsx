import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const SportDashboard2 = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    SportbookingTrue: 0,
    SportbookingFalse: 0
  });

  useEffect(() => {
    fetch('http://localhost:5000/stats')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Fetched stats:', data);
        setStats({
          SportbookingTrue: data.SportbookingTrue,
          SportbookingFalse: data.SportbookingFalse
        });
      })
      .catch((err) => {
        console.error('Error:', err);
      });
  }, [navigate]);

  const pieData2 = [
    { name: 'Booked Slots', value: stats.SportbookingTrue },
    { name: 'UnBooked Slots', value: stats.SportbookingFalse },
  ];

  const COLORS = ['#0088FE', '#FF8042'];

  return (
    <div className="admin-body">
      <div className="management-box stats-graph">
        <h3>Booked Sport Slots</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData2}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData2.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SportDashboard2;
