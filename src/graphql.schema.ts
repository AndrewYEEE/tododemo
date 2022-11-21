
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class AuthorInfo {
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
}

export class AuthorUpdate {
    firstName?: Nullable<string>;
    lastName?: Nullable<string>;
    fullName?: Nullable<string>;
    email?: Nullable<string>;
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

export abstract class IQuery {
    abstract queryAuthor(id: string): Nullable<Author> | Promise<Nullable<Author>>;

    abstract getCats(): Nullable<Nullable<Cat>[]> | Promise<Nullable<Nullable<Cat>[]>>;

    abstract queryPosts(id: string): Nullable<Nullable<MyPost>[]> | Promise<Nullable<Nullable<MyPost>[]>>;
}

export abstract class IMutation {
    abstract createAuthor(authorInfo: AuthorInfo): Nullable<CreateResult> | Promise<Nullable<CreateResult>>;

    abstract updateAuthor(id: string, authorUpdate?: Nullable<AuthorUpdate>): Nullable<Author> | Promise<Nullable<Author>>;

    abstract createCat(catInput?: Nullable<CatInput>): Nullable<Cat> | Promise<Nullable<Cat>>;

    abstract createPost(id: string, postinfo: PostInfo): Nullable<CreatePostResult> | Promise<Nullable<CreatePostResult>>;
}

export class Author {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
}

export class CreateResult {
    id: string;
    status: boolean;
}

export class Cat {
    id?: Nullable<number>;
    name?: Nullable<string>;
    age?: Nullable<number>;
    color?: Nullable<string>;
}

export class MyPost {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    owner: User;
}

export class User {
    name: UserInfo;
    email: string;
}

export class UserInfo {
    firstName: string;
    lastName: string;
    fullName: string;
}

export class CreatePostResult {
    postid: string;
    status: boolean;
}

type Nullable<T> = T | null;
