import * as React from "react";
import { Container, Row, Col } from "reactstrap";
import { useState } from "react";
import styles from "./AdseroTeamsManagement.module.scss";
import { IAdseroTeamsManagementProps } from "./IAdseroTeamsManagementProps";
import { escape } from "@microsoft/sp-lodash-subset";
import "../../../ExternalRef/CSS/style.css";
import "../../../ExternalRef/CSS/alertify.min.css";
import * as alertify from "alertifyjs";
import * as $  from 'jquery';
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
} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { sp, Lists, ILists } from "@pnp/sp/presets/all";
import "@pnp/sp/fields";
import "@pnp/sp/items";
import "@pnp/sp/lists";
import "@pnp/sp/site-users";
import "@pnp/sp/webs";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import "@pnp/sp/site-users/web";
import { graph } from "@pnp/graph";
import "@pnp/graph/users";
import "@pnp/graph/photos";
import CapacityDashboard from "./CapacityDashboard";
import ClientIntakeDashboard from "./ClientIntakeDashBoard";
//for dev
var profileListUrl = "/sites/adsero/ProfilePictures/";
var SiteImageUrl = "/sites/adsero/SiteImages/";
// //for liv
// var profileListUrl = "/sites/dev/ProfilePictures/";
// var SiteImageUrl = "/sites/dev/SiteImages/";
// import { BsPlus } from "react-icons/bs"; 
export interface IcarosuelState {
  pageSwitch:string;
  landingActive: boolean;
  activeIndex: number;
  CarouselItems: any;
  allUsers: any;
  allProfilePics: any;
  currentUserDetails: any;
  tilesItems: any;
  currentUserGroups: any;
  showCapacityModal: boolean;
  capacityValue: string;
  currentUserProfileUrl: string;
  billable: string;
  nonbillable: string;
  capacityEditFlag: Boolean;
  CapacityEditId: number;
  showIntakeModal:boolean;
  showIntakeDashboard:boolean;
  allClientIntakeData:any;
  ClientIntakeAdmin:boolean;
  ClientIntakereadUser:boolean;
  ClientIntakeRepUser:Boolean;
  BannerImage:string;
  capacityAdmin:boolean;
  capacityEmployee:boolean;
  capacityData:any;

}
var slides = [];
var tilesArray = [];
var CrntUserEmail;

var Adminuser=false;
var ReadUser=false;
var RecipientUser=false;

var RecipentUsersMail=[];

var arrClientName = [];
var arrIndivuals = [];
var arrAdverseName = [];
var arrAdversindicual = [];
var arrNonAdversName = [];
var Allvalues = [];
var AllItems=[];
var GroupUsers=[];
var SignClientRender = "";
var AdverseNameRender = "";
var SignAdverseRender = "";
var NonAdverseRender = "";
var editData=[];
var checkconflicts1;
var checkconflicts2 = [];
var checkconflicts3 = [];
var checkconflicts4 = [];
var checkconflicts5 = [];

var clientvalue=[];
var adversvalue=[];
var potentialadversarievalue=[];
var otherindivualvalue=[];
export default class AdseroTeamsManagement1 extends React.Component<
  IAdseroTeamsManagementProps,
  IcarosuelState
