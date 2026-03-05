import { Component } from '@angular/core';
import { environment } from '@env';
import { FsExampleModule } from '@firestitch/example';
import { VerificationComponent } from '../verification/verification.component';
import { ManageVerificationsComponent } from '../manage-verifications/manage-verifications.component';
import { VerificationMethodsComponent } from '../verification-methods/manage-verifications.component';


@Component({
    templateUrl: 'examples.component.html',
    standalone: true,
    imports: [FsExampleModule, VerificationComponent, ManageVerificationsComponent, VerificationMethodsComponent]
})
export class ExamplesComponent {
  public config = environment;
}
