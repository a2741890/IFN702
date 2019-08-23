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
  const client = getAuthenticatedClient(accessToken);
  
  const events = await client
    .api('/v1.0/users/william@chen.onmicrosoft.com/events')
    .headers({"Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJub25jZSI6Im9uWGtSVEttcEl1NDVFNEdxOXV6MmhRb2FzWXgza0xCWmhEQXMyeFhYZ1kiLCJhbGciOiJSUzI1NiIsIng1dCI6ImllX3FXQ1hoWHh0MXpJRXN1NGM3YWNRVkduNCIsImtpZCI6ImllX3FXQ1hoWHh0MXpJRXN1NGM3YWNRVkduNCJ9.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC85ZTY1YjI5Yi0zYTM0LTRhNzAtOGQzOS0wZDE4Y2YyMjFhMjYvIiwiaWF0IjoxNTY2NTMwMTUwLCJuYmYiOjE1NjY1MzAxNTAsImV4cCI6MTU2NjUzNDA1MCwiYWlvIjoiNDJGZ1lOZzMzMk5SMnZUNTgzYXVZNWxsTit0bk1BQT0iLCJhcHBfZGlzcGxheW5hbWUiOiJNci5Cb29rZXIiLCJhcHBpZCI6IjU5ZDg2OTYwLTlmNjctNDk4MC04Mjk3LWU4ZjJmNGVkYjY4NSIsImFwcGlkYWNyIjoiMSIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzllNjViMjliLTNhMzQtNGE3MC04ZDM5LTBkMThjZjIyMWEyNi8iLCJvaWQiOiJlNWJmOTlkMC1hYjUwLTRiM2QtYmYyMy1mODg4YTJjYjcyZjQiLCJyb2xlcyI6WyJDYWxlbmRhcnMuUmVhZCJdLCJzdWIiOiJlNWJmOTlkMC1hYjUwLTRiM2QtYmYyMy1mODg4YTJjYjcyZjQiLCJ0aWQiOiI5ZTY1YjI5Yi0zYTM0LTRhNzAtOGQzOS0wZDE4Y2YyMjFhMjYiLCJ1dGkiOiI4bFNfYWU2VGNVR1VDSk5RVnU4V0FBIiwidmVyIjoiMS4wIiwieG1zX3RjZHQiOjE1NjU5MzY2NzB9.NIS19dJzFNx1IcFkt175brG0zer_dxxBAKvscIl6C-nuJoky7zJYUCENpK1gqiDt-S9miYNkzvKM4wiOHN-ApPJFzB1xd4Cv4lsxVnqVh8ATBemF9QdIFNe1M4nrU_u7mwyO0hw9Ep8dHwuHOYj_iatC54zd56CmqrhoWyyvE_5uahpuVTOkiCIqHE5fAX5GVjKUJLh0ESaXA6npUH_5Mf4XaCpNdR6cAIMhqsEzivpGQXJSxekgyv7Faodd46NNIwm8ksBQs-faJlShx2bOVAqrscedCv0zI53ly6AfLzjlrmFqKVq6Gb02QgM5OWO3N0Ae6espJ6KG38_bu1EoiQ"})
    .select('subject,organizer,start,end')
    .orderby('createdDateTime DESC')
    .get();
return events;

}

export async function createEvents(accessToken) {
  const client = getAuthenticatedClient(accessToken);
 
  const events = await client
    .api('/me/events')
    .post({
      Subject: "Plan summer company picnic"
      });

  return events;
}

export async function createBooking(accessToken) {
  const client = getAuthenticatedClient(accessToken);
 
  const events = await client
    .api('/bookingBusinesses')
    .version('beta')
	  .get();
  console.log(events);
  return events;
}

// export async function getClientAccessToken() {
//   let formData = new FormData();
//   formData.append('client_id', '59d86960-9f67-4980-8297-e8f2f4edb685');
//   formData.append('client_secret', 'yu/gwiqNAit-Pi_i/bK6n6zIOhrsAl69');
//   formData.append('resource', 'https://graph.microsoft.com');
//   formData.append('grant_type', 'client_credentials',);
//   return fetch('https://login.microsoftonline.com/9e65b29b-3a34-4a70-8d39-0d18cf221a26/oauth2/token',
//   {
//     method: 'POST',
//     headers: {
//       'Content-Type' : 'application/x-www-form-urlencoded',
//     },
//     body: JSON.stringify({
//     client_id : '59d86960-9f67-4980-8297-e8f2f4edb685',
//     client_secret: 'yu/gwiqNAit-Pi_i/bK6n6zIOhrsAl69',
//     resource : 'https://graph.microsoft.com',
//     grant_type : 'client_credentials',
//     }),
//   });
// }
// getClientAccessToken();

