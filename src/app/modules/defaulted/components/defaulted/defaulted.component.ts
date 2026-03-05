import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { FsChipModule } from '@firestitch/chip';


@Component({
    selector: 'app-defaulted',
    templateUrl: './defaulted.component.html',
    styleUrls: ['./defaulted.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [FsChipModule],
})
export class DefaultedComponent {

}
