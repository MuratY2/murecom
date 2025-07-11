import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
}

interface RecentOrder {
  id: string;
  customerName: string;
  product: string;
  amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  date: Date;
}

interface TopProduct {
  name: string;
  sales: number;
  revenue: number;
  image: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalProducts: 1247,
    totalOrders: 3892,
    totalRevenue: 125430,
    totalUsers: 8934
  };

  recentOrders: RecentOrder[] = [
    {
      id: 'ORD-001',
      customerName: 'John Smith',
      product: 'Wireless Headphones',
      amount: 199.99,
      status: 'processing',
      date: new Date('2024-01-15')
    },
    {
      id: 'ORD-002',
      customerName: 'Sarah Johnson',
      product: 'Smart Watch',
      amount: 299.99,
      status: 'shipped',
      date: new Date('2024-01-14')
    },
    {
      id: 'ORD-003',
      customerName: 'Mike Davis',
      product: 'Laptop Stand',
      amount: 79.99,
      status: 'delivered',
      date: new Date('2024-01-13')
    },
    {
      id: 'ORD-004',
      customerName: 'Emily Brown',
      product: 'Bluetooth Speaker',
      amount: 149.99,
      status: 'pending',
      date: new Date('2024-01-12')
    },
    {
      id: 'ORD-005',
      customerName: 'David Wilson',
      product: 'Phone Case',
      amount: 29.99,
      status: 'processing',
      date: new Date('2024-01-11')
    }
  ];

  topProducts: TopProduct[] = [
    {
      name: 'Wireless Headphones',
      sales: 234,
      revenue: 46800,
      image: '/placeholder.svg?height=60&width=60'
    },
    {
      name: 'Smart Watch',
      sales: 189,
      revenue: 56700,
      image: '/placeholder.svg?height=60&width=60'
    },
    {
      name: 'Bluetooth Speaker',
      sales: 156,
      revenue: 23400,
      image: '/placeholder.svg?height=60&width=60'
    },
    {
      name: 'Laptop Stand',
      sales: 143,
      revenue: 11440,
      image: '/placeholder.svg?height=60&width=60'
    }
  ];

  salesData = [
    { month: 'Jan', sales: 12000 },
    { month: 'Feb', sales: 15000 },
    { month: 'Mar', sales: 18000 },
    { month: 'Apr', sales: 22000 },
    { month: 'May', sales: 25000 },
    { month: 'Jun', sales: 28000 }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    // Component initialization
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'processing': return 'status-processing';
      case 'shipped': return 'status-shipped';
      case 'delivered': return 'status-delivered';
      default: return '';
    }
  }

  getStatusText(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  viewOrderDetails(orderId: string) {
    console.log('View order details:', orderId);
    // Navigate to order details page
  }

  manageProducts() {
    console.log('Navigate to products management');
    // Navigate to products management page
  }

  manageUsers() {
    console.log('Navigate to users management');
    // Navigate to users management page
  }

  viewReports() {
    console.log('Navigate to reports');
    // Navigate to reports page
  }

  goBack() {
    this.router.navigate(['/']);
  }
}