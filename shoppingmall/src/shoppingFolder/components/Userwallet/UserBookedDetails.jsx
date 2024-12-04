import React, { useState, useEffect } from 'react';
import { Button, Modal, Box, List, ListItem, CircularProgress } from '@mui/material';
import Typography from '@mui/material/Typography';

import "../css/UserWallet.css"; // Import the CSS file

const BookingDetails = ({ userId }) => {
    const [openUserModal, setOpenUserModal] = useState(false);
    const [openBookingModal, setOpenBookingModal] = useState(false);
    const [openWalletModal, setOpenWalletModal] = useState(false);
    const [userDetails, setUserDetails] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [userWallet, setUserWallet] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch the booking details on component mount
    useEffect(() => {
        const fetchBookingDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/booking-details/${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch booking details');
                }
                const data = await response.json();
                setUserDetails(data.userDetails);
                setBookings(data.bookings);
                setUserWallet(data.userWallet);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBookingDetails();
    }, [userId]);

    const handleModalClose = () => {
        setOpenUserModal(false);
        setOpenBookingModal(false);
        setOpenWalletModal(false);
    };

    return (
        <div>
            <Button variant="contained" color="secondary" onClick={() => setOpenBookingModal(true)} className="modal-button">
                Show Bookings
            </Button>
            {/* User Details Modal */}
            <Modal open={openUserModal} onClose={handleModalClose}>
                <Box className="modal-box">
                    {loading ? (
                        <div className="loading">
                            <CircularProgress />
                        </div>
                    ) : error ? (
                        <Typography className="error-message">{error}</Typography>
                    ) : userDetails ? (
                        <div>
                            <Typography className="modal-header">User Details</Typography>
                            <Typography className="typography-text">Name: {userDetails.name}</Typography>
                            <Typography className="typography-text">Email: {userDetails.email}</Typography>
                            {/* Add more user details here */}
                        </div>
                    ) : (
                        <Typography>No user details found</Typography>
                    )}
                </Box>
            </Modal>

            {/* Booking Details Modal */}
            <Modal open={openBookingModal} onClose={handleModalClose}>
                <Box className="modal-box">
                    {loading ? (
                        <div className="loading">
                            <CircularProgress />
                        </div>
                    ) : error ? (
                        <Typography className="error-message">{error}</Typography>
                    ) : bookings.length > 0 ? (
                        <div>
                            <Typography className="modal-header">Bookings</Typography>
                            <List className="booking-list">
                                {bookings.map((booking) => (
                                    <ListItem key={booking._id} className="booking-list-item">
                                        <Typography>
                                            <strong>Booking ID:</strong> {booking._id}
                                        </Typography>
                                        <Typography>
                                            <strong>Sport:</strong> {booking.sport_foreignkey ? booking.sport_foreignkey.name : 'Unknown'}
                                        </Typography>
                                        <Typography className="booking-item-status">
                                            Status: {booking.is_booked ? 'Booked' : 'Not Booked'}
                                        </Typography>
                                        {/* Add more booking details here */}
                                    </ListItem>
                                ))}
                            </List>
                        </div>
                    ) : (
                        <Typography>No bookings found</Typography>
                    )}
                </Box>
            </Modal>

            {/* User Wallet Modal */}
            <Modal open={openWalletModal} onClose={handleModalClose}>
                <Box className="modal-box">
                    {loading ? (
                        <div className="loading">
                            <CircularProgress />
                        </div>
                    ) : error ? (
                        <Typography className="error-message">{error}</Typography>
                    ) : userWallet ? (
                        <div>
                            <Typography className="modal-header">User Wallet</Typography>
                            <Typography className="typography-text">Wallet ID: {userWallet._id}</Typography>
                            <Typography className="typography-text">Sports Bookings: {userWallet.sports_bookings.length > 0 ? userWallet.sports_bookings.join(', ') : 'No bookings'}</Typography>
                            {/* Add more wallet details here */}
                        </div>
                    ) : (
                        <Typography>No wallet details found</Typography>
                    )}
                </Box>
            </Modal>
        </div>
    );
};

export default BookingDetails;
