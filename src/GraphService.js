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





  // const client = getAuthenticatedClient(accessToken);
  
  // const events = await client
  //   .api('/v1.0/users/william@chen.onmicrosoft.com/events')
  //   .header('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJub25jZSI6InV1UDNVVmhDWWlYTkhPRV9tbFF3MkpHRFpvMVZHcnlpOXNNbXplWk1GbUEiLCJhbGciOiJSUzI1NiIsIng1dCI6ImllX3FXQ1hoWHh0MXpJRXN1NGM3YWNRVkduNCIsImtpZCI6ImllX3FXQ1hoWHh0MXpJRXN1NGM3YWNRVkduNCJ9.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC85ZTY1YjI5Yi0zYTM0LTRhNzAtOGQzOS0wZDE4Y2YyMjFhMjYvIiwiaWF0IjoxNTY2NTI5NzkwLCJuYmYiOjE1NjY1Mjk3OTAsImV4cCI6MTU2NjUzMzY5MCwiYWlvIjoiNDJGZ1lIaDlJYnl3NmZ5V1hVNnM4VGNyYWhieEF3QT0iLCJhcHBfZGlzcGxheW5hbWUiOiJNci5Cb29rZXIiLCJhcHBpZCI6IjU5ZDg2OTYwLTlmNjctNDk4MC04Mjk3LWU4ZjJmNGVkYjY4NSIsImFwcGlkYWNyIjoiMSIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzllNjViMjliLTNhMzQtNGE3MC04ZDM5LTBkMThjZjIyMWEyNi8iLCJvaWQiOiJlNWJmOTlkMC1hYjUwLTRiM2QtYmYyMy1mODg4YTJjYjcyZjQiLCJyb2xlcyI6WyJDYWxlbmRhcnMuUmVhZCJdLCJzdWIiOiJlNWJmOTlkMC1hYjUwLTRiM2QtYmYyMy1mODg4YTJjYjcyZjQiLCJ0aWQiOiI5ZTY1YjI5Yi0zYTM0LTRhNzAtOGQzOS0wZDE4Y2YyMjFhMjYiLCJ1dGkiOiJOQ0RFVEt5ZkkwT0lLRkt3UTdNV0FBIiwidmVyIjoiMS4wIiwieG1zX3RjZHQiOjE1NjU5MzY2NzB9.gPY2OKn2UXEphevIu4ok8ryM_eA1UABFhBTGMYXgAKTMq-CFLI_I7jxMZZ1NVYaUSpguUWzjHFYVFqBRs_uxOuOhGfCTJ8rEauANaYFSouRed18xrXWVkHflJC_SfQhuVGmNZdOT7j_RIM91wTiDwBjbQHoeQXOQO02h8lzH2vNI9Inz6ZZlQJXoKmWZxcr5n0UyS2jZMveQ3GTPABwurb1sL10UEVOagPkt0mgTHvF2eDoRZFmdhAo8HHXEdMfWvrxjzx-7TO9ZaQOcptWczEXBR3a56gwi2wgbZJfvEkPiBPyly7cM8R9fhkzafIxlwGkcOnbGSqlUyMSSb5agOg')
  //   .select('subject,organizer,start,end')
  //   .orderby('createdDateTime DESC')
  //   .get();




