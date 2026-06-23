import type { Response } from "express";

const ACCESS_TTL = Number(process.env.ACCESS_TTL_SECONDS) || 900;
const REFRESH_TTL = Number(process.env.REFRESH_TTL_SECONDS) || 604800;
const isProd = process.env.NODE_ENV === "production";

export const ACCESS_COOKIE = "access_token";
export const REFRESH_COOKIE = "refresh_token";

const baseOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: "lax" as const,
  path: "/",
};

export function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string
): void {
  res.cookie(ACCESS_COOKIE, accessToken, {
    ...baseOptions,
    maxAge: ACCESS_TTL * 1000,
  });

  res.cookie(REFRESH_COOKIE, refreshToken, {
    ...baseOptions,
    maxAge: REFRESH_TTL * 1000,
  });
}

export function clearAuthCookies(res: Response): void {
  res.clearCookie(ACCESS_COOKIE, baseOptions);
  res.clearCookie(REFRESH_COOKIE, baseOptions);
}
