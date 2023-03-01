import { Component, OnInit } from '@angular/core';
import { Embed, factories, service } from 'powerbi-client';
import { environment } from 'src/environments/environment';


export type EventHandler = (event?: service.ICustomEvent<any>, embeddedEntity?: Embed) => void | null;

@Component({
  selector: 'app-powerbi-embed',
  templateUrl: './powerbi-embed.component.html',
  styleUrls: ['./powerbi-embed.component.scss'],
})
export class PowerbiEmbedComponent implements OnInit {

   // Power BI service
   powerbi!: service.Service;

  constructor() {}
  
  private prevEventHandlerMapString = '';

  ngOnInit() {
    this.powerbi.setSdkInfo(environment.sdkType, environment.sdkWrapperVersion);
  }


  protected setEventHandlers(embed: Embed, eventHandlerMap: Map<string, EventHandler | null>): void {
    // Get string representation of eventHandlerMap
    const eventHandlerMapString = JSON.stringify(eventHandlerMap);

    // Check if event handler map changed
    if (this.prevEventHandlerMapString === eventHandlerMapString) {
      return;
    }

    // Update prev string representation of event handler map
    this.prevEventHandlerMapString = eventHandlerMapString;

    // Apply all provided event handlers
    eventHandlerMap.forEach((eventHandlerMethod, eventName) => {
      // Removes event handler for this event
      embed.off(eventName);

      // Event handler is effectively removed for this event when eventHandlerMethod is null
      if (eventHandlerMethod) {
        // Set single event handler
        embed.on(eventName, (event: service.ICustomEvent<any>): void => {
          eventHandlerMethod(event, embed);
        });
      }
    });
  }
}
