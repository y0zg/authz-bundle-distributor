import { Application, NextFunction, Request, Response } from 'express';
import { Mock } from 'ts-mockery';
import { ApplicationContext } from '../../../context';
import { create } from '../create';

describe('create', () => {
    let context: ApplicationContext;
    let request: Request;
    let response: Response;
    let next: NextFunction;
    let app: Application;

    beforeEach(() => {
        context = Mock.of<ApplicationContext>({});

        app = Mock.of<Application>({
            locals: { context },
        });

        request = Mock.of<Request>({
            app,
        });

        const send = jest.fn();

        response = Mock.of<Response>({
            send,
            status: jest.fn(() => ({
                send,
            })),
        });

        next = jest.fn();
    });

    it('responds successfully', () => {
        create(request, response, next);
        expect(response.status).toHaveBeenCalledWith(201);
        expect(response.send).toHaveBeenCalledWith({});
    });

    it('handles an error', () => {
        response.status = jest.fn(() => {
            throw new Error('Something went wrong');
        });
        create(request, response, next);
        expect(next).toHaveBeenCalled();
    });
});
