import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, flatMap } from 'rxjs/operators';
import { Product } from './product.model';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiPath: string = 'https://localhost:5001/v1/produtos';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Product[]> {
    return this.http.get(this.apiPath).pipe(
      catchError(this.handleError),
      map(this.jsonDataToProducts)
    )
  }

  getByID(id: string): Observable<Product> {
    const url = `${this.apiPath}/${id}`;

    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToProduct)
    )
  }

  create(product: Product): Observable<Product> {
    return this.http.post(this.apiPath, product).pipe(
      catchError(this.handleError),
      map(this.jsonDataToProduct)
    )
  }

  update(product: Product): Observable<Product> {
    return this.http.put(this.apiPath, product).pipe(
      catchError(this.handleError),
      map(this.jsonDataToProduct)
    )
  }

  delete(id: string): Observable<any> {
    const url = `${this.apiPath}/${id}`;

    return this.http.delete(url).pipe(
      catchError(this.handleError),
      map(() => null)
    )
  }


  // PRIVATE METHODS
  private jsonDataToProducts(jsonData: any[]): Product[] {
    const categories: Product[] = [];
    jsonData.forEach(element => categories.push(element as Product));
    return categories;
  }

  private jsonDataToProduct(jsonData: any): Product {
    return jsonData as Product;
  }

  private handleError(error: any): Observable<any> {
    console.log('Erro na requisição =>', error);
    return throwError(error);
  }

}
