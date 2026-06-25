MessageBubble from booksphere-client. Use via `window.Booksphere.MessageBubble` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<BooksphereProvider>` (full provider chain in README.md — components read theme/i18n from that context).

## Examples

### UserMessage

```jsx
() => (
  <div style={{ background: '#0d0d0d', padding: '16px', maxWidth: '620px' }}>
    <MsgBubble role="user" content="How can I apply the concept of habit stacking to my startup routine?" genre="self-help" time="09:41" />
  </div>
)
```

### AssistantWithInsight

```jsx
() => (
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
)
```

### Conversation

```jsx
() => (
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
)
```
