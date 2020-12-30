import React, { Component } from 'react'
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";


export default class WeeklyCases extends Component {
    state = {
    }


    componentDidMount() {

        this.initChart();



    };

    componentDidUpdate() {

        this.initChart();


    };

    componentWillUnmount() {
        if (this.chart) {
            this.chart.dispose();
        }
    };

    initChart(){
        am4core.useTheme(am4themes_animated);
        let chart = am4core.create("WeeklyChart", am4charts.XYChart);
        // Add data
        chart.data = this.props.dataArray;

        chart.dataDateFormat = "YYYY-MM-DD";
        // Create axes
        let dateAxis = chart.xAxes.push(new am4charts.DateAxis());

        dateAxis.renderer.grid.template.location = 0;
        dateAxis.renderer.minGridDistance = 30;

        let valueAxis1 = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis1.title.text = "Cases";

        // Create series
        let series1 = chart.series.push(new am4charts.ColumnSeries());
        series1.dataFields.valueY = "cases_weekly";
        series1.dataFields.dateX = "date";
        series1.yAxis = valueAxis1;
        series1.name = "Positive cases";
        series1.tooltipText = "{name}\n[bold font-size: 20]{valueY}[/]";
        series1.fill = chart.colors.getIndex(1);
        series1.strokeWidth = 0;
        series1.clustered = false;
        series1.columns.template.width = am4core.percent(40);

        let series2 = chart.series.push(new am4charts.ColumnSeries());
        series2.dataFields.valueY = "deaths_weekly";
        series2.dataFields.dateX = "date";
        series2.yAxis = valueAxis1;
        series2.name = "Deaths";
        series2.tooltipText = "{name}\n[bold font-size: 20]{valueY}[/]";
        series2.fill = chart.colors.getIndex(0).lighten(0.5);
        series2.strokeWidth = 0;
        series2.clustered = false;
        series2.toBack();

        let bullet3 = series1.bullets.push(new am4charts.CircleBullet());
        bullet3.circle.radius = 3;
        bullet3.circle.strokeWidth = 2;
        bullet3.circle.fill = am4core.color("#fff");

        let bullet4 = series2.bullets.push(new am4charts.CircleBullet());
        bullet4.circle.radius = 3;
        bullet4.circle.strokeWidth = 2;
        bullet4.circle.fill = am4core.color("#fff");

        let series3 = chart.series.push(new am4charts.LineSeries());
        series3.dataFields.valueY = "cases_weekly";
        series3.dataFields.dateX = "date";
        series3.name = "Positive cases - Curve";
        series3.strokeWidth = 2;
        series3.tensionX = 0.7;
        series3.yAxis = valueAxis1;

        let series4 = chart.series.push(new am4charts.LineSeries());
        series4.dataFields.valueY = "deaths_weekly";
        series4.dataFields.dateX = "date";
        series4.name = "Deaths - Curve";
        series4.strokeWidth = 2;
        series4.tensionX = 0.7;
        series4.yAxis = valueAxis1;


        // Add cursor
        chart.cursor = new am4charts.XYCursor();

        // Add legend
        chart.legend = new am4charts.Legend();
        chart.legend.position = "top";

        // //Add scrollbar
        // chart.scrollbarX = new am4charts.XYChartScrollbar();
        // chart.scrollbarX.series.push(series1);
        // chart.scrollbarX.parent = chart.bottomAxesContainer;

        this.chart = chart;

    }

    render() {

        return (

            <div className="col-md-8">
                <div className="card">
                    <div className="card-header ">
                        <h4 className="card-title">Weekly cases: {this.props.countryName} </h4>
                        <p className="card-category">COVID-19 Cases</p>
                    </div>
                    <div className="card-body ">
                        <div id="WeeklyChart" style={{ width: "95%", height: "500px" }}></div>
                    </div>
                    <div className="card-footer ">
                        <hr />
                        <div className="stats">
                            <i className="fa fa-history"></i> Updated every week
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
