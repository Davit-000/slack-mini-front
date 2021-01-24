import React from "react"
import {connect} from "react-redux"
import {withStyles} from "@material-ui/core"
import {LockOutlined} from "@material-ui/icons"
import {Link as RouterLink} from "react-router-dom"
import {CssBaseline, TextField} from "@material-ui/core"
import {Avatar, Button, Container, Link, Typography} from "@material-ui/core"
import api from "../../api";
import {login} from "../../actions";
import Cookies from "js-cookie";

const styles = theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  link: {
    display: 'block'
  }
})

class Login extends React.Component {
  onChange = e => {
    const {name, value} = e.target

    this.setState({[name]: value})
  }

  onSubmit = e => {
    e.preventDefault()

    const {errors, ...form} = this.state
    const {history, dispatch} = this.props

    api.post('/login', form)
      .then(res => {
        const {token} = res.data

        api.defaults.headers.common['Authorization'] = token;
        Cookies.set('token', token)
        dispatch(login(token))
        history.push('/')
      })
      .catch(err => {
        console.log(err);
        if (err.response && err.response.status === 422) {
          this.setState({errors: err.response.data})
        }
      })
  }

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      errors: {}
    }
  }

  errorFirst(field) {
    const {errors} = this.state

    return this.errorHas(field) ? errors[field][0] : null
  }

  errorHas(field) {
    const {errors} = this.state

    return errors.hasOwnProperty(field)
  }

  render() {
    const {classes} = this.props
    const {errors, ...form} = this.state

    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline/>

        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlined/>
          </Avatar>

          <Typography component="h1" variant="h5">Sign in</Typography>

          <form onSubmit={this.onSubmit} className={classes.form} noValidate>
            <TextField
              helperText={this.errorFirst('email')}
              error={this.errorHas('email')}
              onChange={this.onChange}
              value={form.email}
              label="Email Address"
              variant="outlined"
              margin="normal"
              name="email"
              id="email"
              autoFocus
              fullWidth
              required
            />

            <TextField
              helperText={this.errorFirst('password')}
              error={this.errorHas('password')}
              onChange={this.onChange}
              value={form.password}
              variant="outlined"
              label="Password"
              name="password"
              type="password"
              margin="normal"
              id="password"
              fullWidth
              required
            />

            <Button
              className={classes.submit}
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
            >
              Login
            </Button>

            <Link
              className={classes.link}
              component={RouterLink}
              variant="body2"
              to="/register"
              align="center"
            >
              Don't have an account? Sign Up
            </Link>
          </form>
        </div>
      </Container>
    )
  }
}

export default withStyles(styles)(connect()(Login))
