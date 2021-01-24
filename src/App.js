import React from "react"
import {connect} from "react-redux"
import {makeStyles} from "@material-ui/core/styles"
import {BrowserRouter, Link, Route, Redirect, Switch, NavLink} from "react-router-dom"
import {AppBar, Button, CssBaseline, SvgIcon, Toolbar, Typography} from "@material-ui/core"
import Cookies from "js-cookie"
import api from "./api"
import {logout} from "./actions"
import Home from "./views/Home"
import Login from "./views/auth/Login"
import Register from "./views/auth/Register"

const useStyles = makeStyles(theme => ({
  appBar: {
    marginBottom: theme.spacing(5)
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}))

const Logo = props =>
  <SvgIcon {...props}>
    <path fill="currentColor" d="M6,15A2,2 0 0,1 4,17A2,2 0 0,1 2,15A2,2 0 0,1 4,13H6V15M7,15A2,2 0 0,1 9,13A2,2 0 0,1 11,15V20A2,2 0 0,1 9,22A2,2 0 0,1 7,20V15M9,7A2,2 0 0,1 7,5A2,2 0 0,1 9,3A2,2 0 0,1 11,5V7H9M9,8A2,2 0 0,1 11,10A2,2 0 0,1 9,12H4A2,2 0 0,1 2,10A2,2 0 0,1 4,8H9M17,10A2,2 0 0,1 19,8A2,2 0 0,1 21,10A2,2 0 0,1 19,12H17V10M16,10A2,2 0 0,1 14,12A2,2 0 0,1 12,10V5A2,2 0 0,1 14,3A2,2 0 0,1 16,5V10M14,18A2,2 0 0,1 16,20A2,2 0 0,1 14,22A2,2 0 0,1 12,20V18H14M14,17A2,2 0 0,1 12,15A2,2 0 0,1 14,13H19A2,2 0 0,1 21,15A2,2 0 0,1 19,17H14Z" />
  </SvgIcon>

const App = ({token, dispatch}) => {
  const classes = useStyles()

  const onLogout = () => {
    api.post('/logout')
      .then(() => delete api.defaults.headers.common['Authorization'])
      .then(() => Cookies.remove('token'))
      .then(() => dispatch(logout()))
      .catch(err => console.log(err))
  }

  return (
    <BrowserRouter>
      <CssBaseline/>

      <AppBar position="relative" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" color="inherit" className={classes.title} noWrap>
            <Button color="inherit" component={NavLink} to="/" disableRipple>
              <Logo/> Slack
            </Button>
          </Typography>

          {!token
            ? <React.Fragment>
              <Button component={Link} color="inherit" to="/login">Login</Button>
              <Button component={Link} color="inherit" to="/register">Register</Button>
            </React.Fragment>
            : <Button color="inherit" onClick={onLogout}>Logout</Button>
          }
        </Toolbar>
      </AppBar>

      <main>
        <Switch>
          <Route path="/register" component={Register}/>

          <Route path="/login" component={Login}/>

          <Route path="/" render={({history, location}) => !token
            ? <Redirect to={{pathname: '/login', state: {from: location}}}/>
            : <Home history={history}/>
          }/>
        </Switch>
      </main>
    </BrowserRouter>
  )
}

const mapStateToProps = state => ({
  token: state.auth.token
})

export default connect(mapStateToProps, null)(App)
