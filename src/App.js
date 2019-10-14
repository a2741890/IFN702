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
import "./App.css";

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
      code:'',
      isAuthenticated: (user !== null),
      user: {},
      error: null
    };

    if (user) {
      // Enhance user object with data from Graph
      this.getUserProfile();
    }

  }
  
  componentDidMount(){
    this.getCode()
    setTimeout(() => {
      if(this.state.code != undefined){
        this.postCode();
      }
    }, 10);;

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
             user={this.state.user}
            />
          <Container>
            {error}
            <Route exact path="/"
              render={(props) =>
                <Welcome {...props}
                  isAuthenticated={this.state.isAuthenticated}
                  token={this.state.token} />
              } />
            <Route exact path="/calendar"
              render={(props) =>
                <div className="App">
        <header>
          <div id="logo">
            <span className="icon">date_range</span>
            <span>
              Booking<b>Calendar</b>
            </span>
          </div>
        </header>
        <main>
        <Calendar {...props}
                  token={this.state.token}
                  showError={this.setErrorMessage.bind(this)} />
        </main>
        </div>   
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

  getCode = () =>{
    let qr={};
    window.location.search.substring(1).split("&").forEach(p => { qr[p.split("=")[0]] = p.split("=")[1] });
    //use
    let code = qr["code"];
    this.setState({code:code});
  }
  

  async login() {
    try {
      await this.userAgentApplication.loginPopup(
          {
            scopes: config.scopes,
            prompt: "select_account"
        });
      await this.getUserProfile();
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

  logout() {
    this.userAgentApplication.logout();
  }

  async getUserProfile() {
    try {
      // Get the access token silently
      // If the cache contains a non-expired token, this function
      // will just return the cached token. Otherwise, it will
      // make a request to the Azure OAuth endpoint to get a token
  
      var accessToken = await this.userAgentApplication.AquireToken.acquireTokenSilent({
          scopes: config.scopes
        });
  
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
        fetch("http://localhost:3001/",{
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "userName": this.state.user.displayName,
          "userEmail": this.state.user.mail
        })
        })
          .then(res => res.json())
          .then((result) => {
            alert(result);
          }
            ,
            (error) => {
              alert(error);
              console.log(error);
            }
          )

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
  
async postCode() {
    try {
      fetch("http://localhost:3001/code",{
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "code" : this.state.code,
          "userName": this.state.user.displayName,
          "userEmail": this.state.user.mail
        })
        })
          .then(res => res.json())
          .then((result) => {
            alert(result);
          }
            ,
            (error) => {
              alert(error);
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
    }
  }
  
}

  
export default App;
