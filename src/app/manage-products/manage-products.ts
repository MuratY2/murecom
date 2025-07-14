import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { app } from "../firebase";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  Timestamp,
} from "firebase/firestore";

/** Interface for Product */
export interface Product {
  id: string;
  name: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  imageUrl: string;
  status: "approved" | "pending" | "rejected";
  sellerId: string;
  createdAt: Date;
  updatedAt: Date;
}

/** Interface for Seller Info */
export interface Seller {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
}

/** Interface for Admin Product View */
export interface AdminProduct {
  product: Product;
  seller: Seller;
}

@Component({
  selector: "app-manage-products",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./manage-products.html",
  styleUrls: ["./manage-products.css"],
})
export class ManageProductsComponent implements OnInit {
  products: AdminProduct[] = [];
  loading = true;
  error: string | null = null;
  activeDropdown: string | null = null;

  private firestore = getFirestore(app);

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  /** Load all approved products and their seller info from Firestore */
  async loadProducts(): Promise<void> {
    this.loading = true;
    this.error = null;
    this.products = [];

    try {
      // Query approved products
      const q = query(
        collection(this.firestore, "products"),
        where("status", "==", "approved")
      );
      const snap = await getDocs(q);

      // For each product doc, fetch its seller
      const list = await Promise.all(
        snap.docs.map(async (d) => {
          const data = d.data() as any;
          const prod: Product = {
            id: d.id,
            name: data.name,
            description: data.description,
            brand: data.brand,
            category: data.category,
            price: data.price,
            stock: data.stock,
            imageUrl: data.imageUrl,
            status: data.status,
            sellerId: data.sellerId,
            createdAt:
              (data.createdAt as Timestamp)?.toDate?.() ?? new Date(),
            updatedAt:
              (data.updatedAt as Timestamp)?.toDate?.() ?? new Date(),
          };

          // Fetch seller details
          const sellerSnap = await getDoc(
            doc(this.firestore, "users", prod.sellerId)
          );
          const su = sellerSnap.data() as any;
          const seller: Seller = {
            uid: prod.sellerId,
            displayName: su?.displayName || "Unknown",
            email: su?.email || "",
            photoURL: su?.photoURL,
          };

          return { product: prod, seller };
        })
      );

      this.products = list;
    } catch (err: any) {
      console.error("Failed to load products:", err);
      this.error = err.message || "Failed to load products.";
    } finally {
      this.loading = false;
    }
  }

  toggleDropdown(productId: string, event: Event): void {
    event.stopPropagation();
    this.activeDropdown =
      this.activeDropdown === productId ? null : productId;
  }

  closeDropdowns(): void {
    this.activeDropdown = null;
  }

  editProduct(item: AdminProduct): void {
    console.log("Editing product:", item.product.name);
    alert(`Editing product ${item.product.name}. (Demo)`);
    this.closeDropdowns();
  }

  viewProductDetails(item: AdminProduct): void {
    console.log("Viewing product details:", item.product.name);
    alert(`Viewing details for ${item.product.name}. (Demo)`);
    this.closeDropdowns();
  }

  viewSellerDetails(seller: Seller): void {
    console.log("Viewing seller details:", seller.displayName);
    alert(`Viewing details for seller ${seller.displayName}. (Demo)`);
    this.closeDropdowns();
  }

  removeProduct(item: AdminProduct): void {
    console.log("Removing product:", item.product.name);
    alert(`Product ${item.product.name} has been removed. (Demo)`);
    this.closeDropdowns();
  }

  goBack(): void {
    this.router.navigate(["/admin-dashboard"]);
  }
}
