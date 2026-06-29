import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import redis from "@/lib/redis";

// 🚀 POST: Creates a new blog (STRICTLY REQUIRED LOGIN)
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

    // 🔐 SINGLE BLOG
    if (id) {
      const blog = await Blog.findById(id);

      if (!blog) {
        return NextResponse.json(
          { success: false, error: "Blog post not found." },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        blog,
      });
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

      const blogs = await Blog.find({
        authorEmail: session.user.email,
      })
        .sort({ createdAt: -1 })
        .select("title image category views createdAt");

      return NextResponse.json({
        success: true,
        blogs,
      });
    }

    // 🌐 EXPLORE BLOGS (CACHE + OPTIMIZED)

    const cacheKey = `blogs:${page}:${limit}:${search.trim()}`;

    // 1. Check Redis cache
    const cached = await redis.get(cacheKey);

    if (cached) {
      return NextResponse.json({
        success: true,
        blogs: JSON.parse(cached),
        page,
        cached: true,
      });
    }

    // 2. Build query
    let query: any = {};

    if (search.trim()) {
      query = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
          { authorName: { $regex: search, $options: "i" } },
        ],
      };
    }

    // 3. Count total
    const totalBlogs = await Blog.countDocuments(query);

    // 4. Fetch optimized blogs (NO heavy content field)
    const blogs = await Blog.find(query)
      .select("title image category authorName views createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // 5. Store in Redis (cache for 3000s)
    await redis.setEx(cacheKey, 3000, JSON.stringify(blogs));

    return NextResponse.json({
      success: true,
      blogs,
      page,
      totalPages: Math.ceil(totalBlogs / limit),
      totalBlogs,
    });

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

// ✏️ PUT: Updates an existing blog (🔐 PRIVATE - LOGIN & OWNERSHIP REQUIRED)
export async function PUT(req: Request) {
  try {
    await connectDB();

    // 1. Verify Session Authenticity
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // 2. Extract blog ID from URL query parameters
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Blog ID is missing." }, { status: 400 });
    }

    // 3. Find the existing blog to check ownership
    const existingBlog = await Blog.findById(id);
    if (!existingBlog) {
      return NextResponse.json({ success: false, error: "Blog post not found." }, { status: 404 });
    }

    // 🔐 Security check: Ensure the user editing the blog is the original author
    if (existingBlog.authorEmail !== session.user.email) {
      return NextResponse.json({ success: false, error: "Forbidden: You do not own this blog." }, { status: 403 });
    }

    // 4. Parse incoming body updates
    const body = await req.json();

    if (!body.title || !body.content) {
      return NextResponse.json({ success: false, error: "Title and Content are required." }, { status: 400 });
    }

    // 5. Perform the database update
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        title: body.title,
        content: body.content,
        category: body.category || "technology",
        image: body.image || "",
        tags: body.tags || [],
      },
      { new: true, runValidators: true } // Returns the updated document and runs validation
    );

    return NextResponse.json({ success: true, blog: updatedBlog });

  } catch (error: any) {
    console.error("❌ BACKEND PUT ERROR LOG:", error.message || error);
    return NextResponse.json({ success: false, error: error.message || "Failed to update blog" }, { status: 500 });
  }
}

