import PromptBlock from './PromptBlock'

export default function PromptLibrary({ prompts }) {
  return (
    <div>
      <p className="text-zinc-400 text-sm leading-relaxed mb-6">
        Every prompt from this section in one place. Copy what you need.
      </p>
      <div className="space-y-2">
        {prompts.map((p, i) => (
          <PromptBlock key={i} label={p.label} content={p.content} />
        ))}
      </div>
    </div>
  )
}
