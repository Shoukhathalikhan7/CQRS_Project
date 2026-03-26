import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { Dashboard } from './dashboard/dashboard';
import { Users } from './users/users';
import { AdminTasks } from './admin-tasks/admin-tasks';
import { authGuard } from './auth-guard';
import { AdminLearningComponent } from './admin-learning/admin-learning';
import { LearningView } from './learning-view/learning-view';



export const routes: Routes = [

  { path: '', component: Login },
  { path: 'signup', component: Signup },

  { 
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard]
  },
  {
  path: 'learning',
  component: LearningView
},


{
  path: 'users',
  component: Users
},
{
  path: 'admin-tasks',
  component: AdminTasks
},
{ path: 'admin-learning', 
  component: AdminLearningComponent 
},

];