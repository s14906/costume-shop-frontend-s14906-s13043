import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {UrlPart} from "../../shared/models/http";
import {
    ItemColorModel,
    ItemSizeModel
} from "../../shared/models/data.models";
import {Observable} from "rxjs";
import {
    AddressDTO,
    AddToCartDTO, ComplaintChatMessageDTO,
    ComplaintDTO,
    ItemWithImageDTO, OrderHistoryDTO, UserLoginDTO,
    UserRegistrationDTO
} from "../../shared/models/dto.models";
import {
    CartResponse,
    GetAddressesResponse,
    SimpleResponse,
    UserResponse
} from "../../shared/models/rest.models";

@Injectable({
    providedIn: 'root'
})
export class HttpService {
    constructor(private http: HttpClient) {
    }

    public getAllItems(): Observable<ItemWithImageDTO[]> {
        return this.http.get<ItemWithImageDTO[]>(UrlPart.BACKEND_LINK + UrlPart.ITEMS);
    }

    public getAllItemSizes(): Observable<ItemSizeModel[]> {
        return this.http.get<ItemSizeModel[]>(UrlPart.BACKEND_LINK + UrlPart.ITEM_SIZES);
    }

    public getAllItemColors(): Observable<ItemColorModel[]> {
        return this.http.get<ItemColorModel[]>(UrlPart.BACKEND_LINK + UrlPart.ITEM_COLORS);
    }


    public getAllComplaints(): Observable<ComplaintDTO[]> {
        return this.http.get<ComplaintDTO[]>(UrlPart.BACKEND_LINK + UrlPart.COMPLAINTS);
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

    public getCartItemsByUserId(userId: number): Observable<CartResponse> {
        return this.http.get<CartResponse>(UrlPart.BACKEND_LINK + UrlPart.CART, {
            params: {
                userId: userId
            }
        });
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

    public getComplaint(complaintId: string): Observable<ComplaintDTO> {
        return this.http.get<ComplaintDTO>(`${UrlPart.BACKEND_LINK}${UrlPart.COMPLAINTS}/${complaintId}`);
    }

    public getComplaintChatMessages(complaintId: number): Observable<ComplaintChatMessageDTO[]> {
        return this.http.get<ComplaintChatMessageDTO[]>(`${UrlPart.BACKEND_LINK}${UrlPart.COMPLAINTS}/${complaintId}/${UrlPart.MESSAGES}`);
    }

    public getAllOrdersForUser(userId: number): Observable<OrderHistoryDTO[]> {
        return this.http.get<OrderHistoryDTO[]>(`${UrlPart.BACKEND_LINK}${UrlPart.USERS}/${userId}/${UrlPart.ORDERS}`);
    }
}
