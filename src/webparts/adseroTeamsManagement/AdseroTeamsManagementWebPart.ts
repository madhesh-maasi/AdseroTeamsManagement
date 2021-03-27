import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { MSGraphClient, HttpClient } from '@microsoft/sp-http';
import * as strings from 'AdseroTeamsManagementWebPartStrings';
import AdseroTeamsManagement from './components/AdseroTeamsManagement';
import { IAdseroTeamsManagementProps } from './components/IAdseroTeamsManagementProps';

export interface IAdseroTeamsManagementWebPartProps {
  description: string;
  siteUrl:string;
}

export default class AdseroTeamsManagementWebPart extends BaseClientSideWebPart<IAdseroTeamsManagementWebPartProps> {

  public render(): void {
    this.context.msGraphClientFactory.getClient()
    .then((_graphClient: MSGraphClient): void => {
    const element: React.ReactElement<IAdseroTeamsManagementProps> = React.createElement(
      AdseroTeamsManagement,
      {
            description: this.properties.description,
            context: this.context,
            graphClient: _graphClient,
            siteUrl: this.context.pageContext.web.absoluteUrl,
      }
    );

    ReactDom.render(element, this.domElement);
    });
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
