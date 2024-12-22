import { NextRequest } from 'next/server';

export type RouteParams<T = unknown> = {
    params: T;
};

export type RouteHandler = (
    request: NextRequest,
    params: RouteParams
) => Promise<Response>; 