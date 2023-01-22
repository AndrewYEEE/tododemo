
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
    firstname?: Nullable<string>;
    lastname?: Nullable<string>;
    username?: Nullable<string>;
    email: string;
    age?: Nullable<number>;
}

export abstract class IMutation {
    abstract signup(signupInput: SignupInput): Nullable<SignupPayload> | Promise<Nullable<SignupPayload>>;

    abstract signin(signinInput: SigninInput): Nullable<SigninPayload> | Promise<Nullable<SigninPayload>>;

    abstract createCat(catInput?: Nullable<CatInput>): Nullable<Cat> | Promise<Nullable<Cat>>;

    abstract createMyPost(postinfo: PostInfo): Nullable<PostResult> | Promise<Nullable<PostResult>>;

    abstract editMyPost(postid: string, postinfo: PostInfo): Nullable<PostResult> | Promise<Nullable<PostResult>>;

    abstract editPostByUserID(userid: string, postid: string, postinfo: PostInfo): Nullable<PostResult> | Promise<Nullable<PostResult>>;

    abstract deleteMyPost(postid: string): Nullable<PostResult> | Promise<Nullable<PostResult>>;

    abstract deletePostByID(userid: string, postid: string): Nullable<PostResult> | Promise<Nullable<PostResult>>;

    abstract createUser(basicinfo: BasicInfo): Nullable<Result> | Promise<Nullable<Result>>;

    abstract updateSelf(userinfo: UserInfo): Nullable<User> | Promise<Nullable<User>>;

    abstract updateUser(id: string, userinfo: UserInfo): Nullable<User> | Promise<Nullable<User>>;

    abstract deleteUser(email: string): Nullable<Result> | Promise<Nullable<Result>>;
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

    abstract queryMyPosts(): Nullable<Nullable<TodoPost>[]> | Promise<Nullable<Nullable<TodoPost>[]>>;

    abstract queryMyPostTotal(): Nullable<number> | Promise<Nullable<number>>;

    abstract queryPostByUserID(userid: string, skip: number, index: number): Nullable<Nullable<TodoPost>[]> | Promise<Nullable<Nullable<TodoPost>[]>>;

    abstract queryPostTotal(): Nullable<number> | Promise<Nullable<number>>;

    abstract queryUser(id: string): Nullable<User> | Promise<Nullable<User>>;
}

export class Cat {
    id?: Nullable<number>;
    name?: Nullable<string>;
    age?: Nullable<number>;
    color?: Nullable<string>;
}

export abstract class ISubscription {
    abstract postBeenCreated(userid: string): Nullable<TodoPost> | Promise<Nullable<TodoPost>>;
}

export class TodoPost {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    updatedAt: string;
}

export class PostResult {
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
