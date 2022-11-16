
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

export class Author {
    id: number;
    firstName?: Nullable<string>;
    lastName?: Nullable<string>;
}

export abstract class IQuery {
    abstract author(id: number): Nullable<Author> | Promise<Nullable<Author>>;

    abstract getCats(): Nullable<Nullable<Cat>[]> | Promise<Nullable<Nullable<Cat>[]>>;
}

export abstract class IMutation {
    abstract createCat(catInput?: Nullable<CatInput>): Nullable<Cat> | Promise<Nullable<Cat>>;
}

export class Cat {
    id?: Nullable<number>;
    name?: Nullable<string>;
    age?: Nullable<number>;
    color?: Nullable<string>;
}

type Nullable<T> = T | null;
