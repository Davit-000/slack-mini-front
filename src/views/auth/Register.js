import React from "react"
import Cookies from "js-cookie"
import {connect} from "react-redux"
import {withStyles} from "@material-ui/core"
import {LockOutlined} from "@material-ui/icons"
import {Link as RouterLink} from "react-router-dom"
import {CssBaseline, TextField} from "@material-ui/core"
import {Avatar, Button, Container, Link, Typography} from "@material-ui/core"
import api from "../../api";
import {login} from "../../actions"

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

class Register extends React.Component {
  onChange = e => {
    const {name, value} = e.target

    this.setState({[name]: value})
  }

  onSubmit = e => {
    e.preventDefault()

    const {errors, ...form} = this.state
    const {history, dispatch} = this.props

    api.post('/register', form)
      .then(res => {
        const {token} = res.data

        api.defaults.headers.common['Authorization'] = token;
        Cookies.set('token', token)
        dispatch(login(token))
        history.push('/')
      })
      .catch(err => {
        if (err.response && err.response.status === 422) {
          this.setState({errors: err.response.data})
        }
      })
  }

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      errors: {}
    }
  }

  errorFirst(field) {
    const {errors} = this.state

    return this.errorHas(field)
      ? (errors[field][0] instanceof Object) ? errors[field][0].message : errors[field][0]
      : null
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

          <Typography component="h1" variant="h5">Register</Typography>

          <form onSubmit={this.onSubmit} className={classes.form} noValidate>
            <TextField
              helperText={this.errorFirst('name')}
              error={this.errorHas('name')}
              onChange={this.onChange}
              value={form.name}
              label="Full name"
              variant="outlined"
              margin="normal"
              name="name"
              id="name"
              autoFocus
              fullWidth
              required
            />

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

            <TextField
              onChange={this.onChange}
              value={form.password_confirmation}
              name="password_confirmation"
              id="password_confirmation"
              label="Confirm password"
              variant="outlined"
              type="password"
              margin="normal"
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
              Register
            </Button>

            <Link
              className={classes.link}
              component={RouterLink}
              variant="body2"
              to="/login"
              align="center"
            >
              Already has an account? Sign In
            </Link>
          </form>
        </div>
      </Container>
    )
  }
}

export default withStyles(styles)(connect()(Register))
