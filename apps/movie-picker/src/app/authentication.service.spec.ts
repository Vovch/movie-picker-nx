import { AuthenticationService } from './authentication.service';
import { HTTPService } from './http.service';
import { of } from 'rxjs';
import * as util from 'util';

global.TextEncoder = util.TextEncoder;
global.TextDecoder = util.TextDecoder as any;
// Before running test cases
(global as any).crypto = {
    subtle: {
        digest: jest.fn().mockImplementation(() => Promise.resolve('mock_hash')),
    },
};

const mockLoginResponse = of('login success');
const mockRegisterResponse = of('register success');

jest.mock('./http.service', () => {
    return jest.fn().mockImplementation(() => {
        return {
            login: jest.fn().mockImplementation(() => mockLoginResponse),
            register: jest.fn().mockImplementation(() => mockRegisterResponse),
        };
    });
});

describe('AuthenticationService', () => {
    let service: AuthenticationService;
    let httpService: any;

    beforeEach(() => {
        httpService = HTTPService;
        service = new AuthenticationService(httpService);
    });

    afterEach(() => {
        localStorage.removeItem('login');
        localStorage.removeItem('hash');
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should generate a hash when requested', async () => {
        const hash = await service.generateHash('testLogin', 'testPassword');
        expect(hash).toBeDefined(); // Add additional checks as needed
    });

    // Add other tests as needed
});
