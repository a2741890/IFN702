import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container } from 'reactstrap';
import { UserAgentApplication } from 'msal';
import NavBar from './NavBar';
import ErrorMessage from './ErrorMessage';
import Welcome from './Welcome';
import config from './Config';
import { getUserDetails } from './GraphService';
import 'bootstrap/dist/css/bootstrap.css';
import Calendar from './Calendar';

class App extends Component {
  constructor(props) {
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

    var user = this.userAgentApplication.getAccount();

    this.state = {
      isAuthenticated: (user !== null),
      user: {},
      error: null
    };

    if (user) {
      // Enhance user object with data from Graph
      //this.getUserProfile();
    }
  }

  render() {
    let error = null;
    if (this.state.error) {
      error = <ErrorMessage message={this.state.error.message} debug={this.state.error.debug} />;
    }

    return (
      <Router>
        <div>
          <NavBar
            isAuthenticated={this.state.isAuthenticated}
            authButtonMethod={this.state.isAuthenticated ? this.logout.bind(this) : this.login.bind(this)}
            user={this.state.user}/>
          <Container>
            {error}
            <Route exact path="/"
              render={(props) =>
                <Welcome {...props}
                  isAuthenticated={this.state.isAuthenticated}
                  user={this.state.user}
                  authButtonMethod={this.login.bind(this)} />
              } />
            <Route exact path="/calendar"
              render={(props) =>
                <Calendar {...props}
                  showError={this.setErrorMessage.bind(this)} />
              } />
          </Container>
        </div>
      </Router>
    );
  }

  setErrorMessage(message, debug) {
    this.setState({
      error: {message: message, debug: debug}
    });
  }

  async login() {
    try {
      await this.userAgentApplication.loginPopup(
        {
          scopes: config.scopes,
          prompt: "select_account"
      });
      //await this.getUserProfile();
    }
    catch(err) {
      var errParts = err.split('|');
      this.setState({
        isAuthenticated: false,
        user: {},
        error: { message: errParts[1], debug: errParts[0] }
      });
    }
  }

  logout() {
    this.userAgentApplication.logout();
  }

  async getUserProfile() {
    try {
      // Get the access token silently
      // If the cache contains a non-expired token, this function
      // will just return the cached token. Otherwise, it will
      // make a request to the Azure OAuth endpoint to get a token

      var accessToken = "eyJ0eXAiOiJKV1QiLCJub25jZSI6IkhpRFNMSFhOa3pCbzdVR2pwVFA3TDFiWHhsVEgzSkNyQTZzbG1DbXIxdm8iLCJhbGciOiJSUzI1NiIsIng1dCI6ImllX3FXQ1hoWHh0MXpJRXN1NGM3YWNRVkduNCIsImtpZCI6ImllX3FXQ1hoWHh0MXpJRXN1NGM3YWNRVkduNCJ9.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC85ZTY1YjI5Yi0zYTM0LTRhNzAtOGQzOS0wZDE4Y2YyMjFhMjYvIiwiaWF0IjoxNTY2NDg5MTA1LCJuYmYiOjE1NjY0ODkxMDUsImV4cCI6MTU2NjQ5MzAwNSwiYWlvIjoiNDJGZ1lDaUllNXF6Zm5MVTJwMkZvYytYT0h4cEJBQT0iLCJhcHBfZGlzcGxheW5hbWUiOiJNci5Cb29rZXIiLCJhcHBpZCI6IjU5ZDg2OTYwLTlmNjctNDk4MC04Mjk3LWU4ZjJmNGVkYjY4NSIsImFwcGlkYWNyIjoiMSIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzllNjViMjliLTNhMzQtNGE3MC04ZDM5LTBkMThjZjIyMWEyNi8iLCJvaWQiOiJlNWJmOTlkMC1hYjUwLTRiM2QtYmYyMy1mODg4YTJjYjcyZjQiLCJzdWIiOiJlNWJmOTlkMC1hYjUwLTRiM2QtYmYyMy1mODg4YTJjYjcyZjQiLCJ0aWQiOiI5ZTY1YjI5Yi0zYTM0LTRhNzAtOGQzOS0wZDE4Y2YyMjFhMjYiLCJ1dGkiOiJlZGRQemJxS0pFTzB4M1I1MGNvQUFBIiwidmVyIjoiMS4wIiwieG1zX3RjZHQiOjE1NjU5MzY2NzB9.XuEOWTp3t1toUSYKvqoDcIkNlxqhbd9nFdJ7-QYRKaGEDxKeF1AQKKCADKIAcnRM2uOeLEVKTpfaWjO8ewvjUzlMp2BEK0yoipvEadUVfyxu2AKOeKHXb3K8bdMYmrB16YOX-lUCVHnQ-V53WwAxWQwYZdMHXzHavaHI6JgpADqMAzmNRa6rjWFOeVyuQP6pUhakmqOUI276-WFd848RKTvO59ZuKIdMIEvYcXMJgWP6k2G7A_iwAEw5kWIhq-QzbXgrvG9f7-nQhN9OZu3apjbDi32e9na0TuFL0ZXqFb8PA08twBop5efzW_slvMwnDzpOAHXyHj-GBMFP65d89g";
      // await this.userAgentApplication.acquireTokenSilent({
      //   scopes: config.scopes
      // });
      if (accessToken) {
        // Get the user's profile from Graph
        var user = await getUserDetails(accessToken);
        this.setState({
          isAuthenticated: true,
          user: {
            displayName: user.displayName,
            email: user.mail || user.userPrincipalName
          },
          error: null
        });
      }
    }
    catch(err) {
      var error = {};
      if (typeof(err) === 'string') {
        var errParts = err.split('|');
        error = errParts.length > 1 ?
          { message: errParts[1], debug: errParts[0] } :
          { message: err };
      } else {
        error = {
          message: err.message,
          debug: JSON.stringify(err)
        };
      }

      this.setState({
        isAuthenticated: false,
        user: {},
        error: error
      });
    }
  }
}

export default App;
