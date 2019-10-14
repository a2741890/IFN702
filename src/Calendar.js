import React from 'react';
import { Table } from 'reactstrap';
import moment from 'moment';
import config from './Config';
import { getEvents } from './GraphService';
import { createEvents } from './GraphService';
import { getBookings } from './GraphService';
import * as dateFns from 'date-fns';
import { stringify } from 'querystring';
import { clone } from '@babel/types';




///////////////////Test////////////////


class Calendar extends React.Component {
  constructor(props){
    super(props);

  this.state = {
    currentWeek: new Date(),
    selectedDate: new Date(),
    selectedDates: [],
    disabled: [],
    booked: [],
    name:'',
    studentID: '',
    email: '',
    subject: 'IFN701',
    message: '',
    value: '',
    mouseDown: false
  };
  this.getEvent();
  this.createDisabled();
    // this.handleChange = this.handleChange.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
}

test = () =>{
  fetch("http://localhost:3001/authorization", { 
      method: 'get', 
      })
        .then(res => res.text())
        .then((result) => {
          return result;
        }
          ,
          (error) => {
            alert(error);
            console.log(error);
          }
        )
}



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
          <span>{dateFns.format(this.state.currentWeek, dateFormat)}</span>
        </div>
        <div className="col col-end" >
          <div className="icon" onClick={this.nextWeek}>
            chevron_right</div>
        </div>
      </div>
    );
  }

  renderDays() {
    //原本小寫的d都變成i
    const dateFormat = 'iiii';
    const days = [];
    let startDate = dateFns.startOfWeek(this.state.currentWeek);
    for (let i = 0; i < 8; i++) {
      //JSX syntax : push html element into array
      if(i === 0){
        days.push(
          <div className="col col-center">
            Day
          </div>
        )
      }
      else
      {
      days.push(
        <div className="col col-center" key={i}>
          {dateFns.format(dateFns.addDays(startDate, i-1), dateFormat)}<br />
          {dateFns.format(dateFns.addDays(startDate, i-1), "d")}
        </div>
      );
      }
    }
    return <div className="days row">{days}</div>;
  }

  renderCells() {
    const { currentWeek } = this.state;
    const weekStart = dateFns.startOfWeek(currentWeek);
    const weekEnd = dateFns.endOfWeek(weekStart);
    const startDate = dateFns.startOfWeek(weekStart);
    const endDate = dateFns.endOfWeek(weekEnd);
    const today = Date.now();

    const dateFormat = "HH:mm";
    const rows = [];
    let days = [];
    let sides = [];
    let day = dateFns.addHours(startDate, 9);
    let formattedDate = "";

    for(let j=9; j<18; j++)
    {
      sides.push(
        <div className="col cell">
          <span className="sideText">{j}:00</span>
        </div>
      )

    }
    
    //多少個小時
    const duration = 0.25;
    let counter = 0;
    //一天有9小時可以用
    while (counter < (9/duration)*7) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        formattedDate = dateFns.format(day, dateFormat);

        days.push(
          <div
            data-date={cloneDay}
            className={`col cell ${
              this.state.booked.find(el => el.getTime() === cloneDay.getTime())?"booked":
              this.handleDisabled(cloneDay)?"disabled":
              this.state.selectedDates.find(el => el.getTime() === cloneDay.getTime())?"selected":""
              }`}
              onMouseDown={(e)=>this.handleClickable(e)?this.handleMouseDown(e):""}
              onMouseOver={(e)=>this.handleClickable(e)?this.handleMouseOver(e):""}
              onMouseUp={(e)=>this.handleClickable(e)?this.handleMouseUp(e):""}
          >
            {/* <span className="number">{formattedDate}</span> */}
            <span className="bg">{formattedDate}</span>
          </div>
        );
        day = dateFns.addDays(day, 1);
        counter += 1;
        }
        day = dateFns.subDays(day, 7);
        day = dateFns.addMinutes(day, duration*60);
      }

      rows.push(
        <div className="row">
          {days}
        </div>
      );
      days = [];
    return <div className="wrap"><div className="left">{sides}</div>
    <div className="body">{rows}</div></div>;
  }



  renderForm() {
      return(
        <form className="form" onSubmit={e => {this.handleSubmit(e)}}>
        <ul className="form-style-1">
            <li>
              <label>Full Name <span className="required">*</span></label><input type="text" name="field1" className="field-divided" placeholder="First" />
             <input type="text" name="field2" className="field-divided" placeholder="Last" onChange= {e => {this.handleChange_Name(e)}}/>
             </li>
             
             <li>
                <label>Student ID <span className="required">*</span></label>
                <input type="text" name="field3" className="field-long" value={this.state.studentID}  onChange= {e => {this.handleChange_studentID(e)}}/>
            </li>

            <li>
                <label>Email <span className="required">*</span></label>
                <input type="email" name="field4" className="field-long" value={this.state.email} onChange={e => {this.handleChange_Email(e)} }/>
            </li>
            <li>
                <label>Subject</label>
                <select name="field5" value={this.state.subject} className="field-select" value={this.state.subject} onChange= {e =>{this.handleChange_Subject(e)}}>
                <option value="IFN701">IFN701</option>
                <option value="IFN702">IFN702</option>
                <option value="IFN660">IFN660</option>
                </select>
            </li>
            <li>
                <label>Your Message <span className="required">*</span></label>
                <textarea name="field6" id="field6" 
                className="field-long field-textarea"
                value={this.state.message} onChange={e => {this.handleChange_Message(e)} }
                >
                </textarea>
            </li>
            <li>
                <input type="submit" value="Submit" onClick={e => {this.postEvent()}} />
            </li>
        </ul>
        </form>
      );


    // return (
    //   <div className="formArea">
    //   <form className="form" onSubmit={e => {this.handleSubmit(e)}}>
    //     <li><label>
    //       Student ID
    //       <input type="text" value={this.state.studentID}  onChange= {e => {this.handleChange_studentID(e)} }/>
    //     </label></li>
    //     <li><label>
    //       Email
    //       <input type="text" value={this.state.email} onChange={e => {this.handleChange_Email(e)} }/>
    //     </label></li>
    //     <li><label className="noteInput">
    //       Note
    //       <textarea type="text" value={this.state.note} onChange={e => {this.handleChange_Note(e)} }/>
    //     </label></li>
    //     <input type="submit" value="Submit" onClick={e => {this.postEvent()} }/>
    //   </form>
    //   </div>
    // );
  }

  onTimeClick = day => {
    console.log(day);
    let selectedDates = this.state.selectedDates;
    if(selectedDates.find(el => el.getTime() === day.getTime()))
    {
      selectedDates = selectedDates.filter(
        (value, index, arr)=>{return value.getTime() !== day.getTime()}
        )
    }
    else
    {
      selectedDates.push(day);
    }
    this.setState({
      selectedDate: day,
      selectedDates: selectedDates
    });
  };
  
  handleMouseDown(e){
    let date = new Date(e.currentTarget.getAttribute('data-date'));
    this.onTimeClick(date);
    this.setState({mouseDown:true});
  }

  handleMouseOver(e){

    let date = new Date(e.currentTarget.getAttribute('data-date'));
    setTimeout(() => {
      if(this.state.mouseDown){this.onTimeClick(date)};
    }, 100); 
  }

  handleMouseUp(e){
 
    this.setState({mouseDown:false});
  }

  nextWeek = () => {
    this.setState({
      currentWeek: dateFns.addWeeks(this.state.currentWeek, 1)
    });
    
    window.requestAnimationFrame(this.getEvent.bind(this));
    window.requestAnimationFrame(this.createDisabled.bind(this));
  };

  prevWeek = () => {
    this.setState({
      currentWeek: dateFns.subWeeks(this.state.currentWeek, 1)
    });
    window.requestAnimationFrame(this.getEvent.bind(this));
    window.requestAnimationFrame(this.createDisabled.bind(this));
  };
  
  handleChange_Name(event) {
    this.setState({Name: event.target.value});
  }

  handleChange_studentID(event) {
    this.setState({studentID: event.target.value});
  }
  handleChange_Email(event) {
    this.setState({email: event.target.value});
  }
  handleChange_Subject(event) {
    this.setState({subject: event.target.value});
  }
  handleChange_Message(event) {
    this.setState({message: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.email);
    event.preventDefault();
  }

  handleDisabled(day){
    if(this.state.disabled.find(el => el.getTime() === day.getTime()) !== undefined)
    {
      return true;
    }
      return false;
  }

  createDisabled(){
    const { currentWeek } = this.state;
    const weekStart = dateFns.startOfWeek(currentWeek);
    const startDate = dateFns.startOfWeek(weekStart);
    const today = Date.now();
    let cloneDay = startDate;
    let disabled = this.state.disabled;
    while(dateFns.isBefore(dateFns.endOfDay(cloneDay), dateFns.endOfDay(today)))
    {
      if(this.state.booked.find(el => el.getTime() === cloneDay.getTime()) === undefined)
      {
        disabled.push(cloneDay);
      }
      cloneDay = dateFns.addMinutes(cloneDay, 15);
    }
    this.setState({
      disabled: disabled
    });
  }

  handleClickable(e){
    let day = new Date(e.target.getAttribute('data-date'));
    let clickable = this.state.disabled.find(el => el.getTime() === day.getTime());
    clickable = this.state.booked.find(el => el.getTime() === day.getTime());
  
    if(clickable===undefined){
      return true;
    }
      return false;
  }
  render() {
    return (
      <div className="calendar">
        {this.renderHeader()}
        {this.renderDays()}
        {this.renderCells()}
        {this.renderForm()}
      </div>
    );
  }
  getEvent =() =>{
    fetch("http://localhost:3001/getEvent",{
      method: 'GET',
      })
      .then(res => res.json())
      .then(
        (result) => {
          let booked = this.state.booked;
          result.value.forEach(element => {
            let day = new Date(element.start.dateTime);
            booked.push(day)
          });


          this.setState({
            booked: booked
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log(error);
        }
      )
  };
  
  postEvent = () =>{
    fetch("http://localhost:3001/createEvent",{
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "selectedDates" : this.state.selectedDates,
        "name": this.state.name,
        "studentID": this.state.studentID,
        "email": this.state.email,
        "subject": this.state.subject,
        "message": this.state.message
      })
      })
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          console.log(error);
        }
      )
  };

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