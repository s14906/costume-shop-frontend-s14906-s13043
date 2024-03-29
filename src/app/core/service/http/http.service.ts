import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {UrlPart} from "../../../shared/models/http";
import {Observable} from "rxjs";
import {
    AddressDTO,
    AddToCartDTO,
    CartConfirmationDTO,
    ComplaintChatMessageDTO,
    CreateNewComplaintDTO, ItemDTO, OrderStatusDTO,
    UserLoginDTO,
    UserRegistrationDTO
} from "../../../shared/models/dto.models";
import {
    CartResponse,
    ComplaintChatMessageResponse,
    ComplaintResponse,
    GetAddressesResponse,
    ItemResponse,
    OrderDetailsResponse,
    OrderResponse, OrderStatusResponse, PaymentTransactionResponse,
    SimpleResponse,
    UserResponse
} from "../../../shared/models/rest.models";

@Injectable({
    providedIn: 'root'
})
export class HttpService {
    constructor(private http: HttpClient) {
    }

    public getAllItems(): Observable<ItemResponse> {
        return this.http.get<ItemResponse>(UrlPart.BACKEND_LINK + UrlPart.ITEMS);
    }

    public getItemById(itemId: string): Observable<ItemResponse> {
        return this.http.get<ItemResponse>(`${UrlPart.BACKEND_LINK}${UrlPart.ITEMS}/${itemId}`);
    }

    public getAllItemsBySearchTextAndCategory(searchText: string, category: string): Observable<ItemResponse> {
        return this.http.get<ItemResponse>(`${UrlPart.BACKEND_LINK}${UrlPart.SEARCH}/${category}/${searchText}`);
    }

    public getAllItemSizes(): Observable<ItemResponse> {
        return this.http.get<ItemResponse>(UrlPart.BACKEND_LINK + UrlPart.ITEM_SIZES);
    }

    public getAllItemCategories(): Observable<ItemResponse> {
        return this.http.get<ItemResponse>(UrlPart.BACKEND_LINK + UrlPart.ITEM_CATEGORIES);
    }

    public getAllItemSets(): Observable<ItemResponse> {
        return this.http.get<ItemResponse>(UrlPart.BACKEND_LINK + UrlPart.ITEM_SETS);
    }

