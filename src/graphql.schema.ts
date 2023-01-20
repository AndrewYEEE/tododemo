
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum Roles {
    ADMIN = "ADMIN",
    NMEMBER = "NMEMBER"
}

export class SignupInput {
    email: string;
    username: string;
    password: string;
}

export class SigninInput {
    id: string;
    username: string;
    password: string;
}

export class CatInput {
    name: string;
    age: number;
    color: string;
}

export class PostInfo {
    title: string;
    description: string;
    completed?: Nullable<boolean>;
}

export class BasicInfo {
    firstname?: Nullable<string>;
    lastname?: Nullable<string>;
    username: string;
    email: string;
    password: string;
    age?: Nullable<number>;
}

export class UserInfo {
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    age: number;
}

export abstract class IMutation {
    abstract signup(signupInput: SignupInput): Nullable<SignupPayload> | Promise<Nullable<SignupPayload>>;

    abstract signin(signinInput: SigninInput): Nullable<SigninPayload> | Promise<Nullable<SigninPayload>>;

    abstract createCat(catInput?: Nullable<CatInput>): Nullable<Cat> | Promise<Nullable<Cat>>;

    abstract createPost(id: string, postinfo: PostInfo): Nullable<CreatePostResult> | Promise<Nullable<CreatePostResult>>;

    abstract createUser(basicinfo: BasicInfo): Nullable<Result> | Promise<Nullable<Result>>;

    abstract updateUser(id: string, userinfo?: Nullable<UserInfo>): Nullable<User> | Promise<Nullable<User>>;
}

export class SignupPayload {
    id?: Nullable<string>;
    result: boolean;
}

export class SigninPayload {
    token?: Nullable<string>;
    result: boolean;
}

export abstract class IQuery {
    abstract getCats(): Nullable<Nullable<Cat>[]> | Promise<Nullable<Nullable<Cat>[]>>;

    abstract queryPosts(id: string): Nullable<Nullable<MyPost>[]> | Promise<Nullable<Nullable<MyPost>[]>>;

    abstract queryUser(id: string): Nullable<User> | Promise<Nullable<User>>;
}

export class Cat {
    id?: Nullable<number>;
    name?: Nullable<string>;
    age?: Nullable<number>;
    color?: Nullable<string>;
}

export abstract class ISubscription {
    abstract postBeenCreated(userid: string): Nullable<MyPost> | Promise<Nullable<MyPost>>;
}

export class MyPost {
    id: string;
    title: string;
    description: string;
    completed: boolean;
}

export class CreatePostResult {
    postid: string;
    status: boolean;
}

export class User {
    id: string;
    firstname?: Nullable<string>;
    lastname?: Nullable<string>;
    username: string;
    email: string;
    role: Roles;
    age?: Nullable<number>;
}

export class Result {
    id: string;
    status: boolean;
}

type Nullable<T> = T | null;
