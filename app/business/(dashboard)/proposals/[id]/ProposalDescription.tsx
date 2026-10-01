type Props = {
  content: string | null;
};

function isSectionHeading(line: string) {
  const normalized = line.trim();

  if (!normalized) {
    return false;
  }

  return (
    normalized === normalized.toUpperCase() &&
    /[A-Z]/.test(normalized) &&
    normalized.length <= 80
  );
}

function isBullet(line: string) {
  return /^(\u2022|-|\*)\s+/.test(line.trim());
}

function getBulletText(line: string) {
  return line.trim().replace(/^(\u2022|-|\*)\s+/, "");
}

export default function ProposalDescription({
  content,
}: Props) {
  if (!content?.trim()) {
    return (
      <p className="text-sm text-slate-500">
        No description has been provided.
      </p>
    );
  }

  const lines = content.replace(/\r\n/g, "\n").split("\n");

  const elements: React.ReactNode[] = [];

  let paragraphLines: string[] = [];
  let bulletItems: string[] = [];

  function flushParagraph() {
    if (paragraphLines.length === 0) {
      return;
    }

    elements.push(
      <p
        key={`paragraph-${elements.length}`}
        className="text-sm leading-7 text-slate-700"
      >
        {paragraphLines.join(" ")}
      </p>,
    );

    paragraphLines = [];
  }

  function flushBullets() {
    if (bulletItems.length === 0) {
      return;
    }

    elements.push(
      <ul
        key={`bullets-${elements.length}`}
        className="list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700"
      >
        {bulletItems.map((item, index) => (
          <li key={`${item}-${index}`}>
            {item}
          </li>
        ))}
      </ul>,
    );

    bulletItems = [];
  }

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushBullets();
      return;
    }

    if (isSectionHeading(trimmed)) {
      flushParagraph();
      flushBullets();

      elements.push(
        <div
          key={`heading-${elements.length}`}
          className="border-b border-slate-100 pb-2 pt-3 first:pt-0"
        >
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900">
            {trimmed}
          </h3>
        </div>,
      );

      return;
    }

    if (isBullet(trimmed)) {
      flushParagraph();
      bulletItems.push(getBulletText(trimmed));
      return;
    }

    flushBullets();
    paragraphLines.push(trimmed);
  });

  flushParagraph();
  flushBullets();

  return (
    <div className="space-y-4">
      {elements}
    </div>
  );
}