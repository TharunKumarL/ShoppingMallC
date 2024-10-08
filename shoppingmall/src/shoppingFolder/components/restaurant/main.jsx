import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import './Page.css'

export default props => {
  return (
    <div>
      <Row className="text-center align-items-center pizza-cta">
        <Col>
          <p className="looking-for-pizza">
            If you're looking for a great food experience.
          </p>
          <Button
            variant="primary"
            className="book-table-btn"
            onClick={() => {
              props.setPage(1);
            }}
          >
            Book Table
          </Button>
        </Col>
      </Row>
      <Row className="text-center big-img-container">
        <Col>
          <img
            src={require("../images/cafe.jpg")}
            alt="cafe"
            className="big-img"
          />
        </Col>
      </Row>
    </div>
  );
};
