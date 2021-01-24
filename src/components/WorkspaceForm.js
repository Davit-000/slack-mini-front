import React from "react"
import PropTypes from "prop-types"
import {isEqual} from "lodash"
import {Autocomplete} from "@material-ui/lab"
import {withStyles} from "@material-ui/core/styles"
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@material-ui/core"
import {MODE_CREATE, MODE_UPDATE, MODE_CLOSE} from "../views/Home"
import api from "../api";

const styles = {
  dialog: {
    minWidth: '400px'
  }
}

class WorkspaceForm extends React.Component {
  static propTypes = {
    form: PropTypes.object,
    mode: PropTypes.number.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
  }

  submitForm = e => {
    e.preventDefault()

    if (this.isModeCreate) this.createWorkspace()

    if (this.isModeUpdate) this.updateWorkspace()
  }

  closeForm = () => {
    this.resetErrors()
    this.resetForm()

    this.props.onClose(MODE_CLOSE)
  }

  setField = e => {
    const {name, value} = e.target

    this.setState({[name]: value})
  }

  onChange = (_, value) => {
    if (!value) {
      this.setState({sub_domain: '', options: []})

      return
    }

    this.setState({sub_domain: value})
  }

  getSuggestions = (_, term) => {
    if (!term) {
      this.setState({term: '', options: []})

      return
    }

    this.setState({loading: true, term})

    api.get('/workspaces/suggest', {params: {term}})
      .then(res => res.data)
      .then(options => {
        console.log(options)

        return options
      })
      .then(options => this.setState({options}))
      .catch(err => console.log(err))
      .finally(() => this.setState({loading: false}))
  }

  get isModeCreate() {
    return this.props.mode === MODE_CREATE
  }

  get isModeUpdate() {
    return this.props.mode === MODE_UPDATE
  }

  get btnText() {
    switch (this.props.mode) {
      case MODE_CREATE:
        return 'Create Task'
      case MODE_UPDATE:
        return 'Update task'
      default:
        return null
    }
  }

  get title() {
    switch (this.props.mode) {
      case MODE_CREATE:
        return 'Create Workspace'
      case MODE_UPDATE:
        return 'Update Workspace'
      case MODE_CLOSE:
        return null
      default:
        return null
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      name: props.form?.name || '',
      sub_domain: props.form?.sub_domain || '',
      term: '',
      errors: {},
      open: false,
      loading: false,
      options: []
    }
  }

  createWorkspace() {
    const {name, sub_domain} = this.state

    api.post('/workspaces', {name, sub_domain})
      .then(res => res.data.workspace)
      .then(workspace => this.props.onSubmit({mode: MODE_CREATE, workspace}))
      .then(() => this.closeForm())
      .catch(err => {
        console.log(err)

        if (err.response && (err.response.status === 422 || err.response.status === 400)) {
          this.setState({errors: err.response.data})
        }
      })
  }

  updateWorkspace() {
    const {id} = this.props.form
    const {name, sub_domain} = this.state

    api.patch(`/workspaces/${id}`, {name, sub_domain})
      .then(res => res.data.workspace)
      .then(workspace => this.props.onSubmit({mode: MODE_UPDATE, workspace}))
      .then(() => this.closeForm())
      .catch(err => {
        console.log(err)

        if (err.response && (err.response.status === 422 || err.response.status === 400)) {
          this.setState({errors: err.response.data})
        }
      })
  }

  resetErrors() {
    this.setState({errors: {}})
  }

  resetForm() {
    this.setState({name: '', sub_domain: ''})
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

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!isEqual(this.props.form, prevProps.form)) {
      const {form} = this.props

      this.setState({
        name: form?.name || '',
        sub_domain: form?.sub_domain || '',
      })
    }
  }

  render() {
    const {mode, classes} = this.props
    const {errors, open, loading, options, ...form} = this.state

    return (
      <Dialog open={!!mode} className={classes.dialog} onClose={this.closeForm}>
        <form onSubmit={this.submitForm} style={{width: '100%'}} noValidate>

          <DialogTitle>{this.title}</DialogTitle>

          <DialogContent>
            <TextField
              helperText={this.errorFirst('name')}
              error={this.errorHas('name')}
              onChange={this.setField}
              value={form.name}
              label="Workspace name"
              variant="outlined"
              margin="normal"
              name="name"
              id="name"
              autoFocus
              fullWidth
              required
            />

            <Autocomplete
              fullWidth
              open={open}
              options={options}
              loading={loading}
              value={form.sub_domain}
              inputValue={form.term}
              onOpen={() => this.setState({open: true})}
              onClose={() => this.setState({open: false})}
              onChange={this.onChange}
              onInputChange={this.getSuggestions}
              getOptionSelected={(options, value) => options.includes(value)}
              clearOnBlur={false}
              renderInput={params =>
                <TextField
                  {...params}
                  required
                  margin="normal"
                  label="Subdomain"
                  variant="outlined"
                  error={this.errorHas('sub_domain')}
                  helperText={this.errorFirst('sub_domain')}
                />
              }
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={this.closeForm}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" type="submit">
              {this.btnText}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    )
  }
}

export default withStyles(styles)(WorkspaceForm)
