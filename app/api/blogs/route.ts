import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// 🚀 POST: Creates a new blog
export async function POST(req: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    if (!body.title || !body.content) {
      return NextResponse.json({ success: false, error: "Title and Content are required." }, { status: 400 });
    }

    const blog = await Blog.create({
      title: body.title,
      content: body.content,
      category: body.category || "technology",
      image: body.image || "",
      tags: body.tags || [],
      authorName: session.user.name || "Anonymous",
      authorEmail: session.user.email,
    });

    return NextResponse.json({ success: true, blog });
  } catch (error: any) {
    console.error("❌ BACKEND POST ERROR LOG:", error.message || error);
    return NextResponse.json({ success: false, error: error.message || "Failed to create blog" }, { status: 500 });
  }
}

// 📦 GET: Handles public lookup vs private dashboards
export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const id = searchParams.get("id");
    const dashboardOnly = searchParams.get("dashboard");

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const noCacheHeaders = {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    };

    // 🔐 SINGLE BLOG
    if (id) {
      const blog = await Blog.findById(id);

      if (!blog) {
        return NextResponse.json(
          { success: false, error: "Blog post not found." },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, blog }, { headers: noCacheHeaders });
    }

    // 🔐 DASHBOARD BLOGS
    if (dashboardOnly === "true") {
      const session = await getServerSession(authOptions);

      if (!session?.user?.email) {
        return NextResponse.json(
          { success: false, error: "Unauthorized" },
          { status: 401 }
        );
      }

      const cleanSearch = search.trim();
      let query: any = { authorEmail: session.user.email };

      if (cleanSearch) {
        query.$or = [
          { title: { $regex: cleanSearch, $options: "i" } },
          { category: { $regex: cleanSearch, $options: "i" } },
          { authorName: { $regex: cleanSearch, $options: "i" } },
        ];
      }

      const totalBlogs = await Blog.countDocuments(query);

      const blogs = await Blog.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("title content image category authorName views createdAt");

      return NextResponse.json(
        {
          success: true,
          blogs,
          page,
          totalPages: Math.ceil(totalBlogs / limit),
          totalBlogs,
        },
        { headers: noCacheHeaders }
      );
    }

    // 🌐 EXPLORE BLOGS (Directly from MongoDB)
    const cleanSearch = search.trim();
    let query: any = {};

    if (cleanSearch) {
      query = {
        $or: [
          { title: { $regex: cleanSearch, $options: "i" } },
          { category: { $regex: cleanSearch, $options: "i" } },
          { authorName: { $regex: cleanSearch, $options: "i" } },
        ],
      };
    }

    const totalBlogs = await Blog.countDocuments(query);

    const blogs = await Blog.find(query)
      .select("title image category authorName content views createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json(
      {
        success: true,
        blogs,
        page,
        totalPages: Math.ceil(totalBlogs / limit),
        totalBlogs,
      },
      { headers: noCacheHeaders }
    );

  } catch (error: any) {
    console.error("❌ BACKEND GET ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch blogs",
      },
      { status: 500 }
    );
  }
}

// ✏️ PUT: Updates an existing blog
export async function PUT(req: Request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Blog ID is missing." }, { status: 400 });
    }

    const existingBlog = await Blog.findById(id);
    if (!existingBlog) {
      return NextResponse.json({ success: false, error: "Blog post not found." }, { status: 404 });
    }

    if (existingBlog.authorEmail !== session.user.email) {
      return NextResponse.json({ success: false, error: "Forbidden: You do not own this blog." }, { status: 403 });
    }

    const body = await req.json();

    if (!body.title || !body.content) {
      return NextResponse.json({ success: false, error: "Title and Content are required." }, { status: 400 });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        title: body.title,
        content: body.content,
        category: body.category || "technology",
        image: body.image || "",
        tags: body.tags || [],
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ success: true, blog: updatedBlog });

  } catch (error: any) {
    console.error("❌ BACKEND PUT ERROR LOG:", error.message || error);
    return NextResponse.json({ success: false, error: error.message || "Failed to update blog" }, { status: 500 });
  }
}