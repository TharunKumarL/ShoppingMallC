export const fetchDeals = () => async (dispatch) => {
    dispatch({ type: 'FETCH_DEALS_REQUEST' });
  
    try {
      const response = await fetch('http://localhost:5000/api/deals');
      const data = await response.json();
      dispatch({ type: 'FETCH_DEALS_SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'FETCH_DEALS_FAILURE', payload: error.message });
    }
  };
  