import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { RouterOutlet } from "@angular/router";
import { NavbarAdminComponent } from "../navbar-admin/navbar-admin.component";

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, NavbarAdminComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

}
