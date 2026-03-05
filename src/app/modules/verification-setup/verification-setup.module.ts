import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { FsFormModule } from '@firestitch/form';
import { FsLabelModule } from '@firestitch/label';
import { FsSkeletonModule } from '@firestitch/skeleton';




import { VerificationMethodData } from './data';
import { VerificationSetupService } from './services';
import { VerificationSetupRoutingModule } from './verification-setup-routing.module';
import { EmailComponent, VerifyComponent } from './views';


@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    FsFormModule,
    FsSkeletonModule,
    FsLabelModule,
    VerificationSetupRoutingModule,
    EmailComponent,
    VerifyComponent,
],
    providers: [
        VerificationMethodData,
        VerificationSetupService,
    ],
})
export class FsVerificationSetupModule { }
