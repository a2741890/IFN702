import React from 'react';
import { Table } from 'reactstrap';
import moment from 'moment';
import config from './Config';
import { getEvents } from './GraphService';
import { createEvents } from './GraphService';
import { getBookings } from './GraphService';
function formatDateTime(dateTime) {
  return moment.utc(dateTime).local().format('M/D/YY h:mm A');
}
///////////////////Test////////////////
// import dateFns from "date-fns";

// class Calendar extends React.Component {
//   render() {
//     return (
//       <div>
//         <div>Header</div>
//         <div>Days</div>
//         <div>Cells</div>
//       </div>
//     );
//   }
// }

// export default Calendar;








///////////////////////////////
export default class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: []
    };
  }

  async componentDidMount() {
    try {
      var accessToken = this.props.token;
      // Get the user's events
      var events = await getEvents(accessToken);
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