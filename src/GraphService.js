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
    .api('/me/events')
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

export async function getClientAccessToken() {
  // let formData = new FormData();
  // formData.append('client_id', '59d86960-9f67-4980-8297-e8f2f4edb685');
  // formData.append('client_secret', 'yu/gwiqNAit-Pi_i/bK6n6zIOhrsAl69');
  // formData.append('resource', 'https://graph.microsoft.com');
  // formData.append('grant_type', 'client_credentials',);
  // return fetch('https://login.microsoftonline.com/9e65b29b-3a34-4a70-8d39-0d18cf221a26/oauth2/token',
  // {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type' : 'application/x-www-form-urlencoded',
  //   },
  //   body: JSON.stringify({
  //   client_id : '59d86960-9f67-4980-8297-e8f2f4edb685',
  //   client_secret: 'yu/gwiqNAit-Pi_i/bK6n6zIOhrsAl69',
  //   resource : 'https://graph.microsoft.com/Bookings',
  //   grant_type : 'client_credentials',
  //   }),
  // });
  
}

getClientAccessToken();
