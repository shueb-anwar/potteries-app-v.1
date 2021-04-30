import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentGatewayService } from '../../../app/payment.service';
import { Storage } from '@ionic/storage';

import { BookingProvider } from './../../providers/firebase/booking';

@Component({
  selector: 'app-booking-confirmation',
  templateUrl: './booking-confirmation.component.html',
  styleUrls: ['./booking-confirmation.component.scss'],
  providers: [PaymentGatewayService]
})
export class BookingConfirmationComponent {
	public bus: any;

  public TXT_STATUS: string;
  public RESPMSG: string;

  constructor(
    private navParams: ActivatedRoute,
    public paymentgateway:  PaymentGatewayService,
    public storage: Storage,
    public bookingProvider: BookingProvider,
  ) {
  	this.navParams.queryParams.subscribe(params => { 
      this.TXT_STATUS = params['TXT_STATUS'];
      this.RESPMSG = params['RESPMSG'];

      storage.get('bookingDetail').then((bookingDetail) => {
        this.bookingProvider.updateBookingStatus(bookingDetail.key, this.TXT_STATUS, params['ORDER_ID']);

        if(params['RESPCODE'] != "01") {
          bookingProvider.removeItem(bookingDetail.key);
        } else {
          this.bus = bookingDetail;
        }
      });

      //  https://developer.paytm.com/docs/transaction-status-api/
      // this.paymentgateway.orderConfirmation(params).subscribe(function(res) {
      //   console.log(res);
      //   self.RESPMSG = res.S2S_Response.RESPMSG;
      // })

  	});
  }
}
