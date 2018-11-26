import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from "@angular/core";
import { LoginComponent } from './user/login/login.component';
import { ChatComponent } from './chat/chat/chat.component';


// importing componenets
import { RegisterComponent } from './user/register/register.component';



const routes: Routes = [
    { path: 'login', component: LoginComponent},
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {path: 'register', component: RegisterComponent},
    {path: 'chat', component: ChatComponent},
    
    
    // {path: 'add', component: AddProductComponent},
  
  ];

  export const routingModule: ModuleWithProviders = RouterModule.forRoot(routes);