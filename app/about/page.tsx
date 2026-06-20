import React from 'react'

const About = () => {
  return (
<div className="relative min-h-screen bg-gray-200 overflow-hidden">
  {/* Purple Dot Background */}
  <div className="absolute inset-0 bg-[radial-gradient(#a855f766_1px,transparent_1px)] [background-size:16px_16px]" />

  {/* Purple Glow */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#7c3aed22,transparent_70%)]" />

  <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
    {/* Hero */}
    <div className="text-center mb-16">
      <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
        About <span className="text-purple-600">Blogisthan</span>
      </h1>

      <p className="max-w-3xl mx-auto text-lg text-gray-700">
        A modern blogging platform built for creators, writers, and thinkers
        who want to share their ideas with the world.
      </p>
    </div>

    {/* Mission */}
    <div className="bg-white rounded-3xl shadow-xl border border-purple-100 p-8 mb-10">
      <h2 className="text-3xl font-bold text-purple-600 mb-4">
        Our Mission
      </h2>

      <p className="text-gray-700 leading-relaxed">
        At Blogisthan, our mission is to make publishing accessible to
        everyone. We believe great ideas deserve an audience, and creating a
        blog should be as effortless as writing your first sentence. Our
        platform focuses on simplicity, performance, and a distraction-free
        writing experience.
      </p>
    </div>

    {/* Features */}
    <div className="grid md:grid-cols-2 gap-8 mb-10">
      <div className="bg-white rounded-3xl shadow-xl border border-purple-100 p-8">
        <h2 className="text-3xl font-bold text-purple-600 mb-4">
          What You Can Do
        </h2>

        <ul className="space-y-3 text-gray-700">
          <li>✍️ Create and publish blogs in minutes</li>
          <li>📚 Organize your content efficiently</li>
          <li>🌎 Share your ideas with the world</li>
          <li>📱 Access your blogs from any device</li>
          <li>⚡ Enjoy a fast and responsive experience</li>
        </ul>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-purple-100 p-8">
        <h2 className="text-3xl font-bold text-purple-600 mb-4">
          Why Blogisthan?
        </h2>

        <p className="text-gray-700 leading-relaxed">
          Unlike complex content management systems, Blogisthan is designed
          with simplicity in mind. We focus on delivering a smooth experience
          for both readers and writers while leveraging modern technologies to
          ensure speed, reliability, and scalability.
        </p>
      </div>
    </div>

    {/* Technology */}
    <div className="bg-white rounded-3xl shadow-xl border border-purple-100 p-8 mb-10">
      <h2 className="text-3xl font-bold text-purple-600 mb-6">
        Built With Modern Technology
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-gray-100 rounded-xl p-4 text-center font-semibold text-gray-800">
          Next.js
        </div>

        <div className="bg-gray-100 rounded-xl p-4 text-center font-semibold text-gray-800">
          React
        </div>

        <div className="bg-gray-100 rounded-xl p-4 text-center font-semibold text-gray-800">
          TypeScript
        </div>

        <div className="bg-gray-100 rounded-xl p-4 text-center font-semibold text-gray-800">
          Tailwind CSS
        </div>

        <div className="bg-gray-100 rounded-xl p-4 text-center font-semibold text-gray-800">
          NextAuth
        </div>
      </div>
    </div>

    {/* Community */}
    <div className="bg-white rounded-3xl shadow-xl border border-purple-100 p-8 text-center">
      <h2 className="text-3xl font-bold text-purple-600 mb-4">
        Join The Community
      </h2>

      <p className="text-gray-700 max-w-3xl mx-auto leading-relaxed">
        Blogisthan is more than a blogging platform—it's a place where ideas,
        stories, and knowledge come together. Whether you're a beginner writer
        or an experienced creator, we're excited to be part of your publishing
        journey.
      </p>

      <p className="mt-8 text-xl italic text-purple-600 font-medium">
        "Every great idea begins with a single post."
      </p>
    </div>
  </div>
</div>
  )
}

export default About
