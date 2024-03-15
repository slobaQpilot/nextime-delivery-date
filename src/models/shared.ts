export type APIResponse<T> = {
  data: T;
};

export interface ShippingLine {
  name: string;
  nextOrderDate: string;
  shippingCarrier: number;
  shippingMethod: string;
  total: number;
}

export interface DeliveryDate {
  deliveryDate: string;
  shippingLines: ShippingLine[];
}

export interface ShippingOptionsResponse {
  shippingLines: {
    deliveryDates: DeliveryDate[];
    recommendedDeliveryDate: {
      deliveryDate: string;
      shippingLines: ShippingLine[];
    };
  };
  errors: string[];
  succeeded: boolean;
}

export interface ShippingDetails {
  orderId?: string;
  shippingAddress?: any;
  items?: any;
  shippingOptionFilters?: {
    maxDeliveryDate?: string;
    minDeliveryDate?: string;
    nextOrderDate?: string;
  };
}

export interface Order {
  OrderId: number;
  shippingAddress: Address;
  items: Array<{
    id: number;
    productId: string;
    qty: number;
    regularPrice: number;
    salePrice: number;
  }>;

  shippingOptionFilters: {
    minDeliveryDate: string;
    maxDeliveryDate: string;
  };
}

export interface Address {
  name: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type MPDate = {
  day: number;
  month: number;
  year: number;
  isoDate: string;
  date: string;
};
