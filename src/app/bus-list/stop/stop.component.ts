import { Component, OnInit, Input } from '@angular/core';
import { ControlContainer, FormGroupDirective} from '@angular/forms';

@Component({
  selector: 'app-stop',
  templateUrl: './stop.component.html',
  styleUrls: ['./stop.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class StopComponent implements OnInit {
  @Input() stop;
  @Input() stopIndex;
  @Input() routeIndex;
  public stopForm: any;

  constructor(private parentF: FormGroupDirective) { 
    this.stopForm = this.parentF.form;
  }

  ngOnInit() {}

}
