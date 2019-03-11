import React, { Component } from 'react';
import * as d3 from 'd3';
import './App.css';
import data from './adata.csv';

class App extends Component {
  constructor(props) {
    super(props);
    this.drawAnomalyDetection = this.drawAnomalyDetection.bind(this);
  }

  drawAnomalyDetection() {
    const margin = {top: 30, right: 20, bottom: 30, left: 50},
        width = 1200 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // const parseDate = d3.time.format("%d-%b-%y").parse;
    const x = d3.time.scale().range([0, width]);
    const y = d3.scale.linear().range([height, 0]);

    const xAxis = d3.svg.axis().scale(x)
        .orient("bottom").ticks(5);

    const yAxis = d3.svg.axis().scale(y)
        .orient("left").ticks(15);

    const valueline = d3.svg.line()
        .x((d) => { return x(d.date); })
        .y((d) => { return y(d.close); });

    const svg = d3.select('.App')
        .append('svg')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append('g')
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv(data, (error, data) => {
      data.forEach((d) => {
        d.date = new Date(d.date);
        d.close = +d.close;
      });

      x.domain(d3.extent(data, (d) => d.date));
      y.domain([0, d3.max(data, (d) => d.close)]);

      svg.append("path")
          .attr("class", "line")
          .attr("d", valueline(data));

      svg.selectAll("dot")
          .data(data)
          .enter().append("circle")
          .filter((d) => d.close > 5000)
          .attr('fill', 'red')
          .attr("r", 5)
          .attr("cx", (d) => x(d.date))
          .attr("cy", (d) => y(d.close));

      svg.selectAll("dot")
          .data(data)
          .enter().append("circle")
          .filter((d) => d.close < 1)
          .attr('fill', 'red')
          .attr("r", 5)
          .attr("cx", (d) => x(d.date))
          .attr("cy", (d) => y(d.close));

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
    })

  }

  componentDidMount() {
    this.drawAnomalyDetection();
  }

  render() {
    return (
      <div className="App">

      </div>
    );
  }
}

export default App;
