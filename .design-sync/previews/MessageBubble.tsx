// MessageBubble uses motion.div with initial={{ opacity: 0, y: 10 }} — blank in headless capture.
// Static recreation with the same layout using inline styles.

const GENRE_COLOR: Record<string, string> = {
  'self-help': '#f5a623', 'thriller': '#c0392b', 'romance': '#e91e8c',
  'educational': '#2d9b6f', 'fiction': '#4a90d9', 'horror': '#7b2d2d',
};

const MsgBubble = ({ role, content, insight, followups, genre, time }: any) => {
  const isUser = role === 'user';
  const color = GENRE_COLOR[genre] || '#f5a623';
  const timestamp = time || '09:41';

  const paragraphs = (content || '').split(/\n\n+/).filter(Boolean);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '16px', flexDirection: isUser ? 'row-reverse' : 'row' }}>
      {/* Avatar */}
      <div style={{ width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px', backgroundColor: isUser ? '#f5a62315' : `${color}18`, border: `1px solid ${isUser ? '#f5a62330' : `${color}35`}` }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={isUser ? '#f5a623' : color} strokeWidth="2">
          {isUser ? <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/> : <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></>}
        </svg>
      </div>
      <div style={{ maxWidth: '85%', display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start' }}>
        {/* Bubble */}
        <div style={{ borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px', padding: '12px 16px', fontSize: '14px', lineHeight: 1.6, border: `1px solid ${isUser ? '#f5a62333' : '#2a2a2a'}`, borderLeft: !isUser ? `2px solid ${color}80` : undefined, background: isUser ? '#f5a62326' : '#1a1a1a', color: isUser ? '#f5f0e8' : '#e8ddd0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {paragraphs.map((p: string, i: number) => {
            const parts = p.split(/\*\*(.+?)\*\*/g);
            return <p key={i} style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{parts.map((part: string, j: number) => j % 2 === 1 ? <strong key={j} style={{ color: '#f5f0e8', fontWeight: 600 }}>{part}</strong> : part)}</p>;
          })}
        </div>
        {/* Business insight */}
        {insight && (
          <div style={{ marginTop: '8px', display: 'flex', alignItems: 'flex-start', gap: '8px', background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: '12px', padding: '10px 12px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f5a623" strokeWidth="2" style={{ flexShrink: 0, marginTop: '2px' }}><path d="M9 18h6M10 22h4M12 2a7 7 0 0 1 7 7c0 2.4-1.2 4.5-3 5.7V17H8v-2.3C6.2 13.5 5 11.4 5 9a7 7 0 0 1 7-7z"/></svg>
            <p style={{ margin: 0, fontSize: '12px', color: 'rgba(245,166,35,0.9)', lineHeight: 1.5 }}>{insight}</p>
          </div>
        )}
        {/* Follow-ups */}
        {followups?.length > 0 && (
          <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {followups.map((q: string, i: number) => (
              <button key={i} style={{ fontSize: '12px', background: '#1a1a1a', border: '1px solid #2a2a2a', color: '#9a8a78', padding: '6px 12px', borderRadius: '999px', cursor: 'pointer' }}>{q}</button>
            ))}
          </div>
        )}
        <p style={{ fontSize: '10px', color: '#5a4a3a', margin: '4px 0 0', textAlign: isUser ? 'right' : 'left' }}>{timestamp}</p>
      </div>
    </div>
  );
};

export const UserMessage = () => (
  <div style={{ background: '#0d0d0d', padding: '16px', maxWidth: '620px' }}>
    <MsgBubble role="user" content="How can I apply the concept of habit stacking to my startup routine?" genre="self-help" time="09:41" />
  </div>
);

export const AssistantWithInsight = () => (
  <div style={{ background: '#0d0d0d', padding: '16px', maxWidth: '620px' }}>
    <MsgBubble
      role="assistant"
      genre="self-help"
      time="09:42"
      content={`Habit stacking is particularly powerful for founders. **The formula**: "After I [CURRENT HABIT], I will [NEW HABIT]."\n\nFor your startup routine, consider anchoring high-leverage activities to existing habits — your morning coffee becomes your weekly metrics review, your team standup ends with a 5-minute strategic question.`}
      insight="Founders who systemise decision-making through habits free up cognitive bandwidth for creative problem-solving."
      followups={['What habits should I prioritise first?', 'How long until a habit becomes automatic?']}
    />
  </div>
);

export const Conversation = () => (
  <div style={{ background: '#0d0d0d', padding: '16px', maxWidth: '620px' }}>
    <MsgBubble role="user" content="How can I apply the concept of habit stacking to my startup routine?" genre="self-help" time="09:41" />
    <MsgBubble
      role="assistant"
      genre="self-help"
      time="09:42"
      content={`Habit stacking is particularly powerful for founders. **The formula**: "After I [CURRENT HABIT], I will [NEW HABIT]."\n\nFor your startup routine, consider anchoring high-leverage activities to existing habits — your morning coffee becomes your weekly metrics review.`}
      insight="Founders who systemise decision-making through habits free up cognitive bandwidth for creative problem-solving."
      followups={['What habits should I prioritise first?', 'How long until a habit becomes automatic?']}
    />
  </div>
);
