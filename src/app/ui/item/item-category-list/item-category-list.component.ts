import {Component, OnDestroy} from '@angular/core';
import {HttpService} from "../../../core/service/http/http.service";
import {Subscription} from "rxjs";
import {ItemCategoryDTO} from "../../../shared/models/dto.models";
import {ItemResponse, SimpleResponse} from "../../../shared/models/rest.models";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FormValidationService} from "../../../core/service/form/form-validation.service";
import {SnackbarService} from "../../../core/service/snackbar.service";
import {Router} from "@angular/router";
import {HttpErrorService} from "../../../core/service/http/http-error.service";

@Component({
  selector: 'app-item-category',
  templateUrl: './item-category-list.component.html',
  styleUrls: ['./item-category-list.component.css']
})
export class ItemCategoryListComponent implements OnDestroy {
  private allSubscriptions: Subscription[] = [];
  loading: boolean = false;
  itemCategories: ItemCategoryDTO[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 10;
  addCategoryForm: FormGroup;
  constructor(private httpService: HttpService,
              private formBuilder: FormBuilder,
              private formValidationService: FormValidationService,
              private snackbarService: SnackbarService,
              private httpErrorService: HttpErrorService,
              private router: Router) {
    this.addCategoryForm = this.formBuilder.group({
        category: ['', Validators.required, this.formValidationService.validateFieldNotEmpty]
      },
      {updateOn: "submit"}
    );

    this.allSubscriptions.push(
      this.httpService.getAllItemCategories().subscribe((next: ItemResponse): void => {
        this.itemCategories = next.itemCategories;
      })
    );
  }

  get paginatedOrders() {
    const begin: number = this.currentPage * this.itemsPerPage;
    const end: number = begin + this.itemsPerPage;
    return this.itemCategories.slice(begin, end);
  }

  onSubmitAddNewCategory(): void {
    if (this.formValidationService.isFormValid(this.addCategoryForm)) {
      this.allSubscriptions.push(
        this.httpService.postAddItemCategory(this.formValidationService.getFieldValue(this.addCategoryForm, 'category'))
          .subscribe({
            next: (next: SimpleResponse): void => {
              this.snackbarService.openSnackBar(next.message);
              this.router.navigateByUrl('/', {skipLocationChange: true}).then((): void => {
                this.router.navigate(['item-categories']);
              });
            },
            error: err => {
              this.httpErrorService.handleError(err);
            }
          })
      );
    }
  }

  ngOnDestroy(): void {
    this.allSubscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }
}
