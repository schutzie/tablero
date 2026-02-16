// src/hooks/useFirestore.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  QueryConstraint,
  DocumentData,
  FirestoreError,
  Timestamp,
  serverTimestamp,
  writeBatch,
  increment,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from '@/config/firebase'; // You'll need to set up Firebase config
import { z } from 'zod';
import {
  User, Player, Team, Game, GameEvent, PlayerStats, League, Notification,
  UserSchema, PlayerSchema, TeamSchema, GameSchema, GameEventSchema,
  PlayerStatsSchema, LeagueSchema, NotificationSchema,
  COLLECTIONS
} from '@/config/schema';

// ============================================
// TYPE DEFINITIONS
// ============================================

type UseFirestoreReturn<T> = {
  data: T | null;
  loading: boolean;
  error: FirestoreError | null;
  refetch: () => Promise<void>;
};

type UseFirestoreListReturn<T> = {
  data: T[];
  loading: boolean;
  error: FirestoreError | null;
  refetch: () => Promise<void>;
  hasMore: boolean;
  loadMore: () => Promise<void>;
};

type MutationReturn<T> = {
  mutate: (data: Partial<T>) => Promise<void>;
  loading: boolean;
  error: FirestoreError | null;
};

// ============================================
// GENERIC FIRESTORE HOOKS
// ============================================

/**
 * Generic hook for fetching a single document with Zod validation
 * Provides real-time updates and automatic revalidation
 */
