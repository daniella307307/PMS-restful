import React, { useEffect, useState } from 'react';

function TypingHeader() {
  const fullText = "Revolutionizing Parking with Smart Technology".trim();
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(false); // Controls cursor visibility

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < fullText.length) {
        setTypedText((prev) => prev + fullText[index]);
        index++;
      } else {
        clearInterval(typingInterval);
        setShowCursor(true); // Show cursor only after typing completes
      }
    }, 100);

    return () => {
      clearInterval(typingInterval); // Proper cleanup
    };
  }, [fullText]); // Added dependency to avoid stale closure

  return (
    <h1 className='text-xl md:text-3xl font-bold mb-4 text-[#C0B7E8]'>
      {typedText}
      {showCursor && <span className='animate-pulse'>|</span>} {/* Only show cursor when done */}
    </h1>
  );
}

export default TypingHeader;