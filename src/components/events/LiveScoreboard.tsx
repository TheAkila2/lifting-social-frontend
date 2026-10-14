'use client';

import { Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import api from '@/lib/api';

interface LiveState {
  current_session: number;
  current_group: string;
  current_lift_type: 'snatch' | 'clean_jerk' | 'break';
  current_athlete_name: string;
  current_attempt_number: number;
  current_weight: number;
  timer_running: boolean;
  timer_remaining: number;
  referee_decisions: any;
  next_athlete_name: string;
  next_weight: number;
  lifting_order: any[];
  last_update: string;
}

interface AthleteResult {
  registration_id: string;
  athlete_id?: string;
  source_registration_id?: string;
  athlete_name: string;
  weight_category: string;
  lot_number: number;
  start_number?: number;
  body_weight?: number;
  session_number: number;
  group_number: string;
  club_name: string;
  
  snatch_opener: number;
  snatch_1_weight: number;
  snatch_1_result: string;
  snatch_2_weight: number;
  snatch_2_result: string;
  snatch_3_weight: number;
  snatch_3_result: string;
  best_snatch: number;
  
  cnj_opener: number;
  clean_jerk_1_weight: number;
  clean_jerk_1_result: string;
  clean_jerk_2_weight: number;
  clean_jerk_2_result: string;
  clean_jerk_3_weight: number;
  clean_jerk_3_result: string;
  best_clean_jerk: number;
  
  total: number;
  sinclair_score: number;
  category_rank: number;
  is_dq?: boolean;
  medals: {
    gold: boolean;
    silver: boolean;
    bronze: boolean;
  };
}

interface LiveScoreboardProps {
  eventId: string;
  showControls?: boolean;
}

export default function LiveScoreboard({ eventId, showControls = false }: LiveScoreboardProps) {
  const [liveState, setLiveState] = useState<LiveState | null>(null);
  const [athletes, setAthletes] = useState<AthleteResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvedEventId, setResolvedEventId] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<string>('live');
  const [availableSessionsDetails, setAvailableSessionsDetails] = useState<any[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const scaleViewportRef = useRef<HTMLDivElement>(null);
  const scaleContentRef = useRef<HTMLDivElement>(null);
  const fetchSequenceRef = useRef(0);

  // "Expand" mode — a CSS-only full-viewport overlay instead of the native
  // Fullscreen API. iOS Safari on iPhone (unlike iPad) doesn't support
  // requestFullscreen() on arbitrary elements at all, so that approach
  // silently did nothing on phones. This works identically everywhere.
  useEffect(() => {
    document.body.style.overflow = isFullscreen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  const toggleFullscreen = () => setIsFullscreen((prev) => !prev);

  // Scale the whole table down (never up) to fit the viewport with no
  // scrolling at all — same "fit to screen" technique as the desktop
  // Technical Panel's own Scoreboard screen, so a phone in landscape gets
  // the same no-scroll full-screen experience instead of a tiny slice of a
  // 1000px-wide table under a horizontal scrollbar.
  useLayoutEffect(() => {
    if (!isFullscreen) {
      setScale(1);
      return;
    }

    const measure = () => {
      const viewport = scaleViewportRef.current;
      const content = scaleContentRef.current;
      if (!viewport || !content) return;

      const prevTransform = content.style.transform;
      content.style.transform = 'none';
      const contentWidth = content.scrollWidth;
      const contentHeight = content.scrollHeight;
      content.style.transform = prevTransform;

      if (!contentWidth || !contentHeight) return;

      const widthScale = viewport.clientWidth / contentWidth;
      const heightScale = viewport.clientHeight / contentHeight;
      setScale(Math.min(1, widthScale, heightScale));
    };

    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('orientationchange', measure);
    const rafId = requestAnimationFrame(measure);

    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('orientationchange', measure);
      cancelAnimationFrame(rafId);
    };
  }, [isFullscreen, athletes, selectedSession]);

  const { scheduledSessions, inProgressSessions, completedSessions } = useMemo(() => {
    const scheduled: any[] = [];
    const inProgress: any[] = [];
    const completed: any[] = [];

    availableSessionsDetails.forEach(session => {
      const sessionAthletes = athletes.filter(a => a.session_number === session.session_number);
      const sessionData = { ...session, athletes: sessionAthletes };

      if (session.status === 'in-progress' || session.status === 'in_progress') {
        inProgress.push(sessionData);
      } else if (session.status === 'completed') {
        completed.push(sessionData);
      } else {
        scheduled.push(sessionData);
      }
    });

    // If nothing is in progress, check for a live state override
    if (inProgress.length === 0 && liveState?.current_session) {
        const sessionToMove = scheduled.findIndex(s => s.session_number === liveState.current_session);
        if (sessionToMove > -1) {
            const [session] = scheduled.splice(sessionToMove, 1);
            inProgress.push(session);
        }
    }

    return { scheduledSessions: scheduled, inProgressSessions: inProgress, completedSessions: completed };
  }, [athletes, availableSessionsDetails, liveState]);

  const sessionButtons = useMemo(() => {
    return availableSessionsDetails
      .slice()
      .sort((a, b) => (a.session_number || 0) - (b.session_number || 0))
      .map((s) => ({
        value: String(s.session_number),
        label: s.name || `Session ${s.session_number}`,
      }));
  }, [availableSessionsDetails]);

  const visibleSessions = useMemo(() => {
    if (selectedSession === 'all') {
      return {
        visibleInProgress: inProgressSessions,
        visibleScheduled: scheduledSessions,
        visibleCompleted: completedSessions,
      };
    }

    if (selectedSession === 'live') {
      if (inProgressSessions.length > 0) {
        return {
          visibleInProgress: inProgressSessions,
          visibleScheduled: [],
          visibleCompleted: [],
        };
      }

      return {
        visibleInProgress: [],
        visibleScheduled: scheduledSessions.slice(0, 1),
        visibleCompleted: [],
      };
    }

    const sessionNum = parseInt(selectedSession, 10);
    return {
      visibleInProgress: inProgressSessions.filter((s) => s.session_number === sessionNum),
      visibleScheduled: scheduledSessions.filter((s) => s.session_number === sessionNum),
      visibleCompleted: completedSessions.filter((s) => s.session_number === sessionNum),
    };
  }, [selectedSession, inProgressSessions, scheduledSessions, completedSessions]);

  const boardLabel = useMemo(() => {
    if (selectedSession === 'live') {
      if (inProgressSessions.length > 0) {
        return inProgressSessions[0].name || `Session ${inProgressSessions[0].session_number} - In Progress`;
      }
      if (scheduledSessions.length > 0) {
        return `${scheduledSessions[0].name || `Session ${scheduledSessions[0].session_number}`} - Next Session`;
      }
      return 'Live Session';
    }

    if (selectedSession !== 'all') {
      const session = availableSessionsDetails.find((s) => String(s.session_number) === selectedSession);
      if (session) {
        return session.name || `Session ${session.session_number}`;
      }
    }

    if (scheduledSessions.length > 0) {
      return 'All Sessions';
    }

    return 'Competition Scoreboard';
  }, [inProgressSessions, scheduledSessions, selectedSession, availableSessionsDetails]);

  const highlightedAthleteKey = useMemo(() => {
    if (!liveState?.current_athlete_name) return null;
    return liveState.current_athlete_name.toLowerCase();
  }, [liveState]);

  useEffect(() => {
    if (selectedSession === 'live' || selectedSession === 'all') return;

    const selectedExists = availableSessionsDetails.some(
      (s) => String(s.session_number) === selectedSession
    );

    if (!selectedExists) {
      setSelectedSession('live');
    }
  }, [selectedSession, availableSessionsDetails]);

  useEffect(() => {
    // Fetch initial scoreboard data
    fetchScoreboard();

    const refreshId = setInterval(() => {
      fetchScoreboard();
    }, 5000);

    const handleWindowFocus = () => {
      fetchScoreboard();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchScoreboard();
      }
    };

    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const socketBaseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '');

    // Initialize WebSocket connection
    const newSocket = io(socketBaseUrl, {
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('WebSocket connected');
      newSocket.emit('join-competition', resolvedEventId || eventId);
    });

    newSocket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    newSocket.on('connect_error', (err) => {
      // The 5s poll (above) is the real data path regardless of socket
      // state, so a failed handshake here is just logged, not surfaced —
      // the UI indicator for this was more confusing than useful in
      // practice (e.g. iOS backgrounding tabs disconnects sockets harmlessly).
      console.error('WebSocket connect error:', err.message);
    });

    newSocket.on('live-update', (update: any) => {
      console.log('Live update received:', update);
      handleLiveUpdate(update);
    });

    return () => {
      clearInterval(refreshId);
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (newSocket) {
        newSocket.emit('leave-competition', resolvedEventId || eventId);
        newSocket.close();
      }
    };
  }, [eventId, resolvedEventId]);

  const fetchScoreboard = async () => {
    const requestId = ++fetchSequenceRef.current;

    try {
      const response = await api.get(`/wl-system/scoreboard/${eventId}`, {
        params: { _t: Date.now() }
      });
      const payload = response?.data || {};

      // Ignore stale responses from older in-flight requests.
      if (requestId !== fetchSequenceRef.current) return;

      if (payload.event_id) {
        setResolvedEventId(payload.event_id);
      }
      
      setAvailableSessionsDetails(payload.available_sessions_details || []);
      setAthletes(payload.scoreboard || []);
      setLiveState(payload.live_state);
      setLoading(false);
    } catch (error) {
      if (requestId !== fetchSequenceRef.current) return;
      console.error('Error fetching scoreboard:', error);
      setLoading(false);
    }
  };

  const handleLiveUpdate = (update: any) => {
    switch (update.type) {
      case 'state_update':
        setLiveState(update.data);
        break;
      
      case 'result_update':
        // Refresh full dataset so totals/ranks remain canonical after each decision.
        fetchScoreboard();
        break;
      
      case 'timer_update':
        setLiveState(prev => prev ? { ...prev, timer_running: update.data.running, timer_remaining: update.data.remaining } : null);
        break;
      
      case 'competition_start':
        fetchScoreboard(); // Refresh full data
        break;
      
      case 'session_complete':
        fetchScoreboard(); // Refresh to get final rankings
        break;

      case 'attempt_update':
        fetchScoreboard(); // Keep live board in sync with technical panel attempt edits
        break;

      case 'athlete_update':
      case 'dq_update':
        fetchScoreboard(); // Keep DQ/lot/status changes canonical with backend ranking output
        break;
    }
  };

  // Same tile look (color + spacing, no border) as WL-System's live Scoreboard
  // screen: a colored rounded tile with a small margin, not a full-bleed
  // table-cell background — this is the one piece of styling that has to
  // match exactly for the site to read as "the same scoreboard."
  const renderAttempt = (weight: number | null, result: string | null, isDq = false) => {
    const normalized = (result || '').toLowerCase().trim().replace(/\s+/g, '_').replace(/-/g, '_');
    const isGood = normalized === 'good_lift' || normalized === 'good' || normalized === 'success' || normalized === 'pass';
    const isNoLift = normalized === 'no_lift' || normalized === 'bad' || normalized === 'fail' || normalized === 'failed' || normalized === 'reject';

    const tileClass = "flex items-center justify-center h-full font-bold tabular-nums rounded-md m-1";

    if (isDq && (!normalized || normalized === 'pending' || normalized === 'not_attempted')) {
      return <div className={tileClass} style={{ backgroundColor: '#ef4444', color: '#ffffff' }}>{weight || '-'}</div>;
    }

    if (normalized === 'not_attempted') {
      return <div className={tileClass} style={{ backgroundColor: '#e5e7eb', color: '#4b5563' }}>N/A</div>;
    }

    if (!weight) {
      return <div className={tileClass} style={{ backgroundColor: '#f1f5f9', color: '#94a3b8' }}>-</div>;
    }

    if (isGood) {
      return <div className={tileClass} style={{ backgroundColor: '#4ade80', color: '#14532d' }}>{weight}</div>;
    }
    if (isNoLift) {
      return <div className={tileClass} style={{ backgroundColor: '#ef4444', color: '#ffffff' }}>{weight}</div>;
    }
    return <div className={tileClass} style={{ backgroundColor: '#fde047', color: '#713f12' }}>{weight}</div>;
  };

  const renderMedal = (medals: any) => {
    if (medals?.gold) return <span className="text-yellow-500 text-xl">🥇</span>;
    if (medals?.silver) return <span className="text-gray-400 text-xl">🥈</span>;
    if (medals?.bronze) return <span className="text-amber-600 text-xl">🥉</span>;
    return null;
  };

const renderSessionTable = (session: any, isLive: boolean) => {
    const sessionAthletes = [...(session.athletes || [])];
  const isSessionCompleted = session?.status === 'completed';

    const groupedByClass = sessionAthletes.reduce<Record<string, AthleteResult[]>>((acc, athlete) => {
      const classKey = (athlete.weight_category || 'Unclassified').toString().trim() || 'Unclassified';
      if (!acc[classKey]) {
        acc[classKey] = [];
      }
      acc[classKey].push(athlete);
      return acc;
    }, {});

    const sortedClasses = Object.keys(groupedByClass).sort((a, b) => {
      const numA = parseFloat(a.replace(/[^0-9.]/g, ''));
      const numB = parseFloat(b.replace(/[^0-9.]/g, ''));

      if (!Number.isNaN(numA) && !Number.isNaN(numB) && numA !== numB) {
        return numA - numB;
      }

      return a.localeCompare(b);
    });

    const shouldShowClassHeaders = sortedClasses.length > 1;

    const getClassAthletes = (classKey: string) => {
      return [...groupedByClass[classKey]].sort((a, b) => {
        const dqA = a.is_dq === true;
        const dqB = b.is_dq === true;
        if (dqA !== dqB) return dqA ? 1 : -1;

        const startA = a.start_number ?? Number.MAX_SAFE_INTEGER;
        const startB = b.start_number ?? Number.MAX_SAFE_INTEGER;
        if (startA !== startB) return startA - startB;

        const lotA = a.lot_number ?? Number.MAX_SAFE_INTEGER;
        const lotB = b.lot_number ?? Number.MAX_SAFE_INTEGER;
        if (lotA !== lotB) return lotA - lotB;
        return (a.athlete_name || '').localeCompare(b.athlete_name || '');
      });
    };

    const headerCellStyle = { backgroundColor: '#1e1b4b', color: '#ffffff' };
    const colGroup = (
      <colgroup>
        <col style={{ width: '30%' }} />
        <col style={{ width: '6%' }} /><col style={{ width: '6%' }} /><col style={{ width: '6%' }} /><col style={{ width: '7%' }} />
        <col style={{ width: '6%' }} /><col style={{ width: '6%' }} /><col style={{ width: '6%' }} /><col style={{ width: '7%' }} />
        <col style={{ width: '7%' }} /><col style={{ width: '5%' }} />
      </colgroup>
    );

    return (
      <div key={session.id} className="overflow-x-auto">
        <h3 className="px-4 sm:px-6 py-2 text-sm font-bold uppercase tracking-wide text-slate-500">
          {session.name || `Session ${session.session_number}`}
        </h3>
        <table className="min-w-[1000px] w-full table-fixed border-collapse">
          {colGroup}
          <thead>
            <tr className="h-11" style={headerCellStyle}>
              <th className="px-3 text-left text-xs sm:text-sm font-bold uppercase tracking-wide" style={headerCellStyle} />
              <th className="text-center text-xs sm:text-sm font-bold" style={headerCellStyle}>1</th>
              <th className="text-center text-xs sm:text-sm font-bold" style={headerCellStyle}>2</th>
              <th className="text-center text-xs sm:text-sm font-bold" style={headerCellStyle}>3</th>
              <th className="text-center text-xs sm:text-sm font-bold" style={headerCellStyle}>Best</th>
              <th className="text-center text-xs sm:text-sm font-bold" style={headerCellStyle}>1</th>
              <th className="text-center text-xs sm:text-sm font-bold" style={headerCellStyle}>2</th>
              <th className="text-center text-xs sm:text-sm font-bold" style={headerCellStyle}>3</th>
              <th className="text-center text-xs sm:text-sm font-bold" style={headerCellStyle}>Best</th>
              <th className="text-center text-xs sm:text-sm font-bold" style={headerCellStyle}>TOTAL</th>
              <th className="text-center text-xs sm:text-sm font-bold" style={headerCellStyle}>RANK</th>
            </tr>
          </thead>
          <tbody>
            {sessionAthletes.length === 0 && (
              <tr>
                <td colSpan={11} className="px-4 py-8 text-center text-sm text-slate-400">
                  No athletes in this session yet.
                </td>
              </tr>
            )}
            {sortedClasses.map((classKey) => {
              const classAthletes = getClassAthletes(classKey);

              return (
                <Fragment key={`class-${session.id}-${classKey}`}>
                  {shouldShowClassHeaders && (
                    <tr className="h-10">
                      <td colSpan={11} className="px-3 text-sm font-black uppercase tracking-wide text-white" style={{ backgroundColor: '#1e1b4b' }}>
                        {classKey.toLowerCase().includes('kg') ? classKey : `${classKey}kg`} Weight Class
                      </td>
                    </tr>
                  )}
                  {classAthletes.map((athlete: AthleteResult, index: number) => {
                    const isCurrent = isLive && highlightedAthleteKey === (athlete.athlete_name || '').toLowerCase();
                    const isDq = athlete.is_dq === true;
                    const rankValue = !isDq && (athlete.total || 0) > 0
                      ? athlete.category_rank || null
                      : null;

                    return (
                      <tr
                        key={`${athlete.registration_id}-${classKey}`}
                        className="h-[52px] border-b border-slate-200"
                        style={isCurrent ? { backgroundColor: '#fef9c3' } : undefined}
                      >
                        <td className="p-0 h-[52px]">
                          <div className="h-full flex items-center justify-between gap-2 bg-slate-50 rounded-md px-3 m-1">
                            <span className="truncate font-semibold text-black">
                              <span className="text-slate-400 font-normal mr-2">{athlete.lot_number ?? index + 1}</span>
                              {athlete.athlete_name || 'Unknown Athlete'}
                              {isDq && <span className="ml-2 text-xs font-bold uppercase text-red-600">DQ</span>}
                            </span>
                            <span className="shrink-0 text-xs font-bold text-slate-500 uppercase">
                              {athlete.club_name ? `(${athlete.club_name})` : ''}
                            </span>
                          </div>
                        </td>
                        <td className="p-0 h-[52px]">{renderAttempt(athlete.snatch_1_weight, athlete.snatch_1_result, isDq)}</td>
                        <td className="p-0 h-[52px]">{renderAttempt(athlete.snatch_2_weight, athlete.snatch_2_result, isDq)}</td>
                        <td className="p-0 h-[52px]">{renderAttempt(athlete.snatch_3_weight, athlete.snatch_3_result, isDq)}</td>
                        <td className="text-center font-bold">{athlete.best_snatch || '-'}</td>
                        <td className="p-0 h-[52px]">{renderAttempt(athlete.clean_jerk_1_weight, athlete.clean_jerk_1_result, isDq)}</td>
                        <td className="p-0 h-[52px]">{renderAttempt(athlete.clean_jerk_2_weight, athlete.clean_jerk_2_result, isDq)}</td>
                        <td className="p-0 h-[52px]">{renderAttempt(athlete.clean_jerk_3_weight, athlete.clean_jerk_3_result, isDq)}</td>
                        <td className="text-center font-bold">{athlete.best_clean_jerk || '-'}</td>
                        <td className="text-center font-black text-lg">{athlete.total || '-'}</td>
                        <td className="text-center font-black text-lg">{rankValue || '-'}</td>
                      </tr>
                    );
                  })}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-5" ref={containerRef}>
      <div
        className={`rounded-2xl shadow-2xl overflow-hidden bg-white ${isFullscreen ? 'fixed inset-0 z-[60] h-[100dvh] w-screen flex flex-col rounded-none' : ''}`}
      >
        {/* Header — same teal gradient + centered title treatment as WL-System's Scoreboard screen */}
        <div
          className="px-4 sm:px-6 py-4 flex items-center justify-between gap-3 flex-wrap shrink-0"
          style={{ background: 'linear-gradient(to bottom, #0c3b47, #082933)' }}
        >
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-bold tracking-[0.15em] uppercase truncate" style={{ color: '#9fd8e3' }}>
              Lifting Social — Live
            </p>
            <h2 className="text-lg sm:text-2xl font-black uppercase tracking-wide truncate" style={{ color: '#ffffff' }}>
              Scoreboard — {boardLabel}
            </h2>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="relative inline-flex items-center">
              <select
                aria-label="Select session view"
                title="Select session view"
                className="appearance-none bg-white/10 border border-white/20 rounded-md pl-3 pr-8 py-1.5 text-xs sm:text-sm font-semibold text-white cursor-pointer"
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
              >
                <option value="live" className="text-[#0c3b47]">Live Session</option>
                <option value="all" className="text-[#0c3b47]">All Sessions</option>
                {sessionButtons.map((session) => (
                  <option key={session.value} value={session.value} className="text-[#0c3b47]">
                    {session.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen (better on mobile)'}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-md px-2.5 py-1.5 text-xs sm:text-sm font-semibold text-white transition-colors"
            >
              {isFullscreen ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 9H4.5M9 9V4.5M9 9L3.75 3.75M15 9h4.5M15 9V4.5M15 9l5.25-5.25M9 15H4.5M9 15v4.5M9 15l-5.25 5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" /></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 3.5H4.5V7M16 3.5h3.5V7M8 20.5H4.5V17M16 20.5h3.5V17" /></svg>
              )}
              <span className="hidden sm:inline">{isFullscreen ? 'Exit' : 'Full Screen'}</span>
            </button>
          </div>
        </div>

        {liveState && liveState.current_athlete_name && (
          <div className="px-4 sm:px-6 py-4 border-b border-slate-200 flex flex-col gap-3 md:flex-row md:items-center md:justify-between" style={{ backgroundColor: '#f0fdfa' }}>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">On Platform</p>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900">{liveState.current_athlete_name}</p>
              <p className="text-sm sm:text-base text-slate-600">
                {liveState.current_lift_type === 'snatch' ? 'Snatch' : 'Clean & Jerk'} • Attempt {liveState.current_attempt_number} • {liveState.current_weight} kg
              </p>
            </div>

            <div className="flex items-center gap-3">
              {liveState.timer_running && (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-[#0c3b47]/30 flex items-center justify-center bg-white">
                  <span className="font-mono text-xl sm:text-2xl font-black text-[#0c3b47]">{liveState.timer_remaining}</span>
                </div>
              )}
              {liveState.next_athlete_name && (
                <div className="text-sm text-right">
                  <p className="uppercase tracking-[0.12em] text-slate-400 text-[10px]">Next</p>
                  <p className="font-bold text-slate-900">{liveState.next_athlete_name}</p>
                  <p className="text-slate-600">{liveState.next_weight} kg</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div
          ref={scaleViewportRef}
          className={`space-y-4 py-2 ${isFullscreen ? 'flex-1 overflow-hidden' : ''}`}
        >
          <div
            ref={scaleContentRef}
            style={
              isFullscreen
                ? { transform: `scale(${scale})`, transformOrigin: 'top left', width: scale < 1 ? `${100 / scale}%` : '100%' }
                : undefined
            }
            className="space-y-4"
          >
            {visibleSessions.visibleInProgress.map(session => renderSessionTable(session, true))}

            {visibleSessions.visibleScheduled.length > 0 && (
              <div>
                <h3 className="px-4 sm:px-6 py-2 text-sm font-bold uppercase tracking-wide text-slate-500">Upcoming Sessions</h3>
                {visibleSessions.visibleScheduled.map(session => renderSessionTable(session, false))}
              </div>
            )}

            {visibleSessions.visibleCompleted.length > 0 && (
              <div>
                <h3 className="px-4 sm:px-6 py-2 text-sm font-bold uppercase tracking-wide text-slate-500">Completed Sessions</h3>
                {visibleSessions.visibleCompleted.map(session => renderSessionTable(session, false))}
              </div>
            )}

            {visibleSessions.visibleInProgress.length === 0 && visibleSessions.visibleScheduled.length === 0 && visibleSessions.visibleCompleted.length === 0 && (
               <div className="px-4 py-8 text-center text-sm text-slate-400">
                  No sessions found for this competition yet.
                </div>
            )}
          </div>
        </div>

        <div className="px-4 sm:px-6 py-3 text-xs sm:text-sm bg-slate-50 border-t border-slate-200 text-slate-600 flex flex-wrap gap-4">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: '#fde047' }} /> Declared/pending</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: '#4ade80' }} /> Good lift</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: '#ef4444' }} /> No lift</span>
        </div>
      </div>

      {showControls && (
        <p className="text-xs text-zinc-500">
          Debug mode active.
        </p>
      )}
    </div>
  );
}
