import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { Router } from "@angular/router"

interface CheckoutProduct {
  id: string
  name: string
  description: string
  price: number
  category: string
  brand: string
  imageUrl: string
  sellerId: string
  quantity: number
}

interface ShippingAddress {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface PaymentMethod {
  type: "card" | "paypal"
  cardNumber: string
  expiryDate: string
  cvv: string
  cardholderName: string
}

@Component({
  selector: "app-checkout",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./checkout.html",
  styleUrls: ["./checkout.css"],
})
export class CheckoutComponent {
  // Demo cart items - easily replaceable with Firebase data later
  cartItems: CheckoutProduct[] = [
    {
      id: "1",
      name: "Premium Wireless Headphones",
      description: "High-quality wireless headphones with noise cancellation",
      price: 199.99,
      category: "Electronics",
      brand: "AudioTech",
      imageUrl: "/placeholder.svg?height=100&width=100",
      sellerId: "seller123",
      quantity: 1,
    },
    {
      id: "2",
      name: "Smart Fitness Watch",
      description: "Advanced fitness tracking with heart rate monitor",
      price: 299.99,
      category: "Electronics",
      brand: "FitTech",
      imageUrl: "/placeholder.svg?height=100&width=100",
      sellerId: "seller456",
      quantity: 2,
    },
  ]

  shippingAddress: ShippingAddress = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  }

  paymentMethod: PaymentMethod = {
    type: "card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  }

  countries = ["United States", "Canada", "United Kingdom", "Germany", "France", "Australia", "Japan"]

  processing = false

  constructor(private router: Router) {}

  get subtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  get shipping(): number {
    return this.subtotal > 100 ? 0 : 9.99
  }

  get tax(): number {
    return this.subtotal * 0.08 // 8% tax
  }

  get total(): number {
    return this.subtotal + this.shipping + this.tax
  }

  updateQuantity(productId: string, quantity: number): void {
    const item = this.cartItems.find((item) => item.id === productId)
    if (item && quantity > 0) {
      item.quantity = quantity
    }
  }

  removeItem(productId: string): void {
    this.cartItems = this.cartItems.filter((item) => item.id !== productId)
  }

  async processCheckout(): Promise<void> {
    this.processing = true

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Here you would integrate with payment processor and create order in Firebase
    alert("Order placed successfully! (Demo)")

    this.processing = false
    this.router.navigate(["/"])
  }

  goBack(): void {
    this.router.navigate(["/"])
  }
}
