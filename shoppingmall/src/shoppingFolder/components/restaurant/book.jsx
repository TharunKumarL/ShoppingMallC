import React, { useState, useEffect } from 'react';
import { Row, Col, Dropdown, Button, FormControl } from 'react-bootstrap';
import Table from "./table";

export default props => {
  const [totalTables, setTotalTables] = useState([]);
  const [selection, setSelection] = useState({
    table: {
      name: null,
      id: null
    },
    date: new Date(),
    time: null,
    location: "Any Location",
    size: 0
  });

  const [booking, setBooking] = useState({
    name: "",
    phone: "",
    email: ""
  });

  const [locations] = useState(["Any Location", "Patio", "Inside", "Bar"]);
  const [times] = useState([
    "9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM"
  ]);

  const [reservationError, setReservationError] = useState(false);

  const getDate = _ => {
    const months = [
      "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ];
    const date = `${months[selection.date.getMonth()]} ${selection.date.getDate()} ${selection.date.getFullYear()}`;
    let time = selection.time.slice(0, -2);
    time = selection.time > 12 ? time + 12 + ":00" : time + ":00";
    const datetime = new Date(`${date} ${time}`);
    return datetime;
  };

  const getEmptyTables = _ => {
    return totalTables.filter(table => table.isAvailable).length;
  };

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const datetime = getDate();
        const res = await fetch("http://localhost:5000/availability", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ date: datetime })
        });

        if (!res.ok) {
          console.error(`Server returned an error: ${res.status}`);
        } else {
          const data = await res.json();
          const availableTables = data.tables.filter(
            table =>
              (selection.size > 0 ? table.capacity >= selection.size : true) &&
              (selection.location !== "Any Location"
                ? table.location === selection.location
                : true)
          );
          setTotalTables(availableTables);
        }
      } catch (error) {
        console.error("Failed to fetch availability:", error);
      }
    };

    if (selection.time && selection.date) {
      fetchTables();
    }
  }, [selection.time, selection.date, selection.size, selection.location]);

  const reserve = async _ => {
    if (
      booking.name.length === 0 ||
      booking.phone.length === 0 ||
      booking.email.length === 0
    ) {
      console.log("Incomplete Details");
      setReservationError(true);
    } else {
      const datetime = getDate();
      let res = await fetch("http://localhost:5000/reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...booking,
          date: datetime,
          table: selection.table.id
        })
      });
      res = await res.text();
      console.log("Reserved: " + res);
      props.setPage(2);
    }
  };

  const selectTable = (table_name, table_id) => {
    setSelection({
      ...selection,
      table: {
        name: table_name,
        id: table_id
      }
    });
  };

  const getSizes = _ => {
    return Array.from({ length: 7 }, (_, i) => i + 1).map(size => (
      <Dropdown.Item
        key={size}
        className="booking-dropdown-item"
        onClick={() => setSelection({ ...selection, size })}
      >
        {size}
      </Dropdown.Item>
    ));
  };

  const getLocations = _ => {
    return locations.map(loc => (
      <Dropdown.Item
        key={loc}
        className="booking-dropdown-item"
        onClick={() => setSelection({ ...selection, location: loc })}
      >
        {loc}
      </Dropdown.Item>
    ));
  };

  const getTimes = _ => {
    return times.map(time => (
      <Dropdown.Item
        key={time}
        className="booking-dropdown-item"
        onClick={() => setSelection({ ...selection, time })}
      >
        {time}
      </Dropdown.Item>
    ));
  };

  const getTables = _ => {
    return totalTables.map(table => (
      <Table
        key={table._id}
        id={table._id}
        chairs={table.capacity}
        name={table.name}
        empty={table.isAvailable}
        selectTable={selectTable}
      />
    ));
  };

  return (
    <div>
      <Row className="text-center align-items-center pizza-cta">
        <Col>
          <p className="looking-for-pizza">
            {!selection.table.id ? "Book a Table" : "Confirm Reservation"}
            <i className={!selection.table.id ? "fas fa-chair pizza-slice" : "fas fa-clipboard-check pizza-slice"}></i>
          </p>
          <p className="selected-table">
            {selection.table.id ? `You are booking table ${selection.table.name}` : null}
          </p>
          {reservationError ? <p className="reservation-error">* Please fill out all of the details.</p> : null}
        </Col>
      </Row>

      {!selection.table.id ? (
        <div id="reservation-stuff">
          <Row className="text-center align-items-center">
            <Col xs="12" sm="3">
              <FormControl
                type="date"
                required
                className="booking-dropdown"
                value={selection.date.toISOString().split("T")[0]}
                onChange={e => setSelection({ ...selection, date: new Date(e.target.value) })}
              />
            </Col>
            <Col xs="12" sm="3">
              <Dropdown>
                <Dropdown.Toggle variant="primary" className="booking-dropdown">
                  {selection.time || "Select a Time"}
                </Dropdown.Toggle>
                <Dropdown.Menu>{getTimes()}</Dropdown.Menu>
              </Dropdown>
            </Col>
            <Col xs="12" sm="3">
              <Dropdown>
                <Dropdown.Toggle variant="primary" className="booking-dropdown">
                  {selection.location}
                </Dropdown.Toggle>
                <Dropdown.Menu>{getLocations()}</Dropdown.Menu>
              </Dropdown>
            </Col>
            <Col xs="12" sm="3">
              <Dropdown>
                <Dropdown.Toggle variant="primary" className="booking-dropdown">
                  {selection.size === 0 ? "Select a Party Size" : selection.size.toString()}
                </Dropdown.Toggle>
                <Dropdown.Menu>{getSizes()}</Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
          <Row className="tables-display">
            <Col>
              {getEmptyTables() > 0 && <p className="available-tables">{getEmptyTables()} available</p>}
              {selection.date && selection.time ? (
                getEmptyTables() > 0 ? (
                  <div>
                    <div className="table-key">
                      <span className="empty-table"></span> &nbsp; Available
                      &nbsp;&nbsp;
                      <span className="full-table"></span> &nbsp; Unavailable
                    </div>
                    <Row>{getTables()}</Row>
                  </div>
                ) : (
                  <p className="table-display-message">No Available Tables</p>
                )
              ) : (
                <p className="table-display-message">Please select a date and time for your reservation.</p>
              )}
            </Col>
          </Row>
        </div>
      ) : (
        <div id="confirm-reservation-stuff">
          <Row className="text-center justify-content-center reservation-details-container">
            <Col xs="12" sm="3" className="reservation-details">
              <FormControl
                type="text"
                placeholder="Name"
                className="reservation-FormControl"
                value={booking.name}
                onChange={e => setBooking({ ...booking, name: e.target.value })}
              />
            </Col>
            <Col xs="12" sm="3" className="reservation-details">
              <FormControl
                type="text"
                placeholder="Phone Number"
                className="reservation-FormControl"
                value={booking.phone}
                onChange={e => setBooking({ ...booking, phone: e.target.value })}
              />
            </Col>
            <Col xs="12" sm="3" className="reservation-details">
              <FormControl
                type="email"
                placeholder="Email"
                className="reservation-FormControl"
                value={booking.email}
                onChange={e => setBooking({ ...booking, email: e.target.value })}
              />
            </Col>
          </Row>
          <Row className="text-center">
            <Col>
              <Button
                variant="primary"
                className="confirm-reservation-button"
                onClick={reserve}
              >
                Confirm Reservation
              </Button>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
};
