import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Chats, Users, Mensaje } from '../../models/usuarios/user_pets';
import { DbaService } from '../../services/dba.service';
import { NavParams, ModalController } from '@ionic/angular';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  url:string;
  chat:Chats;
  titulo:string;
  nombre_chat = '';
  type:string;
  usuario:Users;
  user:Users;
  integrantes:Users[] = [];
  conversacion:Mensaje[] = [];
  publicar_integrantes:Users[] = [];
  constructor(private storage:Storage,
    private dba:DbaService,
    private params:NavParams,
    private modal:ModalController) { }

  ngOnInit() {
    this.chat = this.params.get('chat');
    this.user = this.params.get('user');
    console.log(this.user);
    this.asignar_usuario();
    if(this.chat){
      
      this.nombre_chat = this.chat.nombre;
      this.integrantes = this.chat.users;
      this.conversacion = this.chat.mensaje;
      
      this.load_integrantes();
      if(this.integrantes.length == 2 ){
        // quiere decir conversacion 1-1
        for (let integrante of this.integrantes){
          if (this.user.email != integrante.email){
            this.titulo = integrante.name;
            if(integrante.url){
              this.url = integrante.url;
              this.type = integrante.type;
            }
          }
        }
      }
      else {
        this.titulo = this.chat.nombre;
      }
    }
    else {
      this.nombre_chat = this.params.get('nombre');
      this.integrantes = this.params.get('usuarios_entrantes');
      
      if (this.integrantes.length == 2){
        for (let integrante of this.integrantes){
          
          console.log(integrante);
          if (integrante.email != this.user.email){
            this.titulo = integrante.name;
            this.type = integrante.type;
            console.log(this.type);
            if (integrante.url){
              this.url = integrante.url;
              
            }
          }
        }
      }
      for (let x = 0; x < this.integrantes.length; x++){
        if (!this.integrantes[x].chats){
          // voy verificando que todos los integrantes del nuevo chat
          // no tengan un chat undefined
          this.integrantes[x].chats = [];
          
        }
        
        
      }
      this.crear_chat();
    }
    
  }
  asignar_usuario(){
    if(this.user.apellido){
      this.usuario = {
        name:this.user.name,
        apellido:this.user.apellido,
        email:this.user.email,
        type:this.user.type
      } 
    }
    else {
      this.usuario = {
        name:this.user.name,
        email:this.user.email,
        type:this.user.type
      }
    } 
    if(this.user.url){
      this.usuario['url'] = this.user.url;
      this.url = this.user.url;
    }
    else {
      this.usuario['url'] = 'assets/img/chat_user.PNG';
      this.url = 'assets/img/chat_user.PNG';
    }
  } 
  back(){
    this.modal.dismiss();
  }
  async load_integrantes(){
    let personas:Users[] = [];
    personas.push(this.user);
    for (let x = 1; x < this.integrantes.length; x++){
      let llave = this.integrantes[x].email;
      llave = llave.replace("@","_");
      while(llave.indexOf(".")!=-1){
        llave = llave.replace(".","_");
      }
      let persona:any = await this.dba.load_integrante(llave);
      if (persona.email){
        personas.push(persona);
      }
      
    }
    this.integrantes = personas;
  }
  crear_chat(){
    
    let final:any[] = [];
    for (let add of this.integrantes){
      let nuevo = new Object();
      for(let adjuntico in add){
        
        if(adjuntico != "chats" && adjuntico != "veterinarias" && adjuntico != "users" && adjuntico != "calificaciones" && adjuntico != "tasks"){
          nuevo[adjuntico] = add[adjuntico];
        }
        
      }
      final.push(nuevo);
    }
    let nuevo_chat:Chats;
    if (final.length == 2){
      if (this.url){
        nuevo_chat = {
          nombre:this.nombre_chat,
          users:final,
          url:this.url,
          type:this.type
        }
      }
      else {
        nuevo_chat = {
          nombre:this.nombre_chat,
          users:final,
          type:this.type
        }
      }
    }
    else {
      nuevo_chat = {
        nombre:this.nombre_chat,
        users:final,
        type:'Grupo'
      }
    }
    this.chat = nuevo_chat;
    console.log('creando chat');
    console.log(this.chat);
  }
  async publicar(mensaje){
    let message:Mensaje;
    console.log(this.url);
    message = {
      contenido:mensaje,
      creador:this.usuario,
      url:this.url
    } 
    
    console.log(message);
    this.conversacion.unshift(message);
    
    let send = document.getElementById('message');
    send.innerHTML = "";
    for (let integrante of this.integrantes){
      let find = integrante.chats.findIndex((element)=>{
        return element.nombre === this.nombre_chat
      });
      if (find > -1){
        integrante.chats[find].mensaje = this.conversacion;
      }
      else {
        // esto quiere decir que es un chat nuevo
        this.chat["mensaje"] = this.conversacion;
        // agrego el nuevo chat al arreglo de chats de cada usuario
        integrante.chats.push(this.chat);

        console.log(integrante);
      }
      await this.dba.publicar_info(integrante,integrante.email,'usuarios');
    }
    
  }
}
