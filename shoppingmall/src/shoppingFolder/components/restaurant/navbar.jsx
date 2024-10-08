import React from 'react';
import { Navbar } from 'react-bootstrap';

export default props => {
  return (
    <div>
      <Navbar bg="light" variant="light" expand="md">
        <Navbar.Brand
          className="nav-brand"
          onClick={() => {
            props.setPage(0);
          }}
        >
          Food Cabin
        </Navbar.Brand>
      </Navbar>
    </div>
  );
};