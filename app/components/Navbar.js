"use client"
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <>
      <nav className="h-16 navbar flex items-center justify-between p-4 bg-gray-800 text-white">
        <div className="select-none logo cursor-pointer filter invert hover:invert-50 transition duration-300 hover:scale-110">
          <Link href="/">
            <Image src="/next.svg" alt="logo" width={80} height={80} />
          </Link>
        </div>
        <ul className="nav-links flex items-center space-x-4">
          <li>
            <Link className="hover:underline" href="/">
              Home
            </Link>
          </li>
          <li>
            <Link className="hover:underline" href="/about">
              About
            </Link>
          </li>
          <li>
            <Link className="hover:underline" href="/blogs">
              Blogs
            </Link>
          </li>
          {session && (
            <li>
              <Link className="hover:underline" href="/yourblogs">
                Your Blogs
              </Link>
            </li>
          )}
          <li>
            <Link href={session ? "/logout" : "/login"}>
              <button className="bg-white select-none hover:bg-gray-200 hover:scale-105 cursor-pointer text-black font-bold py-1 px-3 rounded">
                {session? "Logout" : "Login"}
              </button>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar
