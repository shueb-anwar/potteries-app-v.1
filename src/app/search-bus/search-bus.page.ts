import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { PaymentGatewayService } from '../payment.service';
import { Geolocation } from '@capacitor/geolocation';
import { LocationService } from '../location.service';

@Component({
  selector: 'app-search-bus',
  templateUrl: './search-bus.page.html',
  styleUrls: ['./search-bus.page.scss'],
  providers: [PaymentGatewayService, LocationService]
})
export class SearchBusPage implements OnInit {
	public complexForm : FormGroup;
  public processTransactionForm: FormGroup;
  public url: string;
  public currentLocation: any;

  constructor(
    public paymentgateway: PaymentGatewayService,
    public fb: FormBuilder,
    public router: Router,
    private locationService: LocationService) { 


    const getCurrentPosition = async () => {
      var self = this;
      const coordinates = await Geolocation.getCurrentPosition();
    
      this.locationService.getCurrentCity(coordinates).subscribe(function(res){
        // self.complexForm.patchValue({
        //   from: res.results[0].address_components[0].long_name
        // });

        self.currentLocation = res.results[0].formatted_address
      });
    }

    getCurrentPosition();

  	this.complexForm = fb.group({
      from: ['Amroha', Validators.required],
      to: ['Okhla', Validators.compose([Validators.required, Validators.maxLength(15)])]
    });

    this.processTransactionForm = fb.group({
      ENVIRONMENT: [null],
      MID: ['pEwPzj57976555121471'],
      ORDER_ID: ["123"],
      CUST_ID: ["shuaib"],
      TXN_AMOUNT: ["5"],
      CHANNEL_ID: ['WAP'],
      CHECKSUMHASH: [null],
      WEBSITE: ['localhost'],
      MOBILE_NO: [95608342202],
      EMAIL: ["shuaib.mbd@gmail.com"],
      INDUSTRY_TYPE_ID: ['Retail'],
      CALLBACK_URL: ['https://securegw-stage.paytm.in/theia/paytmCallback?ORDER_ID='+ 123],
      // CALLBACK_URL: [this.paymentgateway.callbackUrl]
    });
  }

  ngOnInit() {
  }

  submitForm(formData: FormData) {
    this.router.navigate(['search-bus/result'], {queryParams: formData })

    // this.paymentgateway.orderConfirmation({  
    //   "ORDERID":"TEST_1558956974518",
    //   "MID":"pEwPzj57976555121471",
    //   "TXNID":"20190527111212800110168463600533460",
    //   "TXNAMOUNT":"5.00",
    //   "PAYMENTMODE":"DC",
    //   "CURRENCY":"INR",
    //   "TXNDATE":"2019-05-27 17:06:20.0",
    //   "STATUS":"TXN_SUCCESS",
    //   "RESPCODE":"01",
    //   "RESPMSG":"Txn Success",
    //   "GATEWAYNAME":"HDFC",
    //   "BANKTXNID":"4036217121962950",
    //   "BANKNAME":"STATE BANK OF INDIA",
    //   "CHECKSUMHASH":"8n7msEttAK06JP7reus7RwUAhAfCjlP9MTrsfk/Aqu8lTDXqnCrQLi1ZCPXtZ1VPu4gfe1AerfgJzxuIKAMirEbE9saoahhWg5WQqZfXOpM="
    // }).subscribe(function(res) {
    //   console.log(res);
    // })
  }
}
