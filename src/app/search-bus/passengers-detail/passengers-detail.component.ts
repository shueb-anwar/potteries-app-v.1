import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { BookingProvider } from '../../providers/firebase/booking';
import { UserProvider } from '../../providers/firebase/user';
import { PaymentGatewayService } from '../../../app/payment.service';
import { map, filter, find, assign, forEach, isEmpty } from 'lodash';
import { Storage } from '@ionic/storage';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { IUserProfile } from '../../user-profile/user-profile.interface';

@Component({
  selector: 'app-passengers-detail',
  templateUrl: './passengers-detail.component.html',
  styleUrls: ['./passengers-detail.component.scss'],
  providers: [PaymentGatewayService]
})
export class PassengersDetailComponent implements OnInit {
  public busId: string;
  public data: {};
  public bus: any;
  public complexForm: FormGroup;
  public processTransactionForm: FormGroup;
  public today: any;
  public tomorrow: any;
  public customAlertOptions: any;
  public selectedRoute: any;
  public currentUser: any;
  public bookingCharges: number = 5;
  public totalBookingCharges: number = 5;
  public url: any;
  public tempPayload: any;
  public totalFare: number;
  public browserOptions: InAppBrowserOptions = {
    location: 'no',
    fullscreen: 'no'

  };
  // @ViewChild('mySelect') selectRef: Select;

  constructor(
    private navParams: ActivatedRoute,
    private router: Router,
    public bookingProvider: BookingProvider,
    public fb: FormBuilder,
    public paymentgateway: PaymentGatewayService,
    private storage: Storage,
    private iab: InAppBrowser,
    public userProvider: UserProvider
  ) {
    this.navParams.queryParams.subscribe(params => {
      this.bus = JSON.parse(params.bus);

      this.customAlertOptions = {
        cssClass: 'lg',
        // subHeader: 'Select your route',
        message: "You are changing your trip; Please make sure to pick the correct route."
      }

      this.currentUser = JSON.parse(localStorage.getItem('user'));
      console.log(this.currentUser);
      if (isEmpty(this.currentUser)) {
        this.router.navigate(['search-bus'])
      }

      // PayTM Payment Code
      var order_id = 'TOURLIN_' + new Date().getTime();

      this.processTransactionForm = fb.group({
        MID: ['NEUutZ14422133875394'],
        ORDER_ID: [order_id],
        CUST_ID: [this.currentUser.uid],
        INDUSTRY_TYPE_ID: ['Retail'],
        CHANNEL_ID: ['WAP'],
        TXN_AMOUNT: [this.totalBookingCharges],
        // WEBSITE: ['APPSTAGING'],
        MOBILE_NO: [this.currentUser.phoneNumber],
        EMAIL: [this.currentUser.email],
        CALLBACK_URL: ['https://securegw-stage.paytm.in/theia/paytmCallback?ORDER_ID=' + order_id]
      });

      // PayTM Payment Code End

      var today = new Date, tomorrow = new Date(today);
      this.today = this.parseDate(today);

      tomorrow.setDate(today.getDate() + 1);
      this.tomorrow = this.parseDate(tomorrow);

      this.selectedRoute = this.bus.selectedRoute;

      this.complexForm = fb.group({
        orderid: [order_id],
        date: [this.today, Validators.required],
        route: [this.bus.selectedRoute.id, Validators.required],
        from: [this.bus.selectedRoute.from, Validators.required],
        to: [this.bus.selectedRoute.to, Validators.required],
        time: [this.bus.selectedRoute.time, Validators.required],
        passengers: fb.array([
          this.initPassengers(this.currentUser.name)
        ]),
        userid: [this.currentUser.uid, Validators.required],
        status: 'PENDING'
      });

      this.complexForm.get('route').valueChanges.subscribe(val => {
        var selectedRoute: { from: string, to: string, time: string } = find(this.bus.routeDetail, function (o) { return o.id == val });

        this.complexForm.patchValue({
          from: selectedRoute.from,
          to: selectedRoute.to,
          time: selectedRoute.time
        });

        this.selectedRoute = selectedRoute;
      });

      this.complexForm.get('passengers').valueChanges.subscribe(passengers => {
        this.totalBookingCharges = this.bookingCharges * passengers.length;
        this.totalFare = this.bus.fare * passengers.length;

        this.processTransactionForm.patchValue({
          TXN_AMOUNT: this.totalBookingCharges.toFixed(2)
        });
      });

      this.userProvider.getItem(this.currentUser.uid).then((user: IUserProfile) => {
        if (user) {
          var passenger = <FormArray>this.complexForm.controls['passengers'];
          passenger.controls[0].patchValue({ gender: user.gender })
        }
      })
    });
  }

