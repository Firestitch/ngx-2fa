import { NgModule } from '@angular/core';

import { Fs2faManageComponent } from './components/2fa-manage/2fa-manage.component';

@NgModule({
    imports: [
        Fs2faManageComponent,
    ],
    exports: [
        Fs2faManageComponent,
    ],
})
export class Fs2faManageModule { }
