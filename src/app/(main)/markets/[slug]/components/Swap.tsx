'use client';

import React, { useEffect } from 'react';

export default function SwapComponent({
  mintAddress,
}: {
  mintAddress: string;
}) {
  useEffect(() => {
    if (typeof window !== 'undefined' && mintAddress) {
      import('@jup-ag/plugin')
        .then(mod => {
          const init = mod.init;
          init({
            displayMode: 'integrated',
            integratedTargetId: 'target-container',
            formProps: {
              fixedMint: mintAddress,
              initialInputMint: 'So11111111111111111111111111111111111111112',
              initialOutputMint: mintAddress,
            },
            branding: {
              name: 'OnlyFounders',
              logoUri:
                'https://icm-bucket.sfo3.digitaloceanspaces.com/tokens/myimage.png',
            },
            containerStyles: {
              backgroundColor: '#0C1014',
              color: '#FFFFFF',
              borderRadius: '20px',
              height: '480px',
            },
            containerClassName: 'hide-scrollbar',
          });
        })
        .catch(error => {
          console.error('Failed to load Jupiter swap widget:', error);
        });
    }
  }, [mintAddress]);

  return (
    <div className="bg-[#0C1014] rounded-2xl border border-[#191e23] hide-scrollbar">
      <div id="target-container" />
    </div>
  );
}
