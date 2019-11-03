import { async } from 'q';

var graph = require('@microsoft/microsoft-graph-client');

function getAuthenticatedClient(accessToken) {
  // Initialize Graph client
  const client = graph.Client.init({
    // Use the provided access token to authenticate
    // requests
    authProvider: (done) => {
      done(null, accessToken.accessToken);
    }
  });

  return client;
}

export async function getUserDetails(accessToken) {
  const client = getAuthenticatedClient(accessToken);

  const user = await client.api('/me').get();
  return user;
}


export async function getEvent(that,id) {

  fetch(`http://localhost:3000/getEvent/${id}`,{
    method: 'GET',
    })
    .then(res => res.json())
    .then(
      (result) => {
        let booked = that.state.booked;
        result.value.forEach(element => {
          let day = new Date(element.start.dateTime);
          booked.push(day)
        });
        that.setState({
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

export async function postEvent(that,id){
  fetch(`http://localhost:3000/createEvent/${id}`,{
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "selectedDates" : that.state.selectedDates,
      "name": that.state.name,
      "studentID": that.state.studentID,
      "email": that.state.email,
      "subject": that.state.subject,
      "message": that.state.message
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






export async function getEvents(accessToken) {
  
  return fetch("https://graph.microsoft.com/v1.0/users/william@chen.onmicrosoft.com/events", { 
    method: 'get', 
    headers: new Headers({
      'Authorization': `Bearer ${accessToken}`, 
      'Content-Type': 'application/x-www-form-urlencoded'
      })})
      .then(res => res.json())
      .then(
        (result) => {
          return result;
          },
        (error) => {
          console.log(error);
        }
      )
}






