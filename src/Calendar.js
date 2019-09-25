import React from 'react';
import { Table } from 'reactstrap';
import moment from 'moment';
import config from './Config';
import { getEvents } from './GraphService';
import { createEvents } from './GraphService';
import { getBookings } from './GraphService';
import * as dateFns from 'date-fns';
import { stringify } from 'querystring';




///////////////////Test////////////////


class Calendar extends React.Component {
  state = {
    currentWeek: new Date(),
    selectedDate: new Date(),
    selectedDates: []
  };

  renderHeader() {
    const dateFormat = "MMMM yyyy";
  return (
    <div className="header row flex-middle">
      <div className="col col-start">
        <div className="icon" onClick={this.prevWeek}>
          chevron_left
        </div>
      </div>
      <div className="col col-center">
        <span>
          {dateFns.format(this.state.currentWeek, dateFormat)}
        </span>
      </div>
      <div className="col col-end" onClick={this.nextWeek}>
        <div className="icon">chevron_right</div>
      </div>
    </div>
  );
  }

  renderDays() {
    //原本小寫的d都變成i
    const dateFormat = 'iiii';
    const days = [];
    let startDate = dateFns.startOfWeek(this.state.currentWeek);
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
    const { currentWeek, selectedDate } = this.state;
    const weekStart = dateFns.startOfWeek(currentWeek);
    const weekEnd = dateFns.endOfWeek(weekStart);
    const startDate = dateFns.startOfWeek(weekStart);
    const endDate = dateFns.endOfWeek(weekEnd);

    const dateFormat = "d";
    const rows = [];

    let days = [];
    let day = dateFns.addHours(startDate, 9);
    let formattedDate = "";

    let timeSlots = [];
    const timeFormat = "HH:mm";
    

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        //Create time slots
        let formattedDay = "";
        timeSlots = [];
        for (let j = 0; j < 9; j++) {
          const cloneDay = day;
          
          formattedDay = dateFns.format(day, timeFormat);
          timeSlots.push(
            <div className={` ${
              this.state.selectedDates.find(el => el.getTime() === cloneDay.getTime()) ? "selected":""} `}
              key={day}
             onClick={(e) => {e.stopPropagation(); this.onTimeClick(cloneDay);}}
             >
               <tr>{formattedDay}</tr></div>
          );
          day = dateFns.addHours(day, 1);
        }
        day = dateFns.subHours(day, 9);
        
        //Create days of the week
        formattedDate = dateFns.format(day, dateFormat);
        days.push(
          <div
            className={`col cell `}
          >
            {/* <span className="number">{formattedDate}</span>
            <span className="bg">{formattedDate}</span> */}
            <table>
              <tr>
              <th>{formattedDate}</th>
              </tr>
              {timeSlots}
            </table>
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


  onTimeClick = day => {
    console.log(day+"Time");
    let selectedDates = this.state.selectedDates;
    console.log(selectedDates);
    selectedDates.push(day);
    this.setState({
      selectedDate: day,
      selectedDates: selectedDates
    });
  };

  nextWeek = () => {
    this.setState({
      currentWeek: dateFns.addWeeks(this.state.currentWeek, 1)
    });
  };
  prevWeek = () => {
    this.setState({
      currentWeek: dateFns.subWeeks(this.state.currentWeek, 1)
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