export function useFirestoreDoc<T>(
  collectionName: string,
  docId: string | null,
  schema: z.ZodSchema<T>,
  realtime = true
): UseFirestoreReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  const fetchDoc = useCallback(async () => {
    if (!docId) {
      setData(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      if (realtime) {
        // Set up real-time listener
        const docRef = doc(db, collectionName, docId);
        const unsubscribe = onSnapshot(
          docRef,
          (snapshot) => {
            if (snapshot.exists()) {
              const rawData = snapshot.data();
              const validated = schema.parse({ ...rawData, id: snapshot.id });
              setData(validated);
            } else {
              setData(null);
            }
            setLoading(false);
          },
          (err) => {
            console.error(`Error fetching ${collectionName}/${docId}:`, err);
            setError(err as FirestoreError);
            setLoading(false);
          }
        );
        
        return () => unsubscribe();
      } else {
        // One-time fetch
        const docRef = doc(db, collectionName, docId);
        const snapshot = await getDoc(docRef);
        
        if (snapshot.exists()) {
          const rawData = snapshot.data();
          const validated = schema.parse({ ...rawData, id: snapshot.id });
          setData(validated);
        } else {
          setData(null);
        }
        setLoading(false);
      }
    } catch (err) {
      console.error(`Error in useFirestoreDoc for ${collectionName}:`, err);
      setError(err as FirestoreError);
      setLoading(false);
    }
  }, [collectionName, docId, schema, realtime]);

  useEffect(() => {
    const cleanup = fetchDoc();
    return () => {
      if (cleanup && typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [fetchDoc]);

  return { data, loading, error, refetch: fetchDoc };
}

/**
 * Generic hook for fetching a list of documents with pagination
 */
export function useFirestoreList<T>(
  collectionName: string,
  schema: z.ZodSchema<T>,
  constraints: QueryConstraint[] = [],
  pageSize = 20,
  realtime = false
): UseFirestoreListReturn<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<DocumentData | null>(null);

  const fetchDocs = useCallback(async (loadingMore = false) => {
    try {
      if (!loadingMore) {
        setLoading(true);
        setError(null);
      }

      const baseQuery = query(
        collection(db, collectionName),
        ...constraints,
        limit(pageSize)
      );

      if (realtime && !loadingMore) {
        // Real-time updates (only for initial load)
        const unsubscribe = onSnapshot(
          baseQuery,
          (snapshot) => {
            const docs = snapshot.docs.map(doc => {
              const rawData = doc.data();
              return schema.parse({ ...rawData, id: doc.id });
            });
            setData(docs);
            setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
            setHasMore(snapshot.docs.length === pageSize);
            setLoading(false);
          },
          (err) => {
            console.error(`Error fetching ${collectionName} list:`, err);
            setError(err as FirestoreError);
            setLoading(false);
          }
        );
        
        return () => unsubscribe();
      } else {
        // One-time fetch
        const snapshot = await getDocs(baseQuery);
        const docs = snapshot.docs.map(doc => {
          const rawData = doc.data();
          return schema.parse({ ...rawData, id: doc.id });
        });
        
        if (loadingMore) {
          setData(prev => [...prev, ...docs]);
        } else {
          setData(docs);
        }
        
        setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
        setHasMore(snapshot.docs.length === pageSize);
        setLoading(false);
      }
    } catch (err) {
      console.error(`Error in useFirestoreList for ${collectionName}:`, err);
      setError(err as FirestoreError);
      setLoading(false);
    }
  }, [collectionName, schema, constraints, pageSize, realtime]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading || !lastDoc) return;
    await fetchDocs(true);
  }, [hasMore, loading, lastDoc, fetchDocs]);

  useEffect(() => {
    const cleanup = fetchDocs();
    return () => {
      if (cleanup && typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [fetchDocs]);

  return { data, loading, error, refetch: () => fetchDocs(), hasMore, loadMore };
}

// ============================================
// USER HOOKS
// ============================================

export function useUser(userId: string | null) {
  return useFirestoreDoc(COLLECTIONS.USERS, userId, UserSchema);
}

export function useCurrentUser(currentUserId: string) {
  const { data: user, loading, error } = useUser(currentUserId);
  
  const updatePreferences = useCallback(async (preferences: Partial<User['preferences']>) => {
    if (!currentUserId) return;
    
    const docRef = doc(db, COLLECTIONS.USERS, currentUserId);
    await updateDoc(docRef, {
      [`preferences`]: preferences,
      updatedAt: serverTimestamp()
    });
  }, [currentUserId]);

  const followPlayer = useCallback(async (playerId: string) => {
    if (!currentUserId) return;
    
    const docRef = doc(db, COLLECTIONS.USERS, currentUserId);
    await updateDoc(docRef, {
      followingPlayers: arrayUnion(playerId),
      updatedAt: serverTimestamp()
    });
  }, [currentUserId]);

  const unfollowPlayer = useCallback(async (playerId: string) => {
    if (!currentUserId) return;
    
    const docRef = doc(db, COLLECTIONS.USERS, currentUserId);
    await updateDoc(docRef, {
      followingPlayers: arrayRemove(playerId),
      updatedAt: serverTimestamp()
    });
  }, [currentUserId]);

  return {
    user,
    loading,
    error,
    updatePreferences,
    followPlayer,
    unfollowPlayer
  };
}

// ============================================
// PLAYER HOOKS
// ============================================

export function usePlayer(playerId: string | null) {
  return useFirestoreDoc(COLLECTIONS.PLAYERS, playerId, PlayerSchema);
}

export function usePlayersByTeam(teamId: string | null) {
  const constraints = useMemo(() => {
    if (!teamId) return [];
    return [
      where('currentTeams', 'array-contains', { teamId }),
      orderBy('jerseyNumber', 'asc')
    ];
  }, [teamId]);

  return useFirestoreList(
    COLLECTIONS.PLAYERS,
    PlayerSchema,
    constraints
  );
}

export function usePlayerStats(gameId: string, playerId: string) {
  const path = `${COLLECTIONS.GAMES}/${gameId}/${COLLECTIONS.PLAYER_STATS}`;
  return useFirestoreDoc(path, playerId, PlayerStatsSchema);
}

// ============================================
// TEAM HOOKS
// ============================================

export function useTeam(teamId: string | null) {
  return useFirestoreDoc(COLLECTIONS.TEAMS, teamId, TeamSchema);
}

export function useTeamsByLeague(leagueId: string | null) {
  const constraints = useMemo(() => {
    if (!leagueId) return [];
    return [
      where('league', '==', leagueId),
      orderBy('currentSeason.winPercentage', 'desc')
    ];
  }, [leagueId]);

  return useFirestoreList(
    COLLECTIONS.TEAMS,
    TeamSchema,
    constraints
  );
}

// ============================================
// GAME HOOKS
// ============================================

export function useGame(gameId: string | null) {
  return useFirestoreDoc(COLLECTIONS.GAMES, gameId, GameSchema, true); // Always real-time for games
}

export function useLiveGames() {
  const constraints = useMemo(() => [
    where('status', '==', 'live'),
    orderBy('scheduledAt', 'desc')
  ], []);

  return useFirestoreList(
    COLLECTIONS.GAMES,
    GameSchema,
    constraints,
    20,
    true // Real-time updates for live games
  );
}

export function useUpcomingGames(teamId?: string, limit = 5) {
  const constraints = useMemo(() => {
    const baseConstraints = [
      where('status', '==', 'scheduled'),
      where('scheduledAt', '>=', Timestamp.now()),
      orderBy('scheduledAt', 'asc')
    ];

    if (teamId) {
      // This requires a composite index
      return [
        where('status', '==', 'scheduled'),
        where('homeTeam.teamId', '==', teamId),
        orderBy('scheduledAt', 'asc')
      ];
    }

    return baseConstraints;
  }, [teamId]);

  return useFirestoreList(
    COLLECTIONS.GAMES,
    GameSchema,
    constraints,
    limit
  );
}

export function useGameEvents(gameId: string | null) {
  const constraints = useMemo(() => [
    orderBy('timestamp', 'desc')
  ], []);

  if (!gameId) {
    return { data: [], loading: false, error: null, refetch: async () => {}, hasMore: false, loadMore: async () => {} };
  }

  const path = `${COLLECTIONS.GAMES}/${gameId}/${COLLECTIONS.GAME_EVENTS}`;
  return useFirestoreList(
    path,
    GameEventSchema,
    constraints,
    50,
    true // Real-time for live play-by-play
  );
}

// ============================================
// GAME MANAGEMENT HOOKS
// ============================================

export function useGameManagement(gameId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<FirestoreError | null>(null);

  const startGame = useCallback(async () => {
    try {
      setLoading(true);
      const gameRef = doc(db, COLLECTIONS.GAMES, gameId);
      await updateDoc(gameRef, {
        status: 'live',
        currentPeriod: 1,
        currentTime: '12:00',
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      setError(err as FirestoreError);
    } finally {
      setLoading(false);
    }
  }, [gameId]);

  const endPeriod = useCallback(async (period: number) => {
    try {
      setLoading(true);
      const gameRef = doc(db, COLLECTIONS.GAMES, gameId);
      const isHalftime = period === 2;
      
      await updateDoc(gameRef, {
        currentPeriod: isHalftime ? 2 : period + 1,
        isHalftime,
        currentTime: '12:00',
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      setError(err as FirestoreError);
    } finally {
      setLoading(false);
    }
  }, [gameId]);

  const recordEvent = useCallback(async (event: Omit<GameEvent, 'eventId' | 'timestamp'>) => {
    try {
      setLoading(true);
      const batch = writeBatch(db);
      
      // Add event
      const eventRef = doc(collection(db, COLLECTIONS.GAMES, gameId, COLLECTIONS.GAME_EVENTS));
      batch.set(eventRef, {
        ...event,
        eventId: eventRef.id,
        timestamp: serverTimestamp()
      });

      // Update game score if it's a scoring event
      if (event.eventType === 'field_goal' || event.eventType === 'three_pointer' || event.eventType === 'free_throw') {
        const gameRef = doc(db, COLLECTIONS.GAMES, gameId);
        const scoreField = event.teamId === 'home' ? 'score.home' : 'score.away';
        const points = event.details?.points || 0;
        
        batch.update(gameRef, {
          [scoreField]: increment(points),
          updatedAt: serverTimestamp()
        });
      }

      await batch.commit();
    } catch (err) {
      setError(err as FirestoreError);
    } finally {
      setLoading(false);
    }
  }, [gameId]);

  const updateScore = useCallback(async (homeScore: number, awayScore: number) => {
    try {
      setLoading(true);
      const gameRef = doc(db, COLLECTIONS.GAMES, gameId);
      await updateDoc(gameRef, {
        'score.home': homeScore,
        'score.away': awayScore,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      setError(err as FirestoreError);
    } finally {
      setLoading(false);
    }
  }, [gameId]);

  const finalizeGame = useCallback(async () => {
    try {
      setLoading(true);
      const gameRef = doc(db, COLLECTIONS.GAMES, gameId);
      await updateDoc(gameRef, {
        status: 'final',
        completedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      setError(err as FirestoreError);
    } finally {
      setLoading(false);
    }
  }, [gameId]);

  return {
    startGame,
    endPeriod,
    recordEvent,
    updateScore,
    finalizeGame,
    loading,
    error
  };
}

// ============================================
// LEAGUE HOOKS
// ============================================

export function useLeague(leagueId: string | null) {
  return useFirestoreDoc(COLLECTIONS.LEAGUES, leagueId, LeagueSchema);
}

export function useLeagueStandings(leagueId: string) {
  const { data: league, loading, error } = useLeague(leagueId);
  
  const standings = useMemo(() => {
    if (!league) return [];
    return league.standings.sort((a, b) => b.winPercentage - a.winPercentage);
  }, [league]);

  return { standings, loading, error };
}

// ============================================
// NOTIFICATION HOOKS
// ============================================

export function useNotifications(userId: string) {
  const constraints = useMemo(() => [
    where('userId', '==', userId),
    where('status', '==', 'unread'),
    orderBy('sentAt', 'desc')
  ], [userId]);

  const { data, loading, error, refetch } = useFirestoreList(
    COLLECTIONS.NOTIFICATIONS,
    NotificationSchema,
    constraints,
    20,
    true
  );

  const markAsRead = useCallback(async (notificationId: string) => {
    const notifRef = doc(db, COLLECTIONS.NOTIFICATIONS, notificationId);
    await updateDoc(notifRef, {
      status: 'read',
      readAt: serverTimestamp()
    });
  }, []);

  const markAllAsRead = useCallback(async () => {
    const batch = writeBatch(db);
    data.forEach(notification => {
      const notifRef = doc(db, COLLECTIONS.NOTIFICATIONS, notification.notificationId);
      batch.update(notifRef, {
        status: 'read',
        readAt: serverTimestamp()
      });
    });
    await batch.commit();
  }, [data]);

  return {
    notifications: data,
    loading,
    error,
    refetch,
    markAsRead,
    markAllAsRead,
    unreadCount: data.length
  };
}

// ============================================
// STATISTICS HOOKS
// ============================================

export function usePlayerSeasonStats(playerId: string, seasonId: string) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Query all games for this season where player participated
        const gamesQuery = query(
          collection(db, COLLECTIONS.GAMES),
          where('seasonId', '==', seasonId),
          where('status', '==', 'final')
        );
        
        const gamesSnapshot = await getDocs(gamesQuery);
        
        let totalStats = {
          gamesPlayed: 0,
          points: 0,
          rebounds: 0,
          assists: 0,
          steals: 0,
          blocks: 0,
          turnovers: 0,
          fieldGoalsMade: 0,
          fieldGoalsAttempted: 0,
          threePointersMade: 0,
          threePointersAttempted: 0,
          freeThrowsMade: 0,
          freeThrowsAttempted: 0
        };

        // For each game, get player stats
        for (const gameDoc of gamesSnapshot.docs) {
          const statsRef = doc(db, COLLECTIONS.GAMES, gameDoc.id, COLLECTIONS.PLAYER_STATS, playerId);
          const statsDoc = await getDoc(statsRef);
          
          if (statsDoc.exists()) {
            const gameStats = statsDoc.data();
            totalStats.gamesPlayed++;
            totalStats.points += gameStats.points || 0;
            totalStats.rebounds += gameStats.reboundsTotal || 0;
            totalStats.assists += gameStats.assists || 0;
            totalStats.steals += gameStats.steals || 0;
            totalStats.blocks += gameStats.blocks || 0;
            totalStats.turnovers += gameStats.turnovers || 0;
            totalStats.fieldGoalsMade += gameStats.fieldGoalsMade || 0;
            totalStats.fieldGoalsAttempted += gameStats.fieldGoalsAttempted || 0;
            totalStats.threePointersMade += gameStats.threePointersMade || 0;
            totalStats.threePointersAttempted += gameStats.threePointersAttempted || 0;
            totalStats.freeThrowsMade += gameStats.freeThrowsMade || 0;
            totalStats.freeThrowsAttempted += gameStats.freeThrowsAttempted || 0;
          }
        }

        // Calculate averages and percentages
        const averages = {
          ...totalStats,
          ppg: totalStats.gamesPlayed > 0 ? totalStats.points / totalStats.gamesPlayed : 0,
          rpg: totalStats.gamesPlayed > 0 ? totalStats.rebounds / totalStats.gamesPlayed : 0,
          apg: totalStats.gamesPlayed > 0 ? totalStats.assists / totalStats.gamesPlayed : 0,
          fieldGoalPercentage: totalStats.fieldGoalsAttempted > 0 
            ? totalStats.fieldGoalsMade / totalStats.fieldGoalsAttempted 
            : 0,
          threePointPercentage: totalStats.threePointersAttempted > 0
            ? totalStats.threePointersMade / totalStats.threePointersAttempted
            : 0,
          freeThrowPercentage: totalStats.freeThrowsAttempted > 0
            ? totalStats.freeThrowsMade / totalStats.freeThrowsAttempted
            : 0
        };

        setStats(averages);
      } catch (err) {
        console.error('Error fetching season stats:', err);
        setError(err as FirestoreError);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [playerId, seasonId]);

  return { stats, loading, error };
}

// ============================================
// SEARCH HOOKS
// ============================================

export function useSearch(searchTerm: string, searchType: 'players' | 'teams' | 'games') {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    if (!searchTerm || searchTerm.length < 2) {
      setResults([]);
      return;
    }

    const search = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let searchQuery;
        let schema;
        
        switch (searchType) {
          case 'players':
            // Search by name (you might need to create a composite field for full text search)
            searchQuery = query(
              collection(db, COLLECTIONS.PLAYERS),
              where('lastName', '>=', searchTerm),
              where('lastName', '<=', searchTerm + '\uf8ff'),
              limit(10)
            );
            schema = PlayerSchema;
            break;
            
          case 'teams':
            searchQuery = query(
              collection(db, COLLECTIONS.TEAMS),
              where('name', '>=', searchTerm),
              where('name', '<=', searchTerm + '\uf8ff'),
              limit(10)
            );
            schema = TeamSchema;
            break;
            
          case 'games':
            // This is more complex - might search by team names
            searchQuery = query(
              collection(db, COLLECTIONS.GAMES),
              orderBy('scheduledAt', 'desc'),
              limit(10)
            );
            schema = GameSchema;
            break;
            
          default:
            return;
        }
        
        const snapshot = await getDocs(searchQuery);
        const searchResults = snapshot.docs.map(doc => {
          const data = doc.data();
          return schema.parse({ ...data, id: doc.id });
        });
        
        setResults(searchResults);
      } catch (err) {
        console.error('Search error:', err);
        setError(err as FirestoreError);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(search, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, searchType]);

  return { results, loading, error };
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Calculate player efficiency rating (PER)
 */
export function calculatePER(stats: PlayerStats): number {
  const { 
    points, assists, rebounds, steals, blocks, 
    fieldGoalsMade, fieldGoalsAttempted,
    freeThrowsMade, freeThrowsAttempted,
    turnovers, personalFouls
  } = stats;
  
  // Simplified PER calculation
  const positives = points + rebounds + assists + steals + blocks;
  const negatives = (fieldGoalsAttempted - fieldGoalsMade) + 
                   (freeThrowsAttempted - freeThrowsMade) + 
                   turnovers + personalFouls;
  
  return Math.max(0, (positives - negatives) / parseFloat(stats.minutesPlayed.replace(':', '.')) * 15);
}

/**
 * Format game time for display
 */
export function formatGameTime(minutes: number, seconds: number): string {
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Calculate team record string
 */
export function formatRecord(wins: number, losses: number): string {
  return `${wins}-${losses}`;
}

/**
 * Get player full name
 */
export function getPlayerFullName(player: Player): string {
  return player.displayName || `${player.firstName} ${player.lastName}`;
}

/**
 * Check if game is today
 */
export function isGameToday(scheduledAt: Timestamp): boolean {
  const gameDate = scheduledAt.toDate();
  const today = new Date();
  return gameDate.toDateString() === today.toDateString();
}

/**
 * Get game status display text
 */
export function getGameStatusText(game: Game): string {
  switch (game.status) {
    case 'scheduled':
      const date = game.scheduledAt.toDate();
      if (isGameToday(game.scheduledAt)) {
        return `Today ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
      }
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
    case 'live':
      if (game.isHalftime) return 'Halftime';
      return `Q${game.currentPeriod} ${game.currentTime}`;
      
    case 'final':
      return game.isOvertime ? 'Final/OT' : 'Final';
      
    case 'postponed':
      return 'Postponed';
      
    case 'cancelled':
      return 'Cancelled';
      
    default:
      return game.status;
  }
}

/**
 * Calculate shooting percentage
 */
export function calculatePercentage(made: number, attempted: number): string {
  if (attempted === 0) return '.000';
  const percentage = (made / attempted);
  return percentage.toFixed(3).substring(1); // Remove leading 0
}

/**
 * Get team colors for styling
 */
export function getTeamColors(team: Team): { primary: string; secondary: string } {
  return {
    primary: team.colorPrimary || '#000000',
    secondary: team.colorSecondary || '#FFFFFF'
  };
}

/**
 * Sort players by position order
 */
export function sortByPosition(players: Player[]): Player[] {
  const positionOrder = ['PG', 'SG', 'SF', 'PF', 'C'];
  return players.sort((a, b) => {
    const aIndex = positionOrder.indexOf(a.position[0]);
    const bIndex = positionOrder.indexOf(b.position[0]);
    return aIndex - bIndex;
  });
}

// Export all hooks and utilities
export default {
  // Document hooks
  useFirestoreDoc,
  useFirestoreList,
  
  // Entity-specific hooks
  useUser,
  useCurrentUser,
  usePlayer,
  usePlayersByTeam,
  usePlayerStats,
  useTeam,
  useTeamsByLeague,
  useGame,
  useLiveGames,
  useUpcomingGames,
  useGameEvents,
  useGameManagement,
  useLeague,
  useLeagueStandings,
  useNotifications,
  usePlayerSeasonStats,
  useSearch,
  
  // Utility functions
  calculatePER,
  formatGameTime,
  formatRecord,
  getPlayerFullName,
  isGameToday,
  getGameStatusText,
  calculatePercentage,
  getTeamColors,
  sortByPosition
};