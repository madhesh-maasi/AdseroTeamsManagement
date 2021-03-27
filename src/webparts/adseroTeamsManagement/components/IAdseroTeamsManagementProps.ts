import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IAdseroTeamsManagementProps {
  description: string;
  context: WebPartContext;
  siteUrl: string;
  graphClient: any;
}
