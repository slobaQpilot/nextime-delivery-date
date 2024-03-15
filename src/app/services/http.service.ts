import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ShippingDetails, ShippingOptionsResponse } from '../../models/shared';
import { Observable } from 'rxjs';

@Injectable()
export class HttpService {
  constructor(private http: HttpClient) {}

  getShippingOptions({
    siteId,
    shippingDetails,
  }: {
    siteId: string;
    shippingDetails: ShippingDetails;
  }): Observable<ShippingOptionsResponse> {
    return this.http.post<ShippingOptionsResponse>(
      `${environment.apiUrl}/${siteId}/shipping-options`,
      shippingDetails
    );
  }
}
