import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/app/lib/prisma";
import { signJWT, setAuthCookie } from "@/app/lib/jwt";

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        // Check if email exists
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                passwordHash: true,
                role: true,
                emailVerified: true,
                username: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);
        if (!isValidPassword) {
            return NextResponse.json(
                { error: "Invalid email or password" },
                { status: 401 }
            );
        }

        /**@todo Check if email is verified */
        /* if (!user.emailVerified) {
          return NextResponse.json(
            { error: "Please verify your email before signing in" },
            { status: 403 }
          );
        } */

        // Create JWT token
        const token = await signJWT({
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
            emailVerified: user.emailVerified,
        });

        // Create response
        const response = NextResponse.json(
            {
                user: {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    role: user.role,
                },
            },
            { status: 200 }
        );

        // Set auth cookie
        setAuthCookie(response, token);

        return response;
    } catch (error) {
        console.error("Signin error:", error);
        return NextResponse.json(
            { error: "An error occurred during sign in" },
            { status: 500 }
        );
    }
}
