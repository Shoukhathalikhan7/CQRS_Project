import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { Dashboard } from './dashboard/dashboard';
import { Users } from './users/users';
import { AdminTasks } from './admin-tasks/admin-tasks';
import { authGuard } from './auth-guard';

export const routes: Routes = [

  { path: '', component: Login },
  { path: 'signup', component: Signup },

  { 
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard]
  },

{
  path: 'users',
  component: Users
},
{
  path: 'admin-tasks',
  component: AdminTasks
}

];