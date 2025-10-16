'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { IconBrandDiscord, IconBrandX, IconGlobe } from '@tabler/icons-react';

interface TokenVestingProps {
  tokenTicker: string;
}

export function TokenVesting({ tokenTicker }: TokenVestingProps) {
  const [vestingTerms, setVestingTerms] = useState('');

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 backdrop-blur-xl">
      <h3 className="text-lg font-semibold text-[#e5e7eb] mb-4">
        Token Vesting Schedule
      </h3>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-muted-foreground">Vesting Terms</Label>
          <div className="text-sm">No vesting</div>
        </div>
      </div>
    </div>
  );
}

export function LPDetails() {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 backdrop-blur-xl">
      <h3 className="text-lg font-semibold text-[#e5e7eb] mb-4">LP</h3>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-[#e5e7eb]">LP Unlock Date</Label>
          <div className="text-sm text-[#e5e7eb]">100% permanently locked</div>
        </div>
      </div>
    </div>
  );
}

export function TokenLinks() {
  const [links, setLinks] = useState({
    website: '',
    discord: '',
    twitter: '',
  });

  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');

  const handleEdit = (field: string) => {
    setEditingField(field);
    setTempValue(links[field as keyof typeof links]);
  };

  const handleSave = (field: string) => {
    setLinks(prev => ({
      ...prev,
      [field]: tempValue,
    }));
    setEditingField(null);
    toast.success('Link updated successfully');
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempValue('');
  };

  const linkIcons = {
    website: <IconGlobe />,
    discord: <IconBrandDiscord />,
    twitter: <IconBrandX />,
  };

  const linkLabels = {
    website: 'Website',
    discord: 'Discord',
    twitter: 'Twitter',
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 backdrop-blur-xl">
      <h3 className="text-lg font-semibold text-[#e5e7eb] mb-4">Links</h3>

      <div className="space-y-4">
        {Object.entries(links).map(([field, url]) => (
          <div key={field} className="flex items-center justify-between">
            <div className="flex items-center space-x-2 flex-1">
              <span className="text-sm text-[#9ca3af]">
                {linkIcons[field as keyof typeof linkIcons]}
              </span>
              {editingField === field ? (
                <Input
                  value={tempValue}
                  onChange={e => setTempValue(e.target.value)}
                  className="text-sm bg-[#0a0f12]/60 border-[#00ffff]/20"
                  placeholder={`Enter ${field} URL`}
                />
              ) : (
                <span className="text-sm text-[#e5e7eb] truncate">
                  {url ||
                    `Add ${linkLabels[field as keyof typeof linkLabels]} link`}
                </span>
              )}
            </div>
            <div className="flex space-x-2">
              {editingField === field ? (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleSave(field)}
                  >
                    Save
                  </Button>
                  <Button variant="secondary" size="sm" onClick={handleCancel}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleEdit(field)}
                >
                  {url ? 'Edit' : 'Add'}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// export function AddContent() {
//   const [isOwner, setIsOwner] = useState(true);
//   const [contentLinks, setContentLinks] = useState<string[]>([]);
//   const [newContentLink, setNewContentLink] = useState('');
//   const [showAddLink, setShowAddLink] = useState(false);

//   const handleAddContentLink = () => {
//     if (newContentLink.trim()) {
//       setContentLinks(prev => [...prev, newContentLink.trim()]);
//       setNewContentLink('');
//       setShowAddLink(false);
//       toast.success('Marketing link added successfully');
//     }
//   };

//   const handleRemoveLink = (index: number) => {
//     setContentLinks(prev => prev.filter((_, i) => i !== index));
//     toast.success('Marketing link removed');
//   };

//   return (
//     <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 backdrop-blur-xl">
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="text-lg font-semibold text-[#e5e7eb]">Add Content</h3>
//         <span className="text-xs text-[#00ffff] bg-[#00ffff]/10 px-2 py-1 rounded">Owner</span>
//       </div>

//       <div className="text-sm text-muted-foreground mb-2">
//         You are adding content as the owner
//       </div>

//       <div className="flex space-x-2 mb-4">
//         <Button variant="outline" size="sm" className="flex items-center space-x-1">
//           <span>📱</span>
//           <span>Post Tweet</span>
//         </Button>
//         <Button variant="outline" size="sm" className="flex items-center space-x-1">
//           <span>📷</span>
//           <span>Post Video</span>
//         </Button>
//         <Button variant="outline" size="sm" className="flex items-center space-x-1">
//           <span>📝</span>
//           <span>Add Text</span>
//         </Button>
//       </div>

//       <div className="mb-4">
//         <div className="flex items-center justify-between mb-2">
//           <h4 className="text-sm font-semibold text-[#e5e7eb]">Marketing Links</h4>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => setShowAddLink(!showAddLink)}
//           >
//             Add Link
//           </Button>
//         </div>

//         {showAddLink && (
//           <div className="space-y-2 mb-3 p-3 bg-[#0a0f12]/40 rounded-lg">
//             <Input
//               value={newContentLink}
//               onChange={(e) => setNewContentLink(e.target.value)}
//               placeholder="Enter link to your marketing content (Twitter, Reddit, etc.)"
//               className="bg-[#0a0f12]/60 border-[#00ffff]/20"
//             />
//             <div className="flex space-x-2">
//               <Button size="sm" onClick={handleAddContentLink}>Add</Button>
//               <Button variant="outline" size="sm" onClick={() => setShowAddLink(false)}>Cancel</Button>
//             </div>
//           </div>
//         )}

//         {contentLinks.length > 0 && (
//           <div className="space-y-2">
//             {contentLinks.map((link, index) => (
//               <div key={index} className="flex items-center justify-between p-2 bg-[#0a0f12]/20 rounded">
//                 <a
//                   href={link}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="text-sm text-[#00ffff] hover:underline truncate flex-1"
//                 >
//                   {link}
//                 </a>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => handleRemoveLink(index)}
//                   className="ml-2"
//                 >
//                   Remove
//                 </Button>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       <Button variant="outline" className="w-full" size="sm">
//         👥 Manage Delegates
//       </Button>
//     </div>
//   );
// }

export function HolderComments() {
  const [newComment, setNewComment] = useState('');
  const [marketingLink, setMarketingLink] = useState('');
  const [comments, setComments] = useState<
    Array<{
      id: string;
      text: string;
      marketingLink?: string;
      timestamp: Date;
      author: string;
    }>
  >([]);

  const handleSubmit = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now().toString(),
        text: newComment.trim(),
        marketingLink: marketingLink.trim() || undefined,
        timestamp: new Date(),
        author: 'You',
      };

      setComments(prev => [comment, ...prev]);
      setNewComment('');
      setMarketingLink('');
      toast.success('Comment posted successfully');
    }
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 backdrop-blur-xl">
      <h3 className="text-lg font-semibold text-[#e5e7eb] mb-4">
        Holder Comments
      </h3>

      <div className="space-y-4">
        <div className="space-y-3 p-4 bg-neutral-800  rounded-lg">
          <Input
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Share your thoughts about this token..."
          />

          <Input
            value={marketingLink}
            onChange={e => setMarketingLink(e.target.value)}
            placeholder="Link to your social media post promoting this token (optional)"
          />

          <div className="text-xs text-muted-foreground mb-2">
            Add a link to show where you've promoted this token on social media
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!newComment.trim()}
            size="sm"
            variant={'secondary'}
            className="ml-auto"
          >
            Post Comment
          </Button>
        </div>

        {comments.length > 0 ? (
          <div className="space-y-3">
            {comments.map(comment => (
              <div key={comment.id} className="p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-[#e5e7eb]">
                    {comment.author}
                  </span>
                  <span className="text-xs text-[#9ca3af]">
                    {comment.timestamp.toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-[#e5e7eb] mb-2">{comment.text}</p>
                {comment.marketingLink && (
                  <a
                    href={comment.marketingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#00ffff] hover:underline flex items-center space-x-1"
                  >
                    <span>🔗</span>
                    <span>View promotional post</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground text-center py-8">
            No comments yet. Be the first to share your thoughts!
          </div>
        )}
      </div>
    </div>
  );
}

export function LaunchConfiguration() {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 backdrop-blur-xl">
      <h3 className="text-lg font-semibold text-[#e5e7eb] mb-4">
        Launch Configuration
      </h3>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            Initial Market Cap
          </span>
          <span className="text-sm">4,999 USDC</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            Graduation Market Cap
          </span>
          <span className="text-sm">74,988 USDC</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            Anti-Sniping Protection
          </span>
          <span className="text-sm">Disabled</span>
        </div>
      </div>
    </div>
  );
}
