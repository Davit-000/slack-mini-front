import React from "react"
import {connect} from "react-redux"
import {Button, Card, CardContent, Container, CssBaseline, Grid, Typography} from "@material-ui/core"
import api from "../api";
import WorkspaceList from "../components/WorkspaceList"
import WorkspaceForm from "../components/WorkspaceForm"

export const MODE_CREATE = 1

export const MODE_UPDATE = 2

export const MODE_CLOSE = 0

class Home extends React.Component {
  toggleForm = (mode, editable = null) => this.setState({mode, editable})

  submitForm = ({mode, workspace}) => {
    const workspaces = this.state.workspaces.map(w => ({...w}))

    if (mode === MODE_CREATE) {
      workspaces.push(workspace)
    }

    if (mode === MODE_UPDATE) {
      const index = workspaces.findIndex(w => w.id === workspace.id)

      workspaces.splice(index, 1, workspace)
    }

    this.setState({workspaces})
  }

  removeWorkspace = workspace => {
    const workspaces = this.state.workspaces.map(w => ({...w}))
    const index = workspaces.findIndex(w => w.id === workspace.id)

    workspaces.splice(index, 1)

    this.setState({workspaces})
  }

  constructor(props) {
    super(props);

    this.state = {
      mode: 0,
      editable: null,
      workspaces: []
    }
  }

  getWorkspaces() {
    api.get('/workspaces')
      .then(res => res.data.workspaces)
      .then(workspaces => this.setState({workspaces}))
      .catch(err => console.log(err))
  }

  componentDidMount() {
    this.getWorkspaces()
  }

  render() {
    const {mode, editable, workspaces} = this.state

    return (
      <Container>
        <CssBaseline/>

        <Card variant="outlined">
          <CardContent>
            <Grid justify="space-between" container>
              <Typography gutterBottom variant="h5" component="h2">
                Workplaces
              </Typography>

              <Button
                onClick={() => this.toggleForm(MODE_CREATE)}
                variant="contained"
                color="primary"
              >
                Create workspace
              </Button>
            </Grid>
          </CardContent>

          <WorkspaceForm
            key="workspace-form"
            mode={mode}
            form={editable}
            onClose={this.toggleForm}
            onSubmit={this.submitForm}
          />

          <WorkspaceList
            items={workspaces}
            onEdit={this.toggleForm}
            onRemove={this.removeWorkspace}
          />
        </Card>
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  auth: {...state.auth}
})

export default connect(mapStateToProps, null)(Home)

