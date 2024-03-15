import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { createApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { ApplicationRef } from '@angular/core';

(async () => {
  const app: ApplicationRef = await createApplication(appConfig);

  const nextimeDeliveryDate = createCustomElement(AppComponent, {
    injector: app.injector,
  });
  customElements.define('nextime-delivery-date', nextimeDeliveryDate);
})();
