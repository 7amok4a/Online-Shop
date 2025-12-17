import bcrypt from "bcrypt" ; 
import crypto from "crypto" ; 
import jwt from "jsonwebtoken"; 
import ENV from "../config/env";
import { UserType } from "../utils/enums";
import { CURRENT_TIMESTAMP } from "../utils/constants";
import { IsEmail,IsNotEmpty, MinLength } from "class-validator";
import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("users")
export class User {

    @PrimaryGeneratedColumn('identity')
    id : number 

    @Column({type : 'varchar' , length : 150}) 
    @IsNotEmpty({message : 'Please Enter your name'})
    name : string  

    @Column({unique : true})
    @IsEmail() 
    @IsNotEmpty({message : 'Please Enter your mail'}) 
    email : string 


    @Column({type : 'varchar'}) 
    @MinLength(6 , {message : 'Weak Password'}) 
    @IsNotEmpty({message : 'Please Enter your password'}) 
    password : string 


    @Column({type : 'enum' , enum : UserType , default : UserType.NORMAL_USER}) 
    role : UserType 

    @Column({type : 'text' , nullable : true })
    profileImage : string 

    @Column({type : 'text'})  
    refreshToken  : string 

    @Column({ nullable: true })
    resetPasswordToken?: string;

    @Column({ type: "timestamp", nullable: true })
    resetPasswordExpire?: Date;


    @CreateDateColumn({type : 'timestamp' , default :() => CURRENT_TIMESTAMP}) 
    createdAt : Date ; 
    
    @UpdateDateColumn({type : 'timestamp' , default : ()=> CURRENT_TIMESTAMP , onUpdate : CURRENT_TIMESTAMP}) 
    updatedAt : Date ; 


    @BeforeInsert() 
    async hashPassword() {
        const salt = await bcrypt.genSalt(10) ; 
        this.password = await bcrypt.hash(this.password , salt) ; 
    }


    async comparePassword(enterPassword : string) : Promise<boolean>{
        const isMatch = await bcrypt.compare(enterPassword , this.password) ; 

        return isMatch ; 
    }

    createAccessToken() : string  {
        const token = jwt.sign({id : this.id} , 
            ENV.JWT_SECRET_ACCESS, 
            {expiresIn : ENV.ACCESS_JWT_EXPIRES_TIME  as jwt.SignOptions['expiresIn'] }) ; 

        return token ; 
    }

    createRefreshToken()  : string {
        const token = jwt.sign({id : this.id} , 
            ENV.JWT_SECRET_REFRESH, 
            {expiresIn : ENV.ACCESS_JWT_EXPIRES_TIME  as jwt.SignOptions['expiresIn'] }) ; 

        return token ; 
    }

    getResetPasswordToken()  : string {
        const resetToken = crypto.randomBytes(20).toString('hex') ; 
        
        this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest('hex') ;  
        this.resetPasswordExpire = new Date(Date.now() + 30 * 60 * 1000) ; 


        return resetToken ; 
    }
}