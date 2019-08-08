import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginGuard } from './celador/login.guard';

const routes: Routes = [
  { path: '', loadChildren: './pages/enterate/enterate.module#EnteratePageModule' },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule', canActivate:[LoginGuard] },
  { path: 'notificaciones', loadChildren: './pages/notificaciones/notificaciones.module#NotificacionesPageModule' },
  { path: 'veterinarias', loadChildren: './pages/veterinarias/veterinarias.module#VeterinariasPageModule' },
  { path: 'login', loadChildren: './pages/ingresar/login/login.module#LoginPageModule' },
  { path: 'registrar', loadChildren: './pages/ingresar/registrar/registrar.module#RegistrarPageModule' },
  { path: 'enterate', loadChildren: './pages/enterate/enterate.module#EnteratePageModule' },
  { path: 'vet-registro', loadChildren: './pages/ingresar/vet-registro/vet-registro.module#VetRegistroPageModule' },
  { path: 'mascotas', loadChildren: './pages/ingresar/registrar/mascotas/mascotas.module#MascotasPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
