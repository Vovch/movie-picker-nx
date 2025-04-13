import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { MovieList } from '../database/schemas/movieList.schema';

describe('MoviesController', () => {
    let controller: MoviesController;
    let service: MoviesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MoviesController],
            providers: [
                {
                    provide: MoviesService,
                    useValue: {
                        findAll: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<MoviesController>(MoviesController);
        service = module.get<MoviesService>(MoviesService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should return an array of movies', async () => {
        const mockMovieList: MovieList = {
            listId: '1',
            name: 'Test List',
            list: [
                {
                    id: 1,
                    name: 'Test Movie',
                    director: 'Test Director',
                    originalName: 'Test Original Name',
                    yearProduced: '2021',
                    yearAdded: '2021',
                },
            ],
        };

        jest.spyOn(service, 'findAll').mockResolvedValue(mockMovieList);

        const result = await controller.findAll();
        expect(result).toEqual(mockMovieList);
    });

    it('should handle errors', async () => {
        jest.spyOn(service, 'findAll').mockRejectedValue(new Error('Test Error'));

        await expect(controller.findAll()).rejects.toThrow('Test Error');
    });
});
