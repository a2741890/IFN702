import React from 'react';
import {
  Button,
  Jumbotron } from 'reactstrap';

function WelcomeContent(props) {
  // If authenticated, greet the user
  if (props.isAuthenticated) {
    return (
      <div>
        <h4>Welcome To Booking Web!</h4>
        <p>Use the navigation bar at the top of the page to get started.</p>
        <Button color="primary"  href="https://login.microsoftonline.com/9e65b29b-3a34-4a70-8d39-0d18cf221a26/oauth2/v2.0/authorize?client_id=59d86960-9f67-4980-8297-e8f2f4edb685&response_type=code&redirect_uri=http://localhost:3000/&response_mode=query&scope=offline_access%20user.read%20mail.read&state=12345" /*onClick={props.authButtonMethod}*/
        >
        Register!
        </Button>
      </div>
    );
  }

  // Not authenticated, present a sign in button
  return <p><b>Please logging in to manage your booking!</b></p>;
}

export default class Welcome extends React.Component {

  render() {
    return (
      <Jumbotron>
        <h1>Mr.Booker</h1>
        <p className="lead">This sample app shows how to use the Microsoft Graph API to access Outlook and OneDrive data from React</p>
        <WelcomeContent
          isAuthenticated={this.props.isAuthenticated}
          token={this.props.token}
          authButtonMethod={this.props.authButtonMethod} />
      </Jumbotron>
    );
  }
}