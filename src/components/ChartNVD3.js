import React, { Component } from 'react';
import NVD3Chart from 'react-nvd3';
import { isFunction, map, uniq, pick, values, flatten} from 'lodash';
import { format } from 'd3';

export default class ChartNVD3 extends Component{

  // given a d3 format specifier, return a d3 formatting
  // function for use by react-nvd3 component
  getFormatter(specifier, time=false) {
    if (typeof specifier === 'string') {
      return format(specifier);
    }
    if (isFunction(specifier)) {
      return specifier;
    }
  }

  getFormattedSettings() {
    let _settings = Object.assign({}, this.props.settings);

    // Allow use object for colors to keep order after filter changes.
    if(_settings.color && !Array.isArray(_settings.color)) {
      let labels;
      if(this.props.data.length && this.props.data[0].values) {
        labels = map(flatten(map(this.props.data, 'values')), _settings.x);
      } else {
        labels = uniq(map(this.props.data, _settings.x));
      }
      _settings.color = values(pick(_settings.color, labels));
    }

    Object.keys(_settings).forEach(k => {
      if (_settings[k].tickFormat) {
        _settings[k].tickFormat = this.getFormatter(_settings[k].tickFormat);
      }
    });

    return _settings;
  }

  render() {
    const settings = Object.assign({datum: this.props.data || [], key: this.props.componentKey, x: this.props.x, y: this.props.y}, this.getFormattedSettings());
    
    console.log("CHART", this)

    return (
        <NVD3Chart {...settings} style={{"height": "450px"}} />
     )
  }
}
