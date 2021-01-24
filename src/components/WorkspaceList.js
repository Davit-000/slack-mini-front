import React from "react"
import PropTypes from "prop-types"
import {withStyles} from "@material-ui/core/styles"
import {Edit,DeleteForever} from "@material-ui/icons"
import {IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@material-ui/core"
import {MODE_UPDATE} from "../views/Home";
import api from "../api";

const styles = {
  table: {
    minWidth: 650,
  },
  container: {
    maxHeight: 440,
  },
}

class WorkspaceList extends React.Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    onRemove: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired
  }

  removeWorkspace(workspace) {
    api.delete(`/workspaces/${workspace.id}`)
      .then(() => this.props.onRemove(workspace))
      .catch(err => console.log(err))
  }

  render() {
    const {items, classes} = this.props

    return (
      <TableContainer component={Paper} className={classes.container}>
        <Table className={classes.table} stickyHeader aria-label="workplace table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Subdomain</TableCell>
              <TableCell align="left">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={`workplace-${item.id}`}>
                <TableCell component="th" scope="row">{item.id}</TableCell>
                <TableCell align="left">{item.name}</TableCell>
                <TableCell align="left">{item.sub_domain}</TableCell>
                <TableCell align="left">
                  <IconButton color="inherit" size="small" onClick={() => this.props.onEdit(MODE_UPDATE, item)}>
                    <Edit fontSize="small"/>
                  </IconButton>

                  <IconButton color="secondary" size="small" onClick={() => this.removeWorkspace(item)}>
                    <DeleteForever fontSize="small"/>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}

export default withStyles(styles)(WorkspaceList)
