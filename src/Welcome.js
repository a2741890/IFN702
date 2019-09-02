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
      </div>
    );
  }

  // Not authenticated, present a sign in button
  return <Button color="primary" onClick={props.authButtonMethod}>Booking!</Button>;
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