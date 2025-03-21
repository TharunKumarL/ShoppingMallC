import React ,{useEffect}from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/css/AdminDashboard.css';
import AddShopOwner from './Admin/AddShopOwner';
import AdminDashboard2 from './AdminDashBoard2';
import RestroOwnerDashboard from './RestroOwnerDashboard';

const AdminDashboard = () => {
  const navigate = useNavigate(); // Initialize useNavigate for navigation
  
  useEffect(() => {
    // Check if user is authenticated and authorized
    fetch('/api/admin/dashboard', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Send token in request headers
      }
    })
    .then(res => {
      if (res.status === 401) {
        // Unauthorized - redirect to login
        navigate('/login');
      } else if (res.status === 403) {
        // Forbidden - user is not admin
        alert('Access Denied: You are not authorized');
        navigate('/login');
      }
    })
    .catch(err => {
      console.error('Error:', err);
      navigate('/login'); // Handle error by redirecting to login
    });
  }, [navigate]);

return (
  <div className="admin-body">
    <div className="admin-container">
      <AdminDashboard2 />
      <div className="admin-management">
        <h2 className="management-heading">Admin Management</h2>
        <div className="management-options">
          {/* Add Shops */}
          <div className="management-box add-shops">
            <h3>Add Shops</h3>
            <p>Manage and add new shops to the mall directory.</p>
            <button
              className="manage-now-btn"
              onClick={() => navigate('/admin/add-shop')}
            >
              Manage Now
            </button>
          </div>

          {/* Update Shops */}
          <div className="management-box update-shops">
            <h3>Update Shops</h3>
            <p>Update the details of existing shops in the mall directory.</p>
            <button
              className="manage-now-btn"
              onClick={() => navigate('/admin/update-shop')}
            >
              Manage Now
            </button>
          </div>

          {/* View Shops */}
          <div className="management-box view-shops">
            <h3>View Shops</h3>
            <p>View the list of all shops in the mall directory.</p>
            <button
              className="manage-now-btn"
              onClick={() => navigate('/admin/view-shops')}
            >
              View Now
            </button>
          </div>

          {/* View ShopOwners */}
          <div className="management-box view-shopowners">
            <h3>View ShopOwners</h3>
            <p>View the list of all shop owners in the mall management system.</p>
            <button
              className="manage-now-btn"
              onClick={() => navigate('/admin/view-shopowners')}
            >
              View Now
            </button>
            </div>
            {/* Add Managers */}
           <div className="management-box add-manager">
              <h3>Add Managers</h3>
                <p>View the list of all sections in the mall management system.</p>
              <button className="manage-now-btn" onClick={() => navigate('/admin/add-manager')}> Manage Now </button>
          </div>
           {/* View FeedBacks */}
           <div className="management-box add-manager">
              <h3>View FeedBacks</h3>
                <p>View the list of all FeedBacks.</p>
              <button className="manage-now-btn" onClick={() => navigate('/admin/viewFeedBack')}> Manage Now </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default AdminDashboard;
