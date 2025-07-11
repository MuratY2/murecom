import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";

import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { app } from "../firebase";           // adjust path if your firebase.ts lives elsewhere
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-become-seller",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./become-seller.html",
  styleUrls: ["./become-seller.css"]
})
export class BecomeSellerComponent {
  sellerApplication = {
    fullName: "",
    businessName: "",
    socialSecurityNumber: "",
    phoneNumber: ""
  };

  submitting = false;       // optional UI flag

  private firestore = getFirestore(app);

  constructor(private router: Router, private auth: AuthService) {}

  /* -------- submit handler -------- */
  async onSubmit(): Promise<void> {
    if (!this.auth.currentUser) {
      alert("You must be logged in to apply.");
      return;
    }

    this.submitting = true;

    try {
      await addDoc(collection(this.firestore, "sellerApplications"), {
        ...this.sellerApplication,
        userId: this.auth.currentUser.uid,
        status: "pending",
        submittedAt: serverTimestamp()
      });

      alert("Your application has been submitted for review!");
      this.router.navigate(["/"]);
    } catch (err) {
      console.error("Application error:", err);
      alert("Failed to submit application. Please try again.");
    } finally {
      this.submitting = false;
    }
  }

  /* -------- back nav -------- */
  goBack(): void {
    this.router.navigate(["/"]);
  }
}
