import { NextResponse } from "next/server";

export function middleware(request) {
    const res = NextResponse.next();
    
    // Add CORS headers to the response
    res.headers.set('Access-Control-Allow-Credentials', 'false ');
    res.headers.set('Access-Control-Allow-Origin', '*'); // Replace '*' with your actual origin
    res.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
        return new NextResponse(null, {
            headers: res.headers
        });
    }

    return res;
}

// Specify the path regex to apply the middleware to
export const config = {
    matcher: '*',
};

