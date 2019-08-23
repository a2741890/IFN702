import React from 'react';
import { Table } from 'reactstrap';
import moment from 'moment';
import config from './Config';
import { getEvents } from './GraphService';
import { createEvents } from './GraphService';
import { createBooking } from './GraphService';
import {getClientAccessToken} from './GraphService';

function formatDateTime(dateTime) {
  return moment.utc(dateTime).local().format('M/D/YY h:mm A');
}

export default class Calendar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      events: []
    };
  }

  async componentDidMount() {
    try {
      // Get the user's access token
      // var accessToken = await window.msal.acquireTokenSilent({
      //   scopes: config.scopes
      // });
      // Get the user's events
      var events = await getEvents("eyJ0eXAiOiJKV1QiLCJub25jZSI6IlVTdWNXRlZiMEIzN29VYk0xX20xVThjaGVVNExJbTRKWDYxU1NqNzRqQk0iLCJhbGciOiJSUzI1NiIsIng1dCI6ImllX3FXQ1hoWHh0MXpJRXN1NGM3YWNRVkduNCIsImtpZCI6ImllX3FXQ1hoWHh0MXpJRXN1NGM3YWNRVkduNCJ9.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC85ZTY1YjI5Yi0zYTM0LTRhNzAtOGQzOS0wZDE4Y2YyMjFhMjYvIiwiaWF0IjoxNTY2NTI3NzEyLCJuYmYiOjE1NjY1Mjc3MTIsImV4cCI6MTU2NjUzMTYxMiwiYWlvIjoiNDJGZ1lEZ2VtcGQyd1d1SFMrZUZXelcrNnk5cEF3QT0iLCJhcHBfZGlzcGxheW5hbWUiOiJNci5Cb29rZXIiLCJhcHBpZCI6IjU5ZDg2OTYwLTlmNjctNDk4MC04Mjk3LWU4ZjJmNGVkYjY4NSIsImFwcGlkYWNyIjoiMSIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzllNjViMjliLTNhMzQtNGE3MC04ZDM5LTBkMThjZjIyMWEyNi8iLCJvaWQiOiJlNWJmOTlkMC1hYjUwLTRiM2QtYmYyMy1mODg4YTJjYjcyZjQiLCJyb2xlcyI6WyJDYWxlbmRhcnMuUmVhZCJdLCJzdWIiOiJlNWJmOTlkMC1hYjUwLTRiM2QtYmYyMy1mODg4YTJjYjcyZjQiLCJ0aWQiOiI5ZTY1YjI5Yi0zYTM0LTRhNzAtOGQzOS0wZDE4Y2YyMjFhMjYiLCJ1dGkiOiJSZEZlNkwzNDdreWxfUzRGdlhsSkFBIiwidmVyIjoiMS4wIiwieG1zX3RjZHQiOjE1NjU5MzY2NzB9.myoNRsmHsdy-t9F--UXE164yiTeBej5-h-LeWVz_kaL6tX-AP4XhxNO2wdfcQhUH4BezDfol_dWqO3fdUY5wF1R-5ZAYxCWjoTRSDjGApJBtuwGcHM_8WNCSZ_T1RrOYbs29AXqj_oUl7Rtjhw1gX-3o5BsiZaqxkk6S4RInkBVHH4dQaYFeCnHYLE5QASlyQnGT8mwY4W-ViEwwXwOKKp1EMhSwio-PvcxEmD63lcypTdMlZTrSS85d1HBAY-hQPgB08GlQ6ThlfFqZ9ijtLDSuY8wnLvAe8pfL2UUjZvzOHwSzMkI4S65UZrjGNMExkCHVZoNSqGK5xoMx4GEewA");
      // Update the array of events in state
      this.setState({events: events.value});
      // Create the user's events
      // var events2 = await createEvents(accessToken);
      // var events3 = await createBooking(accessToken);
    }
    catch(err) {
      this.props.showError('ERROR', JSON.stringify(err));
    }
  }

  render() {
    return (
      <div>
        <h1>Calendar</h1>
        <Table>
          <thead>
            <tr>
              <th scope="col">Organizer</th>
              <th scope="col">Subject</th>
              <th scope="col">Start</th>
              <th scope="col">End</th>
            </tr>
          </thead>
          <tbody>
            {this.state.events.map(
              function(event){
                return(
                  <tr key={event.id}>
                    <td>{event.organizer.emailAddress.name}</td>
                    <td>{event.subject}</td>
                    <td>{formatDateTime(event.start.dateTime)}</td>
                    <td>{formatDateTime(event.end.dateTime)}</td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </div>
    );
  }
}