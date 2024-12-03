import "../css/UserWallet.css";

const UserWallet = () => {
    return (
        <div>
            <div className="user-wallet-container">
                <h2>Hello Anudeep, how are you?</h2>
                <div className="user-wallet-box">
                    <div className="wallet-details">
                        <p className="wallet-details-heading">Your details</p>
                        <p className="wallet-amount">Wallet amount: ₹1000</p>
                    </div>
                    <hr />
                    <h3>Name: Anudeep</h3>
                    <h3>Registered email: anudeep@example.com</h3>
                </div>


                <div className="user-bookings">
                     Bookings
                    <hr />
                </div>
            </div>
        </div>
    );
}

export default UserWallet;

