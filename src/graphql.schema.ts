
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

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

export class UserInfo {
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
}

export abstract class IQuery {
    abstract getCats(): Nullable<Nullable<Cat>[]> | Promise<Nullable<Nullable<Cat>[]>>;

    abstract queryPosts(id: string): Nullable<Nullable<MyPost>[]> | Promise<Nullable<Nullable<MyPost>[]>>;

    abstract queryUser(id: string): Nullable<User> | Promise<Nullable<User>>;
}

export abstract class IMutation {
    abstract createCat(catInput?: Nullable<CatInput>): Nullable<Cat> | Promise<Nullable<Cat>>;

    abstract createPost(id: string, postinfo: PostInfo): Nullable<CreatePostResult> | Promise<Nullable<CreatePostResult>>;

    abstract createUser(userInfo: UserInfo): Nullable<Result> | Promise<Nullable<Result>>;

    abstract updateUser(id: string, userUpdate?: Nullable<UserInfo>): Nullable<User> | Promise<Nullable<User>>;
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
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
}

export class Result {
    id: string;
    status: boolean;
}

type Nullable<T> = T | null;
