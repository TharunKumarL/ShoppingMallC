export const fetchShops = () => async (dispatch) => {
    dispatch({ type: 'FETCH_SHOPS_REQUEST' });
  
    try {
      const response = await fetch('http://localhost:5000/api/shops');
      const data = await response.json();
      dispatch({ type: 'FETCH_SHOPS_SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'FETCH_SHOPS_FAILURE', payload: error.message });
    }
  };
  
  export const toggleShopDetails = (shopId) => ({
    type: 'TOGGLE_SHOP_DETAILS',
    payload: shopId,
  });
  