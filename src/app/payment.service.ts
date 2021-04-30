import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';


import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class PaymentGatewayService {
	// public host = "http://tour-paytm-checksumhash-tour-checksumhash.1d35.starter-us-east-1.openshiftapps.com";
	public host = "http://www.medismglobal.com/paytm-prod";

	public paymentURL: string = this.host + "/pgRedirect.php";

	constructor(public http: HttpClient) { }

	orderConfirmation(payload): Observable<any> {
		const httpOptions = {
			headers: new HttpHeaders({
			  'Content-Type':  'text/html'
			})
		};
		
	    return this.http.get(this.host + '/TxnStatus.php?' + this.toQueryParams(payload), {})
		    .pipe(map(this.extractData))
		    .pipe(catchError(this.handleError));
	}

	toQueryParams(obj) {
		var str = "";

		for (var key in obj) {
		    if (str != "") {
		        str += "&";
		    }

		    str += key + "=" + encodeURIComponent(obj[key]);
		}

		return str;
	}


	private extractData(response: Response | any) {
		return response.json();
	}

	private handleError (error : Response | any) {
		// let errMsg: string;

		// if (error instanceof Response) {
		// 	const body = error.json() || '';
		// 	const err = body.error || JSON.stringify(body);
		// 	errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
		// } else {
		// 	errMsg = error.message ? error.message : error.toString();
		// }

		// console.log(errMsg);
		// return errMsg;

		return throwError(error)
		
	}

}