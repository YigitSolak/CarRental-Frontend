import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Brand } from '../../../models/brand';
import { BrandService } from '../../../services/brand.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-brand-update',
  templateUrl: './brand-update.component.html',
  styleUrls: ['./brand-update.component.css'],
})
export class BrandUpdateComponent implements OnInit {
  brandUpdateForm: FormGroup;
  brand!: Brand;

  constructor(
    private formBuilder: FormBuilder,
    private brandService: BrandService,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((param) => {
      this.getBrandById(param['brandId']);
    });
  }

  createBrandUpdateForm() {
    this.brandUpdateForm = this.formBuilder.group({
      brandId: [this.brand.brandId, Validators.required],
      brandName: [this.brand.brandName, Validators.required],
    });
  }

  getBrandById(brandId: number) {
    this.brandService.getBrandById(brandId).subscribe((response) => {
      this.brand = response.data;
      this.createBrandUpdateForm();
    });
  }

  update() {
    let brand: Brand = Object.assign({}, this.brandUpdateForm.value);

    if (!this.brandUpdateForm.valid) {
      this.toastrService.warning('Lütfen boş bilgi bırakmayın', 'Dikkat');
      return;
    }

    this.brandService.update(brand).subscribe(
      (responseSuccess) => {
        this.router.navigate(['brand']);
        return this.toastrService.success(responseSuccess.message, 'Başarılı');
      },
      (responseError) => {
        if (responseError.error.ValidationErrors.length == 0) {
          this.toastrService.error(
            responseError.error.Message,
            responseError.error.StatusCode
          );
          return;
        }

        for (let i = 0; i < responseError.error.ValidationErrors.length; i++) {
          this.toastrService.error(
            responseError.error.ValidationErrors[i].ErrorMessage,
            'Doğrulama Hatası'
          );
        }
      }
    );
  }
}
