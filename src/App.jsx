import { useRef, useState } from 'react';
import './App.css';

const starterPosts = [
  { id: 1, user: 'beluga.dev', caption: 'Building my own social platform 🚀 #BeluTok', emoji: '🌌', sound: 'Original sound — Beluga', bg: 'space' },
  { id: 2, user: 'pixelwizard', caption: 'Tiny pixels. HUGE ideas. 🎮✨', emoji: '👾', sound: 'Pixel vibes', bg: 'pixel' },
  { id: 3, user: 'techhamster', caption: 'The hamster council has approved this 🐹', emoji: '🐹', sound: 'Funny sounds', bg: 'hamster' },
];

export default function App() {
  const [posts, setPosts] = useState(starterPosts);
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState({});
  const [saved, setSaved] = useState({});
  const [following, setFollowing] = useState({});
  const [tab, setTab] = useState('Home');
  const [comments, setComments] = useState({});
  const [draft, setDraft] = useState('');
  const [commentOpen, setCommentOpen] = useState(false);
  const picker = useRef(null);
  const post = posts[index];

  function uploadVideo(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const newPost = {
      id: Date.now(), user: 'beluga.dev',
      caption: file.name, emoji: '🎬', sound: 'Your video',
      video: url, bg: 'space',
    };
    setPosts(p => [newPost, ...p]);
    setIndex(0);
    setTab('Home');
    e.target.value = '';
  }

  function changeTab(next) {
    setTab(next);
    if (next === 'Create') picker.current?.click();
  }

  function sendComment(e) {
    e.preventDefault();
    if (!draft.trim()) return;
    setComments(c => ({
      ...c,
      [post.id]: [...(c[post.id] || []), draft.trim()],
    }));
    setDraft('');
  }

  const shownPosts = tab === 'Following'
    ? posts.filter(p => following[p.user] || p.user === 'beluga.dev')
    : posts;
  const currentIndex = Math.min(index, Math.max(0, shownPosts.length - 1));
  const current = shownPosts[currentIndex] || post;

  return (
    <main className="app">
      <input ref={picker} hidden type="file" accept="video/*" onChange={uploadVideo} />

      <header className="topbar">
        <button className="brand" onClick={() => changeTab('Home')}>belu<span>tok</span></button>
        <nav className="feed-tabs">
          <button onClick={() => changeTab('Following')} className={tab === 'Following' ? 'selected' : ''}>Following</button>
          <button onClick={() => changeTab('Home')} className={tab === 'Home' ? 'selected' : ''}>For You</button>
        </nav>
        <button className="search" onClick={() => changeTab('Discover')} aria-label="Search">⌕</button>
      </header>

      {tab === 'Profile' || tab === 'Discover' || tab === 'Inbox' ? (
        <section className="simple-page">
          {tab === 'Profile' ? (
            <>
              <div className="big-avatar">🐋</div>
              <h2>@beluga.dev</h2>
              <p>Building BeluTok 🚀</p>
              <div className="stats">
                <span><b>{posts.filter(p => p.user === 'beluga.dev').length}</b> posts</span>
                <span><b>{Object.values(following).filter(Boolean).length}</b> following</span>
                <span><b>{Object.values(liked).filter(Boolean).length}</b> likes</span>
              </div>
              <button className="upload-btn" onClick={() => picker.current?.click()}>＋ Upload video</button>
            </>
          ) : (
            <>
              <h2>{tab === 'Discover' ? 'Discover' : 'Inbox'}</h2>
              <p>{tab === 'Discover' ? 'Find your next favourite video.' : 'Your messages will appear here.'}</p>
              {tab === 'Discover' && posts.map((p, i) => (
                <button className="discover-item" key={p.id} onClick={() => { setIndex(i); setTab('Home'); }}>
                  <span>{p.emoji}</span><span>@{p.user}<small>{p.caption}</small></span>
                </button>
              ))}
            </>
          )}
        </section>
      ) : (
        <section className="feed">
          {current ? (
            <article className={`video ${current.bg || 'space'}`} key={current.id}>
              {current.video ? (
                <video className="actual-video" src={current.video} controls loop playsInline autoPlay />
              ) : (
                <div className="visual"><span>{current.emoji}</span><small>BELUTOK</small></div>
              )}
              <div className="video-shade" />
              <div className="video-content">
                <div className="post-info">
                  <div className="username">@{current.user}</div>
                  <p>{current.caption}</p>
                  <div className="sound">♫ {current.sound}</div>
                </div>
                <aside className="actions">
                  <button onClick={() => setFollowing(f => ({ ...f, [current.user]: !f[current.user] }))} className="creator-avatar">
                    {current.user === 'beluga.dev' ? '🐋' : current.emoji}
                    <i>{following[current.user] ? '✓' : '+'}</i>
                  </button>
                  <button onClick={() => setLiked(l => ({ ...l, [current.id]: !l[current.id] }))} className={liked[current.id] ? 'liked' : ''}>
                    <span>♥</span><small>{(liked[current.id] ? 129 : 128) + (current.id - 1) * 0}</small>
                  </button>
                  <button onClick={() => setCommentOpen(true)}><span>●</span><small>{(comments[current.id] || []).length || 'Comment'}</small></button>
                  <button onClick={() => setSaved(s => ({ ...s, [current.id]: !s[current.id] }))} className={saved[current.id] ? 'liked' : ''}><span>▣</span><small>{saved[current.id] ? 'Saved' : 'Save'}</small></button>
                  <button onClick={() => navigator.share ? navigator.share({ title: 'BeluTok', text: current.caption }).catch(() => {}) : alert(current.caption)}><span>↗</span><small>Share</small></button>
                </aside>
              </div>
              <div className="feed-switch">
                <button onClick={() => setIndex(i => (i - 1 + shownPosts.length) % shownPosts.length)}>↑</button>
                <button onClick={() => setIndex(i => (i + 1) % shownPosts.length)}>↓</button>
              </div>
            </article>
          ) : <div className="empty">No videos yet. Upload one! 🎬</div>}
        </section>
      )}

      <footer className="bottom-nav">
        <button className={tab === 'Home' || tab === 'Following' ? 'active' : ''} onClick={() => changeTab('Home')}><span>⌂</span><small>Home</small></button>
        <button className={tab === 'Discover' ? 'active' : ''} onClick={() => changeTab('Discover')}><span>⌕</span><small>Discover</small></button>
        <button className="create" onClick={() => picker.current?.click()}><span>＋</span></button>
        <button className={tab === 'Inbox' ? 'active' : ''} onClick={() => changeTab('Inbox')}><span>✉</span><small>Inbox</small></button>
        <button className={tab === 'Profile' ? 'active' : ''} onClick={() => changeTab('Profile')}><span>◉</span><small>Profile</small></button>
      </footer>

      {commentOpen && current && (
        <div className="overlay" onClick={() => setCommentOpen(false)}>
          <section className="comments" onClick={e => e.stopPropagation()}>
            <header><b>Comments</b><button onClick={() => setCommentOpen(false)}>×</button></header>
            <div className="comment-list">
              {(comments[current.id] || []).length
                ? comments[current.id].map((c, i) => <p key={i}><b>@beluga.dev</b> {c}</p>)
                : <p className="muted">Be the first to comment 👀</p>}
            </div>
            <form onSubmit={sendComment}>
              <input value={draft} onChange={e => setDraft(e.target.value)} placeholder="Add a comment..." maxLength={300} />
              <button>Post</button>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
