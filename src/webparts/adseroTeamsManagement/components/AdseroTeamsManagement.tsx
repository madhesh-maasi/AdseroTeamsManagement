import * as React from "react";
import { Container, Row, Col } from "reactstrap";
import { useState } from "react";
import styles from "./AdseroTeamsManagement.module.scss";
import { IAdseroTeamsManagementProps } from "./IAdseroTeamsManagementProps";
import { escape } from "@microsoft/sp-lodash-subset";
import "../../../ExternalRef/CSS/style.css";
import "../../../ExternalRef/CSS/alertify.min.css";
import * as alertify from "alertifyjs";
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
import CapacityDashboard from "./CapacityDashboard";
var profileListUrl = "/sites/adsero/ProfilePictures/";

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
}
var slides = [];
var tilesArray = [];
export default class AdseroTeamsManagement1 extends React.Component<
  IAdseroTeamsManagementProps,
  IcarosuelState
> {
  constructor(props: IAdseroTeamsManagementProps) {
    super(props);
    sp.setup({
      sp: {
        baseUrl: this.props.siteUrl,
      },
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
    };
    this.loadProfilepics();
    this.loadUsersBirthday();
    this.getCurrentUserDetails();
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
      });
    }
  }
  async getCurrentUserDetails() {
    await this.props.graphClient
      .api("/me")
      .select("mail,displayName,Id")
      .get(async (error, response) => {
        this.setState({ currentUserDetails: response });
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
      .orderBy("Order", true)
      .get()
      .then((allConfigs) => {
        console.log(allConfigs);
        for (let i = 0; i < allConfigs.length; i++) {
          var item = allConfigs[i];
          if (item.AccessType == "Group") {
            if (item.GroupType == "SharePoint") {
              var spgroup = this.state.currentUserGroups.filter((g) => {
                return g.Title == item.SharePointGroupName;
              });
              spgroup.length > 0 ? tilesArray.push({ title: item.Title }) : "";
            } else if (item.GroupType == "O365") {
              var string = {
                groupIds: item.AzureGroupID,
              };
              this.props.graphClient
                .api("/me/checkMemberGroups")
                .post(string)
                .then((aGroups) => {
                  aGroups.length > 0
                    ? tilesArray.push({ title: item.Title })
                    : "";
                });
            }
          } else if (item.AccessType == "User") {
            if (
              item.UserName.toLowerCase() ==
              this.state.currentUserDetails.mail.toLowerCase()
            ) {
              tilesArray.push({ title: item.Title });
            }
          }
        }
        console.log(tilesArray);
        this.setState({ tilesItems: tilesArray });
      });
  }

  async loadProfilepics() {
    await sp.web
      .getFolderByServerRelativeUrl(profileListUrl)
      .files.select("*,listItemAllFields")
      .expand("listItemAllFields")
      .get()
      .then((proItems) => {
        this.setState({ allProfilePics: proItems });
      });
  }

  public loadUsersBirthday = () => {
    this.props.graphClient
      .api("/users")
      .select("mail,displayName,Id")
      .filter("userType eq 'Member'")
      .get(async (error, response) => {
        var allUserArray = response.value.filter((m) => m.mail != null);
        var user;
        var birthdayArr = [];
        var month = "";
        var addMonth = new Date().getMonth() + 1;
        new Date().getMonth() < 10
          ? (month = "0" + addMonth)
          : (month = addMonth.toString());
        var currentDate = new Date().getDate() + "/" + month;

        for (let i = 0; i < allUserArray.length; i++) {
          user = allUserArray[i];
          await this.props.graphClient
            .api("/users/" + user.mail + "/")
            .select("birthday")
            .get()
            .then(async (bresponse, error) => {
              var bmonth: any;
              var addMonth = new Date(bresponse.birthday).getMonth() + 1;
              new Date(bresponse.birthday).getMonth() + 1 < 10
                ? (bmonth = "0" + addMonth)
                : (bmonth = addMonth);
              var bDate = new Date(bresponse.birthday).getDate() + "/" + bmonth;
              if (currentDate == bDate) {
                const user1 = await sp.web.siteUsers
                  .getByEmail(user.mail)
                  .get()
                  .then(async (userId) => {
                    var profileUrl = this.state.allProfilePics.filter(
                      (eachPro) => {
                        return (
                          eachPro.ListItemAllFields.UserNameId == userId.Id
                        );
                      }
                    );

                    await birthdayArr.push({
                      id: birthdayArr.length + 1,
                      mail: user.mail,
                      displayname: user.displayName,
                      src: profileUrl[0].ServerRelativeUrl,
                      altText: "Happy Birthday " + user.displayName + "!",
                      info: `Today ${user.displayName}, Send Him a Great Wish.`,
                      caption: "Happy Birthday " + user.displayName + "!",
                    });
                  });
              }
            });
        }
        this.setState({ CarouselItems: birthdayArr, allUsers: allUserArray });
      });
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

  public capacityToggle = async () => {
    const user1 = await sp.web.siteUsers
      .getByEmail(this.state.currentUserDetails.mail)
      .get()
      .then(async (userId) => {
        var profileUrl = this.state.allProfilePics.filter((eachPro) => {
          return eachPro.ListItemAllFields.UserNameId == userId.Id;
        });
        this.setState({
          currentUserProfileUrl: profileUrl[0].ServerRelativeUrl,
          showCapacityModal: !this.state.showCapacityModal,
        });
      });
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


  // TODO Rendering
  public render(): React.ReactElement<IAdseroTeamsManagementProps> {
    return this.state.landingActive ? (
      <div>
        <Row className="banner-image">
          <Col md={{ size: 6 }} lg={{ size: 8 }} className="left">
            <h2 className="banner-caps">Integrity. Respect. Trust</h2>
          </Col>
          <Col
            xs={{ size: 12 }}
            sm={{ size: 12 }}
            md={{ size: 5 }}
            lg={{ size: 3 }}
            className="right"
          >
            {
              (slides = this.state.CarouselItems.map((item) => {
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
                    <div className="caro-caption">
                      <div className="caro-slogo"></div>
                      <CarouselCaption
                        captionText={item.info}
                        captionHeader={item.caption}
                      />{" "}
                    </div>
                    <div className="text-right">
                      <Button className="btn-theme-lg">Send Wish</Button>{" "}
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
          </Col>
        </Row>
        <div className="tile-section">
          <div className="row">
            {this.state.tilesItems.length > 0
              ? this.state.tilesItems.map((tItems) => {
                  return (
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
                            onClick={this.capacityToggle}
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
                          <button className="btn btn-sm btn-primary"
                          onClick={() =>{
                            this.setState({ landingActive: false,pageSwitch:"Summary"});
                          console.log(this.state.pageSwitch);
                          }
                          }>
                            Summary
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              : ""}
          </div>
        </div>
        <Modal
          isOpen={this.state.showCapacityModal}
          toggle={this.capacityToggle}
          className="capacity-modal"
        >
          <ModalHeader toggle={this.capacityToggle} className="text-center">
            Add or Edit Allocation
          </ModalHeader>
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
      </div>
    ) : (
      <CapacityDashboard
        ProfileData={this.state.allProfilePics}
        description={this.props.description}
        siteUrl={this.props.siteUrl}
        spcontext={this.props.context}
        graphClient={this.props.graphClient}
        landingSwitch={this.state.landingActive}
        pageSwitching={this.state.pageSwitch}
      />
    );
  }
}
