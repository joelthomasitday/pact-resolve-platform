import { NextRequest, NextResponse } from "next/server";
import { UserRepository } from "@/lib/db/repositories/user-repository";
import { verifyPassword } from "@/lib/auth/password";
import { signToken } from "@/lib/auth/jwt";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(request: NextRequest) {
  let step = "parsing-body";
  
  try {
    const body = await request.json();
    step = "validating";
    
    // Validation
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid credentials format" },
        { status: 400 }
      );
    }

    const { email: rawEmail, password } = validation.data;
    const email = rawEmail.toLowerCase();
    step = "finding-user";

    // Find user
    const user = await UserRepository.findByEmail(email);
    
    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    step = "checking-active";
    // Verify status
    if (!user.isActive) {
      return NextResponse.json(
        { error: "Account is deactivated" },
        { status: 403 }
      );
    }

    step = "verifying-password";
    // Verify password
    const isPasswordMatch = await verifyPassword(password, user.password);
    if (!isPasswordMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    step = "signing-token";
    // Sign JWT
    const token = signToken({
      userId: user._id.toString(),
      role: user.role,
    });

    return NextResponse.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error: any) {
    console.error(`Login error at step [${step}]:`, error);
    
    return NextResponse.json(
      { 
        error: "Internal server error",
        step: step,
        message: error?.message || "Unknown"
      },
      { status: 500 }
    );
  }
}

