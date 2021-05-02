import { Component, OnInit } from '@angular/core';
import { Product } from "../shared/product.model";
import { ProductService } from "../shared/product.service";
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit {

  products: Product[] = [];

  constructor(private productService: ProductService, private router: Router) { }

  ngOnInit(): void {

    if (localStorage.getItem('user') === null || localStorage.getItem('user') === undefined) {
      this.router.navigate(['login']);
    }

    this.productService.getAll()
      .subscribe(
        products => this.products = products,
      )
  }

  deleteProduct(product) {
    const mustDelete = confirm('Deseja realmente excluir este item?');

    if (mustDelete)
      this.productService.delete(product.id)
        .subscribe(
          () => this.products = this.products.filter(element => element != product),
        )
  }

  getImagePath = (imagem: string) => {
    return `https://localhost:5001/Images/${imagem}`;
  }

}
