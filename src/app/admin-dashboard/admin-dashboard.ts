import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router } from "@angular/router"

interface AdminAction {
  title: string
  description: string
  icon: string
  route: string
  color: string
  count?: number
}

@Component({
  selector: "app-admin-dashboard",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./admin-dashboard.html",
  styleUrls: ["./admin-dashboard.css"],
})
export class AdminDashboardComponent {
  adminActions: AdminAction[] = [
    {
      title: "Approve Products",
      description: "Review and approve pending product submissions from sellers",
      icon: "📦",
      route: "/admin/approve-products",
      color: "blue",
      count: 12, // Demo count - can be replaced with real data later
    },
    {
      title: "Manage Products",
      description: "View, edit, and manage all products in the marketplace",
      icon: "🛍️",
      route: "/admin/manage-products",
      color: "green",
      count: 247,
    },
    {
      title: "Approve Seller Requests",
      description: "Review applications from buyers who want to become sellers",
      icon: "👤",
      route: "/admin/approve-sellers",
      color: "purple",
      count: 8,
    },
    {
      title: "Manage Users",
      description: "View and manage user accounts, roles, and permissions",
      icon: "👥",
      route: "/admin/manage-users",
      color: "orange",
      count: 1834,
    },
    {
      title: "Order Management",
      description: "Monitor and manage customer orders and transactions",
      icon: "📋",
      route: "/admin/manage-orders",
      color: "teal",
      count: 156,
    },
    {
      title: "System Settings",
      description: "Configure platform settings and administrative preferences",
      icon: "⚙️",
      route: "/admin/settings",
      color: "gray",
    },
  ]

  constructor(private router: Router) {}

  navigateToAction(route: string): void {
    console.log(`Navigating to: ${route}`)
    // For now, just log - you can implement actual routing later
    // this.router.navigate([route]);
  }

  goBack(): void {
    this.router.navigate(["/"])
  }
}
