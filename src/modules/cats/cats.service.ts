import { Logger,Injectable } from '@nestjs/common';
import { Cat, CatInput } from 'src/graphql.schema'

@Injectable()
export class CatsService {
    private readonly logger = new Logger(CatsService.name);
    private cats: Cat[] = [];

    create(cat: CatInput) {
        const newCat = {
            id: this.cats.length + 1,
            ...cat
        }
        this.cats.push(newCat);
        return newCat;
    }

    findAll(): Cat[] {
        this.logger.log(`awfj;wfhwofhfwofhwofh`)
        return this.cats;
    }
}
