import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

describe('MoviesController', () => {
    let controller: MoviesController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MoviesController],
            providers: [MoviesService],
        }).compile();

        controller = module.get<MoviesController>(MoviesController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should return an array of movies', async () => {
        const result = await controller.findAll();
        expect(result).toBeInstanceOf(Array);
    });

    // Add a comprehensive test set. AI!
});
