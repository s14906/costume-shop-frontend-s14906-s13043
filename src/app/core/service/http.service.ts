import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {UrlPart} from "../../shared/models/http";
import {
    ItemColorModel,
} from "../../shared/models/data.models";
import {Observable} from "rxjs";
import {
    AddressDTO,
    AddToCartDTO, CartConfirmationDTO, ComplaintChatMessageDTO,
    CreateNewComplaintDTO, PaymentTransactionDTO,
    UserLoginDTO,
    UserRegistrationDTO
} from "../../shared/models/dto.models";
import {
    CartResponse, ComplaintChatMessageResponse, ComplaintResponse,
    GetAddressesResponse, ItemResponse, OrderDetailsResponse, OrderResponse,
    SimpleResponse,
    UserResponse
} from "../../shared/models/rest.models";

@Injectable({
    providedIn: 'root'
})
export class HttpService {
    constructor(private http: HttpClient) {
    }

    public getAllItems(): Observable<ItemResponse> {
        return this.http.get<ItemResponse>(UrlPart.BACKEND_LINK + UrlPart.ITEMS);
    }

    public getAllItemsBySearchText(searchText: string): Observable<ItemResponse> {
        return this.http.get<ItemResponse>(`${UrlPart.BACKEND_LINK}${UrlPart.ITEMS}/${searchText}`);
    }

    public getAllItemSizes(): Observable<ItemResponse> {
        return this.http.get<ItemResponse>(UrlPart.BACKEND_LINK + UrlPart.ITEM_SIZES);
    }

    public getAllItemColors(): Observable<ItemColorModel[]> {
        return this.http.get<ItemColorModel[]>(UrlPart.BACKEND_LINK + UrlPart.ITEM_COLORS);
    }


    public getAllComplaints(): Observable<ComplaintResponse> {
        return this.http.get<ComplaintResponse>(UrlPart.BACKEND_LINK + UrlPart.COMPLAINTS);
    }

    public getUserByVerificationToken(verificationToken: string): Observable<any> {
        return this.http.get(UrlPart.BACKEND_LINK + UrlPart.USERS, {
            params: {
                verificationToken: verificationToken
            }
        });
    }

    public getAddressesForUser(userId: number): Observable<GetAddressesResponse> {
        return this.http.get<GetAddressesResponse>(UrlPart.BACKEND_LINK + UrlPart.GET_ADDRESSES, {
            params: {
                userId: userId
            }
        });
    }

    public postUserVerification(userId: number): Observable<SimpleResponse> {
        return this.http.post<SimpleResponse>(UrlPart.BACKEND_LINK + UrlPart.VERIFICATION, {}, {
            params: {
                userId: userId
            }
        });
    }

    public postAddToCart(dto: AddToCartDTO): Observable<SimpleResponse> {
        return this.http.post<SimpleResponse>(UrlPart.BACKEND_LINK + UrlPart.CART, dto);
    }

    public getCartByUserId(userId: number): Observable<CartResponse> {
        return this.http.get<CartResponse>(`${UrlPart.BACKEND_LINK}${UrlPart.USER}/${userId}/${UrlPart.CART}`);
    }

    public deleteCartByUserId(userId: number): Observable<CartResponse> {
        return this.http.delete<CartResponse>(`${UrlPart.BACKEND_LINK}${UrlPart.USER}/${userId}/
            ${UrlPart.CART}/${UrlPart.ITEMS}`);
    }

    public deleteCartItemByUserIdAndCartItemId(userId: number, itemId: number): Observable<CartResponse> {
        return this.http.delete<CartResponse>(`${UrlPart.BACKEND_LINK}${UrlPart.USER}/${userId}/${UrlPart.CART}/${UrlPart.ITEMS}/${itemId}`);
    }

    public postRemoveAddress(addressId: number): Observable<SimpleResponse> {
        return this.http.post<SimpleResponse>(UrlPart.BACKEND_LINK + UrlPart.REMOVE_ADDRESS, {}, {
            params: {
                addressId: addressId
            }
        });
    }

    public postChangePassword(userId: number, newPassword: string): Observable<SimpleResponse> {
        return this.http.post<SimpleResponse>(UrlPart.BACKEND_LINK + UrlPart.CHANGE_PASSWORD, {}, {
            params: {
                userId: userId,
                newPassword: newPassword
            }
        });
    }

    public postRegistration(dto: UserRegistrationDTO): Observable<SimpleResponse> {
        return this.http.post<SimpleResponse>(UrlPart.BACKEND_LINK + UrlPart.REGISTRATION, dto);
    }

    public postLogin(dto: UserLoginDTO): Observable<UserResponse> {
        return this.http.post<UserResponse>(UrlPart.BACKEND_LINK + UrlPart.LOGIN, dto);
    }

    public postAddAddress(dto: AddressDTO): Observable<SimpleResponse> {
        return this.http.post<SimpleResponse>(UrlPart.BACKEND_LINK + UrlPart.ADD_ADDRESS, dto);
    }

    public postCreateNewComplaint(dto: CreateNewComplaintDTO): Observable<ComplaintResponse> {
        return this.http.post<ComplaintResponse>(UrlPart.BACKEND_LINK + UrlPart.COMPLAINTS + UrlPart.CREATE, dto);
    }

    public postCreateNewOrderPaymentTransaction(dto: CartConfirmationDTO): Observable<SimpleResponse> {
        return this.http.post<SimpleResponse>(UrlPart.BACKEND_LINK + UrlPart.ORDERS + '/' + UrlPart.PAYMENT, dto);
    }

    public postCreateNewPaymentTransaction(dto: PaymentTransactionDTO): Observable<SimpleResponse> {
        return this.http.post<SimpleResponse>(UrlPart.BACKEND_LINK + UrlPart.ORDERS, dto);
    }

    public postAssignComplaintToEmployee(userId: number, complaintId: number): Observable<SimpleResponse> {
        return this.http.post<SimpleResponse>(UrlPart.BACKEND_LINK + UrlPart.COMPLAINTS, {}, {
            params: {
                userId: userId,
                complaintId: complaintId
            }
        });
    }

    public postSendComplaintChatMessage(complaintChatMessageDTO: ComplaintChatMessageDTO, complaintId: string): Observable<SimpleResponse> {
        return this.http.post<SimpleResponse>(`${UrlPart.BACKEND_LINK}${UrlPart.COMPLAINTS}/${complaintId}/${UrlPart.MESSAGES}`, complaintChatMessageDTO);
    }

    public getComplaint(complaintId: string): Observable<ComplaintResponse> {
        return this.http.get<ComplaintResponse>(`${UrlPart.BACKEND_LINK}${UrlPart.COMPLAINTS}/${complaintId}`);
    }

    public getComplaintChatMessages(complaintId: number): Observable<ComplaintChatMessageResponse> {
        return this.http.get<ComplaintChatMessageResponse>(`${UrlPart.BACKEND_LINK}${UrlPart.COMPLAINTS}/${complaintId}/${UrlPart.MESSAGES}`);
    }

    public getAllOrdersForUser(userId: number): Observable<OrderResponse> {
        return this.http.get<OrderResponse>(`${UrlPart.BACKEND_LINK}${UrlPart.USERS}/${userId}/${UrlPart.ORDERS}`);
    }

  public getAllOrders(): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${UrlPart.BACKEND_LINK}${UrlPart.ORDERS}`);
  }

    public getOrderDetails(orderId: string): Observable<OrderDetailsResponse> {
        return this.http.get<OrderDetailsResponse>(`${UrlPart.BACKEND_LINK}${UrlPart.ORDERS}/${orderId}`);
    }
}
