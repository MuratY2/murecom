import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";

import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  Timestamp
} from "firebase/firestore";
import { app } from "../firebase"; // adjust path if different

/* Firestore record + local helper fields */
export interface SellerApplication {
  id: string;                    // document id
  businessName: string;
  fullName: string;
  phoneNumber: string;
  socialSecurityNumber: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: Date;
  userId: string;
}

@Component({
  selector: "app-seller-approval",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./seller-approval.html",
  styleUrls: ["./seller-approval.css"]
})
export class SellerApprovalComponent implements OnInit {
  sellerApplications: SellerApplication[] = [];
  loading = true;
  error: string | null = null;

  private firestore = getFirestore(app);

  constructor(private router: Router) {}

  /* ------------ lifecycle ------------ */
  ngOnInit(): void {
    this.loadSellerApplications();
  }

  /* ------------ computed ------------ */
  get hasResolved(): boolean {
    return this.sellerApplications.some(a => a.status !== "pending");
  }

  /* ------------ data load ------------ */
  async loadSellerApplications(): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      const q = query(
        collection(this.firestore, "sellerApplications"),
        orderBy("submittedAt", "desc")
      );
      const snap = await getDocs(q);

      this.sellerApplications = snap.docs.map(d => {
        const data = d.data() as any;
        return {
          id: d.id,
          businessName: data.businessName,
          fullName: data.fullName,
          phoneNumber: data.phoneNumber,
          socialSecurityNumber: data.socialSecurityNumber.replace(
            /^\d{3}-\d{2}/,
            "XXX-XX"
          ), // mask
          status: data.status as SellerApplication["status"],
          submittedAt: (data.submittedAt as Timestamp)?.toDate() ?? new Date(),
          userId: data.userId
        };
      });
    } catch (err: any) {
      console.error(err);
      this.error = "Failed to load seller applications.";
    } finally {
      this.loading = false;
    }
  }

  /* ------------ approve / reject ------------ */
  async approveSeller(app: SellerApplication): Promise<void> {
    try {
      // update application status
      await updateDoc(
        doc(this.firestore, "sellerApplications", app.id),
        { status: "approved" }
      );
      // update user role
      await updateDoc(doc(this.firestore, "users", app.userId), {
        userType: "seller"
      });
      app.status = "approved";
    } catch (err) {
      console.error(err);
      alert("Failed to approve application.");
    }
  }

  async rejectSeller(app: SellerApplication): Promise<void> {
    try {
      await updateDoc(
        doc(this.firestore, "sellerApplications", app.id),
        { status: "rejected" }
      );
      app.status = "rejected";
    } catch (err) {
      console.error(err);
      alert("Failed to reject application.");
    }
  }

  /* ------------ clear resolved ------------ */
  async clearResolvedApplications(): Promise<void> {
    const resolved = this.sellerApplications.filter(a => a.status !== "pending");

    if (!resolved.length) return;

    if (
      !confirm(
        `Delete ${resolved.length} resolved application(s)? This cannot be undone.`
      )
    )
      return;

    try {
      await Promise.all(
        resolved.map(a =>
          deleteDoc(doc(this.firestore, "sellerApplications", a.id))
        )
      );
      this.sellerApplications = this.sellerApplications.filter(
        a => a.status === "pending"
      );
    } catch (err) {
      console.error(err);
      alert("Failed to clear resolved applications.");
    }
  }

  /* ------------ nav ------------ */
  goBack(): void {
    this.router.navigate(["/admin-dashboard"]);
  }
}
