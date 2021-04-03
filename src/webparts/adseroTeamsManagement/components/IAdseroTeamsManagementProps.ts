import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IAdseroTeamsManagementProps {
  description: string;
  context: WebPartContext;
  siteUrl: string;
  graphClient: any;
}

export interface ICapacityDashBoardProps {
  description: string;
  spcontext: WebPartContext;
  siteUrl: string;
  graphClient: any;
  ProfileData:any;
  landingSwitch:Boolean;
  pageSwitching:String;
 
}
