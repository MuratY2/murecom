import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router } from "@angular/router"

// Interface for Order Item Product
export interface OrderProduct {
  id: string
  name: string
  category: string
  image: string
  price: number
  rating: number
  reviews: number
}

// Interface for Order Item
export interface OrderItem {
  product: OrderProduct
  quantity: number
}

// Interface for Customer Info
export interface Customer {
  uid: string
  displayName: string
  email: string
  photoURL?: string
}

// Interface for Admin Order View
export interface AdminOrder {
  id: string
  createdAt: Date
  items: OrderItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  customer: Customer
}

@Component({
  selector: "app-order-management",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./order-management.html",
  styleUrls: ["./order-management.css"],
})
export class OrderManagementComponent implements OnInit {
  orders: AdminOrder[] = []
  loading = true
  error: string | null = null
  activeDropdown: string | null = null

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadOrders()
  }

  // Placeholder for loading order data
  loadOrders(): void {
    this.loading = true
    this.error = null
    setTimeout(() => {
      this.orders = [
        {
          id: "order_001",
          createdAt: new Date("2025-07-13T23:36:44Z"),
          items: [
            {
              product: {
                id: "wJ5RPFzCbyFLoh4b6eRx",
                name: "HP Laptop",
                category: "electronics",
                image: "https://assets.mmsrg.com/isr/166325/c1/-/ASSET_MMS_154009413/fee_786_587_png",
                price: 1400,
                rating: 4,
                reviews: 324,
              },
              quantity: 1,
            },
            {
              product: {
                id: "dY0Xk2iqpSngc6JWHxwb",
                name: "Professional Suit",
                category: "clothing",
                image: "https://m.media-amazon.com/images/I/71iywLHlGhL._UY1000_.jpg",
                price: 250,
                rating: 4,
                reviews: 324,
              },
              quantity: 1,
            },
          ],
          total: 1650,
          status: "pending",
          customer: {
            uid: "rGkR4vbwmPRJcRruyyjWrHtycJD3",
            displayName: "Murat Yazgan",
            email: "muratyazgan03@gmail.com",
            photoURL:
              "https://lh3.googleusercontent.com/a/ACg8ocLDUZ8FrnggKj8m5bZzFpGXYUF6dKnPrLuucCvYxWI-uYc7cZ-V=s96-c",
          },
        },
        {
          id: "order_002",
          createdAt: new Date("2025-07-10T14:20:00Z"),
          items: [
            {
              product: {
                id: "prod_003",
                name: "Wireless Headphones",
                category: "electronics",
                image: "/placeholder.svg?height=100&width=100",
                price: 199.99,
                rating: 5,
                reviews: 156,
              },
              quantity: 2,
            },
          ],
          total: 409.97,
          status: "delivered",
          customer: {
            uid: "user_buyer_123",
            displayName: "Jane Doe",
            email: "jane.doe@example.com",
            photoURL: "/placeholder.svg?height=96&width=96",
          },
        },
        {
          id: "order_003",
          createdAt: new Date("2025-07-05T09:15:00Z"),
          items: [
            {
              product: {
                id: "prod_004",
                name: "Smart Watch",
                category: "electronics",
                image: "/placeholder.svg?height=100&width=100",
                price: 299.99,
                rating: 4,
                reviews: 89,
              },
              quantity: 1,
            },
            {
              product: {
                id: "prod_005",
                name: "Phone Case",
                category: "accessories",
                image: "/placeholder.svg?height=100&width=100",
                price: 24.99,
                rating: 4,
                reviews: 234,
              },
              quantity: 3,
            },
          ],
          total: 374.96,
          status: "shipped",
          customer: {
            uid: "user_seller_789",
            displayName: "Alex Johnson",
            email: "alex.johnson@example.com",
            photoURL: "/placeholder.svg?height=96&width=96",
          },
        },
        {
          id: "order_004",
          createdAt: new Date("2025-07-12T16:45:00Z"),
          items: [
            {
              product: {
                id: "prod_006",
                name: "Gaming Mouse",
                category: "electronics",
                image: "/placeholder.svg?height=100&width=100",
                price: 79.99,
                rating: 5,
                reviews: 412,
              },
              quantity: 1,
            },
          ],
          total: 79.99,
          status: "processing",
          customer: {
            uid: "user_gamer_456",
            displayName: "Gaming Pro",
            email: "gamer.pro@example.com",
            photoURL: "/placeholder.svg?height=96&width=96",
          },
        },
      ]
      this.loading = false
    }, 1000) // Simulate network delay
  }

  // Get total number of items in an order
  getTotalItems(order: AdminOrder): number {
    return order.items.reduce((total, item) => total + item.quantity, 0)
  }

  // Generate star rating display
  generateStars(rating: number): string[] {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push("★")
    }

    if (hasHalfStar) {
      stars.push("☆")
    }

    while (stars.length < 5) {
      stars.push("☆")
    }

    return stars
  }

  toggleDropdown(orderId: string, event: Event): void {
    event.stopPropagation()
    this.activeDropdown = this.activeDropdown === orderId ? null : orderId
  }

  closeDropdowns(): void {
    this.activeDropdown = null
  }

  // Placeholder actions
  updateOrderStatus(order: AdminOrder, newStatus: string): void {
    console.log(`Updating order ${order.id} status to ${newStatus}`)
    alert(`Order ${order.id} status updated to ${newStatus}. (Demo)`)
    order.status = newStatus as any
    this.closeDropdowns()
  }

  viewCustomerDetails(customer: Customer): void {
    console.log("Viewing customer details:", customer.displayName)
    alert(`Viewing details for customer ${customer.displayName}. (Demo)`)
    this.closeDropdowns()
  }

  viewOrderDetails(order: AdminOrder): void {
    console.log("Viewing order details:", order.id)
    alert(`Viewing detailed information for order ${order.id}. (Demo)`)
    this.closeDropdowns()
  }

  goBack(): void {
    this.router.navigate(["/admin-dashboard"])
  }
}
