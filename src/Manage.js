import React from 'react';
import { Table } from 'reactstrap';
import moment from 'moment';
import config from './Config';
import { UserAgentApplication } from 'msal';
import { getUserDetails } from './GraphService';
import { getEvent } from './GraphService';
import { postEvent } from './GraphService';
import { createEvents } from './GraphService';
import { getBookings } from './GraphService';
import * as dateFns from 'date-fns';
import { stringify } from 'querystring';
import { clone } from '@babel/types';
import { finished } from 'stream';


class Manage extends React.Component {
    constructor(props){
      super(props);
  

      this.userAgentApplication = new UserAgentApplication({
        auth: {
            clientId: config.appId
        },
        cache: {
            cacheLocation: "localStorage",
            storeAuthStateInCookie: true
        }
    });
    

    this.state = {
      startHour:0,
      finisHour:0,
      values: [{ value: null }],
      user: this.userAgentApplication.getAccount(),
      error: null
    };
    
    }
  

    handleChange_StartHour(event) {
      this.setState({startHour: event.target.value});
    }
    handleChange_FinishHour(event) {
      this.setState({finisHour: event.target.value});
    }
   
    handleChange(i, event) {
      let values = this.state.values;
      values[i].value = event.target.value;
      this.setState({values: values});
    }
  
    handleAdd() {
      let values = this.state.values;
      values.push({ value: null });
      this.setState({values: values});
    }
  
    handleRemove(i) {
      let values = this.state.values;
      values.splice(i, 1);
      this.setState({values: values});
    }

    handleSubmit(event) {
      alert('Configuration was submitted!');
      console.log(this.state.values);
      event.preventDefault();
    }

    setSelectedOption() {
      fetch('http://localhost:3000/configuration',{
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "startHour" : this.state.startHour,
          "finishHour": this.state.finisHour,
          "values": JSON.stringify(this.state.values),
          "userName": this.state.user.name
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
    }

    renderForm() {
      console.log(this.state.user);
      let startHour=[];
      let finisHour=[];
      for(let i=0; i<25; i++)
      {
        startHour.push(
            <option value={i}>{i}:00</option>
        )
        finisHour.push(
            <option value={i}>{i}:00</option>
        )
      }
        return(
          <form className="form" onSubmit={e => {this.handleSubmit(e)}}>
          <ul className="form-style-1">
              <li>
                  <label>Start Time</label>
                  <select name="field1" value={this.state.startHour} className="field-select" value={this.state.startHour} onChange= {e =>{this.handleChange_StartHour(e)}}>
                  {startHour}
                  </select>
              </li>
              <li>
                  <label>Finished Time</label>
                  <select name="field2" value={this.state.finisHour} className="field-select" value={this.state.finisHour} onChange= {e =>{this.handleChange_FinishHour(e)}}>
                  {finisHour}
                  </select>
              </li>
              <li>
              <label>Subject Select List</label>
              <button type="button" onClick={() => {this.handleAdd()}}>
                  +
              </button>
                {this.state.values.map((value, idx) => {
                  return (
                    <div key={`${value}-${idx}`}>
                      <span>{idx+1}</span>
                      <input
                        className="field-select"
                        type="text"
                        placeholder="Enter text"
                        value={value.value || ""}
                        onChange={e => {this.handleChange(idx, e)}}
                      />
                      <button type="button" onClick={() => {this.handleRemove(idx)}}>
                        X
                      </button>
                    </div>
                  );
                })}
              </li>
              <li>
                  <input type="submit" value="Submit" onClick={() => {this.setSelectedOption()}} />
              </li>
          </ul>
          </form>
        );
    }

    
    
    render() {
        return (
          <div className="calendar">
            {this.renderForm()}
          </div>
        );
      }

}   
export default Manage;