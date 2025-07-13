import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router } from "@angular/router"

// Interface for a User, matching your provided fields
export interface User {
  uid: string
  displayName: string
  email: string
  userType: "buyer" | "seller" | "admin"
  createdAt: Date
  lastLoginAt: Date
  loginMethod: "google" | "email" | "facebook" // Example login methods
  photoURL?: string // Optional photo URL
}

@Component({
  selector: "app-manage-users",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./manage-users.html",
  styleUrls: ["./manage-users.css"],
})
export class ManageUsersComponent implements OnInit {
  users: User[] = []
  loading = true
  error: string | null = null
  activeDropdown: string | null = null // To track which dropdown is open

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadUsers()
  }

  // Placeholder for loading user data
  loadUsers(): void {
    this.loading = true
    this.error = null
    setTimeout(() => {
      this.users = [
        {
          uid: "Q68uFsvqLMg1xZ1jBXGghU2XvV33",
          displayName: "Murat Yazgan",
          email: "muratyazgan03@gmail.com",
          userType: "seller",
          createdAt: new Date("2025-07-11T01:57:27Z"),
          lastLoginAt: new Date("2025-07-11T13:10:56Z"),
          loginMethod: "google",
          photoURL:
            "https://lh3.googleusercontent.com/a/ACg8ocLDUZ8FrnggKj8m5bZzFpGXYUF6dKnPrLuucCvYxWI-uYc7cZ-V=s96-c",
        },
        {
          uid: "user_buyer_123",
          displayName: "Jane Doe",
          email: "jane.doe@example.com",
          userType: "buyer",
          createdAt: new Date("2025-06-20T09:00:00Z"),
          lastLoginAt: new Date("2025-07-05T10:30:00Z"),
          loginMethod: "email",
          photoURL: "/placeholder.svg?height=96&width=96",
        },
        {
          uid: "user_admin_456",
          displayName: "Admin User",
          email: "admin@murecom.com",
          userType: "admin",
          createdAt: new Date("2025-05-15T08:00:00Z"),
          lastLoginAt: new Date("2025-07-11T15:00:00Z"),
          loginMethod: "email",
          photoURL: "/placeholder.svg?height=96&width=96",
        },
        {
          uid: "user_seller_789",
          displayName: "Seller Pro",
          email: "seller.pro@example.com",
          userType: "seller",
          createdAt: new Date("2025-07-01T14:00:00Z"),
          lastLoginAt: new Date("2025-07-10T11:00:00Z"),
          loginMethod: "google",
          photoURL:
            "https://lh3.googleusercontent.com/a/ACg8ocLDUZ8FrnggKj8m5bZzFpGXYUF6dKnPrLuucCvYxWI-uYc7cZ-V=s96-c",
        },
        {
          uid: "user_buyer_010",
          displayName: "John Smith",
          email: "john.smith@example.com",
          userType: "buyer",
          createdAt: new Date("2025-04-01T10:00:00Z"),
          lastLoginAt: new Date("2025-06-25T16:00:00Z"),
          loginMethod: "facebook",
          photoURL: "/placeholder.svg?height=96&width=96",
        },
      ]
      this.loading = false
    }, 1000) // Simulate network delay
  }

  toggleDropdown(uid: string, event: Event): void {
    event.stopPropagation() // Prevent closing immediately if clicking on the button itself
    this.activeDropdown = this.activeDropdown === uid ? null : uid
  }

  closeDropdowns(): void {
    this.activeDropdown = null
  }

  // Placeholder actions
  banUser(user: User): void {
    console.log("Banning user:", user.displayName)
    alert(`User ${user.displayName} has been banned. (Demo)`)
    this.closeDropdowns()
  }

  viewUserDetails(user: User): void {
    console.log("Viewing details for user:", user.displayName)
    alert(`Viewing details for ${user.displayName}. (Demo)`)
    this.closeDropdowns()
  }

  changeUserRole(user: User): void {
    console.log("Changing role for user:", user.displayName)
    alert(`Changing role for ${user.displayName}. (Demo)`)
    this.closeDropdowns()
  }

  goBack(): void {
    this.router.navigate(["/admin-dashboard"])
  }
}
