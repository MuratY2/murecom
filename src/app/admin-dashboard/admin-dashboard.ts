import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";

interface AdminAction {
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
  count?: number;
}

@Component({
  selector: "app-admin-dashboard",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./admin-dashboard.html",
  styleUrls: ["./admin-dashboard.css"]
})
export class AdminDashboardComponent {
  /* Tiles to show on the dashboard */
  adminActions: AdminAction[] = [
    {
      title: "Approve Products",
      description: "Review and approve pending product submissions from sellers",
      icon: "📦",
      route: "/admin/products",     // ← updated path
      color: "blue",
      count: 12
    },
    {
      title: "Manage Products",
      description: "View, edit, and manage all products in the marketplace",
      icon: "🛍️",
      route: "/manage-products",
      color: "green",
      count: 247
    },
    {
      title: "Approve Seller Requests",
      description: "Review applications from buyers who want to become sellers",
      icon: "👤",
      route: "/seller-approval",
      color: "purple",
      count: 8
    },
    {
      title: "Manage Users",
      description: "View and manage user accounts, roles, and permissions",
      icon: "👥",
      route: "/manage-users",
      color: "orange",
      count: 1834
    },
    {
      title: "Order Management",
      description: "Monitor and manage customer orders and transactions",
      icon: "📋",
      route: "/order-management",
      color: "teal",
      count: 156
    },
    {
      title: "System Settings",
      description: "Configure platform settings and administrative preferences",
      icon: "⚙️",
      route: "/admin/settings",
      color: "gray"
    }
  ];

  constructor(private router: Router) {}

  /* Navigate to the selected admin tool */
  navigateToAction(route: string): void {
    this.router.navigate([route]);
  }

  /* Back to main site */
  goBack(): void {
    this.router.navigate(["/"]);
  }
}
