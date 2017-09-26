/**
 * List component
 *
 */

'use strict';

import {remote, ipcRenderer} from 'electron';
import React from 'react';
import AppLoader from './../common/AppLoader';
import ListItem from './ListItem';

class SearchBar extends React.Component {
  render() {
    return (
      <div className="container-fluid">
        <div className="input-group">
          <span className="input-group-addon">
            <i className=" fa fa-search"></i>
          </span>
          <input className="form-control" name="search" placeholder="search" autoFocus="autofocus" type="search" id="search-user"></input>
        </div>
      </div>
    )
  }
}

export default class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loader: false,
      modules: []
    }
    this.clearSelection = this.clearSelection.bind(this);
  }
  clearSelection() {
    if(this.modulesList) {
      let tableElement = $(this.modulesList);
      tableElement.find('tr.selected').removeClass('selected');
    }
  }
  updateModules(modules) {
    let rootElement = this.refs.rootElement;
    let data = this.parse(modules);
    this.setState({modules: data, loader: false});
  }
  parse(data) {
    let modules = data.dependencies;
    let arr = [];
    for (let z in modules) {
      let mod = {
        name: z,
        version: modules[z].version
      }
      arr.push(mod);
    }
    return arr;
  }
  componentWillMount() {
    this.setState({
      loader: true
    }, () => {
      ipcRenderer.send('get-global-modules');
    });
  }
  componentDidMount() {
    ipcRenderer.on('get-global-modules-reply', (event, modules) => {
      this.updateModules(modules);
    });
    ipcRenderer.on('uninstall-module-reply', (event, result) => {
      console.log(result.removed);
    });
  }
  componentWillUnmount() {
    ipcRenderer.removeAllListeners(['get-global-modules-reply', 'uninstall-module-reply']);
  }
  render() {
    let modules = this.state.modules;
    if (!modules.length && this.state.loader == false) {
      return null;
    }
    return (
      <AppLoader loading={this.state.loader}>
        <div className="modules-list">
          <h6 className="title">Global packages installed</h6>
          <div className="list-group" ref={(el) => {
            this.modulesList = el;
          }}>
            {modules.map((module, idx) => {
              return <ListItem clearSelection={this.clearSelection} idx={idx} key={idx} {...module}/>
            })}
          </div>
        </div>
      </AppLoader>
    )
  }
}
