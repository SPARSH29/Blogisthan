"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-800 text-white">
      {/* Top Navbar */}
      <div className="h-16 flex items-center justify-between px-4">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/next.svg"
            alt="logo"
            width={80}
            height={80}
            className="cursor-pointer invert transition duration-300 hover:scale-110"
          />
        </Link>

        <div className="flex items-center gap-3">
          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center space-x-4">
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
          </ul>

          {/* Login / Logout Button (always visible) */}
          <Link href={session ? "/logout" : "/login"}>
            <button className="bg-white text-black font-bold py-1 px-3 rounded hover:bg-gray-200 hover:scale-105 transition">
              {session ? "Logout" : "Login"}
            </button>
          </Link>

          {/* Hamburger Menu Button (mobile only) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-2xl font-bold"
          >
            {isOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-700">
          <ul className="flex flex-col py-3">
            <li>
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 hover:bg-gray-700"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                href="/about"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 hover:bg-gray-700"
              >
                About
              </Link>
            </li>

            <li>
              <Link
                href="/blogs"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 hover:bg-gray-700"
              >
                Blogs
              </Link>
            </li>

            {session && (
              <li>
                <Link
                  href="/yourblogs"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 hover:bg-gray-700"
                >
                  Your Blogs
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;