import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'

import { Product } from '../shared/product.model';
import { ProductService } from '../shared/product.service';

import { switchMap } from 'rxjs/operators';
import toastr from 'toastr';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  productForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: [object] = null;
  submittingForm: boolean = false;
  product: Product = new Product();
  file: any;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem('user') === null || localStorage.getItem('user') === undefined) {
      this.router.navigate(['login']);
    }

    this.setCurrentAction();
    this.buildProductForm();
    this.loadProduct();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;
    if (this.currentAction == "new") {
      this.createProduct();
    } else {
      this.updateProduct();
    }
  }

  uploadImage(event: any) {
    this.file = event.target.files[0];
  }

  private setCurrentAction() {
    if (this.route.snapshot.url[0].path == "new") {
      this.currentAction = "new";
    } else {
      this.currentAction = "edit";
    }
  }

  private buildProductForm() {
    this.productForm = this.formBuilder.group({
      id: [null],
      nome: [null, [Validators.required]],
      valor: [null, [Validators.required]],
      imagem: [null, [Validators.required]]
    })
  }

  private loadProduct() {
    if (this.currentAction == "edit") {
      this.route.paramMap.pipe(
        switchMap(params => this.productService.getByID(params.get("id")))
      ).subscribe(
        (product) => {
          this.product = product;
          this.productForm.patchValue(product);
        },
        //(error) => alert("Ocorreu um erro no servidor, tente mais tarde")
      )
    }
  }

  private setPageTitle() {
    if (this.currentAction == "new")
      this.pageTitle = "Cadastro de novo Produto";
    else {
      const nomeProduto = this.product.nome || "";
      this.pageTitle = `Editando Produto: ${nomeProduto}`;
    }

  }

  private createProduct() {
    const product: Product = Object.assign(new Product(), this.productForm.value);
    delete product.id;

    this.productService.create(product)
      .subscribe(
        res => this.actionsForSuccess(res),
        error => this.actionsForError(error)
      )
  }

  private updateProduct() {
    const product: Product = Object.assign(new Product(), this.productForm.value);

    this.productService.update(product)
      .subscribe(
        res => this.actionsForSuccess(res),
        error => this.actionsForError(error)
      )
  }

  private actionsForSuccess(res: any) {

    if (res && res.success == true) {
      toastr.success('Solicitação processada com sucesso!');

      this.router.navigateByUrl('products', { skipLocationChange: true }).then(
        () => this.router.navigate(['products', res.data.id, 'edit'])
      );
    } else {
      this.actionsForError(res);
    }
  }

  private actionsForError(error) {
    toastr.error('Ocorreu um erro ao processar sua solicitação!');

    this.submittingForm = false;

    if (error && error.success == false) {
      this.serverErrorMessages = error.data;
    } else {
      this.serverErrorMessages = [{ message: "Ocorreu um erro no servidor." }];
    }
  }

}
