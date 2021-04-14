import * as React from "react";
import { Container, Row, Col } from "reactstrap";
import { useState } from "react";
import styles from "./AdseroTeamsManagement.module.scss";
import { ICapacityDashBoardProps } from "./IAdseroTeamsManagementProps";
import { escape } from "@microsoft/sp-lodash-subset";
import "../../../ExternalRef/CSS/style.css";
import "../../../ExternalRef/CSS/alertify.min.css";
import * as alertify from "alertifyjs";
import { BaseComponentContext } from "@microsoft/sp-component-base";
import {
  Carousel,
  CarouselItem,
  CarouselControl, 
  CarouselIndicators,
  CarouselCaption,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,  
  Input,
  FormText,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  PeoplePicker,
  PrincipalType,
} from "@pnp/spfx-controls-react/lib/PeoplePicker";
// import { sp } from "@pnp/sp";
import { sp, Lists, ILists } from "@pnp/sp/presets/all";
import "@pnp/sp/fields";
import "@pnp/sp/items";
import "@pnp/sp/lists";
import "@pnp/sp/site-users";
import "@pnp/sp/webs";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import "@pnp/sp/site-users/web";
import { divProperties } from "office-ui-fabric-react";
import DataTable from "react-data-table-component";
import IcarosuelState from "./AdseroTeamsManagement";
import AdseroTeamsManagement1 from "./AdseroTeamsManagement";
import DatePicker from "reactstrap-date-picker";
import * as chartjs from "chart.js";
import { Pie } from "react-chartjs-2";
import { AgGridColumn, AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
// import "styled-components";
let data;



export interface ICapacityDashboardState {
  filterText: string;
  CapacityData: any;
  TableItems: any;
  MoveToLanding: Boolean;
  allpeoplePicker_User: any;
  getpeoplePicker_User: any;
  StartDateValue: string;
  StartDateFormatedVal: string;
  EndDateValue: string;
  EndDateFormatedVal: string;
  capselectedUsermail: string;
  CapacityChartData: any;
  CapSelectedUserName: string;
  CapShowChart: Boolean;
}

export default class AdseroTeamsManagement extends React.Component<
  ICapacityDashBoardProps,
  ICapacityDashboardState
> {
  private _CapacityColumns;

  constructor(props: ICapacityDashBoardProps) {
    super(props);
    sp.setup({
      sp: {
        baseUrl: this.props.siteUrl,
      },
    });
    this.state = {
      EndDateFormatedVal: "",
      EndDateValue: "",
      StartDateFormatedVal: "",
      StartDateValue: "",
      CapacityData: [],
      filterText: "",
      TableItems: [],
      allpeoplePicker_User: [],
      MoveToLanding: false,
      getpeoplePicker_User: [],
      capselectedUsermail: "",
      CapacityChartData: {},
      CapSelectedUserName: "",
      CapShowChart: false,
    };

    this._CapacityColumns= [
      {
        headerName: 'Name',
        field: 'name',       
        sortable:true,filter:true,
        cellRenderer:function(params){
          var urlLen=params.data.profileUrl
          if(urlLen)
          {
            var resultElement = document.createElement("div"); 
            var html=`<img src="${urlLen}" class="dash-dp" width="30" height="30" ><span>${params.data.name}</span></img>`
            resultElement.innerHTML=html
            return resultElement;
          }
        },
        cellStyle: {height:'40px'}
      },
      { headerName: "Billable", field: "billable" ,sortable:true,filter:true}, 
      { headerName: "Non - Billable", field: "nonbillable",sortable:true,filter:true },   
      { headerName: "Capacity Level", field: "capacitylevel",sortable:true,filter:true,
    
      cellRenderer:function(params){
        var capacitylev=params.data.capacitylevel
        capacitylev
        if(capacitylev=="Full")
        {
          var resultElement = document.createElement("span");
          resultElement.classList.add('table-capacity-full');
          resultElement.innerText="Full"; 
          return resultElement;
        }
        else if(capacitylev=="Medium")
        {
          var resultElement = document.createElement("span");
          resultElement.classList.add('table-capacity-medium');
          resultElement.innerText="Medium"; 
          return resultElement;
        }
        else  if(capacitylev=="Low")
        {
          var resultElement = document.createElement("span");
          resultElement.classList.add('table-capacity-low');
          resultElement.innerText="Low"; 
          return resultElement;
        }
        else  if(capacitylev=="Off")
        {
          var resultElement = document.createElement("span");
          resultElement.classList.add('table-capacity-off');
          resultElement.innerText="Off"; 
          return resultElement;
        }
      }}
    ]

    this.getTableData();
  }



  public StartDateChange(StartDateValue, StartDateFormatedVal) {
    this.setState({
      StartDateValue: StartDateValue, // ISO String, ex: "2016-11-19T12:00:00.000Z"
      StartDateFormatedVal: StartDateFormatedVal, // Formatted String, ex: "11/19/2016"
    });
  }
  public endDateChange(EndDateValue, EndDateFormatedVal) {
    this.setState({
      EndDateValue: EndDateValue, // ISO String, ex: "2016-11-19T12:00:00.000Z"
      EndDateFormatedVal: EndDateFormatedVal, // Formatted String, ex: "11/19/2016"
    });
  }
  // ! Get Chart Data
  public getChartData = async () => {
    console.log(this.state.capselectedUsermail);
    console.log(this.state.StartDateValue);

    if (this.state.capselectedUsermail == "") {
      alertify.message("Please enter the user name.");
    } else if (this.state.StartDateValue == "") {
      alertify.message("Please enter Start Date");
    } else if (this.state.EndDateValue == "") {
      alertify.message("Please enter End Date");
    } else if (
      Date.parse(this.state.StartDateValue) >
      Date.parse(this.state.EndDateValue)
    ) {
      alertify.message("Start Date Should be smaller than end date");
    } else {
      var startDateValue =
        new Date(this.state.StartDateValue).toISOString().split("T")[0] +
        "T00:00:00";
      var EndDateValue =
        new Date(this.state.EndDateValue).toISOString().split("T")[0] +
        "T23:59:00";
      await sp.web.lists
        .getByTitle("CapacityManagement")
        .items.select(
          "Author/Id",
          "Author/Title",
          "Author/EMail",
          "CapacityLevel",
          "Billable",
          "NonBillable",
          "Created",
          "ID"
        )
        .expand("Author")
        .filter(
          `Created ge datetime'${startDateValue}' and Created le datetime'${EndDateValue}' and Author/EMail eq '${this.state.capselectedUsermail}'`
        )
        .get()
        .then((item: any) => {
          this.setState({
            CapShowChart: true,
            CapacityChartData: {
              labels: ["Full", "Medium", "Low", "Off"],
              datasets: [
                {
                  data: [
                    item.filter((li) => li.CapacityLevel == "Full").length,
                    item.filter((li) => li.CapacityLevel == "Medium").length,
                    item.filter((li) => li.CapacityLevel == "Low").length,
                    item.filter((li) => li.CapacityLevel == "Off").length,
                  ],
                  backgroundColor: ["#ff7a7a", "#ffbb54", "#63d86f", "#7a7a7a"],
                  hoverBackgroundColor: [
                    "#ff7a7a",
                    "#ffbb54",
                    "#63d86f",
                    "#7a7a7a",
                  ],
                },
              ],
            },
          });
        });
    }
  };
  // Todo Append to Datatable

  public getTableData = async () => {
    let ColumnsArray = [];
    const d = new Date().toLocaleDateString();
    let list = await sp.web.lists
      .getByTitle("CapacityManagement")
      .items.select(
        "Author/Id",
        "Author/Title",
        "Author/EMail",
        "CapacityLevel",
        "Billable",
        "NonBillable",
        "Created",
        "ID"
      )
      .expand("Author")
      .get()
      .then((li) => {
        let filterToday = li.filter((li) => {
          return new Date(li.Created).toLocaleDateString() == d;
        });
        filterToday.forEach((FData) => {
          let proPic = this.props.ProfileData.filter((all) => {
            return all.ListItemAllFields.UserNameId == FData.Author.Id;
          });
          ColumnsArray.push({
            name: FData.Author.Title,
            billable: FData.Billable,
            nonbillable: FData.NonBillable,
            capacitylevel: FData.CapacityLevel,
            profileUrl: proPic[0].ServerRelativeUrl,
          });
        });
        console.log(ColumnsArray);
        this.setState({ CapacityData: ColumnsArray, TableItems: ColumnsArray });
      });
  };
  public CapacityChartSearch = (event) => {
    if (event["length"] > 0) {
      var resultarray = event.map((user) => user.id);

      this.setState({
        allpeoplePicker_User: resultarray,
        capselectedUsermail: event[0].secondaryText,
        CapSelectedUserName: event[0].text,
      });
    } else {
      this.setState({ allpeoplePicker_User: [] });
    }
  };
  public onFirstDataRendered = (params) => {
    params.api.sizeColumnsToFit();
  };
  public render(): React.ReactElement<ICapacityDashBoardProps> {
    return !this.state.MoveToLanding ? (
      <>
        <div
          className="nav-back"
          onClick={() => {
            this.setState({ MoveToLanding: true });
          }}
        ></div>
        {this.props.pageSwitching == "Dashboard" ? (
          <>
            <div>
              <div className="dashboard-head">
                <div>
                  <h3>Allocation Dashboard</h3>
                </div>
                <InputGroup className="search-div">
                  <Input
                    placeholder="Search"
                    className="search-input"
                    value={this.state.filterText}
                    bsSize={"lg"}
                    onChange={(e) => this.setState({ filterText: e.target.value })}
                  />
                </InputGroup>
              </div>

              <div className="datatable-section">
              <div className="ag-theme-alpine" style={ {height: 519, width: "100%" } }>
              <AgGridReact
                onFirstDataRendered={this.onFirstDataRendered}
                 columnDefs={this._CapacityColumns}
                    rowData={this.state.TableItems}  pagination={true}  paginationPageSize={10} quickFilterText={this.state.filterText} >
                </AgGridReact>
                </div>
              </div>
            </div>
          </>
        ) : this.props.pageSwitching == "Summary" ? (
          <>
            <div className="summary-head">
              <h3>Employee Summary</h3>
            </div>
            <div className="filter-row">
              <div className="ppicker-input">
              {/* <label>Employee </label> */}
                <div className="CapSummaryPPickerStyle"><PeoplePicker
                
                context={this.props.spcontext as any}
                titleText=""
                placeholder="Search User"
                personSelectionLimit={1}
                groupName={""}
                defaultSelectedUsers={this.state.allpeoplePicker_User}
                showtooltip={false}
                required={true}
                disabled={false}
                ensureUser={true}
                onChange={(e) => this.CapacityChartSearch.call(this, e)}
                showHiddenInUI={false}
                principalTypes={[PrincipalType.User]}
                resolveDelay={1000}
              />{" "}</div>
              </div> 
              <div className="startDate">
                <label>Start Date</label>
                <DatePicker
                  id="startdatepicker"
                  showClearButton={false}
                  value={this.state.StartDateValue}
                  onChange={(v, f) => this.StartDateChange(v, f)}
                />
              </div>       
              <div className="endDate">
                <label>End Date</label>
                <DatePicker
                  id="enddatepicker"
                  showClearButton={false}
                  value={this.state.EndDateValue}
                  onChange={(v, f) => this.endDateChange(v, f)}
                />
              </div>
              <div className="generate-btn">
                <button
                  className="btn btn-primary btn-generate"
                  onClick={() => this.getChartData()}
                >
                  Generate
                </button>
                <button
                  className="btn btn-theme-secondary btn-clear"
                  onClick={() => {
                    this.setState({
                      StartDateValue: "",
                      EndDateValue: "",
                      capselectedUsermail: "",
                      CapShowChart: false,
                      CapacityChartData: {},
                      CapSelectedUserName: "",
                      allpeoplePicker_User: [],
                    });
                  }}
                >   
                  Clear
                </button>
              </div>
            </div>
            <div className="piechart-section">
              {this.state.CapShowChart == false ? (
                <div>
                  <h2>No Datas Found</h2>
                </div>
              ) : (
                <div>
                  <h2>{this.state.CapSelectedUserName}</h2>
                  <Pie data={this.state.CapacityChartData} />
                </div>
              )}
            </div>
          </>
        ) : (
          ""
        )}
      </>
    ) : ( 
      <AdseroTeamsManagement1
        description={this.props.description}
        siteUrl={this.props.siteUrl}
        context={this.props.spcontext}
        graphClient={this.props.graphClient}
      />
    );
  }
}
