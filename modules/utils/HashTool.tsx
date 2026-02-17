
import React, { useState, useEffect } from 'react';

type Algorithm = 'MD5' | 'SHA-1' | 'SHA-224' | 'SHA-256' | 'SHA-384' | 'SHA-512';

interface HashToolProps {
  algorithm: Algorithm;
}

// Basic MD5 implementation for client-side hashing
function md5(str: string): string {
  const k = [
    0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee, 0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
    0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be, 0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
    0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa, 0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
    0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed, 0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
    0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c, 0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
    0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05, 0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
    0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039, 0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
    0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1, 0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391,
  ];

  const s = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
  ];

  const rotateLeft = (lValue: number, iShiftBits: number) => (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));

  const words: number[] = [];
  for (let i = 0; i < str.length; i++) {
    words[i >> 2] |= (str.charCodeAt(i) & 0xff) << ((i % 4) * 8);
  }
  words[str.length >> 2] |= 0x80 << ((str.length % 4) * 8);
  words[(((str.length + 8) >> 6) << 4) + 14] = str.length * 8;

  let a = 0x67452301;
  let b = 0xefcdab89;
  let c = 0x98badcfe;
  let d = 0x10325476;

  for (let i = 0; i < words.length; i += 16) {
    let aa = a, bb = b, cc = c, dd = d;

    for (let j = 0; j < 64; j++) {
      let f, g;
      if (j < 16) {
        f = (b & c) | (~b & d);
        g = j;
      } else if (j < 32) {
        f = (d & b) | (~d & c);
        g = (5 * j + 1) % 16;
      } else if (j < 48) {
        f = b ^ c ^ d;
        g = (3 * j + 5) % 16;
      } else {
        f = c ^ (b | ~d);
        g = (7 * j) % 16;
      }
      const temp = d;
      d = c;
      c = b;
      b = (b + rotateLeft(a + f + k[j] + (words[i + g] || 0), s[j])) | 0;
      a = temp;
    }
    a = (a + aa) | 0;
    b = (b + bb) | 0;
    c = (c + cc) | 0;
    d = (d + dd) | 0;
  }

  const toHex = (n: number) => {
    let s = '';
    for (let i = 0; i < 4; i++) {
      s += ((n >> (i * 8)) & 0xff).toString(16).padStart(2, '0');
    }
    return s;
  };

  return toHex(a) + toHex(b) + toHex(c) + toHex(d);
}

// Fix: Exporting HashTool component which was missing and causing errors in constants.tsx
export const HashTool: React.FC<HashToolProps> = ({ algorithm }) => {
  const [input, setInput] = useState('');
  const [hash, setHash] = useState('');

  useEffect(() => {
    const computeHash = async () => {
      if (!input) {
        setHash('');
        return;
      }

      if (algorithm === 'MD5') {
        setHash(md5(input));
        return;
      }

      try {
        const msgUint8 = new TextEncoder().encode(input);
        const hashBuffer = await crypto.subtle.digest(algorithm, msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        setHash(hashHex);
      } catch (e) {
        setHash('Error computing hash');
      }
    };

    computeHash();
  }, [input, algorithm]);

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest">Input String</label>
        <textarea 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="h-32 bg-[var(--bg-card)] border border-[var(--border)] p-4 font-mono text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-hover)] resize-none rounded-none"
          placeholder="Paste text here to generate hash..."
        />
      </div>
      <div className="flex flex-col gap-2 flex-1 min-h-0">
        <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest">{algorithm} Result</label>
        <div className="flex-1 relative">
          <textarea 
            readOnly
            value={hash}
            className="w-full h-full bg-[var(--bg-card)] border border-[var(--border)] p-4 font-mono text-xs text-[var(--text-muted)] focus:outline-none resize-none rounded-none"
            placeholder="Result will appear here..."
          />
          {hash && (
            <button 
              onClick={() => navigator.clipboard.writeText(hash)}
              className="absolute top-3 right-3 px-4 py-1.5 bg-[var(--bg-hover)] border border-[var(--border)] text-[9px] uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              Copy
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
