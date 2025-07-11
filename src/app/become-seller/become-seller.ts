import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { Router } from "@angular/router"

@Component({
  selector: "app-become-seller",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./become-seller.html",
  styleUrls: ["./become-seller.css"],
})
export class BecomeSellerComponent {
  sellerApplication = {
    fullName: "",
    businessName: "",
    socialSecurityNumber: "", // SSN field
    phoneNumber: "",
  }

  constructor(private router: Router) {}

  onSubmit(): void {
    // This is a placeholder for future functionality.
    // No actual submission logic is implemented as per your request.
    console.log("Seller Application Submitted (Demo):", this.sellerApplication)
    alert("Your application has been submitted for review! (Demo)")
    // Optionally navigate back or to a confirmation page
    // this.router.navigate(['/']);
  }

  goBack(): void {
    this.router.navigate(["/"])
  }
}
