import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';
import { format } from 'd3';

export default class Metric extends Component{
  getValue() {
    let val = this.props.value || this.props.data[0];
    let formatter;

    if (this.props.field && this.props.data.length > 0) {
      val = this.props.data[0][this.props.field]
    }

    if (this.props.format) {
      formatter = format(this.props.format);
      val = formatter(val);
    }

    if (val === 'NaN') return '...';
    return val;
  }

  render() {
    let bg = this.props.background || "pink";
    let style = {
      background: bg,
    };
    let metric;

    if (this.props.icon) {
      metric =
      <div className="metric-with-icon">
        <div className="col-sm-3 col-lg-4">
          <FontAwesome name={this.props.icon} size="4x"/>
        </div>
        <div className="col-sm-9 col-lg-8">
          <div className="card-metric-number">
            {this.getValue()}
          </div>
          <div className="card-metric-caption">
          {this.props.caption}
          </div>
        </div>
      </div>
    } else {
      metric =
      <div className="metric-without-icon row">
        <div className="card-metric-number">
          {this.getValue()}
        </div>
        <div className="card-metric-caption">
        {this.props.caption}
        </div>
      </div>
    }

    style = Object.assign({}, style, this.props.style);
    return (
        <div className="metric" style={style}>
          {metric}
        </div>
    )
  }
}