  async ngOnInit() {
    await this.storage.create();
  }

  changeDate(event) {
    var date = new Date(event.target.value);

    this.complexForm.get('date').setValue(this.parseDate(date));
  }

  parseDate(date) {
    return [date.getFullYear(), ("0" + (date.getMonth() + 1)).slice(-2), ("0" + date.getDate()).slice(-2)].join("-");
  }

  changeRoute() {
    // this.selectRef.open();
  }

  initPassengers(name?: any, gender?: any) {
    return this.fb.group({
      name: [name, Validators.required],
      gender: [gender, Validators.required],
      seat: [1]
    });;
  }

  addPassenger(name?, gender?) {
    const passengers = <FormArray>this.complexForm.controls['passengers'];
    passengers.push(this.initPassengers(name, gender));
  }

  removePassenger(i: number) {
    const control = <FormArray>this.complexForm.controls['passengers'];

    control.removeAt(i);
  }

  getPassengers() {
    return this.complexForm.get('passengers') as FormArray;
  }

  submitForm(form) {
    var seatBooked = 0, payload = form.value, availableSeatCapacity;

    if (form.valid) {
      var busId = this.bus.busId;

      this.bookingProvider.getBookingHistory(busId, payload.date).once("value", (response) => {
        var items = map(response.val(), item => { return item; });  // items -> total entity

        if (items && items.length) {
          var bookings = ((items, route) => {  // bookings -> Total Entity of Selected Route
            if (items) {
              return filter(items, function (item) {
                return item.route == route;
              });
            } else {
              return [];
            }
          })(items, payload.route);

          forEach(bookings, (item, index) => {
            seatBooked = seatBooked + item.passengers.length  // seatBooked -> Total Passengers Booked
          });

          // Seat Availablity in case of more than one passengers
          availableSeatCapacity = this.bus.capacity - seatBooked;

          if (availableSeatCapacity) {
            if (availableSeatCapacity >= payload.passengers.length) {
              forEach(payload.passengers, function (item, index) {
                item.seat = seatBooked + index + 1;
              });

              this.bookBus(payload);
            } else {
              console.log(`Only ${availableSeatCapacity} seat(s) available. Please remove extra passengers and proceed.`)
            }
          } else {
            console.log("Bus Full");
          }
        } else {
          if (payload.passengers.length > 1) {
            forEach(payload.passengers, function (passenger, index) {
              passenger.seat = index + 1;
            });
          }

          this.bookBus(payload);
        }
      });

    } else {
      console.log("Form not valid");
    }
  }

  bookBus(data) {
    var busId = this.bus.busId;

    if (this.tempPayload && this.tempPayload.orderid == data.orderid) {
      this.processPayment();
    } else {
      this.tempPayload = data;

      this.bookingProvider.addItem(busId, data).then((res: any) => {
        this.storage.set('bookingDetail', assign(data, { key: res.getKey() }));

        this.processPayment();
      });
    }
  }

  processPayment() {
    var payload = this.processTransactionForm.value;
    /*** * Ref. -
     * https://forum.ionicframework.com/t/paytm-integration-with-ionic3/142827/13
     * https://github.com/Paytm-Payments/Paytm_Web_Sample_Kit_PHP
    */
    const browser = this.iab.create(`${this.paymentgateway.paymentURL}?${this.paymentgateway.toQueryParams(payload)}`, "_blank", this.browserOptions);

    browser.on('loadstop').subscribe(event => {
      
    });

    browser.on("loadstart")
      .subscribe((event) => {
        // iab.executeScript({ code: "(function() { alert(123); })()"});
        if (event.url == payload['CALLBACK_URL']) {
          // loading.present(); 
          browser.close();


          this.paymentgateway.orderConfirmation({
            ORDER_ID: payload['ORDER_ID']
          }).subscribe(res => {
            console.log(res);

            this.router.navigate(['/search-bus/confirmation'], {
              queryParams: {
                TXT_STATUS: res.STATUS,
                ORDER_ID: res.ORDERID,
                RESPCODE: res.RESPCODE,
                RESPMSG: res.RESPMSG,
              }
            });
          }, error => {
            console.log(error)
          });
        } else {
          browser.insertCSS({ code: ".xs-txtcontrol { font-size: 0;} .xs-txtcontrol:after { content: 'POTTERIES'; font-size: 17px;}" });
        }
      }), error => {
        console.log(error);
      };
  }
}
