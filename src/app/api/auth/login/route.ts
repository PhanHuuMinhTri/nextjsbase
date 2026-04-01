import authApiRequest from '@/apiRequests/auth';
import { LoginBodyType } from '@/schemaValidations/auth.schema';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { HttpError } from '@/lib/http';
export async function POST(request: Request) {
  const body = (await request.json()) as LoginBodyType;
  const cookieStore = await cookies();

  try {
    const { status, payload } = await authApiRequest.slogin(body);
    const { accessToken, refreshToken } = payload.data;

    const decodeAcessToken = jwt.decode(accessToken) as { exp: number };
    const decodeRefreshToken = jwt.decode(refreshToken) as { exp: number };

    cookieStore.set('accessToken', accessToken, {
      secure: true,
      sameSite: 'lax',
      httpOnly: true,
      path: '/',
      expires: decodeAcessToken.exp * 1000,
    });

    cookieStore.set('refreshToken', refreshToken, {
      secure: true,
      sameSite: 'lax',
      httpOnly: true,
      path: '/',
      expires: decodeRefreshToken.exp * 1000,
    });

    return Response.json(payload);
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status,
      });
    } else {
      Response.json({ message: 'error' }, { status: 500 });
    }
  }
}
