import { JwtPayload } from "jsonwebtoken";
import { UserType } from "./enums";

export interface AuthPayload extends JwtPayload {
  id: number;
}



export interface SafeUser {
  id : number ; 
  name : string ; 
  email : string ; 
  role : UserType ; 
  profileImage : string ; 
  createdAt : Date ; 
  updatedAt : Date ; 

}