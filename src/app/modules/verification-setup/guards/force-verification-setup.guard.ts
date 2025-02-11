import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { FsCookie } from '@firestitch/cookie';


@Injectable({
  providedIn: 'root',
})
export class ForceVerificationSetupGuard  {

  private _cookie = inject(FsCookie);
  private _router = inject(Router);

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    if (this._cookie.get('Token-Force-2fa')) {
      const redirect = window.location.pathname + window.location.search;

      return this._router
        .createUrlTree(['/verification'], { queryParams: { redirect } });
    }

    return true;
  }

}
