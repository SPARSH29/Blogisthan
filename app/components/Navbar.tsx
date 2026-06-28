"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-gray-200 overflow-hidden h-15">
      <nav className="absolute top-0 left-0 w-full z-50 bg-transparent">
        {/* Navbar */}
        <div className="h-16 flex items-center justify-between px-4">
          {/* Logo */}
          <Link href="/">
            <Image
              src="/next.svg"
              alt="logo"
              width={80}
              height={80}
              className="cursor-pointer transition duration-300 hover:scale-110"
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

            {/* Login/Logout */}
            <Link href={session ? "/logout" : "/login"}>
              <button className="bg-black cursor-pointer text-white font-bold py-1 px-3 rounded hover:bg-gray-800 hover:scale-105 transition">
                {session ? "Logout" : "Login"}
              </button>
            </Link>

            {/* Hamburger */}
            <button
              ref={buttonRef}
              onClick={() => setIsOpen((prev) => !prev)}
              className="md:hidden text-2xl font-bold"
            >
              {isOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div
            ref={menuRef}
            className="md:hidden absolute top-16 right-4 z-50 w-56 overflow-hidden rounded-xl border border-gray-300 bg-white shadow-2xl"
          >
            <ul className="flex flex-col">
              <li>
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 hover:bg-gray-100"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 hover:bg-gray-100"
                >
                  About
                </Link>
              </li>

              <li>
                <Link
                  href="/blogs"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 hover:bg-gray-100"
                >
                  Blogs
                </Link>
              </li>

              {session && (
                <li>
                  <Link
                    href="/yourblogs"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 hover:bg-gray-100"
                  >
                    Your Blogs
                  </Link>
                </li>
              )}
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;