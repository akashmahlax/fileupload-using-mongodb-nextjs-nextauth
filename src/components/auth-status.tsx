"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AuthStatus() {
  return (
    <>
      <Link href="/auth/signin">
        <Button variant="ghost">Sign in</Button>
      </Link>
      <Link href="/auth/register">
        <Button variant="ghost">Sign up</Button>
      </Link>
    </>
  )
}

