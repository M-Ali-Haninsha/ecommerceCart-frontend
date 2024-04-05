import { Component, OnInit } from '@angular/core';
import { CartServiceService } from '../services/cart-service.service';
import { ChangeDetectorRef } from '@angular/core';

import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit {

  isCartOpen = false;
  product:any[] = []
  logged:boolean = false
  both:boolean = false
  cartitems:any [] = []
  localCartItem:any []=[]
  bothItem:any [] = []

  constructor(private service:CartServiceService, private route:Router, private cdr: ChangeDetectorRef){}
  ngOnInit(): void {
    const token = sessionStorage.getItem('userValue');     
    if (token) {
      this.logged = true; 
    }
      this.viewProducts()
      this.getCartItems()
  }

  open(){
    this.isCartOpen = !this.isCartOpen;
    this.getCartItems()
  }
  close(){
    this.isCartOpen = !this.isCartOpen;
  }

  viewProducts() {
    this.service.getProducts().subscribe((value)=>{
      this.product = value
    })
  }

  login() {
    this.route.navigate(['/login'])
  }

  logout() {
    if(sessionStorage.getItem('userValue')){
      sessionStorage.removeItem('userValue')
      this.logged = false
      this.route.navigate(['/products'])
    }
  }

  addToCart(productId: string) {
    const userValue = sessionStorage.getItem('userValue');
    if (userValue) {
      const user = JSON.parse(userValue);
      const token = user.token;
      
      if (token) {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        
        this.service.addToCart(productId, headers).subscribe((value: any) => {
          this.getCartItems()
        });
      } else {
        console.error('Token not found in user details.');
      }
    } else {
      console.log('without login, add to cart');

      const existingCartItemsStr = localStorage.getItem('cartItems');
      let existingCartItems = existingCartItemsStr ? JSON.parse(existingCartItemsStr) : [];
      
      if (!existingCartItemsStr) {
        existingCartItems = [{ productId: productId, quantity: 1 }];
      } else {
        const existingCartItem = existingCartItems.find((item: any) => item.productId === productId);
      
        if (existingCartItem) {
          existingCartItem.quantity++;
        } else {
          existingCartItems.push({ productId: productId, quantity: 1 });
        }
      }
      localStorage.setItem('cartItems', JSON.stringify(existingCartItems));
      this.getCartItems()
    }
  }

  getCartItems() {
    const userValue = sessionStorage.getItem('userValue');
    if (userValue) {
      const user = JSON.parse(userValue);
      const token = user.token;

      if(token) {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        const storedItem = localStorage.getItem('cartItems');
    if(storedItem) {
      this.both = true
      const cartItems = JSON.parse(storedItem);
      this.service.getCartItemIfLocalData(headers, cartItems).subscribe((value)=> {
        this.bothItem = value.products
        this.getCartItems()
      })
      this.clearLocalStorage()
    } else {
      this.service.getCartItems(headers).subscribe((value:any)=> {
          this.cartitems = value?.products
        })
    }
      }
  } else {
    const storedItem = localStorage.getItem('cartItems');
    if(storedItem) {
      const cartItems = JSON.parse(storedItem);
      this.service.localStorageProducts(cartItems).subscribe((value)=> {
      this.localCartItem = value.products
    })
    }
  }
  }

  incremet(id:string, currentQuantity:Number) {
    const value = 'increment'
    const userValue = sessionStorage.getItem('userValue');
    if(userValue){
      const user = JSON.parse(userValue);
      const token = user.token;
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.service.cartLogic(id, value, currentQuantity, headers).subscribe((value)=> {
      if(value.incremented == 'success') {
        this.getCartItems()
      }
    })
    } else {      
      const storedItem = localStorage.getItem('cartItems');
      if (storedItem) {
        let cartItems = JSON.parse(storedItem);
        const index = cartItems.findIndex((item: any) => item.productId === id);
        if (index !== -1) {
          cartItems[index].quantity++;
          localStorage.setItem('cartItems', JSON.stringify(cartItems));
          this.getCartItems();
        }
      }
    }
  }

  decrement(id:string, currentQuantity:Number) {
    const userValue = sessionStorage.getItem('userValue');
    if(userValue){
      const user = JSON.parse(userValue);
      const token = user.token;
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.service.cartLogicDecrement(id,currentQuantity,headers).subscribe((value)=> {
      if(value.decremented == 'success') {
        this.getCartItems()
      }
    })
    } else {
      const storedItem = localStorage.getItem('cartItems');
      if (storedItem) {
        let cartItems = JSON.parse(storedItem);
        const index = cartItems.findIndex((item: any) => item.productId === id);
        if (index !== -1) {
          cartItems[index].quantity--;
          localStorage.setItem('cartItems', JSON.stringify(cartItems));
          this.getCartItems();
        }
      }
    }
  }


  removeItem(id:string) {
    const confirmed = confirm("Are you sure you want to remove this item?");
    if (!confirmed) return;
  
    const userValue = sessionStorage.getItem('userValue');
    if(userValue) {
      const user = JSON.parse(userValue);
      const token = user.token;
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      this.service.removeCartItem(id, headers).subscribe((value)=> {
        if(value.removed == 'success') {
          this.getCartItems()
        }
      })
    } else {
      const storedItem = localStorage.getItem('cartItems');
      if (storedItem) {
        let cartItems = JSON.parse(storedItem);
        const index = cartItems.findIndex((item: any) => item.productId === id);
  
        if (index !== -1) {
          cartItems.splice(index, 1);
          localStorage.setItem('cartItems', JSON.stringify(cartItems));
          this.getCartItems();
        }
      }
    }
  }

  checkout() {
    const userValue = sessionStorage.getItem('userValue');
    if(!userValue) {
      this.route.navigate(['/login'])
    }
  }

  clearLocalStorage(){
    localStorage.removeItem('cartItems');
    console.log('Local storage cleared.');
  }

}

