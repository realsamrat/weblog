"use client"

import { Button } from "@/components/ui/button"

interface PromoBlockProps {
  title: string
  description: string
  location?: string
  date?: string
  buttonText: string
  buttonAction?: () => void
  logoText?: string
  variant?: 'techcrunch' | 'custom'
  className?: string
}

export default function PromoBlock({
  title,
  description,
  location,
  date,
  buttonText,
  buttonAction,
  logoText = "TC",
  variant = 'techcrunch',
  className = ""
}: PromoBlockProps) {
  const handleButtonClick = () => {
    if (buttonAction) {
      buttonAction()
    } else {
      console.log(`${buttonText} clicked`)
    }
  }

  return (
    <div className={`flex max-w-2xl mx-auto my-8 border overflow-hidden rounded-none border-emerald-400 bg-white ${className}`}>
      {/* Green sidebar with logo */}
      <div className="bg-green-500 flex justify-center w-24 flex-shrink-0 items-start pt-5">
        <div className="text-black font-bold text-2xl">{logoText}</div>
      </div>

      {/* Main content area */}
      <div className="flex-1 p-6">
        {/* Headline */}
        <h3 className="text-green-600 font-semibold text-xl mb-4">{title}</h3>

        {/* Description */}
        <p className="text-gray-800 text-base mb-4 leading-relaxed font-semibold">
          {description}
        </p>

        {/* Location, date and button wrapper */}
        <div className="flex flex-col gap-4">
          {/* Location and date - only show if provided */}
          {(location || date) && (
            <div className="flex items-center gap-2 text-green-600 font-medium text-sm">
              {location && <span className="font-semibold tracking-normal leading-4">{location}</span>}
              {location && date && <div className="w-px h-3 bg-green-600"></div>}
              {date && <span className="text-slate-600 leading-4">{date}</span>}
            </div>
          )}

          {/* CTA Button */}
          <Button
            className="bg-green-500 hover:bg-green-600 text-white font-semibold rounded-none px-[3.75rem] py-5 self-start"
            onClick={handleButtonClick}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  )
}

// Export the original TechCrunch version for backward compatibility
export function TechCrunchPromoBlock() {
  return (
    <PromoBlock
      title="Save $200+ on your TechCrunch All Stage pass"
      description="Build smarter. Scale faster. Connect deeper. Join visionaries from Precursor Ventures, NEA, Index Ventures, Underscore VC, and beyond for a day packed with strategies, workshops, and meaningful connections."
      location="Boston, MA"
      date="July 15"
      buttonText="REGISTER NOW"
      buttonAction={() => {
        // Add your registration logic here
        console.log("TechCrunch registration clicked")
      }}
    />
  )
}
