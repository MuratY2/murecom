import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";

import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  Timestamp
} from "firebase/firestore";
import { app } from "../firebase"; // adjust if firebase.ts path differs

/* Firestore user structure (mirrors AuthService.createUserDocument) */
export interface User {
  uid: string;
  displayName: string;
  email: string;
  userType: "buyer" | "seller" | "admin";
  createdAt: Date;
  lastLoginAt: Date;
  loginMethod: "google" | "email" | "facebook";
  photoURL?: string;
}

@Component({
  selector: "app-manage-users",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./manage-users.html",
  styleUrls: ["./manage-users.css"]
})
export class ManageUsersComponent implements OnInit {
  users: User[] = [];
  loading = true;
  error: string | null = null;
  activeDropdown: string | null = null;

  private firestore = getFirestore(app);

  constructor(private router: Router) {}

  /* ---------- lifecycle ---------- */
  ngOnInit(): void {
    this.loadUsers();
  }

  /* ---------- data load ---------- */
  async loadUsers(): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      const q = query(collection(this.firestore, "users"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);

      this.users = snap.docs.map(d => {
        const data = d.data() as any;
        return {
          uid: d.id,
          displayName: data.displayName || "Unnamed",
          email: data.email || "—",
          userType: data.userType ?? "buyer",
          createdAt: (data.createdAt as Timestamp)?.toDate() ?? new Date(),
          lastLoginAt: (data.lastLoginAt as Timestamp)?.toDate() ?? new Date(),
          loginMethod: data.loginMethod ?? "email",
          photoURL: data.photoURL
        } as User;
      });
    } catch (err) {
      console.error(err);
      this.error = "Failed to load users.";
    } finally {
      this.loading = false;
    }
  }

  /* ---------- dropdown helpers ---------- */
  toggleDropdown(uid: string, ev: Event): void {
    ev.stopPropagation();
    this.activeDropdown = this.activeDropdown === uid ? null : uid;
  }
  closeDropdowns(): void {
    this.activeDropdown = null;
  }

  /* ---------- placeholder admin actions ---------- */
  banUser(user: User): void {
    console.log("Banning user:", user.displayName);
    alert(`User ${user.displayName} has been banned. (Demo)`);
    this.closeDropdowns();
  }
  viewUserDetails(user: User): void {
    console.log("Viewing user:", user.displayName);
    alert(`Viewing details for ${user.displayName}. (Demo)`);
    this.closeDropdowns();
  }
  changeUserRole(user: User): void {
    console.log("Changing role for:", user.displayName);
    alert(`Changing role for ${user.displayName}. (Demo)`);
    this.closeDropdowns();
  }

  /* ---------- nav ---------- */
  goBack(): void {
    this.router.navigate(["/admin-dashboard"]);
  }
}
