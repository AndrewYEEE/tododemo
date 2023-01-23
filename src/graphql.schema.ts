
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum Action {
    VIEW = "VIEW",
    ADD = "ADD",
    REMOVE = "REMOVE",
    MODIFY = "MODIFY"
}

export enum Subject {
    MY_USER = "MY_USER",
    ALL_USER = "ALL_USER",
    MY_TODO = "MY_TODO",
    ALL_TODO = "ALL_TODO"
}

export enum Roles {
    ADMIN = "ADMIN",
    MEMBER = "MEMBER",
    UNKNOWN = "UNKNOWN"
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

export class PermissionInput {
    action: Action;
    subject: Subject;
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

export class RoleTemplate {
    id: string;
    name?: Nullable<string>;
    permission?: Nullable<Permission>;
}

export class Permission {
    rules?: Nullable<Nullable<Rule>[]>;
}

export class Rule {
    action: Action;
    subject: Subject;
}

export abstract class IQuery {
    abstract queryMyPosts(): Nullable<Nullable<TodoPost>[]> | Promise<Nullable<Nullable<TodoPost>[]>>;

    abstract queryMyPostTotal(): Nullable<number> | Promise<Nullable<number>>;

    abstract queryPostByUserID(userid: string, skip: number, index: number): Nullable<Nullable<TodoPost>[]> | Promise<Nullable<Nullable<TodoPost>[]>>;

    abstract queryPostTotal(): Nullable<number> | Promise<Nullable<number>>;

    abstract queryUser(id: string): Nullable<User> | Promise<Nullable<User>>;
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
    role: string;
    age?: Nullable<number>;
}

export class Result {
    id: string;
    status: boolean;
}

type Nullable<T> = T | null;
