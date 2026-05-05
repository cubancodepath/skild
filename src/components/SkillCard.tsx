import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Check, Copy, Download, Star } from "lucide-react";
import { useState } from "react";

type SkillCardProps = {
  id: string;
  slug: string;
  title: string;
  description: string;
  tags: string[] | null;
  createdAt: string | Date;
  installCommand: string | null;
};

const SkillCard = ({
  id,
  slug,
  createdAt,
  description,
  installCommand,
  tags,
  title,
}: SkillCardProps) => {
  const [copied, setCopied] = useState(false);

  const safeTags = tags ?? [];
  const category = safeTags[0] ?? "General";
  const commandToShow = installCommand ?? `skild add ${slug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(commandToShow);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };
  return (
    <article className="skill-card">
      <div className="chrome">
        <div className="chrome-bar">
          <div className="lights">
            <div className="light red" />
            <div className="light amber" />
            <div className="light green" />
          </div>
          <div className="host">registry.sh</div>
        </div>
      </div>

      <div className="body">
        <div className="meta">
          <div className="author">
            <div className="author-copy">
              <p>{slug}</p>
              <p>
                {createdAt
                  ? new Date(createdAt).toLocaleDateString()
                  : "Unknown date"}
              </p>
            </div>
          </div>

          <p className="category">{category}</p>
        </div>

        <div className="summary">
          <Link
            to="/skills/$skillId"
            params={{ skillId: id }}
            className="title-link"
          >
            <h3>{title}</h3>
          </Link>

          <p>{description}</p>
        </div>

        <div className="command">
          <div className="command-copy">
            <span>{">_"}</span>
            <p>{commandToShow}</p>
          </div>
          <button
            type="button"
            className="copy"
            onClick={handleCopy}
            aria-label="Copy install command"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>

        <div className="footer">
          <div className="stats">
            <button type="button" className="upvote" disabled>
              <Star size={16} />
              <span>--</span>
            </button>

            <div className="comments">
              <Download size={14} />
              <span>--</span>
            </div>
          </div>

          <div className="actions">
            <Link
              to="/skills/$skillId"
              params={{ skillId: id }}
              className="open"
              title={`Open ${title}`}
            >
              <span>Open</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default SkillCard;
