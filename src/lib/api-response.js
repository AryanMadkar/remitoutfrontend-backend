// lib/api-response.js
import { NextResponse } from 'next/server';

export function successResponse(data = null, message = 'OK', status = 200) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status }
  );
}

export function errorResponse(message = 'Internal server error', status = 500, details = null) {
  return NextResponse.json(
    {
      success: false,
      message,
      details,
    },
    { status }
  );
}
