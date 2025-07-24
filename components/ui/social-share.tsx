'use client'

import React, { useState } from 'react'
import { Facebook, Twitter, Linkedin, Mail, Copy, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

interface SocialShareProps {
  url: string
  title: string
  className?: string
}

export function SocialShare({ url, title, className = '' }: SocialShareProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=Check out this article: ${encodedUrl}`
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast({
        title: "Link copied!",
        description: "The article link has been copied to your clipboard.",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast({
        title: "Failed to copy",
        description: "Could not copy the link to clipboard.",
        variant: "destructive"
      })
    }
  }

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], '_blank', 'noopener,noreferrer')
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleShare('facebook')}
        className="h-8 w-8 p-0 text-white hover:bg-white/10 hover:text-blue-400"
        aria-label="Share on Facebook"
      >
        <Facebook className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleShare('twitter')}
        className="h-8 w-8 p-0 text-white hover:bg-white/10 hover:text-white"
        aria-label="Share on X (Twitter)"
      >
        <Twitter className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleShare('linkedin')}
        className="h-8 w-8 p-0 text-white hover:bg-white/10 hover:text-blue-400"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleShare('reddit')}
        className="h-8 w-8 p-0 text-white hover:bg-white/10 hover:text-orange-400"
        aria-label="Share on Reddit"
      >
        <MessageSquare className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleShare('email')}
        className="h-8 w-8 p-0 text-white hover:bg-white/10 hover:text-white"
        aria-label="Share via Email"
      >
        <Mail className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopyLink}
        className={`h-8 w-8 p-0 transition-colors ${
          copied 
            ? 'bg-green-500/20 text-green-400' 
            : 'text-white hover:bg-white/10 hover:text-white'
        }`}
        aria-label="Copy link"
      >
        <Copy className="h-4 w-4" />
      </Button>
    </div>
  )
}
