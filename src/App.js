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
import { async } from 'q';

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

    var token = '';
    this.state = {
      isAuthenticated: (token.length != 0),
      token: token,
      error: null
    };
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
            isAuthenticated={this.state.isAuthenticated}/>
          <Container>
            {error}
            <Route exact path="/"
              render={(props) =>
                <Welcome {...props}
                  isAuthenticated={this.state.isAuthenticated}
                  token={this.state.token}
                  authButtonMethod={this.getClientCredentialToken.bind(this)} />
              } />
            <Route exact path="/calendar"
              render={(props) =>
                <Calendar {...props}
                  token={this.state.token}
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


  
async  getClientCredentialToken() {
    try {
      // Get the access token silently
      // If the cache contains a non-expired token, this function
      // will just return the cached token. Otherwise, it will
      // make a request to the Azure OAuth endpoint to get a token

      // var accessToken = await this.userAgentApplication.acquireTokenSilent({
      //   scopes: config.scopes
      // });
      
        fetch("http://18.218.195.51/Project/api/token?userName=william", { 
        method: 'get', 
        })
          .then(res => res.json())
          .then((result) => {
            this.setState({
              isAuthenticated : true,
              token : result
              
            });}
            ,
            (error) => {
              console.log(error);
            }
          )
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
