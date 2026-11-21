// Splits text into masked words for the rise-in reveal.
// `intro` plays on load (hero); otherwise it reveals when scrolled into view via [data-reveal="words"].
// Screen readers get the plain sentence; the split spans are hidden from them.
export default function Words({
  text,
  intro = false,
  delay = 0,
  highlightLast = false,
}: {
  text: string;
  intro?: boolean;
  delay?: number;
  // Draw a hand-drawn underline under the final word (used once, in the hero)
  highlightLast?: boolean;
}) {
  const words = text.split(" ");
  return (
    <span
      className={intro ? "intro-words" : undefined}
      data-reveal={intro ? undefined : "words"}
      style={{ "--delay": `${delay}ms` } as React.CSSProperties}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => {
          const hl = highlightLast && i === words.length - 1;
          // Underline the word itself, not its trailing punctuation
          const [, body, punct] = hl ? (w.match(/^(.*?)([.,!?]*)$/) as RegExpMatchArray) : [w, w, ""];
          return (
            <span key={i}>
              <span className={hl ? "word-mask hl-mask" : "word-mask"}>
                <span className="word" style={{ "--w": i } as React.CSSProperties}>
                  {hl ? (
                    <>
                      <span className="hl">
                        {body}
                        <svg className="hl-stroke" viewBox="0 0 200 24" preserveAspectRatio="none" fill="none">
                          <path
                            d="M4 15C38 10 78 7.5 118 8.5C150 9.3 176 12 196 9"
                            pathLength={1}
                            stroke="currentColor"
                            strokeWidth={5}
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                      {punct}
                    </>
                  ) : (
                    w
                  )}
                </span>
              </span>
              {i < words.length - 1 && " "}
            </span>
          );
        })}
      </span>
    </span>
  );
}