    public getItemsByPaymentTransactionId(paymentTransactionId: number): Observable<ItemResponse> {
        return this.http.get<ItemResponse>(`${UrlPart.BACKEND_LINK}${UrlPart.PAYMENTS}/${paymentTransactionId}`);
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

    public getAddressesByUserId(userId: number): Observable<GetAddressesResponse> {
        return this.http.get<GetAddressesResponse>(UrlPart.BACKEND_LINK + UrlPart.GET_ADDRESSES, {
            params: {
                userId: userId
            }
        });
    }

    public getComplaintById(complaintId: string): Observable<ComplaintResponse> {
        return this.http.get<ComplaintResponse>(`${UrlPart.BACKEND_LINK}${UrlPart.COMPLAINTS}/${complaintId}`);
    }

    public getComplaintChatMessagesByComplaintId(complaintId: number): Observable<ComplaintChatMessageResponse> {
        return this.http.get<ComplaintChatMessageResponse>(`${UrlPart.BACKEND_LINK}${UrlPart.COMPLAINTS}/${complaintId}/${UrlPart.MESSAGES}`);
    }

    public getAllOrdersByUserId(userId: number): Observable<OrderResponse> {
        return this.http.get<OrderResponse>(`${UrlPart.BACKEND_LINK}${UrlPart.USERS}/${userId}/${UrlPart.ORDERS}`);
    }

    public getAllOrders(): Observable<OrderResponse> {
        return this.http.get<OrderResponse>(`${UrlPart.BACKEND_LINK}${UrlPart.ORDERS}`);
    }

    public getAllOrderStatuses(): Observable<OrderStatusResponse> {
        return this.http.get<OrderStatusResponse>(`${UrlPart.BACKEND_LINK}${UrlPart.ORDERS}/${UrlPart.STATUSES}`);
    }

    public getOrderDetailsByOrderId(orderId: string): Observable<OrderDetailsResponse> {
        return this.http.get<OrderDetailsResponse>(`${UrlPart.BACKEND_LINK}${UrlPart.ORDERS}/${orderId}`);
    }

    public getCartByUserId(userId: number): Observable<CartResponse> {
        return this.http.get<CartResponse>(`${UrlPart.BACKEND_LINK}${UrlPart.USER}/${userId}/${UrlPart.CART}`);
    }

    public postUserVerificationById(userId: number): Observable<SimpleResponse> {
        return this.http.post<SimpleResponse>(UrlPart.BACKEND_LINK + UrlPart.VERIFICATION, {}, {
            params: {
                userId: userId
            }
        });
    }

    public postAddToCart(dto: AddToCartDTO): Observable<SimpleResponse> {
        return this.http.post<SimpleResponse>(UrlPart.BACKEND_LINK + UrlPart.CART, dto);
    }

    public postItem(dto: ItemDTO): Observable<SimpleResponse> {
        return this.http.post<SimpleResponse>(UrlPart.BACKEND_LINK + UrlPart.ITEMS, dto);
    }
    public deleteAddressById(addressId: number): Observable<SimpleResponse> {
        return this.http.delete<SimpleResponse>(UrlPart.BACKEND_LINK + UrlPart.DELETE_ADDRESS, {
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

    public postUserRegistration(dto: UserRegistrationDTO): Observable<SimpleResponse> {
        return this.http.post<SimpleResponse>(UrlPart.BACKEND_LINK + UrlPart.REGISTRATION, dto);
    }

    public postUserLogin(dto: UserLoginDTO): Observable<UserResponse> {
        return this.http.post<UserResponse>(UrlPart.BACKEND_LINK + UrlPart.LOGIN, dto);
    }

    public postAddAddress(dto: AddressDTO): Observable<SimpleResponse> {
        return this.http.post<SimpleResponse>(UrlPart.BACKEND_LINK + UrlPart.ADD_ADDRESS, dto);
    }

    public postCreateNewComplaint(dto: CreateNewComplaintDTO): Observable<ComplaintResponse> {
        return this.http.post<ComplaintResponse>(UrlPart.BACKEND_LINK + UrlPart.COMPLAINTS + UrlPart.CREATE, dto);
    }

    public postCreateNewOrderPaymentTransaction(dto: CartConfirmationDTO): Observable<PaymentTransactionResponse> {
        return this.http.post<PaymentTransactionResponse>(UrlPart.BACKEND_LINK + UrlPart.ORDERS + '/' + UrlPart.PAYMENT, dto);
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

    public postSendPaymentTransactionSuccessEmail(dto: CartConfirmationDTO): Observable<SimpleResponse> {
        return this.http.post<SimpleResponse>(UrlPart.BACKEND_LINK + UrlPart.EMAIL, dto);
    }

    public postCloseComplaintById(complaintId: string): Observable<ComplaintResponse> {
        return this.http.post<ComplaintResponse>(`${UrlPart.BACKEND_LINK}${UrlPart.COMPLAINTS}/${complaintId}`, {});
    }

    public postUpdateOrderStatusForOrder(dto: OrderStatusDTO): Observable<SimpleResponse> {
        return this.http.post<SimpleResponse>(`${UrlPart.BACKEND_LINK}${UrlPart.ORDERS}`, dto);
    }

    public postAddItemCategory(category: string): Observable<SimpleResponse> {
      return this.http.post<SimpleResponse>(`${UrlPart.BACKEND_LINK}${UrlPart.ITEM_CATEGORIES}/${category}`, {});
    }

    public deleteCartItemByUserIdAndCartItemId(userId: number, itemId: number): Observable<CartResponse> {
        return this.http.delete<CartResponse>(`${UrlPart.BACKEND_LINK}${UrlPart.USER}/${userId}/${UrlPart.CART}/${UrlPart.ITEMS}/${itemId}`);
    }

    public getUserByOrderId(orderId: string): Observable<UserResponse> {
        return this.http.get<UserResponse>(`${UrlPart.BACKEND_LINK}${UrlPart.ORDERS}/${orderId}/${UrlPart.USER}`);
    }
}