> {
  constructor(props: IAdseroTeamsManagementProps) {
    super(props);
    sp.setup({
      sp: {
        baseUrl:this.props.siteUrl, //for dev
      },
    });
    graph.setup({
      spfxContext: this.props.context
    });

    this.state = {
      pageSwitch:"",
      landingActive: true,
      activeIndex: 0,
      CarouselItems: [],
      allUsers: [],
      allProfilePics: [],
      currentUserDetails: [],
      currentUserGroups: [],
      tilesItems: [],
      showCapacityModal: false,
      capacityValue: "",
      currentUserProfileUrl: "",
      billable: "",
      nonbillable: "",
      capacityEditFlag: false,
      CapacityEditId: 0,
      showIntakeModal:false,
      showIntakeDashboard:false,
      allClientIntakeData:[],
      ClientIntakeAdmin:false,
      ClientIntakereadUser:false,
      ClientIntakeRepUser:false,
      BannerImage:"",
      capacityAdmin:false,
      capacityEmployee:false,
      capacityData:[]
    };
    
    this.loadProfilepics();
    // this.loadUsersBirthday();
    this.getCurrentUserDetails();
    this.getbannerimage();
    $(document).on("click", "#btnClient", function (e) {
      e.stopImmediatePropagation();
      var clientAdd = `<div class="row">
      <div class="col-common col-sm-12">
      <div class="form-group">
        <input type="text" class="SignClient form-control">
        <button class="btn remove-icon">
        <span class ="removeicon"></span>
        </button>
      </div>
      </div>
      </div>`;
      $(".SignParaDiv").append(clientAdd);
    });

    $(document).on("click", "#btnAdverse", function (e) {
      e.stopImmediatePropagation(); 
      var clientAdd = `<div class="row">
      <div class="col-common col-sm-12">
      <div class="form-group">
        <input type="text" class="Adverse form-control">
    <button class="btn remove-icon">
    <span class ="removeicon"></span>
        </button>
      </div>
      </div>
      </div>`;
      $(".ParAdverseName").append(clientAdd);
    });
    $(document).on("click", "#btnSignAdverse", function (e) {
      e.stopImmediatePropagation();
      //$('#btnSignAdverse').click((e)=>{
      var clientAdd = `<div class="row ">
      <div class="col-common col-sm-12">
      <div class="form-group">
        <input type="text" class="SignAdverse form-control">
    <button class="btn remove-icon">
    <span class ="removeicon"></span>
        </button>

      </div>
      </div>
      </div>`;
      $(".InAdverse").append(clientAdd);
    });
    $(document).on("click", "#btnnonAdverseDel", function (e) {
      e.stopImmediatePropagation();
      //$('#btnnonAdverse').click((e)=>{
      var clientAdd = `<div class="row ">
      <div class="col-common col-sm-12">
      <div class="form-group">
        <input type="text" class="nonAdverse form-control">
    <button class="btn remove-icon">
    <span class ="removeicon"></span>
        </button>
      </div>
      </div>
      </div>`;
      $(".nonParAdverse").append(clientAdd);
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

    $(document).on("click", ".sign-check", function (e) {
      e.stopImmediatePropagation();

      if (
        $(".sign-check." + e.target.id + " span").hasClass("glyphicon-remove")
      ) {
        $(".sign-check." + e.target.id + "").css("text-decoration", "none");
        $(".sign-check." + e.target.id + " span").removeClass(
          "glyphicon-remove"
        );
        $(".sign-check." + e.target.id + " span").addClass("glyphicon-ok");
      } else if (
        $(".sign-check." + e.target.id + " span").hasClass("glyphicon-ok")
      ) {
        $(".sign-check." + e.target.id + "").css(
          "text-decoration",
          "line-through"
        );
        $(".sign-check." + e.target.id + " span").removeClass("glyphicon-ok");
        $(".sign-check." + e.target.id + " span").addClass("glyphicon-remove");
      }
      if ($(".glyphicon-ok").length == 0) 
      {
        $("#btnSave").attr("disabled", false);
        checkconflictsonchange();
        
      }else
      {
        $("#btnSave").attr("disabled", true);
      }     
    });
    $(document).on("click", ".sign-ctrlcheck", function (e) {
      console.log(e);
      e.stopImmediatePropagation();
      if (
        $(".sign-ctrlcheck." + e.target.id + " span").hasClass(
          "glyphicon-remove"
        )
      ) {
        $(".sign-ctrlcheck." + e.target.id + "").css("text-decoration", "none");
        $(".sign-ctrlcheck." + e.target.id + " span").removeClass(
          "glyphicon-remove"
        );
        $(".sign-ctrlcheck." + e.target.id + " span").addClass("glyphicon-ok");
      } else if (
        $(".sign-ctrlcheck." + e.target.id + " span").hasClass("glyphicon-ok")
      ) {
        $(".sign-ctrlcheck." + e.target.id + "").css(
          "text-decoration",
          "line-through"
        );
        $(".sign-ctrlcheck." + e.target.id + " span").removeClass(
          "glyphicon-ok"
        );
        $(".sign-ctrlcheck." + e.target.id + " span").addClass(
          "glyphicon-remove"
        );
      }
      if ($(".glyphicon-ok").length == 0) {
        $("#btnSave").attr("disabled", false);
        checkconflictsonchange();
      }else
      {
        $("#btnSave").attr("disabled", true);

      }
    });
    $(document).on("click", ".sign-adcheck", function (e) {
      console.log(e);
      e.stopImmediatePropagation();
      if (
        $(".sign-adcheck." + e.target.id + " span").hasClass("glyphicon-remove")
      ) {
        $(".sign-adcheck." + e.target.id + "").css("text-decoration", "none");
        $(".sign-adcheck." + e.target.id + " span").removeClass(
          "glyphicon-remove"
        );
        $(".sign-adcheck." + e.target.id + " span").addClass("glyphicon-ok");
      } else if (
        $(".sign-adcheck." + e.target.id + " span").hasClass("glyphicon-ok")
      ) {
        $(".sign-adcheck." + e.target.id + "").css(
          "text-decoration",
          "line-through"
        );
        $(".sign-adcheck." + e.target.id + " span").removeClass("glyphicon-ok");
        $(".sign-adcheck." + e.target.id + " span").addClass(
          "glyphicon-remove"
        );
      }
      if ($(".glyphicon-ok").length == 0) 
      {
        $("#btnSave").attr("disabled", false);
        checkconflictsonchange();
        
      }else
      {
        $("#btnSave").attr("disabled", true);

      }
    });
    $(document).on("click", ".sign-noncheck", function (e) {
      console.log(e);
      e.stopImmediatePropagation();
      if (
        $(".sign-noncheck." + e.target.id + " span").hasClass(
          "glyphicon-remove"
        )
      ) {
        $(".sign-noncheck." + e.target.id + "").css("text-decoration", "none");
        $(".sign-noncheck." + e.target.id + " span").removeClass(
          "glyphicon-remove"
        );
        $(".sign-noncheck." + e.target.id + " span").addClass("glyphicon-ok");
      } else if (
        $(".sign-noncheck." + e.target.id + " span").hasClass("glyphicon-ok")
      ) {
        $(".sign-noncheck." + e.target.id + "").css(
          "text-decoration",
          "line-through"
        );
        $(".sign-noncheck." + e.target.id + " span").removeClass(
          "glyphicon-ok"
        );
        $(".sign-noncheck." + e.target.id + " span").addClass(
          "glyphicon-remove"
        );
      }
      if ($(".glyphicon-ok").length == 0) {
        $("#btnSave").attr("disabled", false);
        checkconflictsonchange();
      }else
      {
        $("#btnSave").attr("disabled", true);

      }
    });
  }

   mandatoryvalidation =async() => {
    var isAllValueFilled = true;
  
    var arrNewClient = [];
    var arrNewClientSign = [];
    var arrNewAdverse = [];
    var arrNewAdverseSign = []; 
    var arrNewNonAdverse = [];
  
    var checkconflicts2 = [];
    var checkconflicts3 = [];
    var checkconflicts4 = [];
    var checkconflicts5 = [];
  
    if(!$('#clientName').val())
    {
      alertify.set('notifier','position', 'top-right');
      alertify.error('Please Enter Client Name');
      $("#btnSave").attr("disabled", false);
      return false;
    }
  
    await arrNewClient.push($("#clientName").val().toLowerCase());
  
    await $(".SignClient").each(async function (key, val) 
    {
      
      await arrNewClientSign.push(val.value.toLowerCase());
    });
  
    await $(".Adverse").each(async function (key, val) {
      await arrNewAdverse.push(val.value.toLowerCase());
    });
  
    await $(".SignAdverse").each(async function (key, val) {
      await arrNewAdverseSign.push(val.value.toLowerCase());
    });
  
    await $(".nonAdverse").each(async function (key, val) {
      await arrNewNonAdverse.push(val.value.toLowerCase());
    });
  
  

  
    await $(".SignClient").each(async function (key, val) 
    {
      if(val.value)
      clientvalue.push(val.value.toLowerCase());
    });
  
    await $(".Adverse").each(async function (key, val) 
    {
      if(val.value) 
      adversvalue.push(val.value.toLowerCase());
    });
  
    await $(".SignAdverse").each(async function (key, val) 
    {
      if(val.value) 
      potentialadversarievalue.push(val.value.toLowerCase());
    });
  
    await $(".nonAdverse").each(async function (key, val) 
    {
      if(val.value) 
      otherindivualvalue.push(val.value.toLowerCase());
    });
  
  
    checkconflicts1 = Allvalues.filter(async (element) => {
      return await arrNewClient.indexOf(element.value) != -1;
    });
    Allvalues.filter(async (element) => {
      if (arrNewClientSign.indexOf(element.value) != -1) {
        await checkconflicts2.push(element);
      }
    });
    Allvalues.filter(async (element) => {
      if (arrNewAdverseSign.indexOf(element.value) != -1) {
        await checkconflicts3.push(element);
      }
    });
    Allvalues.filter(async (element) => {
      if (arrNewAdverse.indexOf(element.value) != -1) {
        await checkconflicts4.push(element);
      }
    });
    Allvalues.filter(async (element) => {
      if (arrNewNonAdverse.indexOf(element.value) != -1) {
        await checkconflicts5.push(element);
      }
  
      // return arrNewNonAdverse.indexOf(element) !== -1
    });

    if ($("#btnSave").text() != "Submit") {
      if (checkconflicts2.length > 0) {
        var renderConflict1 = "";
        checkconflicts2.map(async (item, idx) => {
          renderConflict1 +=
            '<li class="list-group-item sign-check ' +
            idx +
            '" id=' +
            idx +
            '><span class="glyphicon glyphicon-ok"></span>' +
            item.value +
            "-" +
            item.column +
            "-" +
            item.Client +
            "</li>";
        });
        $(".Sign-Conflict").empty();
        $(".Sign-Conflict").append(renderConflict1);
        await $(".conflictone").show();
      } else {
        $(".Sign-Conflict").empty();
        $(".conflictone").hide();
      }
      if (checkconflicts3.length > 0) {
        var renderConflict3 = "";
        checkconflicts3.map(async (item, idx) => {
           renderConflict3 +=
            '<li class="list-group-item sign-ctrlcheck ' +
            idx +
            '" id=' +
            idx +
            '><span class="glyphicon glyphicon-ok"></span>' +
            item.value +
            "-" +
            item.column +
            "-" +
            item.Client +
            "</li>";
        });
        $(".Sign-CtrlAdverse").empty();
        $(".Sign-CtrlAdverse").append(renderConflict3);
        await $(".conflicttwo").show();
      } else {
        $(".Sign-CtrlAdverse").empty();
        $(".conflicttwo").hide();
      }
      if (checkconflicts4.length > 0) {
        var renderConflict4 = "";
        checkconflicts4.map(async (item, idx) => {
           renderConflict4 +=
            '<li class="list-group-item sign-adcheck ' +
            idx +
            '" id=' +
            idx +
            '><span class="glyphicon glyphicon-ok"></span>' +
            item.value +
            "-" +
            item.column +
            "-" +
            item.Client +
            "</li>";
        });
        $(".Sign-Adverse").empty();
        $(".Sign-Adverse").append(renderConflict4);
        await $(".conflictthree").show();
      } else {
        $(".Sign-Adverse").empty();
        $(".conflictthree").hide();
      }
      if (checkconflicts5.length > 0) {
        var renderConflict5 = "";
        checkconflicts5.map(async (item, idx) => {
           renderConflict5 +=
            '<li class="list-group-item sign-noncheck ' +
            idx +
            '" id=' +
            idx +
            '><span class="glyphicon glyphicon-ok"></span>' +
            item.value +
            "-" +
            item.column +
            "-" +
            item.Client +
            "</li>";
        });
        $(".Sign-NonAdverse").empty();
        $(".Sign-NonAdverse").append(renderConflict5);
        await $(".conflictfour").show();
      } else {
        $(".Sign-NonAdverse").empty();
        $(".conflictfour").hide();
      }
    }

  
    if ($(".glyphicon-ok").length == 0) 
    {
        const iar = await sp.web.lists
        .getByTitle("ClientIntake")
        .items.add({
          Title: "Client InTake",
          PotentialClientName: $("#clientName").val(),
          IndividualsClient: SignClientRender,
          IndividualsAdversary: SignAdverseRender,
          OtherIndividuals: NonAdverseRender,
          PotentialAdversaries: AdverseNameRender
        })
        .then( () => {
          alertify.message("Record Created Successfully");
          this.fetchclientdetails();
          this.setState({showIntakeModal:false});
        }).catch( (e)=>{
           alertify.message("something went wrong.please contact system admin");
          this.setState({showIntakeModal:false})
        });
    }
  
    return isAllValueFilled;
  }

  


  //!Check User Today

  async getUserToday() {
    const d = new Date().toLocaleDateString();
    // items.filter(`DateField ge datetime'${d.toISOString()}'`)
    let list = await sp.web.lists
      .getByTitle("CapacityManagement")
      .items.select(
        "Author/EMail",
        "CapacityLevel",
        "Billable",
        "NonBillable",
        "Created",
        "ID"
      )
      .expand("Author")
      .filter(`Author/EMail eq '${this.state.currentUserDetails.mail}'`)
      .get();
    // console.log(list);
    let filteredData = list.filter((li) => {
      return new Date(li.Created).toLocaleDateString() == d;
    });
    console.log(filteredData.length);
    if (filteredData.length > 0) {
      this.setState({
        billable: filteredData[0].Billable,
        nonbillable: filteredData[0].NonBillable,
        capacityValue: filteredData[0].CapacityLevel,
        capacityEditFlag: true,
        CapacityEditId: filteredData[0].ID,
        capacityData:filteredData
      });
    }
  }
  async getCurrentUserDetails() {
    await this.props.graphClient
      .api("/me")
      .select("mail,displayName,Id")
      .get(async (error, response) => {
        this.setState({ currentUserDetails: response });
        CrntUserEmail=response.mail;
        this.getAdminGroupUsers();
        this.getCurrentUsergroups();
        this.getUserToday();
      });
  }
  async getCurrentUsergroups() {
    let grp = await sp.web.currentUser.groups.get().then((r: any) => {
      this.setState({ currentUserGroups: r });
    });
    this.getConfigData();
  }
  async getConfigData() {
    tilesArray = [];
    var groupsArray = [];
    await sp.web.lists
      .getByTitle("ConfigList")
      .items.filter("Visible eq 1")
      .orderBy("Order0", true)
      .get() 
      .then((allConfigs) => {
        console.log(allConfigs);
        allConfigs= allConfigs.sort(function(a, b){return a.Order0 - b.Order0});
        for (let i = 0; i < allConfigs.length; i++) {
          var item = allConfigs[i];
          var spgroup = this.state.currentUserGroups.filter((g) => {
            if(g.Title=="Capacity Management Admin")
            this.setState({capacityAdmin:true})
            else if(g.Title=="Capacity Management Employee")
            this.setState({capacityEmployee:true})
                return item.SharePointGroupName.indexOf(g.Title)!=-1;
              });
              spgroup.length > 0 ? tilesArray.push({ title: item.Title }) : ""; 
        }

        this.setState({ tilesItems: tilesArray });
      });
  }

  async loadProfilepics() {
    var userPhotoArray=[];
    // const allUsers = await graph.users().then(async(usersdet)=>{
    //   usersdet.forEach(async(SelectedUserProfile)=>{
    //     const specificUser = await graph.users.getById(SelectedUserProfile.mail).photo.getBlob().then((photo: any) => {
    //       const url = window.URL;
    //       const blobUrl = url.createObjectURL(photo);
    //       var proObj={Image:blobUrl,email:SelectedUserProfile.mail};
    //       userPhotoArray.push(proObj);
    //     })
    //     .catch((err) => {
    //       var proObj={Image: "data:image/png;base64,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",email:SelectedUserProfile.mail};
    //       userPhotoArray.push(proObj);
          
    //     });

    //   })
    // });

          // this.setState({ allProfilePics: userPhotoArray });

    await sp.web
      .getFolderByServerRelativeUrl(profileListUrl)
      .files.select("*,listItemAllFields")
      .expand("listItemAllFields")
      .get()
      .then((proItems) => {
        proItems.map((img)=>{
          var proObj={Image:img.ServerRelativeUrl,email:img["ListItemAllFields"]["UserName"],birthday:img["ListItemAllFields"].DateOfBirth,displayName:img["ListItemAllFields"]["UserDisplayName"]};
          userPhotoArray.push(proObj);
        })
        this.setState({ allProfilePics: userPhotoArray });
    this.loadUsersBirthday();

      });
  }
  async getbannerimage() {
    await sp.web
      .getFolderByServerRelativeUrl(SiteImageUrl)
      .files.select("*,listItemAllFields")
      .expand("listItemAllFields")
      .get()
      .then((bannerimg) => {
       var bannerSec= bannerimg.filter((i)=>i["ListItemAllFields"].ImageType=="Banner")
        this.setState({BannerImage: bannerSec[0].ServerRelativeUrl});
        
      });
  }
  public loadUsersBirthday = async() => {
    var todayDate= new Date();
    todayDate.setFullYear(2000);

    var month = "";
    var addDate="";
    var addMonth = todayDate.getMonth() + 1;
   todayDate.getDate()<10?addDate= "0" + todayDate.getDate():addDate=  todayDate.getDate().toString()
    todayDate.getMonth() < 10
      ? (month = "0" + addMonth)
      : (month = addMonth.toString());
    var formatteddate=addDate + "-" +month+ "-2000" 

  
      var profileUrl=[];
      var birthdayArr = [];

        this.state.allProfilePics.filter(
          (eachPro) => {
              if(eachPro.birthday== formatteddate)
              {
                birthdayArr.push({
                  id: birthdayArr.length + 1,
                  mail: eachPro.email,
                  displayname: eachPro.displayName,
                  src: eachPro.Image,
                  altText: "Happy Birthday " + eachPro.displayName + "!",
                  info: `Today ${eachPro.displayName}'s Birthday, Send Him a Great Wish.`,
                  caption: "Happy Birthday " + eachPro.displayName + "!",
                });
              }
              
              // profileUrl.push(eachPro)
            
          }
        );
      
        this.setState({ CarouselItems: birthdayArr });
      

//     this.props.graphClient
//       .api("/users")
//       .select("mail,displayName,Id")
//       .filter("userType eq 'Member'")
//       .get(async (error, response) => {
//         var allUserArray = response.value.filter((m) => m.mail != null);
//         var user;
//         var month = "";
//         var addMonth = new Date().getMonth() + 1;
//         new Date().getMonth() < 10
//           ? (month = "0" + addMonth)
//           : (month = addMonth.toString());
//         var currentDate = new Date().getDate() + "/" + month;

//         for (let i = 0; i < allUserArray.length; i++) {
//           user = allUserArray[i];
//           await this.props.graphClient
//             .api("/users/" + user.mail + "/")
//             .select("birthday")
//             .get()
//             .then(async (bresponse, error) => {
//               var bmonth: any;
//               var addMonth = new Date(bresponse.birthday).getMonth() + 1;
//               new Date(bresponse.birthday).getMonth() + 1 < 10
//                 ? (bmonth = "0" + addMonth)
//                 : (bmonth = addMonth);
//               var bDate = new Date(bresponse.birthday).getDate() + "/" + bmonth;
//               if (currentDate == bDate) {
//                 // const user1 = await sp.web.siteUsers
//                 //   .getByEmail(user.mail)
//                 //   .get()
//                 //   .then(async (userId) => {
//                   var profileUrl=[];
//                      this.state.allProfilePics.filter(
//                       (eachPro) => {
//                           if(eachPro.email== user.mail)
//                           profileUrl.push(eachPro)
                        
//                       }
//                     );

//                     await birthdayArr.push({
//                       id: birthdayArr.length + 1,
//                       mail: user.mail,
//                       displayname: user.displayName,
//                       src: profileUrl[0].Image,
//                       altText: "Happy Birthday " + user.displayName + "!",
//                       info: `Today ${user.displayName}'s Birthday, Send Him a Great Wish.`,
//                       caption: "Happy Birthday " + user.displayName + "!",
//                     });
//                   // });
//               }
//             }).catch((err)=>{
// console.log(err)
//             });
//         }
//       });
  };

  public next(this) {
    const nextIndex =
      this.state.activeIndex === this.state.CarouselItems.length - 1
        ? 0
        : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
  }

  public previous(this) {
    const nextIndex =
      this.state.activeIndex === 0
        ? this.state.CarouselItems.length - 1
        : this.state.activeIndex - 1;
    this.setState({ activeIndex: nextIndex });
  }

  public goToIndex(this, newIndex) {
    this.setState({ activeIndex: newIndex });
  }

  public AddeditCapacityToggle = async () => {

        var profileUrl = this.state.allProfilePics.filter((eachPro) => {
          return eachPro.email == this.state.currentUserDetails.mail;
        });
if(this.state.capacityData.length == 0)
{
  this.setState({
    currentUserProfileUrl: profileUrl[0].Image,
    showCapacityModal: !this.state.showCapacityModal,
    capacityValue:"",
    billable:"",
    nonbillable:"" 
  });
}
else
{
  this.setState({
    currentUserProfileUrl: profileUrl[0].Image,
    showCapacityModal: !this.state.showCapacityModal,
    capacityValue:this.state.capacityData[0].CapacityLevel,
    billable:this.state.capacityData[0].Billable,
    nonbillable:this.state.capacityData[0].NonBillable
  });
}


  };

  public capacityToggle = async () => {
    // const user1 = await sp.web.siteUsers
    //   .getByEmail(this.state.currentUserDetails.mail)
    //   .get()
    //   .then(async (userId) => {
        var profileUrl = this.state.allProfilePics.filter((eachPro) => {
          return eachPro.email == this.state.currentUserDetails.mail;
        });
        this.setState({
          currentUserProfileUrl: profileUrl[0].Image,
          showCapacityModal: !this.state.showCapacityModal,
          capacityValue:"",
          billable:"",
          nonbillable:""
        });
      // });
  };

  public getbill = (e) => {
    const test = e.target.name;
    const EnteredVal = e.target.value;
    e.target.name == "billable"
      ? this.setState({ billable: EnteredVal })
      : e.target.name == "nonbillable"
      ? this.setState({ nonbillable: EnteredVal })
      : e.target.name == "capacity-check"
      ? this.setState({ capacityValue: e.target.innerText })
      : "";
  };
  // public getnonbill = (e)=>{
  //   this.setState({nonbillable:e.target.value});
  // }
  //! Post Capacity
  public capacityPost = async () => {
    if (this.state.capacityValue == "") {
      alertify.message("Please Choose Capacity Level");
    } else if (this.state.billable == "") {
      alertify.message("Please enter Billable");
    } else if (this.state.nonbillable == "") {
      alertify.message("Please enter Non-Billable");
    } else {
      if (!this.state.capacityEditFlag) {
        await sp.web.lists
          .getByTitle("CapacityManagement")
          .items.add({
            CapacityLevel: this.state.capacityValue,
            Billable: this.state.billable,
            NonBillable: this.state.nonbillable,
          })
          .then(() => {
            this.setState({
              billable: "",
              nonbillable: "",
              capacityValue: "",
              showCapacityModal: !this.state.showCapacityModal,
            });
            this.getUserToday();
          });
      } else {
        let list = sp.web.lists.getByTitle("CapacityManagement");
        const i = await list.items
          .getById(this.state.CapacityEditId)
          .update({
            CapacityLevel: this.state.capacityValue,
            Billable: this.state.billable,
            NonBillable: this.state.nonbillable,
          })
          .then(() => {
            this.setState({
              billable: "",
              nonbillable: "",
              capacityValue: "",
              showCapacityModal: !this.state.showCapacityModal,
            });
            this.getUserToday();
          });
      }
    }
  };

  public  getAdminGroupUsers=async()=>
{
  await sp.web.siteGroups.getByName("Client Conflict Admins").users().then(async (items)=>
  {
      Adminuser=false;
      for(var i=0;i<items.length;i++)
      {
          if(CrntUserEmail==items[i].Email)
          {
              Adminuser=true;
              this.setState({ClientIntakeAdmin:true});
          }
      }
      await this.getReadGroupUsers();
  }).catch(function (error) 
  {
    ErrorCallBack(error, "getAdminGroupUsers");
  });
}
public getReadGroupUsers=async()=>
{
  await sp.web.siteGroups.getByName("Client Conflict Read only").users().then(async (items)=>
  {
    ReadUser=false;
    for(var i=0;i<items.length;i++)
    {
        if(CrntUserEmail==items[i].Email)
        {
          ReadUser=true;
          this.setState({ClientIntakereadUser:true});
        }
    }
    await this.getRecipientUserGroupUsers()
  }).catch(function (error) 
  {
    ErrorCallBack(error, "getReadGroupUsers");
  });
}
public getRecipientUserGroupUsers=async()=>
{
  await sp.web.siteGroups.getByName("Client Conflict Recipient").users().then(async(items)=>
  {
    RecipientUser=false;
    for(var i=0;i<items.length;i++)
    {
        RecipentUsersMail.push(items[i].Email);
        if(CrntUserEmail==items[i].Email)
        {
          RecipientUser=true;
          this.setState({ClientIntakeRepUser:true});
        }
    }
    
    if(!Adminuser)
    $("#btnNewRecord").hide();
    else
    $("#btnNewRecord").show();

    if(RecipientUser||Adminuser||ReadUser)
    await this.fetchclientdetails();
    // else
    // alertify.message("You Don't have Permission to access this page");

  }).catch(function (error) 
  {
    ErrorCallBack(error, "getRecipientUserGroupUsers");
  });
}

 fetchclientdetails=async()=> {
  await sp.web.lists
    .getByTitle("ClientIntake")
    .items.top(5000).orderBy("Modified",false)
    .get()
    .then(async (items: any) => {
      AllItems=items;
      var html = "";
      for (var i = 0; i < items.length; i++) {
        var formattedAdverse = "";
        var formattedClient = "";
        var formattedNonAdverse = "";
        var formattedAdverseNames = "";
        if (items[i].IndividualsAdversary) {

          var splitValueAdverse = items[i].IndividualsAdversary.replace(
            /;/g,
            "</br>"
          );
          formattedAdverse = "<div>" + splitValueAdverse + "</div>";
        }

        if (items[i].IndividualsClient) {

          var splitValueClient = items[i].IndividualsClient.replace(
            /;/g,
            "</br>"
          );
          formattedClient = "<div>" + splitValueClient + "</div>";
        }
        if (items[i].OtherIndividuals) {

          var splitValueNonAdverse = items[i].OtherIndividuals.replace(
            /;/g,
            "</br>"
          );
          formattedNonAdverse = "<div>" + splitValueNonAdverse + "</div>";
        }
        if (items[i].PotentialAdversaries) {

          var splitValueAdverseNames = items[i].PotentialAdversaries.replace(
            /;/g,
            "</br>"
          );
          formattedAdverseNames = "<div>" + splitValueAdverseNames + "</div>";
        }

       

        if (items[i].PotentialClientName) {
          arrClientName.push(items[i].PotentialClientName.toLowerCase());
        }

        if (items[i].IndividualsClient) {
          items[i].IndividualsClient.split(";").map(async (item) => {
            if (item != "")
              await arrIndivuals.push({
                value: item.toLowerCase(),
                column: "Individuals with Significant (Client)",
                Client: items[i].PotentialClientName.toLowerCase(),
              });
          });
        }

        if (items[i].PotentialAdversaries) {

          items[i].PotentialAdversaries.split(";").map(async (item) => {
            if (item != "")
              await arrAdverseName.push({
                value: item.toLowerCase(),
                column: "Potential Adversaries",
                Client: items[i].PotentialClientName.toLowerCase(),
              });
          });
        }

        if (items[i].IndividualsAdversary) {
          items[i].IndividualsAdversary.split(";").map(async (item) => {
            if (item != "")
              await arrAdversindicual.push({
                value: item.toLowerCase(),
                column: "Individuals with Significant (Adversary)",
                Client: items[i].PotentialClientName.toLowerCase(),
              });
          });
        }

        if (items[i].OtherIndividuals) {

          items[i].OtherIndividuals.split(";").map(async(item) => {
            if (item != "")
              await arrNonAdversName.push({
                value: item.toLowerCase(),
                column: "Other Individuals",
                Client: items[i].PotentialClientName.toLowerCase(),
              });
          });
        }
      }
      Allvalues = arrNonAdversName
        .concat(arrIndivuals)
        .concat(arrAdverseName)
        .concat(arrAdversindicual);
      // .concat(arrNonAdversName);
      this.setState({allClientIntakeData:AllItems})

    })
    .catch(async function (error) {
      await alertify.message(error.message);
    });


  setTimeout(function () {}, 3000);
}

public clientSave = async () => {
  clientvalue=[];
  adversvalue=[];
  potentialadversarievalue=[];
  otherindivualvalue=[];

  $("#btnSave").attr("disabled", true);
  SignClientRender = "";
  AdverseNameRender = "";
  SignAdverseRender = "";
  NonAdverseRender = "";
  //$('#btnSave').click((e)=>{
  var SignClient = document.getElementsByClassName("SignClient");
  for (let i = 0; i < SignClient.length; i++) {
    if (SignClient[i]["value"])
      SignClientRender =
        SignClientRender + (SignClient[i])["value"] + ";";
  }

  var AdverseName = document.getElementsByClassName("Adverse");
  for (let i = 0; i < AdverseName.length; i++) {
    if (AdverseName[i]["value"])
      AdverseNameRender =
        AdverseNameRender + (AdverseName[i])["value"] + ";";
  }
  var SignAdverse = document.getElementsByClassName("SignAdverse");
  for (let i = 0; i < SignAdverse.length; i++) {
    if (SignAdverse[i]["value"])
      SignAdverseRender =
        SignAdverseRender + (SignAdverse[i])["value"] + ";";
  }
  var NonAdverse = document.getElementsByClassName("nonAdverse");
  for (let i = 0; i < NonAdverse.length; i++) {
    if (NonAdverse[i]["value"])
      NonAdverseRender =
        NonAdverseRender + (NonAdverse[i])["value"] + ";";
  }

  this.mandatoryvalidation();

}  

  // TODO Rendering
  public render(): React.ReactElement<IAdseroTeamsManagementProps> {
    return this.state.landingActive ? (
      <div>  
        <div className="banner-section">
        <img src={this.state.BannerImage} className="banner-img" alt=""/>
        <Row className="banner-image">
          <Col md={{ size: 6 }} lg={{ size: 8 }} className="left">
            <h2 className="banner-caps">Integrity. Respect. Trust</h2>
          </Col>
          {this.state.CarouselItems.length>0?
          <Col
            xs={{ size: 12 }}
            sm={{ size: 12 }}
            md={{ size: 3 }}
            lg={{ size: 3 }}
            xl={{ size: 2 }}
            className="right"
          > 
            {
              (slides = this.state.CarouselItems.map((item) => {
                var email = `mailto:${item.mail}?subject=Birthday Wishes&body=Happy Birthday to ${item.displayname}`
                return (
                  <CarouselItem key={item.id}>
                    <div className="caro-image">
                      <img
                        src={item.src}
                        alt={item.altText}
                        height="300px"
                        width="100%"
                      />   
                    </div>  
                    <div className="caro-caption d-block">
                      <div className="caro-slogo"></div>
                      <CarouselCaption
                      className="d-block"
                        captionText={item.info}
                        captionHeader={item.caption}
                      />{" "}
                    </div>   
                    <div className="text-right">
                     
                     
                    <a href={email}>     
                    <button className="btn btn-theme-lg ">Send Wish</button>{" "}
                    </a>
                    </div>
                  </CarouselItem>  
                );
              }))
            }
            <Carousel
              activeIndex={this.state.activeIndex}
              next={() => this.previous.call(this)}
              previous={() => this.next.call(this)}
            >
              <CarouselIndicators
                items={this.state.CarouselItems}
                activeIndex={this.state.activeIndex}
                onClickHandler={(num) => this.goToIndex.call(this, num)}
              />
              {slides}
              <CarouselControl
                direction="prev"
                directionText="Previous"
                onClickHandler={() => this.previous.call(this)}
              />
              <CarouselControl
                direction="next"
                directionText="Next"
                onClickHandler={() => this.next.call(this)}
              />
            </Carousel>
          </Col>:""}
        </Row>
        </div>
        <div className="tile-section">
          <div className="row">
            {this.state.tilesItems.length > 0
              ? this.state.tilesItems.map((tItems) => { 
                return (
                tItems.title=="Capacity Management System"&&(this.state.capacityAdmin||this.state.capacityEmployee)?
                 
                    <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3">
                      <div className="tile">
                        <div className="tile-title-section">
                          <div className="tile-logo"></div>
                          <div className="tile-header">
                            <h2>{tItems.title}</h2>
                            <p></p>
                          </div>
                        </div>
                        <div className="tile-btn-section text-right">
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={this.AddeditCapacityToggle}
                          >
                            Add / Edit
                          </button>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={(e) =>{
                              this.setState({ landingActive: false,pageSwitch:"Dashboard" });
                              console.log(this.state.pageSwitch)}
                              
                            }
                          >
                            Dashboard
                          </button>
                          {this.state.capacityAdmin?  <button className="btn btn-sm btn-primary"
                          onClick={() =>{
                            this.setState({ landingActive: false,pageSwitch:"Summary"});
                          console.log(this.state.pageSwitch);
                          }
                          }>
                            Summary
                          </button>:""}
                        
                        </div>
                      </div>
                    </div>:tItems.title=="Client Intake Management"&&(this.state.ClientIntakeAdmin||this.state.ClientIntakeRepUser||this.state.ClientIntakereadUser)?
                     <div className="col-sm-12 col-md-6 col-lg-4 col-xl-3">
                     <div className="tile">
                       <div className="tile-title-section">
                         <div className="tile-logo"></div>
                         <div className="tile-header">
                           <h2>{tItems.title}</h2>
                           <p></p>
                         </div>
                       </div>
                       <div className="tile-btn-section text-right">
                         { this.state.ClientIntakeAdmin ? <button
                           className="btn btn-sm btn-primary"
                           onClick={()=>this.setState({showIntakeModal:true})}
                         >
                           Add
                         </button>:""}
                         { this.state.ClientIntakeAdmin||this.state.ClientIntakeRepUser||this.state.ClientIntakereadUser ?  <button
                           className="btn btn-sm btn-primary"
                           onClick={(e) =>{
                             this.setState({ landingActive: false,showIntakeDashboard:true });
                             console.log(this.state.pageSwitch)}
                             
                           }
                         >
                           Dashboard
                         </button>:""}
                       </div>  
                     </div>
                   </div>:""
                  );                        
                })
              : <h4>No Tabs to Display</h4>}
          </div>
        </div>
        <Modal
          isOpen={this.state.showCapacityModal}
          toggle={this.capacityToggle}
          className="capacity-modal"
        > 
        <div className="modal-header-section"> 
          <ModalHeader toggle={this.capacityToggle} className="text-center addeditallocation">
            Add or Edit Allocation  
          </ModalHeader>
          <div className="ragylogo"></div>
          </div>
          <ModalBody>   
            <div className="cur-user-info text-right">
              <span>Hi, {this.state.currentUserDetails.displayName}</span>
              <img
                src={this.state.currentUserProfileUrl}
                alt=""
                className="user-dp"
                width="40"
                height="40"
              />
            </div>
            <div className="status-btn">
              <button
                name="capacity-check"
                className={
                  "btn-status btn-full " +
                  (this.state.capacityValue == "Full" ? "active" : "")
                }
                onClick={this.getbill}
              >
                Full
              </button>
              <button
                name="capacity-check"
                className={
                  "btn-status btn-medium " +
                  (this.state.capacityValue == "Medium" ? "active" : "")
                }
                onClick={this.getbill}
              >
                Medium
              </button>
              <button
                name="capacity-check"
                className={
                  "btn-status btn-low " +
                  (this.state.capacityValue == "Low" ? "active" : "")
                }
                onClick={this.getbill}
              >
                Low
              </button>
              <button
                name="capacity-check"
                className={
                  "btn-status btn-off " +
                  (this.state.capacityValue == "Off" ? "active" : "")
                }
                onClick={this.getbill}
              >
                Off
              </button>
            </div>
            <div className="status-btn-notes">
              Please choose your capacity level.
            </div>
            <FormGroup>
              <Label for="exampleText">Billable</Label>
              <Input
                type="textarea"
                value={this.state.billable}
                onChange={this.getbill}
                name="billable"
                id="billable"
                row="5"
              />
            </FormGroup>
            <FormGroup>
              <Label for="exampleText">Non - Billable</Label>
              <Input
                type="textarea"
                value={this.state.nonbillable}
                onChange={this.getbill}
                name="nonbillable"
                id="nonbillable"
                row="5"
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.capacityToggle}>
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={this.capacityPost}
              className="mr-0"
            >
              Submit
            </Button>{" "}
          </ModalFooter>    
        </Modal>
        <Modal 
          isOpen={this.state.showIntakeModal}
          toggle={()=>this.setState({showIntakeModal:false})}
          className="client-intake-modal" 
        >
          <div className="modal-header-section">  
          <ModalHeader  className="text-center">
            Add Client Intake 
          </ModalHeader>
          <div className="ragylogo"></div>
          </div>  
          <ModalBody>
          
    <div className="form-container-fluid">
    <div className="row">
    <div className="col-sm-12">
    <div className="row">
    <div className="mandatoryInfo col-sm-12 pr-1"><span className="MStar">*</span><label>Mandatory Field</label></div>
        
    <div className="potential-client-sec">

     
      <div className="col-common col-sm-12 form-group mand">
      
      <input type="text" className="form-control" id="clientName" placeholder="Potential Client Name" />
      </div>
      </div>
    </div>
    </div>
    </div>

    <div className="row" style={{display:"none"}}>
    <div className="col-sm-6 main-left-column">
    <div className="row">
    <div className="form-group">

      <div className="col-common col-sm-12 form-group">
      <input type="text" className="form-control" id="MName" placeholder="Matter Name" />
      </div>
      </div>
    </div>
    </div>

        <div className="col-sm-6 main-right-column" style={{display:"none"}}>
    <div className="row">
    <div className="form-group">
   
      <div className="col-common col-sm-12 form-group">
      <input type="text" className="form-control" id="MNumber" placeholder="Matter Number" />
      </div>
      </div>
    </div>
    </div>
    </div>
    

    <div className="row ">
    <div className="col-sm-6 main-left-column">
    <div className="row ParSignClient">
    <div className="col-common col-sm-12">  
    <div className="form-group">

    <input type="text" className="SignClient form-control" placeholder="Individuals with Significant (Client):" />
    <button className="btn btn-primary add-icon" id="btnClient">
      <span className="addicon"></span>
    {/* <i className="glyphicon glyphicon-plus">+</i> */}
    </button>

  </div>
  

  <div className="SignParaDiv"></div>

  <div className="alert alert-warning custom-alert conflictone" style={{display:"none"}}>
<ul className="list-group custom-list-group Sign-Conflict">
  
</ul>
</div>
    </div>
    </div>
    <div className="">
    <div className="row ">
    <div className="col-common col-sm-12 ">
    <div className="form-group">
     
      <input type="text" className="Adverse form-control" placeholder="Potential Adversaries" />
      <button className="btn btn-primary add-icon"  id="btnAdverse">
      <span className="addicon"></span>
        {/* <i className="glyphicon glyphicon-plus">+</i> */}
      </button>

    </div>
    </div>
    
    
    </div>
    <div className="ParAdverseName"></div>

    <div className="alert alert-warning custom-alert conflictthree" style={{display:"none"}}>

<ul className="list-group custom-list-group Sign-Adverse">
  
</ul>
</div>
    </div>


    
    </div>
    <div className="col-sm-6 main-right-column">    

<div className="row ">
<div className="col-common col-sm-12">
<div className="form-group">

  <input type="text" className="SignAdverse form-control" placeholder="Individuals with Significant (Adversary)" />
          <button className="btn btn-primary add-icon" id="btnSignAdverse">
          <span className="addicon"></span>
        {/* <i className="glyphicon glyphicon-plus">+</i> */}
      </button>

</div>
</div>
</div>

<div className="InAdverse"></div>
<div className="alert alert-warning custom-alert conflicttwo" style={{display:"none"}}>

<ul className="list-group custom-list-group Sign-CtrlAdverse">
  
</ul>
</div>

    
    <div className="row ">
    <div className="col-common col-sm-12">
    <div className="form-group">
   
      <input type="text" className="nonAdverse form-control" placeholder="Other Individuals" id="btnnonAdverse" />
      <button className="btn btn-primary add-icon" id="btnnonAdverseDel">
      {/* <i className="glyphicon glyphicon-plus">+</i> */}
      <span className="addicon"></span>
      </button>
 
    </div>
    </div>
    </div>

    <div className="nonParAdverse"> </div>
    <div className="alert alert-warning custom-alert conflictfour" style={{display:"none"}}>

<ul className="list-group custom-list-group Sign-NonAdverse">
  
</ul>
</div>
</div>
</div></div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={()=>this.setState({showIntakeModal:false})}>
              Cancel
            </Button>
        

            <Button
              color="primary"
              className="mr-0" id="btnSave" onClick={this.clientSave}
            >
               <span className="button-text">Conflict Check</span>
            </Button>{" "}
          </ModalFooter>
        </Modal>
      </div>
    ):this.state.showIntakeDashboard?(<ClientIntakeDashboard  RecipentUsersMailDetails={RecipentUsersMail}  description={this.props.description} siteUrl={this.props.siteUrl}
    spcontext={this.props.context}
    graphClient={this.props.graphClient} allClientData={this.state.allClientIntakeData} isClientIntakeAdmin={this.state.ClientIntakeAdmin}/> ): (
      <CapacityDashboard
        ProfileData={this.state.allProfilePics}
        description={this.props.description}
        siteUrl={this.props.siteUrl}
        spcontext={this.props.context}
        graphClient={this.props.graphClient}
        landingSwitch={this.state.landingActive}
        pageSwitching={this.state.pageSwitch}
      />
    )
  }
}



async function ErrorCallBack(error,methodname)
{
  console.log(error);
}





async function checkconflictsonchange()
{

  var arrNewClientSigntemp  = [];
  var arrNewAdversetemp  = [];
  var arrNewAdverseSigntemp  = []; 
  var arrNewNonAdversetemp  = [];

  var isNoNewValue=false;


  await $(".SignClient").each(async function (key, val) 
  {
    if(val.value)
    await arrNewClientSigntemp.push(val.value.toLowerCase());
  });

  await $(".Adverse").each(async function (key, val)
  {
    if(val.value)
    await arrNewAdversetemp.push(val.value.toLowerCase());
  });

  await $(".SignAdverse").each(async function (key, val) {
    if(val.value)
    await arrNewAdverseSigntemp.push(val.value.toLowerCase());
  });

  await $(".nonAdverse").each(async function (key, val) {
    if(val.value)
    await arrNewNonAdversetemp.push(val.value.toLowerCase());
  });

  if(arrNewClientSigntemp.length!=clientvalue.length)
  isNoNewValue=true;
  else if(arrNewAdversetemp.length!=adversvalue.length)
  isNoNewValue=true;
  else if(arrNewAdverseSigntemp.length!=potentialadversarievalue.length)
  isNoNewValue=true;
  else if(arrNewNonAdversetemp.length!=otherindivualvalue.length)
  isNoNewValue=true;

        if(isNoNewValue)
        {
          $("#btnSave").text("Client Conflict");
        }
        else
        {
          $("#btnSave").text("Submit");
        }
}
