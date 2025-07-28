import PageWrapper from "@/components/page-wrapper"
import Link from "next/link"

export default function About() {
  return (
    <PageWrapper>
      <div className="min-h-[calc(100vh-60px-88px)] py-4 bg-black -mt-[60px] pt-[60px]">
        <div className="max-w-4xl mx-auto px-8">
          <div className="bg-[#f7f7f8] p-8 sm:p-12 md:p-16 relative overflow-hidden">
            {/* Background SVG */}
            <img 
              src="/icons/nerds_fs.svg" 
              alt="" 
              className="absolute top-0 right-4 h-64 w-auto pointer-events-none"
            />
            {/* Logo */}
            <Link href="/" className="inline-block mb-2 relative z-10 group p-2 -m-2">
              <svg className="h-6 overflow-visible" viewBox="0 0 771.22 178.45" xmlns="http://www.w3.org/2000/svg">
                {/* 0 shape - with glow effect */}
                <path 
                  className="logo-hover-glow" 
                  fill="#d61f1f" 
                  d="M94.46,14.32C85.2,4.82,73.72,0,60.32,0h-11.86c-13.31,0-24.88,4.82-34.39,14.32C4.74,23.66,0,35.15,0,48.46v81.52c0,13.22,4.73,24.78,14.1,34.41,9.58,9.32,21.14,14.05,34.36,14.05h11.86c13.31,0,24.8-4.74,34.14-14.08,9.5-9.5,14.32-21.07,14.32-34.39V48.46c0-13.39-4.82-24.88-14.32-34.14ZM80.04,83.91v46.07c0,10.69-9.03,19.72-19.72,19.72h-11.86c-9.17,0-17.23-6.44-19.26-15.18l50.84-50.61ZM28.74,48.46c0-10.69,9.03-19.72,19.72-19.72h11.86c9.12,0,17.02,6.22,19.24,14.96l-50.81,51.04v-46.28Z"
                />
                {/* nerds text - no glow effect */}
                <g fill="#000">
                  <path d="M191.37,55.07h-2.7c-8.53,0-16.36,2.34-23.36,6.98v-4.96h-26.18v119.34h26.18v-77.22c0-9.74,8.22-17.96,17.96-17.96h8.1c9.9,0,17.96,8.06,17.96,17.96v77.22h26.18v-77.22c0-12.2-4.39-22.66-13.05-31.1-8.43-8.66-18.9-13.05-31.1-13.05Z"/>
                  <path d="M348.91,126.47v-27.26c0-12.22-4.4-22.69-13.02-31.07-8.44-8.68-18.91-13.07-31.12-13.07h-8.09c-12.13,0-22.67,4.39-31.32,13.05-8.51,8.5-12.82,18.96-12.82,31.09v35.1c0,12.12,4.39,22.66,13.06,31.34,8.85,8.6,19.02,12.79,31.08,12.79h8.77c20.05,0,37.62-13.56,42.71-32.98l.56-2.15-25.07-7.36-.62,2.26c-2.32,8.41-9.39,14.06-17.59,14.06h-8.77c-9.91,0-17.97-8.06-17.97-17.96v-7.84h70.21ZM278.71,99.21c0-9.91,8.06-17.96,17.97-17.96h8.09c9.91,0,17.96,8.05,17.96,17.96v3.11h-44.02v-3.11Z"/>
                  <path d="M424.25,81.25h8.55c8.51,0,15.73,5.83,17.56,14.18l.53,2.4,25.15-7.38-.52-2.12c-2.32-9.53-7.51-17.52-15.4-23.73-7.72-6.32-16.91-9.52-27.33-9.52h-8.55c-12.13,0-22.66,4.39-31.32,13.05-8.51,8.51-12.82,18.97-12.82,31.1v51.04h-22.95v26.18h99.08v-26.18h-49.95v-51.04c0-9.74,8.23-17.96,17.96-17.96Z"/>
                  <path d="M547.51,17.94v44.11c-7-4.64-14.84-6.99-23.37-6.99h-2.69c-12.13,0-22.67,4.39-31.32,13.05-8.51,8.5-12.82,18.96-12.82,31.09v35.1c0,12.04,4.3,22.56,12.84,31.34,8.73,8.49,19.25,12.79,31.3,12.79h2.69c8.53,0,16.37-2.34,23.37-6.97v4.96h26.18V17.94h-26.18ZM547.51,134.31c0,9.73-8.23,17.96-17.97,17.96h-8.09c-9.74,0-17.97-8.23-17.97-17.96v-35.1c0-9.74,8.23-17.96,17.97-17.96h8.09c9.74,0,17.97,8.22,17.97,17.96v35.1Z"/>
                  <path d="M627.43,152.27h20.46c-.16,1.86-.24,3.73-.24,5.6v20.58h-20.22c-16.32,0-30.4-10.69-35.05-26.61l-.64-2.18,25.11-7.64.63,2.26c1.38,4.94,5.19,8.01,9.95,8.01Z"/>
                  <path d="M620.49,91.34c0,6.53,5.92,10.04,11.42,10.54l23.03,2.93c4.52.66,8.71,1.91,12.49,3.69l-5.82,7.63-.41.56-.17.26c-3.15,4.68-5.76,9.43-7.8,14.23-.72-.19-1.48-.33-2.28-.45l-22.26-2.92c-9.8-.96-17.84-4.79-24.53-11.7-6.56-7.05-9.87-15.37-9.87-24.77,0-10.04,3.55-18.69,10.57-25.7,7.27-7.03,15.97-10.58,25.93-10.58h20.92c16.03,0,30.44,10.85,35.05,26.39l.36,1.18.29.99-1.38.42-23.92,7.29-.49-2.48c-.92-4.54-4.9-7.6-9.91-7.6h-20.92c-5.78,0-10.32,4.43-10.32,10.09Z"/>
                </g>
                {/* / shape - with glow effect */}
                <path 
                  className="logo-hover-glow" 
                  fill="#d61f1f" 
                  d="M740.87,19.68v18.27l-.21,2.74c-.15,2.57-2.36,9.6-6.26,14.47l-56.6,74.3-.13.18c-6.76,10.03-10.19,20.31-10.19,30.58v18.23h30.35v-18.23c0-6.33,4.04-12.11,4.17-12.3l56.68-74.41c8.32-10.93,12.53-22.83,12.53-35.38v-18.45h-30.35Z"
                />
              </svg>
            </Link>

            {/* Heading */}
            <h1 className="font-mono text-4xl font-medium tracking-[-0.08em] mb-2">How we started</h1>
            <div className="relative h-[3px] mb-12">
              <div className="absolute left-0 -right-8 sm:-right-12 md:-right-16 h-full bg-[#d61f1f]"></div>
            </div>

            {/* Content */}
            <div className="space-y-6 text-[17px] leading-[1.7] text-gray-800 font-mono tracking-[-0.05em] relative z-10">
              <p>
                Welcome to Weblog, a personal technology blog dedicated to exploring the fascinating intersections of
                artificial intelligence, programming, and cybersecurity.
              </p>

              <p>
                In an era where technology evolves at breakneck speed, this blog serves as a space to dive deep into the
                concepts, tools, and methodologies that shape our digital world. Whether you're a seasoned developer, a
                security professional, or someone curious about the latest developments in AI, you'll find thoughtful
                analysis and practical insights here.
              </p>

              <div className="pt-8">
                <h2 className="font-mono text-2xl font-semibold mb-6 tracking-[-0.06em] flex items-center">
                  <img src="/icons/section_heading_icon_20x20.svg" alt="" className="w-6 h-6 mr-2" />
                  What You'll Find Here
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-mono text-xl font-semibold mb-2 tracking-[-0.05em] flex items-center">
                      <span className="w-2 h-2 bg-[#d61f1f] opacity-60 rounded-full mr-3"></span>
                      Artificial Intelligence
                    </h3>
                    <p className="text-gray-700">
                      Deep dives into machine learning algorithms, neural network architectures, and the ethical
                      implications of AI development.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-mono text-xl font-semibold mb-2 tracking-[-0.05em] flex items-center">
                      <span className="w-2 h-2 bg-[#d61f1f] opacity-60 rounded-full mr-3"></span>
                      Programming
                    </h3>
                    <p className="text-gray-700">
                      Best practices, design patterns, and emerging technologies across various programming languages and
                      frameworks.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-mono text-xl font-semibold mb-2 tracking-[-0.05em] flex items-center">
                      <span className="w-2 h-2 bg-[#d61f1f] opacity-60 rounded-full mr-3"></span>
                      Security
                    </h3>
                    <p className="text-gray-700">
                      Cybersecurity strategies, vulnerability analysis, and practical guides for building secure
                      applications.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <h2 className="font-mono text-2xl font-semibold mb-6 tracking-[-0.06em] flex items-center">
                  <img src="/icons/section_heading_icon_20x20.svg" alt="" className="w-6 h-6 mr-2" />
                  Philosophy
                </h2>

                <p>
                  Technology should be accessible, understandable, and used responsibly. This blog aims to break down
                  complex topics into digestible insights while maintaining technical depth and accuracy.
                </p>

                <p>
                  Every post is crafted with care, backed by research, and written with the goal of providing genuine value
                  to the reader. The focus is on quality over quantity, ensuring each piece contributes meaningfully to the
                  ongoing conversation about technology's role in our lives.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}