'use strict';

import {Type, Provider, provide} from '@angular/core';
import {bootstrap as origBoot} from 'angular2-meteor-auto-bootstrap';
import {APP_BASE_HREF} from '@angular/common';
import {PromiseQ} from 'angular2-meteor';

import {Router} from './router';
import {waitRender, waitRouter} from './utils';

export function bootstrap(appComponentType: any,
                          providers: Array<Type | Provider | any[]> = null) {
  providers = (providers || []).concat(
    provide(APP_BASE_HREF, { useValue: Router.baseUrl }));

  Preboot.start();
  Meteor.defer(() => {
    Meteor.startup(() => {
      origBoot(appComponentType, providers)
        .then(compRef => {
          return waitRender(compRef).then(() => compRef);
        })
        .then(compRef => {
          PromiseQ.onAll(() => {
            console.log('Data is ready');
            waitRender(compRef).then(() => {
              Preboot.complete();
            });
          });
        });
    });
  });
}

declare interface PrebootRef {
  start();
  complete();
}

class Preboot {
  private static _prebootRef: PrebootRef;

  static start() {
    this.init();

    if (this._prebootRef) {
      this._prebootRef.start();
    }
  }

  static complete() {
    this.init();

    if (this._prebootRef) {
      this._prebootRef.complete();
    }
  }

  static init() {
    if (!this._prebootRef) {
      this._prebootRef = global['preboot'];
    }
  }
}

export class ClientRenderer {
  static render(component, providers?) {
    bootstrap(component, providers);
  }
}
