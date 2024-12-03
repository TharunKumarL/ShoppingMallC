import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchShops, toggleShopDetails } from '../../../../shoppingmall/src/redux/actions/shopActions';
import '../components/css/Shoplist.css';
import mall from './images/background3.png';

function ShopsList() {
  const dispatch = useDispatch();
  const { shops, expandedShopId, loading, error } = useSelector(
    (state) => state.shops
  );

  useEffect(() => {
    dispatch(fetchShops());
  }, [dispatch]);

  const handleDetailsClick = (shopId) => {
    dispatch(toggleShopDetails(shopId));
  };

  if (loading) {
    return <div>Loading shops...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="shops-list">
      <h1>Stores & Restaurants</h1>
      {shops.map((shop) => (
        <div key={shop._id} className="shop-item">
          <img src={mall} alt={shop.name} className="shop-image" />
          <div className="shop-info">
            <h2>{shop.name}</h2>
            <p>{shop.location}</p>
            {shop.contact && <p>{shop.contact}</p>}
            <button onClick={() => handleDetailsClick(shop._id)}>Details</button>
          </div>
          {expandedShopId === shop._id && (
            <div className="shop-details">
              <p>
                {shop.name} is located in {shop.location}. You can contact at{' '}
                {shop.contact}. Please Visit!
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ShopsList;
