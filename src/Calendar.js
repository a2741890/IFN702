import React from 'react';
import { Table } from 'reactstrap';
import moment from 'moment';
import config from './Config';
import { getEvents } from './GraphService';
import { createEvents } from './GraphService';
import { getBookings } from './GraphService';
import * as dateFns from 'date-fns';




///////////////////Test////////////////


class Calendar extends React.Component {
  state = {
    currentMonth: new Date(),
    selectedDate: new Date()
  };

  renderHeader() {
    const dateFormat = "MMMM yyyy";
  return (
    <div className="header row flex-middle">
      <div className="col col-start">
        <div className="icon" onClick={this.prevMonth}>
          chevron_left
        </div>
      </div>
      <div className="col col-center">
        <span>
          {dateFns.format(this.state.currentMonth, dateFormat)}
        </span>
      </div>
      <div className="col col-end" onClick={this.nextMonth}>
        <div className="icon">chevron_right</div>
      </div>
    </div>
  );
  }

  renderDays() {
    //原本小寫的d都變成i
    const dateFormat = 'iiii';
    const days = [];
    let startDate = dateFns.startOfWeek(this.state.currentMonth);
    for (let i = 0; i < 7; i++) {
      //JSX syntax : push html element into array
      days.push(
        <div className="col col-center" key={i}>
          {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
        </div>
      );
    }
    return <div className="days row">{days}</div>;
  }

  renderCells() {
    const { currentMonth, selectedDate } = this.state;
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = dateFns.format(day, dateFormat);
        const cloneDay = formattedDate;
        days.push(
          <div
            className={`col cell ${
              !dateFns.isSameMonth(day, monthStart)
                ? "disabled"
                : dateFns.isSameDay(day, selectedDate) ? "selected" : ""
            }`}
            key={day}
            onClick={() => this.onDateClick(dateFns.parse(cloneDay, dateFormat, new Date()))}
            
          >
            <span className="number">{formattedDate}</span>
            <span className="bg">{formattedDate}</span>
            <button className="button">Hi!</button>
          </div>
        );
        day = dateFns.addDays(day, 1);
      }
      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  }

  onDateClick = day => {
    console.log(day);
    this.setState({
      selectedDate: day
    });
  };

  nextMonth = () => {
    this.setState({
      currentMonth: dateFns.addMonths(this.state.currentMonth, 1)
    });
  };
  prevMonth = () => {
    this.setState({
      currentMonth: dateFns.subMonths(this.state.currentMonth, 1)
    });
  };
  
  render() {
    return (
      <div className="calendar">
        {this.renderHeader()}
        {this.renderDays()}
        {this.renderCells()}
      </div>
    );
  }

}

export default Calendar;








///////////////////////////////
// function formatDateTime(dateTime) {
//   return moment.utc(dateTime).local().format('M/D/YY h:mm A');
// }
// export default class Calendar extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       events: []
//     };
//   }

//   async componentDidMount() {
//     try {
//       var accessToken = this.props.token;
//       // Get the user's events
//       var events = await getEvents(accessToken);
//       // Update the array of events in state
//       this.setState({events: events.value});

//       // Create the user's events
//       // var events2 = await createEvents(accessToken);
//       // var events3 = await createBooking(accessToken);
//     }
//     catch(err) {
//       this.props.showError('ERROR', JSON.stringify(err));
//     }
//   }

//   render() {
//     return (
//       <div>
//         <h1>Calendar</h1>
//         <Table>
//           <thead>
//             <tr>
//               <th scope="col">Organizer</th>
//               <th scope="col">Subject</th>
//               <th scope="col">Start</th>
//               <th scope="col">End</th>
//             </tr>
//           </thead>
//           <tbody>
//             {this.state.events.map(
//               function(event){
//                 return(
//                   <tr key={event.id}>
//                     <td>{event.organizer.emailAddress.name}</td>
//                     <td>{event.subject}</td>
//                     <td>{formatDateTime(event.start.dateTime)}</td>
//                     <td>{formatDateTime(event.end.dateTime)}</td>
//                   </tr>
//                 );
//               })}
//           </tbody>
//         </Table>
//       </div>
//     );
//   }
// }