import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/css/AdminDashboard.css';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'; // Import recharts components

const AdminDashboard2 = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    shopOwners: 0,
    shops: 0,
    shopOwnersAssigned: 0,
    shopOwnersUnassigned: 0,
    SportbookingTrue:0,
    SportbookingFalse:0
    
  });

  useEffect(() => {
    // Fetch admin stats (users, shop owners, shops)
    fetch('http://localhost:5000/stats') // If running on different ports
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Fetched stats:', data);
        
        // Calculate unassigned shop owners
        const totalShopOwners = data.shopOwnersCount;
        const assignedShopOwners = data.shopOwnersAssignedCount; // Ensure your backend sends this count
        
        setStats({
          users: data.usersCount,
          shopOwners: totalShopOwners,
          shops: data.shopsCount,
          shopOwnersAssigned: totalShopOwners,
          shopOwnersUnassigned: data.shopsCount-totalShopOwners,// Calculate unassigned
          SportbookingTrue:data.SportbookingTrue,
          SportbookingFalse:data.SportbookingFalse
        });
      })
      .catch((err) => {
        console.error('Error:', err);
      });
  }, [navigate]);

  // Prepare data for the bar chart
  const barData = [
    { name: 'Users', count: stats.users },
    { name: 'Shop Owners', count: stats.shopOwners },
    { name: 'Shops', count: stats.shops },
  ];

  // Prepare data for the pie chart
  const pieData = [
    { name: 'Assigned shops', value: stats.shopOwnersAssigned },
    { name: 'Unassigned shops', value: stats.shopOwnersUnassigned },
  ];

  const pieData2 = [
    { name: 'Booked Slots', value: stats.SportbookingTrue },
    { name: 'UnBooked Slots', value: stats.SportbookingFalse},
  ];

  // Define colors for the pie chart
  const COLORS = ['#0088FE', '#FF8042'];

  return (
    <div className="admin-body">
      {/* Admin management section */}
      <div className="admin-management">
        <h2 className="management-heading">Admin Management</h2>
        <div className="management-options">
          {/* Bar chart section */}
          <div className="management-box stats-graph">
            <h3>Statistics</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart section */}
          <div className="management-box stats-graph">
            <h3>Shop Owners Assignment to the shops</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Pie chart section */}
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
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard2;
