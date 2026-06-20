import mongoose, { Model, Document } from "mongoose";
import slugify from "slugify";

// 1. Define the TypeScript fields interface
export interface IBlog {
  title: string;
  category?: string;
  image?: string;
  content: string;
  tags?: string[];
  authorName?: string;
  authorEmail?: string;
  slug: string;
}

// 2. Define the schema
const BlogSchema = new mongoose.Schema<IBlog>(
  {
    title: { type: String, required: true },
    category: String,
    image: String,
    content: { type: String, required: true },
    tags: [String],
    authorName: String,
    authorEmail: String,
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

// 3. Hook: Clean, typed, synchronous hook (NO 'next' callback)
BlogSchema.pre("validate", function (this: Document & IBlog) {
  if (this.title && (this.isNew || this.isModified("title"))) {
    const baseSlug = slugify(this.title, {
      lower: true,
      strict: true,
    });

    const stringId = this._id ? this._id.toString() : "";
    this.slug = `${baseSlug}-${stringId}`;
  }
});

// 4. Safe Export using Mongoose's cache system
const Blog = (mongoose.models.Blog as Model<IBlog>) || mongoose.model<IBlog>("Blog", BlogSchema);

export default Blog;