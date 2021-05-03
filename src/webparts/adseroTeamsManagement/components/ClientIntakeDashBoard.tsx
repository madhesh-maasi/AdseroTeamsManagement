import * as React from "react";
import { Container, Row, Col } from "reactstrap";
import { useState } from "react";
import styles from "./AdseroTeamsManagement.module.scss";
import { IClientIntakeDashBoardProps } from "./IAdseroTeamsManagementProps";
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
import { sp, Lists, ILists } from "@pnp/sp/presets/all";
import "@pnp/sp/fields";
import "@pnp/sp/items";
import "@pnp/sp/lists";
import "@pnp/sp/site-users";
import "@pnp/sp/webs";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import "@pnp/sp/site-users/web";
import DataTable from "react-data-table-component";
import AdseroTeamsManagement1 from "./AdseroTeamsManagement";
import * as moment from "moment";
import { BsPlus } from "react-icons/bs";
import * as $ from 'jquery'
import { AgGridColumn, AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import DropdownMultiselect from "react-multiselect-dropdown-bootstrap";

export interface IClientIntakeDashBoardState {
    ClientToLanding:boolean;
    ClientIntakeDashboardData:any;
    IntakeTableItems:any;
    showeditIntakeModal:boolean;
    showviewIntakeModal:boolean;
    editClientName:string;
    editMatterName:string;
    editMatterNumber:string;
    editMultiData:string;
    viewMultiData:string;
    filterText:string;
    perpageCount:number;
    IntakeCopyTableItems:any;
  }
  var conditionalRowStyles=[];
  var editData,viewData=[];
  var SignClientRender = "";
var AdverseNameRender = "";
var SignAdverseRender = "";
var NonAdverseRender = "";
var gridApi;
  export default class AdseroTeamsManagement extends React.Component<
  IClientIntakeDashBoardProps,
  IClientIntakeDashBoardState
> {
  private tblcolumns;

  constructor(props: IClientIntakeDashBoardProps) {
    super(props);
    sp.setup({
      sp: {
              baseUrl: this.props.siteUrl, //for dev
      },
    });    
    this.state = { 
        ClientToLanding:false,
        ClientIntakeDashboardData:[],
        IntakeTableItems:[],
        showeditIntakeModal:false,
        editClientName:"",
        editMatterName:"",
        editMatterNumber:"",
        editMultiData:"",
        showviewIntakeModal:false,
        viewMultiData:"",
        filterText:"",
        perpageCount:20,
        IntakeCopyTableItems:[] 
    };

     this.tblcolumns = [
      {
        headerName: 'Potential Client Name',
        field: 'PotentialClientName',    
        wrapText: true,  
        autoHeight: true, 
        sortable:true,filter:true,suppressSizeToFit: true,

      },
      {
        headerName: "Matter Name",
        field: "MatterName",
        wrapText: true,   
        autoHeight: true,
        sortable: true,suppressSizeToFit: true,
        rowStyle: { background: 'black' },
      },
      {
        headerName: "Matter Number",
        field: "MatterNumber",
        autoHeight: true,
        sortable: true,suppressSizeToFit: true,
        rowStyle: { background: 'black' },
      },
      {
        headerName: "Individuals with significant (Client)",
        field: "IndividualswithsignificantClient",
        wrapText: true,   
        autoHeight: true,
        sortable: true ,suppressSizeToFit: true,

        cellRenderer:function(params){
            var urlLen=params.data.IndividualswithsignificantClient
            if(urlLen)
            {
              var resultElement = document.createElement("div"); 
              resultElement.innerHTML=urlLen
              return resultElement;
            }
          }
      },
      {
        headerName: "Individuals with significant (Adversary)",
        field: "IndividualswithsignificantAdversary",
        wrapText: true,  
        autoHeight: true, 
          sortable: true,suppressSizeToFit: true,
          cellRenderer:function(params){
            var urlLen=params.data.IndividualswithsignificantAdversary
            if(urlLen)
            {
              var resultElement = document.createElement("div"); 
              resultElement.innerHTML=urlLen
              return resultElement;
            }
          } 
      },
      {
        headerName: "Potential Adversaries",
        field: "PotentialAdversaries",
          sortable: true,
          wrapText: true,  suppressSizeToFit: true,
          cellRenderer:function(params){
            var urlLen=params.data.PotentialAdversaries
            if(urlLen)
            {
              var resultElement = document.createElement("div"); 

              resultElement.innerHTML=urlLen
              return resultElement;
            }
          } 
      },
      {
        headerName: "Other Individuals",
        field: "OtherIndividuals",
          sortable: true,
          wrapText: true,  
          autoHeight: true,suppressSizeToFit: true,
          cellRenderer:function(params){
            var urlLen=params.data.OtherIndividuals
            if(urlLen)
            {
              var resultElement = document.createElement("div"); 
              resultElement.innerHTML=urlLen
              return resultElement;
            }
          },
      },
      {
        headerName: "Created Date",
        wrapText: true,  
        field: "CreatedDate",autoHeight: true,suppressSizeToFit: true,
        sortable: true
      },
      {
        headerName: "Status",
        field: "Status",
        wrapText: true,  
        hide: true, sortable: true,autoHeight: true,suppressSizeToFit: true,
      },
      {
        headerName: "Color",
        field: "Color", 
        wrapText: true,  hide: true,
        autoHeight: true,suppressSizeToFit: true,
      },
      {
        headerName: "Actions",
        field: "Actions",autoHeight: true,suppressSizeToFit: true,
        wrapText: true, 
        cellRendererFramework: (params) => {
          var dataID=params.data.ID
          return  this.props.isClientIntakeAdmin?  
          <><a href='#' req-id={dataID} className='Edit-Item' onClick={(e) => this.setActivateModal.call(this, e)}><span className='icon-action icon-edit' title='Edit'></span></a><a href='#' req-id={dataID} className='View-Item' onClick={(e) => this.setviewActivateModal.call(this, e)}><span className='icon-action icon-view' title='View'></span></a><a href='#' req-id={dataID} className='Archive-Item' onClick={(e) => this.archieveItem.call(this, e)}><span className='icon-action icon-save' title='Archive'></span></a></>:<a href='#' req-id={dataID}  className='View-Item' onClick={(e)=>this.setviewActivateModal.call(this,e)}><span  className='icon-action icon-view' title='View'></span></a>
        }, 
        // cellRenderer:(params)=>{
        //   var html="";
        //   // var urlLen=params.data.OtherIndividuals
        //   var dataID=params.data.ID
        //   if(dataID)
        //   {
        //     this.props.isClientIntakeAdmin?html=`<a href='#' req-id=${dataID}  class='Edit-Item' onClick=${(e)=>this.setActivateModal.call(this,e)}><span  class='icon-action icon-edit' title='Edit'></span></a><a href='#' req-id=${dataID}  class='View-Item' onClick=${(e)=>this.setviewActivateModal.call(this,e)}><span  class='icon-action icon-view' title='View'></span></a><a href='#' req-id=${dataID}  class='Archive-Item' onClick=${(e)=>this.archieveItem.call(this,e)}><span  class='icon-action icon-save' title='Archive'></span></a></>`:html=`<a href='#' req-id=${dataID}  class='View-Item' onClick=${(e)=>this.setviewActivateModal.call(this,e)}><span  class='icon-action icon-view' title='View'></span></a>`

        //     var resultElement = document.createElement("div"); 
        //  //   var html=`<img src="${dataID}" class="dash-dp" width="30" height="30" ><span>${dataID}</span></img>`
        //     resultElement.innerHTML=html
        //     return resultElement;
        //   }
        // }
       
      },
     

    ];
  

    this.getTableItems();

    $(document).on("click", "#btneditClient", function (e) {
      e.stopImmediatePropagation();
      var clienteditAdd = `<div class="row">
      <div class="col-common col-sm-12">
      <div class="form-group">
        <input type="text" class="SignClient form-control">
        <button class="btn btn-secodary remove-icon">
        <span class ="removeicon"></span>
        </button>
      </div>
      </div>
      </div>`;
      $(".SignParaDiv").append(clienteditAdd);
    });

    $(document).on("click", "#btneditAdverse", function (e) {
      e.stopImmediatePropagation();
      var clienteditAdd = `<div class="row">
      <div class="col-common col-sm-12">
      <div class="form-group">
        <input type="text" class="Adverse form-control">
    <button class="btn btn-secodary remove-icon">
    <span class ="removeicon"></span>
    </button>
      </div>
      </div>
      </div>`;
      $(".ParAdverseName").append(clienteditAdd);
    });
    $(document).on("click", "#btneditSignAdverse", function (e) {
      e.stopImmediatePropagation();
      //$('#btneditSignAdverse').click((e)=>{
      var clienteditAdd = `<div class="row ">
      <div class="col-common col-sm-12">
      <div class="form-group">
        <input type="text" class="SignAdverse form-control">
    <button class="btn btn-secodary remove-icon">
    <span class ="removeicon"></span>
    </button>

      </div>
      </div>
      </div>`;
      $(".InAdverse").append(clienteditAdd);
    });
    $(document).on("click", "#btneditnonAdverseDel", function (e) {
      e.stopImmediatePropagation();
      //$('#btnnonAdverse').click((e)=>{
      var clienteditAdd = `<div class="row ">
      <div class="col-common col-sm-12">
      <div class="form-group">
        <input type="text" class="nonAdverse form-control">
    <button class="btn btn-secodary remove-icon">
    <span class ="removeicon"></span>

    </button>
      </div>
      </div>
      </div>`;
      $(".nonParAdverse").append(clienteditAdd);
    });

    $(document).on("click", ".remove-icon", function (e) {
      e.stopImmediatePropagation();
      $(this).parent().remove();
    });

    $(document).on('keypress','.SignClient,.SignAdverse,.Adverse,.nonAdverse',function(e)
    {
      e.stopImmediatePropagation();
      $("#btnSave").text("Client Conflict");
    });
       
    $(document).on('paste','.SignClient,.SignAdverse,.Adverse,.nonAdverse',function(e)
    {
      e.stopImmediatePropagation();
      $("#btnSave").text("Client Conflict");
    });


  }

  public success = async () => {
  if(!$('#editclientName').val())
  {
    alertify.set('notifier','position', 'top-right');
    alertify.error('Please Enter Client Name');
    $("#btneditSave").attr("disabled", false);
    return false;
  }
  else
  {
     
    $("#btneditSave").attr("disabled", true);
    SignClientRender = "";
    AdverseNameRender = "";
    SignAdverseRender = "";
    NonAdverseRender = "";


    $('.SignClient').each(function()
    {
            if ($(this).val())
            SignClientRender = SignClientRender +$(this).val()+";";
    });

    $('.Adverse').each(function()
    {
          if ($(this).val())
            AdverseNameRender = AdverseNameRender +$(this).val()+";";
    });

    $('.SignAdverse').each(function()
    {
          if ($(this).val())
            SignAdverseRender = SignAdverseRender +$(this).val()+";";
    });

    $('.nonAdverse').each(function()
    {
          if ($(this).val())
            NonAdverseRender = NonAdverseRender +$(this).val()+";";
    });

    sp.web.lists.getByTitle("ClientIntake").items.getById(editData[0].ID).update({
      MatterName: $('#EMName').val(),
      MatterNumber: $('#EMNumber').val(),
      PotentialClientName: $("#clientName").val(),
      IndividualsClient: SignClientRender,
      IndividualsAdversary: SignAdverseRender,
      OtherIndividuals: NonAdverseRender,
      PotentialAdversaries: AdverseNameRender
    }).then( ()=>{
      this.setState({showeditIntakeModal:!this.state.showeditIntakeModal});
      alertify.message("Record Updated Successfully");
      this.getTableItems();
    })
  }
}
  public setActivateModal = (e) =>{
     editData=[];
    var viewID=  e.currentTarget.getAttribute("req-id");
    editData=this.state.ClientIntakeDashboardData.filter((item)=>item.ID==viewID);
   console.log(editData);
   if(editData.length>0)
   {
     
    
      this.EditItem(editData)
   }
  }

  public setviewActivateModal = (e) =>{
    viewData=[];
   var viewID=  e.currentTarget.getAttribute("req-id");
   viewData=this.state.ClientIntakeDashboardData.filter((item)=>item.ID==viewID);
  if(viewData.length>0)
  {
       this.viewItem(viewData)
  }
 }

 public viewItem=(viewData)=>
{
 
 var html=`<div class="viewlabels">`;
 for(let i=0;i<viewData.length;i++)
 {

  var formattedAdverse = "";
  var formattedClient = "";
  var formattedNonAdverse = "";
  var formattedAdverseNames = "";

  if (viewData[i].IndividualsAdversary) {

    var splitValueAdverse = viewData[i].IndividualsAdversary.replace(
      /;/g,
      "</br>"
    );
    formattedAdverse = "<div>" + splitValueAdverse + "</div>";
  }

  if (viewData[i].IndividualsClient) {

    var splitValueClient = viewData[i].IndividualsClient.replace(
      /;/g,
      "</br>"
    );
    formattedClient = "<div>" + splitValueClient + "</div>";
  }
  if (viewData[i].OtherIndividuals) {

    var splitValueNonAdverse = viewData[i].OtherIndividuals.replace(
      /;/g,
      "</br>"
    );
    formattedNonAdverse = "<div>" + splitValueNonAdverse + "</div>";
  }
  if (viewData[i].PotentialAdversaries) {

    var splitValueAdverseNames = viewData[i].PotentialAdversaries.replace(
      /;/g,
      "</br>"
    );
    formattedAdverseNames = "<div>" + splitValueAdverseNames + "</div>";
  } 
  if(viewData[i].Response)
  {
     var responselength=viewData[i].Response.length;
     if(viewData[i].Response.slice(responselength-1)!=",")
     {
      var response=$.parseJSON("["+viewData[i].Response+"]")
     }
     else
     {
      var crtResponse=viewData[i].Response.slice(0,responselength-1);
      var response=$.parseJSON("["+crtResponse+"]")
     }

  }
  var userDetails=this.props.RecipentUsersMailDetails;//GroupUsers


   html+='<div class="row goods-details"><div class="col-5 col-sm-6"><h5 class="goods-label">Potential Client Name</h5></div><div class="col-1 col-sm-1 text-center">:</div><div class="col-5 col-sm-5"><p class="goodsresult">' +
   viewData[i].PotentialClientName +
   "</p></div></div>";

   html+='<div class="row goods-details"><div class="col-5 col-sm-6"><h5 class="goods-label">Individuals with Significant (Client)</h5></div><div class="col-1 col-sm-1 text-center">:</div><div class="col-5 col-sm-5"><p class="goodsresult">' +
   formattedClient +
   "</p></div></div>"; 

   html+='<div class="row goods-details"><div class="col-5 col-sm-6"><h5 class="goods-label">Individuals with Significant (Adversary)</h5></div><div class="col-1 col-sm-1 text-center">:</div><div class="col-5 col-sm-5"><p class="goodsresult">' +
   formattedAdverse +
   "</p></div></div>";

   html+='<div class="row goods-details"><div class="col-5 col-sm-6"><h5 class="goods-label">Potential Adversaries</h5></div><div class="col-1 col-sm-1 text-center">:</div><div class="col-5 col-sm-5"><p class="goodsresult">' +
   formattedAdverseNames +
   "</p></div></div>";

   html+='<div class="row goods-details"><div class="col-5 col-sm-6"><h5 class="goods-label">Other Individuals</h5></div><div class="col-1 col-sm-1 text-center">:</div><div class="col-5 col-sm-5"><p class="goodsresult">' +
   formattedNonAdverse +
   "</p></div></div>";   

   var htmlTbl="<div class='view-table-sec'><table class='user-table'><thead><tr><th>User Name</th><th>Response</th><th>Comments</th></tr></thead><tbody>"   
   
   if(userDetails.length==0)
   {
    htmlTbl+='<tr><td colspan="3">No Users in sharepoint Recipient group</td></tr>';
   }
   for(let j=0;j<userDetails.length;j++)
   {var filterValue=[]
    if(response)
     filterValue=response.filter((val)=>val.UserName.toLowerCase()==userDetails[j].toLowerCase());

    if(filterValue.length>0)
    {
      if(filterValue[0]["Comments"])
      var cmts=filterValue[0]["Comments"] 
      else
       cmts= "N/A"
      htmlTbl+="<tr><td>"+filterValue[0]["UserName"]+"</td><td>"+filterValue[0]["Response"]+"</td><td>"+cmts+"</td></tr>"
    }
    else{
      htmlTbl+="<tr><td>"+userDetails[j]+"</td><td>N/A</td><td>N/A</td></tr>"
    }
   }
   htmlTbl+="</tbody></table></div></div>"
 }
 this.setState({viewMultiData:html+htmlTbl,showviewIntakeModal:!this.state.showviewIntakeModal,});
}
 public archieveItem =(e)=>{
  var archiveID=  e.currentTarget.getAttribute("req-id");
  var archiveData=this.state.ClientIntakeDashboardData.filter((item)=>item.ID==archiveID);

  if(archiveData.length>0)
  {
    alertify.confirm("Do you want to archive this record?",
()=>{
  
 
  const iar =  sp.web.lists
  .getByTitle("ClientIntakeArchiveList")
  .items.add({
    Title: "Client InTake",
    PotentialClientName: archiveData[0].PotentialClientName,
    IndividualsClient: archiveData[0].IndividualsClient,
    IndividualsAdversary: archiveData[0].IndividualsAdversary,
    OtherIndividuals: archiveData[0].OtherIndividuals,
    PotentialAdversaries: archiveData[0].PotentialAdversaries,
    MatterName: archiveData[0].MatterName,
     MatterNumber: archiveData[0].MatterNumber,
     Response: archiveData[0].Response,
     Status: archiveData[0].Status,
  })
  .then( () => {
    
    sp.web.lists.getByTitle("ClientIntake").items.getById(parseInt(archiveID)).delete().then( ()=>{
      alertify.message("Record Archived Successfully");
      this.getTableItems();
    });

  });
},
function(){
  alertify.error('Cancel');
});
  }
 }
  

  public EditItem =(viewData) =>
{
  var html="";
  for(let i=0;i<viewData.length;i++)
  {
 
   var formattedAdverse = "";
   var formattedClient = "";
   var formattedNonAdverse = "";
   var formattedAdverseNames = "";

   $('#EMName').val(viewData[i].MatterName);
   $('#EMNumber').val(viewData[i].MatterNumber);
   var html="<div class='row'>";
   if (viewData[i].IndividualsClient) 
   {
     var splitValueClient = viewData[i].IndividualsClient.split(";");
     splitValueClient = splitValueClient.filter(item => item);
      if(splitValueClient.length==0)
      {
        html+=`<div class="col-sm-6 main-left-column"><div class="row"><div class="col-common col-sm-12"><div class="form-group"><input type="text" class="SignClient form-control" placeholder="Individuals with Significant (Client):" value=""><button class="btn btn-primary add-icon" id="btneditClient">
        <span class="addicon"></span>
        </button></div><div class="SignParaDiv">`
      }
   
     for(let i=0;i<splitValueClient.length;i++)
     {

      if(i==0&&splitValueClient[i])
      {
        html+=`<div class="col-sm-6 main-left-column"><div class="row"><div class="col-common col-sm-12"><div class="form-group"><input type="text" class="SignClient form-control" placeholder="Individuals with Significant (Client):" value='${splitValueClient[i]}'><button class="btn btn-primary add-icon" id="btneditClient">
        <span class="addicon"></span>
        </button></div><div class="SignParaDiv">`
      }
      else if(splitValueClient[i]){

        html+=`<div class="row">
        <div class="col-common col-sm-12">
        <div class="form-group">
          <input type="text" class="SignClient form-control" value="${splitValueClient[i]}">
          <button class="btn btn-secodary remove-icon">
          <span class ="removeicon"></span>
          </button>
        </div>
        </div>
        </div>`;
      }

     }
     
   html+='</div></div>'
   }
   else
   {
    html+=`<div class="col-sm-6 main-left-column"><div class="row"><div class="col-common col-sm-12"><div class="form-group"><input type="text" class="SignClient form-control" placeholder="Individuals with Significant (Client):" value=""><button class="btn btn-primary add-icon" id="btneditClient">
    <span class="addicon"></span>
    </button></div><div class="SignParaDiv">`
    html+='</div></div>'
   }

 


   if (viewData[i].PotentialAdversaries) {
 
     var splitValueAdverseNames = viewData[i].PotentialAdversaries.split(";");

     splitValueAdverseNames = splitValueAdverseNames.filter(item => item);

      if(splitValueAdverseNames.length==0)
      {
        html+=`<div class="col-common col-sm-12"><div class="form-group"><input type="text" class="Adverse form-control" placeholder="Potential Adversaries" value=""><button class="btn btn-primary add-icon" id="btneditAdverse">
        <span class="addicon"></span>
        </button></div><div class="ParAdverseName">`
      }

     for(let i=0;i<splitValueAdverseNames.length;i++)
     {

      if(i==0&&splitValueAdverseNames[i])
      {
        html+=`<div class="col-common col-sm-12"><div class="form-group"><input type="text" class="Adverse form-control" placeholder="Potential Adversaries" value='${splitValueAdverseNames[i]}'><button class="btn btn-primary add-icon" id="btneditAdverse">
        <span class="addicon"></span>
        </button></div><div class="ParAdverseName">`
      }

      else if(splitValueAdverseNames[i]){

        html+=`<div class="row">
        <div class="col-common col-sm-12">
        <div class="form-group">
          <input type="text" class="Adverse form-control" value="${splitValueAdverseNames[i]}">
          <button class="btn btn-secodary remove-icon">
          <span class ="removeicon"></span>
          </button>
        </div>
        </div>
        </div>`;
      }

     }
     
   html+='</div></div></div>'
   }
   else
   {
    html+=`<div class="col-common col-sm-12"><div class="form-group"><input type="text" class="Adverse form-control" placeholder="Potential Adversaries" value=""><button class="btn btn-primary add-icon" id="btneditAdverse">
    <span class="addicon"></span>
    </button></div><div class="ParAdverseName">`
    html+='</div></div></div>'
   }

   html+='</div>'


   if (viewData[i].IndividualsAdversary) {

     var splitValueAdverse = viewData[i].IndividualsAdversary.split(";");

     splitValueAdverse = splitValueAdverse.filter(item => item);

    if(splitValueAdverse.length==0)
    {
      html+=`<div class="col-sm-6 main-right-column"><div class="row"><div class="col-common col-sm-12"><div class="form-group"><input type="text" class="SignAdverse form-control" placeholder="Individuals with Significant (Adversary)" value=""> <button class="btn btn-primary add-icon" id="btneditSignAdverse">
      <span class="addicon"></span>
      </button></div><div class="InAdverse">`
    }

     for(let i=0;i<splitValueAdverse.length;i++)
     {

      if(i==0&&splitValueAdverse[i])
      {
        html+=`<div class="col-sm-6 main-right-column"><div class="row"><div class="col-common col-sm-12"><div class="form-group"><input type="text" class="SignAdverse form-control" placeholder="Individuals with Significant (Adversary)" value='${splitValueAdverse[i]}'> <button class="btn btn-primary add-icon" id="btneditSignAdverse">
        <span class="addicon"></span>
        </button></div><div class="InAdverse">`
      }
      else if(splitValueAdverse[i]){

        html+=`<div class="row">
        <div class="col-common col-sm-12">
        <div class="form-group">
          <input type="text" class="SignAdverse form-control" value="${splitValueAdverse[i]}">
          <button class="btn btn-secodary remove-icon">
          <span class ="removeicon"></span>
          </button>
        </div>
        </div>
        </div>`;
      }

     }
     
   html+='</div></div>'
   }
   else
   {
    html+=`<div class="col-sm-6 main-right-column"><div class="row"><div class="col-common col-sm-12"><div class="form-group"><input type="text" class="SignAdverse form-control" placeholder="Individuals with Significant (Adversary)" value=""> <button class="btn btn-primary add-icon" id="btneditSignAdverse">
    <span class="addicon"></span>
    </button></div><div class="InAdverse">`
    html+='</div></div>'
   }

   if (viewData[i].OtherIndividuals) {
 
    var splitValueNonAdverse = viewData[i].OtherIndividuals.split(";");

    splitValueNonAdverse = splitValueNonAdverse.filter(item => item);

    if(splitValueNonAdverse.length==0)
    {
      html+=`<div class="col-common col-sm-12"><div class="form-group"><input type="text" class="nonAdverse form-control" placeholder="Other Individuals" value=""><button class="btn btn-primary add-icon" id="btneditnonAdverseDel">
      <span class="addicon"></span>
      </button></div><div class="nonParAdverse">`
    }

    for(let i=0;i<splitValueNonAdverse.length;i++)
    {

     
      if(i==0&&splitValueNonAdverse[i])
      {
        html+=`<div class="col-common col-sm-12"><div class="form-group"><input type="text" class="nonAdverse form-control" placeholder="Other Individuals" value="${splitValueNonAdverse[i]}"><button class="btn btn-primary add-icon" id="btneditnonAdverseDel">
      <span class="addicon"></span>
        </button></div><div class="nonParAdverse">`
      }
     else if(splitValueNonAdverse[i]){

       html+=`<div class="row">
       <div class="col-common col-sm-12">
       <div class="form-group">
         <input type="text" class="nonAdverse form-control" value="${splitValueNonAdverse[i]}">
         <button class="btn btn-secodary remove-icon">
         <span class ="removeicon"></span>
         </button>
       </div>
       </div>
       </div>`;
     }

    }
    
  html+='</div></div>'
  }
  else
  {
    html+=`<div class="col-common col-sm-12"><div class="form-group"><input type="text" class="nonAdverse form-control" placeholder="Other Individuals" value=""><button class="btn btn-primary add-icon" id="btneditnonAdverseDel">
    <span class="addicon"></span>
    </button></div><div class="nonParAdverse">`
      html+='</div></div>'
  }


   html+='</div></div></div>'
  //  $('.diveditModelBody').html("");
  //  $('.diveditModelBody').html(html);

   this.setState({showeditIntakeModal:!this.state.showeditIntakeModal,editClientName:viewData[0].PotentialClientName,editMatterName:viewData[0].MatterName,editMatterNumber:viewData[0].MatterNumber,editMultiData:html});

  }

}

  public getTableItems = async() =>{
    let clientIntakeColumnsArray = [];
    let allClientIntakePropsData=this.props.allClientData;
    await sp.web.lists
    .getByTitle("ClientIntake")
    .items.top(5000).orderBy("Modified",false)
    .get()
    .then(async (items: any) => {
        allClientIntakePropsData=items;

    allClientIntakePropsData.forEach((CData) => {
        var colorval="";
        if (CData.Response)
        {
          if (CData.Response.indexOf("Red")>=0) colorval = "Red";
          else if(CData.Response.indexOf("Orange")>=0)  colorval = "Orange";
          else if(CData.Response.indexOf("Clear")>=0)  colorval = "Clear";
          else colorval += "N/A";
        
        }
        else
        {
            colorval += "N/A";
        }
        var formattedAdverse = "";
        var formattedClient = "";
        var formattedNonAdverse = "";
        var formattedAdverseNames = "";
        //  AlertMessage("lOOP ENTERING");
        if (CData.IndividualsAdversary) {
          // var splitValueAdverse = items[i].IndividualsAdverses.replaceAll(
          //   ";",
          //   "</br>"
          // );
          var splitValueAdverse = CData.IndividualsAdversary.replace(
            /;/g,
            "</br>"
          );
          formattedAdverse = splitValueAdverse 
        }

        if (CData.IndividualsClient) {
          // var splitValueClient = items[i].IndividualsClient.replaceAll(
          //   ";",
          //   "</br>"
          // );
          var splitValueClient = CData.IndividualsClient.replace(
            /;/g,
            "</br>"
          );
          formattedClient =  splitValueClient 
        }
        if (CData.OtherIndividuals) {
          // var splitValueNonAdverse = items[i].RelatedNonAdverseNames.replaceAll(
          //   ";",
          //   "</br>"
          // );
          var splitValueNonAdverse = CData.OtherIndividuals.replace(
            /;/g,
            "</br>"
          );
          formattedNonAdverse = splitValueNonAdverse
        }
        if (CData.PotentialAdversaries) {
          // var splitValueAdverseNames = items[i].AdverseNames.replaceAll(
          //   ";",
          //   "</br>"
          // );
          var splitValueAdverseNames = CData.PotentialAdversaries.replace(
            /;/g,
            "</br>"
          );
          formattedAdverseNames =  splitValueAdverseNames 
        }
       
         clientIntakeColumnsArray.push({
          ID:CData.ID,
          PotentialClientName: CData.PotentialClientName?CData.PotentialClientName:"",
          MatterName: CData.MatterName?CData.MatterName:"",
          MatterNumber: CData.MatterNumber?CData.MatterNumber:"",
          IndividualswithsignificantClient: formattedClient?formattedClient:"",
          IndividualswithsignificantAdversary: formattedAdverse?formattedAdverse:"",
          PotentialAdversaries: formattedAdverseNames?formattedAdverseNames:"",
          OtherIndividuals: formattedNonAdverse?formattedNonAdverse:"",
          CreatedDate: moment(CData.Created).format("MM/DD/YYYY"),
          Status: CData.Response?CData.Response:"N/A",
          Color:colorval
        });
      });
    });
      console.log(clientIntakeColumnsArray);
      this.handleStateUpdate(clientIntakeColumnsArray,allClientIntakePropsData)
 };

 public handleStateUpdate(clientIntakeColumnsArray,allClientIntakePropsData){
    this.setState({ ClientIntakeDashboardData: allClientIntakePropsData,IntakeCopyTableItems:clientIntakeColumnsArray ,IntakeTableItems: clientIntakeColumnsArray });
 }




public handlePageChange = (page,totalRows) =>{
console.log(page,totalRows)
}
public onFirstDataRendered = (params) => {
  params.api.sizeColumnsToFit();
};
public onGridReady(params) {
   gridApi = params.api;
  var columnApi = params.columnApi;

  var allColumnIds = [];
  columnApi.getAllColumns().forEach(function (column) {
    allColumnIds.push(column.colId);
  });

  columnApi.autoSizeColumns(allColumnIds, false);

  // gridApi.sizeColumnsToFit();
  // window.onresize = () => {
  //    gridApi.sizeColumnsToFit();
  // }
}

public getRowStyle = params => {
  if (params.data.Color=== "Red") {
      return { background: '#f29198' };
  }
  else if(params.data.Color=== "Orange")
    {
      return { background: '#ffe4b3' };
    }
    else if(params.data.Color=== "Clear")
    {
      return { background: 'White' };
    }
};

public onPageSizeChanged=()=>{
  var value = document.getElementById('page-size')["value"];
  // this.setState({perpageCount:Number(value)});
  gridApi.paginationSetPageSize(Number(value));

}

public multiselect =(selected)=>{
console.log(selected);
// this.setState({IntakeTableItems:this.state.IntakeCopyTableItems})
if(selected.length>0)
{
  var filterdata=this.state.IntakeCopyTableItems.filter((items)=>{
    return selected.indexOf(items.Color)!=-1
   });
   this.setState({IntakeTableItems:filterdata})
}
else
{
  this.setState({IntakeTableItems:this.state.IntakeCopyTableItems})

}

}

  public render(): React.ReactElement<IClientIntakeDashBoardProps> {
    return !this.state.ClientToLanding ?( <><div
        className="nav-back"
        onClick={() => {
            this.setState({ ClientToLanding: true });
        } }
    ></div>
        <>
            <div>
                <div className="dashboard-head">
                    <div>
                        <h3>Client Intake Dashboard</h3>
                    </div>
                    
                    <DropdownMultiselect
                    options={["Red", "Orange", "Clear"]}
                    name="Conflicts" handleOnChange={(selected) => {
                      this.multiselect(selected);
}}
                  />
                    <InputGroup className="search-div">
                        <Input
                            placeholder="Search"
                            className="search-input"
                            value={this.state.filterText}
                            bsSize={"lg"}
                            onChange={(e) => this.setState({ filterText: e.target.value}) }/>
                    </InputGroup>
                </div>
                <div className="datatable-section">
              <div className="ag-theme-alpine" style={ { height:519 } }>
              <p>Page Size:</p> 
              <select onChange={()=>this.onPageSizeChanged()} id={"page-size"}>
                <option value="10" selected>10</option>
                <option value="100">100</option>
                <option value="500">500</option>
                <option value="1000">1000</option>
              </select>
              <AgGridReact
              onGridReady={this.onGridReady}
              getRowStyle={this.getRowStyle}
                onFirstDataRendered={this.onFirstDataRendered}
                 columnDefs={this.tblcolumns}
                    rowData={this.state.IntakeTableItems}  pagination={true}  paginationPageSize={10} quickFilterText={this.state.filterText} >
                </AgGridReact>
                </div>
              </div>
            </div>
            <Modal
          isOpen={this.state.showeditIntakeModal}
          toggle={()=>this.setState({showeditIntakeModal:!this.state.showeditIntakeModal})}
          
        > 
        <div className="modal-header-section"> 
          <ModalHeader toggle={()=>this.setState({showeditIntakeModal:!this.state.showeditIntakeModal})} className="text-center">
            Edit Client Intake
          </ModalHeader>
          <div className="ragylogo"></div>
          </div>
          <ModalBody>
          <div className="form-container-fluid">
    <div className="row">
    <div className="col-sm-12">
    <div className="row">
    <div className="form-group">
      <div className="col-common col-sm-12 form-group">
      <input type="text" className="form-control" id="editclientName" placeholder="Potential Client Name" disabled  value={this.state.editClientName}/>
      </div>
      </div>
    </div>
    </div>
    </div>

    <div className="row">
    <div className="col-sm-6 main-left-column">
    <div className="row">
    <div className="form-group">
      <div className="col-common col-sm-12 form-group">
      <input type="text" className="form-control" id="EMName" placeholder="Matter Name" value={this.state.editMatterName}/>
      </div>
      </div>
    </div>
    </div>

        <div className="col-sm-6 main-right-column">
    <div className="row">
    <div className="form-group">
      <div className="col-common col-sm-12 form-group">
      <input type="text" className="form-control" id="EMNumber" placeholder="Matter Number" value={this.state.editMatterNumber}/> 
      </div>
      </div>
    </div>
    </div>
    </div>
    
    <div className="diveditModelBody" dangerouslySetInnerHTML={{__html: this.state.editMultiData}}></div>
 
    </div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={()=>this.setState({showeditIntakeModal:!this.state.showeditIntakeModal})}>
              Cancel
            </Button>
        

            <Button
              color="primary"
              classNameName="mr-0" id="btneditSave" onClick={this.success}
            >
               <span className="button-text">Conflict Check</span>
            </Button>{" "}
          </ModalFooter>
        </Modal>
        <Modal
          isOpen={this.state.showviewIntakeModal}
          toggle={()=>this.setState({showviewIntakeModal:!this.state.showviewIntakeModal})}
          className="client-intake-view-modal"
        >
          <div className="modal-header-section"> 
          <ModalHeader toggle={()=>this.setState({showviewIntakeModal:!this.state.showviewIntakeModal})} className="text-center">
            View Client Intake 
          </ModalHeader>
          <div className="ragylogo"></div>
          </div>
          <ModalBody>
    <div className="form-container-fluid">



    
    <div className="divviewModelBody" dangerouslySetInnerHTML={{__html: this.state.viewMultiData}}></div>
 
    </div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={()=>this.setState({showviewIntakeModal:!this.state.showviewIntakeModal})}>
              Cancel
            </Button>

          </ModalFooter>
        </Modal>
        </></>):( 
      <AdseroTeamsManagement1
        description={this.props.description}
        siteUrl={this.props.siteUrl}
        context={this.props.spcontext}
        graphClient={this.props.graphClient}
      />
    )
    
  }
}


