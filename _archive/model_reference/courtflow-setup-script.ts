import { 
  initializeApp, 
  cert, 
  ServiceAccount 
} from 'firebase-admin/app';
import { 
  getFirestore, 
  Timestamp,
  FieldValue 
} from 'firebase-admin/firestore';
import { faker } from '@faker-js/faker';

// ============================================
// FIREBASE INITIALIZATION
// ============================================

// Initialize Firebase Admin SDK
// For production, use service account credentials
const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID!,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
  privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
};

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Generate a random element from an array
 */
function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generate multiple random elements from an array
 */
function randomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, array.length));
}

/**
 * Generate random basketball stats with realistic distributions
 */
function generatePlayerStats(gamesPlayed: number) {
  const avgPoints = faker.number.float({ min: 5, max: 30, precision: 0.1 });
  const avgRebounds = faker.number.float({ min: 2, max: 12, precision: 0.1 });
  const avgAssists = faker.number.float({ min: 1, max: 10, precision: 0.1 });
  
  return {
    gamesPlayed,
    totalPoints: Math.round(avgPoints * gamesPlayed),
    totalRebounds: Math.round(avgRebounds * gamesPlayed),
    totalAssists: Math.round(avgAssists * gamesPlayed),
    avgPointsPerGame: avgPoints,
    avgReboundsPerGame: avgRebounds,
    avgAssistsPerGame: avgAssists,
    fieldGoalPercentage: faker.number.float({ min: 0.35, max: 0.55, precision: 0.001 }),
    threePointPercentage: faker.number.float({ min: 0.25, max: 0.45, precision: 0.001 }),
    freeThrowPercentage: faker.number.float({ min: 0.65, max: 0.95, precision: 0.001 })
  };
}

/**
 * Generate a game schedule between two teams
 */
function generateGameSchedule(homeTeamId: string, awayTeamId: string, venueId: string) {
  const scheduledAt = faker.date.future({ years: 0.5 });
  const isPlayed = scheduledAt < new Date();
  
  return {
    gameType: randomElement(['regular', 'playoff', 'exhibition']),
    homeTeamId,
    awayTeamId,
    venueId,
    scheduledAt: Timestamp.fromDate(scheduledAt),
    status: isPlayed ? 'final' : 'scheduled',
    score: isPlayed ? {
      home: faker.number.int({ min: 80, max: 130 }),
      away: faker.number.int({ min: 80, max: 130 })
    } : null
  };
}

// ============================================
// SAMPLE DATA GENERATION
// ============================================

async function createSampleData() {
  console.log('🚀 Starting CourtFlow database setup...\n');
  
  const batch = db.batch();
  
  // Store IDs for relationships
  const userIds: string[] = [];
  const playerIds: string[] = [];
  const teamIds: string[] = [];
  const venueIds: string[] = [];
  const leagueIds: string[] = [];
  const gameIds: string[] = [];
  
  // ============================================
  // 1. CREATE VENUES (5 venues)
  // ============================================
  console.log('📍 Creating venues...');
  
  const venues = [
    {
      name: 'Madison Square Garden',
      city: 'New York',
      state: 'NY',
      capacity: 19812
    },
    {
      name: 'Staples Center',
      city: 'Los Angeles',
      state: 'CA',
      capacity: 18997
    },
    {
      name: 'United Center',
      city: 'Chicago',
      state: 'IL',
      capacity: 20917
    },
    {
      name: 'Chase Center',
      city: 'San Francisco',
      state: 'CA',
      capacity: 18064
    },
    {
      name: 'American Airlines Arena',
      city: 'Miami',
      state: 'FL',
      capacity: 19600
    }
  ];
  
  venues.forEach(venueData => {
    const venueRef = db.collection('venues').doc();
    venueIds.push(venueRef.id);
    
    batch.set(venueRef, {
      venueId: venueRef.id,
      name: venueData.name,
      address: faker.location.streetAddress(),
      city: venueData.city,
      state: venueData.state,
      zipCode: faker.location.zipCode(),
      country: 'USA',
      coordinates: {
        latitude: parseFloat(faker.location.latitude()),
        longitude: parseFloat(faker.location.longitude())
      },
      capacity: venueData.capacity,
      yearOpened: faker.number.int({ min: 1960, max: 2020 }),
      surface: 'hardwood',
      amenities: ['parking', 'concessions', 'luxury_boxes', 'wheelchair_accessible'],
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });
  });
  
  // ============================================
  // 2. CREATE LEAGUES (2 leagues)
  // ============================================
  console.log('🏆 Creating leagues...');
  
  const leagues = [
    {
      name: 'Professional Basketball Association',
      abbreviation: 'PBA',
      type: 'professional',
      level: 'professional'
    },
    {
      name: 'City Recreation League',
      abbreviation: 'CRL',
      type: 'recreational',
      level: 'adult'
    }
  ];
  
  leagues.forEach(leagueData => {
    const leagueRef = db.collection('leagues').doc();
    leagueIds.push(leagueRef.id);
    
    batch.set(leagueRef, {
      leagueId: leagueRef.id,
      name: leagueData.name,
      abbreviation: leagueData.abbreviation,
      type: leagueData.type,
      level: leagueData.level,
      sport: 'basketball',
      currentSeasonId: `season2024_${leagueRef.id}`,
      seasonStartDate: Timestamp.fromDate(new Date('2024-10-01')),
      seasonEndDate: Timestamp.fromDate(new Date('2025-06-30')),
      numberOfTeams: 0, // Will update after creating teams
      gameSettings: {
        quarterLength: 12,
        shotClock: 24,
        overtimeLength: 5,
        timeoutsPerHalf: 3,
        foulsToBonus: 5,
        foulsToDisqualify: 6
      },
      commissioner: faker.person.fullName(),
      commissionerEmail: faker.internet.email(),
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      isActive: true
    });
    
    // Create season subcollection for each league
    const seasonRef = db.collection('leagues').doc(leagueRef.id)
                        .collection('seasons').doc(`season2024_${leagueRef.id}`);
    
    batch.set(seasonRef, {
      seasonId: `season2024_${leagueRef.id}`,
      name: '2024-2025 Season',
      year: 2024,
      startDate: Timestamp.fromDate(new Date('2024-10-01')),
      endDate: Timestamp.fromDate(new Date('2025-06-30')),
      playoffStartDate: Timestamp.fromDate(new Date('2025-04-15')),
      status: 'active',
      currentWeek: 12,
      participatingTeams: [], // Will update after creating teams
      championTeamId: null,
      runnerUpTeamId: null
    });
  });
  
  // ============================================
  // 3. CREATE TEAMS (8 teams)
  // ============================================
  console.log('🏀 Creating teams...');
  
  const teamNames = [
    { name: 'Thunder Hawks', city: 'Oklahoma City', abbreviation: 'OKH' },
    { name: 'Desert Suns', city: 'Phoenix', abbreviation: 'PHX' },
    { name: 'Bay Warriors', city: 'San Francisco', abbreviation: 'SFW' },
    { name: 'Lake Lakers', city: 'Los Angeles', abbreviation: 'LAL' },
    { name: 'River Blazers', city: 'Portland', abbreviation: 'POR' },
    { name: 'Mountain Nuggets', city: 'Denver', abbreviation: 'DEN' },
    { name: 'Jazz Notes', city: 'Salt Lake City', abbreviation: 'UTA' },
    { name: 'Lone Stars', city: 'San Antonio', abbreviation: 'SAS' }
  ];
  
  teamNames.forEach((teamData, index) => {
    const teamRef = db.collection('teams').doc();
    teamIds.push(teamRef.id);
    
    const leagueId = index < 4 ? leagueIds[0] : leagueIds[1]; // Split teams between leagues
    const homeVenueId = randomElement(venueIds);
    
    batch.set(teamRef, {
      teamId: teamRef.id,
      name: teamData.name,
      abbreviation: teamData.abbreviation,
      logoURL: `https://placeholder.com/teams/${teamData.abbreviation.toLowerCase()}.png`,
      colorPrimary: faker.color.rgb(),
      colorSecondary: faker.color.rgb(),
      league: leagueId,
      city: teamData.city,
      state: faker.location.state({ abbreviated: true }),
      country: 'USA',
      homeVenue: homeVenueId,
      foundedYear: faker.number.int({ min: 1946, max: 2020 }),
      managerName: faker.person.fullName(),
      managerEmail: faker.internet.email(),
      managerPhone: faker.phone.number(),
      roster: [], // Will populate after creating players
      coaches: [
        {
          userId: faker.string.uuid(),
          name: faker.person.fullName(),
          role: 'head_coach',
          email: faker.internet.email()
        }
      ],
      currentSeason: {
        seasonId: `season2024_${leagueId}`,
        wins: faker.number.int({ min: 10, max: 50 }),
        losses: faker.number.int({ min: 10, max: 50 }),
        winPercentage: 0,
        homeRecord: `${faker.number.int({ min: 5, max: 25 })}-${faker.number.int({ min: 5, max: 25 })}`,
        awayRecord: `${faker.number.int({ min: 5, max: 25 })}-${faker.number.int({ min: 5, max: 25 })}`,
        streakType: randomElement(['W', 'L']),
        streakCount: faker.number.int({ min: 1, max: 5 })
      },
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      isActive: true,
      visibility: 'public'
    });
  });
  
  // ============================================
  // 4. CREATE USERS (20 users)
  // ============================================
  console.log('👤 Creating users...');
  
  for (let i = 0; i < 20; i++) {
    const userRef = db.collection('users').doc();
    userIds.push(userRef.id);
    
    const roles = randomElements(['player', 'coach', 'fan'], faker.number.int({ min: 1, max: 2 }));
    
    batch.set(userRef, {
      uid: userRef.id,
      email: faker.internet.email(),
      displayName: faker.person.fullName(),
      photoURL: faker.image.avatar(),
      phoneNumber: faker.phone.number(),
      createdAt: FieldValue.serverTimestamp(),
      lastLoginAt: FieldValue.serverTimestamp(),
      isActive: true,
      accountType: randomElement(['free', 'premium']),
      linkedPlayerId: null, // Will link some users to players
      preferences: {
        notifications: {
          gameReminders: faker.datatype.boolean(),
          teamUpdates: faker.datatype.boolean(),
          statsAlerts: faker.datatype.boolean(),
          pushEnabled: faker.datatype.boolean(),
          emailDigest: randomElement(['daily', 'weekly', 'monthly', 'never'])
        },
        display: {
          theme: randomElement(['light', 'dark']),
          language: 'en',
          timezone: faker.location.timeZone(),
          measurementUnit: randomElement(['imperial', 'metric'])
        },
        privacy: {
          profileVisibility: randomElement(['private', 'team', 'public']),
          showStats: faker.datatype.boolean(),
          allowTeamInvites: faker.datatype.boolean()
        }
      },
      followingPlayers: [],
      followingTeams: randomElements(teamIds, faker.number.int({ min: 1, max: 3 })),
      favoriteGames: [],
      roles: roles,
      teamRoles: {}
    });
  }
  
  // ============================================
  // 5. CREATE PLAYERS (50 players)
  // ============================================
  console.log('🏃 Creating players...');
  
  const positions = ['PG', 'SG', 'SF', 'PF', 'C'];
  const playersByTeam: { [teamId: string]: any[] } = {};
  
  for (let i = 0; i < 50; i++) {
    const playerRef = db.collection('players').doc();
    playerIds.push(playerRef.id);
    
    const teamId = teamIds[i % teamIds.length]; // Distribute players across teams
    const firstName = faker.person.firstName('male');
    const lastName = faker.person.lastName();
    const position = randomElements(positions, faker.number.int({ min: 1, max: 2 }));
    const gamesPlayed = faker.number.int({ min: 20, max: 82 });
    
    // Link some players to users (first 10 players)
    const linkedUserId = i < 10 ? userIds[i] : null;
    
    const playerData = {
      playerId: playerRef.id,
      firstName,
      lastName,
      displayName: faker.person.middleName() ? `${firstName[0]}. ${lastName}` : `${firstName} ${lastName}`,
      jerseyNumber: faker.number.int({ min: 0, max: 99 }),
      position,
      height: faker.number.int({ min: 175, max: 220 }), // cm
      weight: faker.number.int({ min: 70, max: 130 }), // kg
      dateOfBirth: Timestamp.fromDate(faker.date.birthdate({ min: 18, max: 40, mode: 'age' })),
      photoURL: faker.image.avatar(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      country: 'USA',
      yearsOfExperience: faker.number.int({ min: 0, max: 15 }),
      skillLevel: randomElement(['beginner', 'intermediate', 'advanced', 'professional']),
      dominantHand: randomElement(['left', 'right']),
      currentTeams: [{
        teamId,
        role: i % 5 === 0 ? 'starter' : randomElement(['bench', 'reserve']),
        joinedAt: FieldValue.serverTimestamp()
      }],
      careerStats: generatePlayerStats(gamesPlayed),
      currentSeasonStats: {
        seasonId: 'season2024',
        ...generatePlayerStats(Math.min(gamesPlayed, 30))
      },
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      isActive: true,
      linkedUserId
    };
    
    batch.set(playerRef, playerData);
    
    // Store player info for team roster
    if (!playersByTeam[teamId]) {
      playersByTeam[teamId] = [];
    }
    playersByTeam[teamId].push({
      playerId: playerRef.id,
      firstName,
      lastName,
      jerseyNumber: playerData.jerseyNumber,
      position,
      role: playerData.currentTeams[0].role,
      joinedAt: playerData.currentTeams[0].joinedAt
    });
    
    // Update linked user with playerId
    if (linkedUserId) {
      const userRef = db.collection('users').doc(linkedUserId);
      batch.update(userRef, { linkedPlayerId: playerRef.id });
    }
  }
  
  // Update team rosters
  Object.entries(playersByTeam).forEach(([teamId, roster]) => {
    const teamRef = db.collection('teams').doc(teamId);
    batch.update(teamRef, { roster });
  });
  
  // ============================================
  // 6. CREATE GAMES (20 games)
  // ============================================
  console.log('🎮 Creating games...');
  
  for (let i = 0; i < 20; i++) {
    const gameRef = db.collection('games').doc();
    gameIds.push(gameRef.id);
    
    // Select two different teams
    const homeTeamId = teamIds[i % teamIds.length];
    const awayTeamId = teamIds[(i + 1) % teamIds.length];
    const venueId = randomElement(venueIds);
    
    // Determine if game has been played
    const scheduledDate = faker.date.between({ 
      from: new Date('2024-10-01'), 
      to: new Date('2025-06-30') 
    });
    const isPlayed = scheduledDate < new Date();
    const isFuture = scheduledDate > new Date();
    
    const gameData: any = {
      gameId: gameRef.id,
      gameType: randomElement(['regular', 'playoff', 'exhibition']),
      homeTeam: {
        teamId: homeTeamId,
        name: teamNames[teamIds.indexOf(homeTeamId)].name,
        logoURL: `https://placeholder.com/teams/${teamNames[teamIds.indexOf(homeTeamId)].abbreviation.toLowerCase()}.png`,
        score: 0,
        timeouts: 7,
        fouls: 0
      },
      awayTeam: {
        teamId: awayTeamId,
        name: teamNames[teamIds.indexOf(awayTeamId)].name,
        logoURL: `https://placeholder.com/teams/${teamNames[teamIds.indexOf(awayTeamId)].abbreviation.toLowerCase()}.png`,
        score: 0,
        timeouts: 7,
        fouls: 0
      },
      scheduledAt: Timestamp.fromDate(scheduledDate),
      venue: venues[venueIds.indexOf(venueId)].name,
      venueAddress: faker.location.streetAddress(),
      status: isFuture ? 'scheduled' : (isPlayed ? 'final' : 'live'),
      currentPeriod: isPlayed ? 4 : (isFuture ? 0 : faker.number.int({ min: 1, max: 4 })),
      currentTime: isPlayed ? '0:00' : (isFuture ? '12:00' : `${faker.number.int({ min: 0, max: 11 })}:${faker.number.int({ min: 10, max: 59 })}`),
      isHalftime: false,
      isOvertime: false,
      officials: [
        {
          name: faker.person.fullName(),
          role: 'crew_chief'
        },
        {
          name: faker.person.fullName(),
          role: 'referee'
        }
      ],
      seasonId: 'season2024',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      attendance: isPlayed ? faker.number.int({ min: 10000, max: 20000 }) : null,
      broadcastInfo: {
        tv: randomElements(['ESPN', 'TNT', 'NBA TV', 'ABC'], faker.number.int({ min: 1, max: 2 })),
        radio: [`${faker.number.int({ min: 88, max: 108 })}.${faker.number.int({ min: 1, max: 9 })} FM`],
        streaming: ['League Pass']
      }
    };
    
    // Add scores if game is played or live
    if (isPlayed || gameData.status === 'live') {
      const homeScore = faker.number.int({ min: 80, max: 130 });
      const awayScore = faker.number.int({ min: 80, max: 130 });
      
      gameData.score = {
        home: homeScore,
        away: awayScore,
        quarterScores: {
          home: [
            faker.number.int({ min: 18, max: 35 }),
            faker.number.int({ min: 18, max: 35 }),
            faker.number.int({ min: 18, max: 35 }),
            faker.number.int({ min: 18, max: 35 })
          ],
          away: [
            faker.number.int({ min: 18, max: 35 }),
            faker.number.int({ min: 18, max: 35 }),
            faker.number.int({ min: 18, max: 35 }),
            faker.number.int({ min: 18, max: 35 })
          ]
        }
      };
      
      gameData.homeTeam.score = homeScore;
      gameData.awayTeam.score = awayScore;
      
      // Add team stats for played games
      gameData.teamStats = {
        home: {
          fieldGoalsMade: faker.number.int({ min: 30, max: 45 }),
          fieldGoalsAttempted: faker.number.int({ min: 70, max: 95 }),
          threePointersMade: faker.number.int({ min: 8, max: 18 }),
          threePointersAttempted: faker.number.int({ min: 25, max: 45 }),
          freeThrowsMade: faker.number.int({ min: 10, max: 25 }),
          freeThrowsAttempted: faker.number.int({ min: 15, max: 30 }),
          rebounds: faker.number.int({ min: 35, max: 55 }),
          assists: faker.number.int({ min: 15, max: 30 }),
          steals: faker.number.int({ min: 4, max: 12 }),
          blocks: faker.number.int({ min: 2, max: 8 }),
          turnovers: faker.number.int({ min: 8, max: 18 })
        },
        away: {
          fieldGoalsMade: faker.number.int({ min: 30, max: 45 }),
          fieldGoalsAttempted: faker.number.int({ min: 70, max: 95 }),
          threePointersMade: faker.number.int({ min: 8, max: 18 }),
          threePointersAttempted: faker.number.int({ min: 25, max: 45 }),
          freeThrowsMade: faker.number.int({ min: 10, max: 25 }),
          freeThrowsAttempted: faker.number.int({ min: 15, max: 30 }),
          rebounds: faker.number.int({ min: 35, max: 55 }),
          assists: faker.number.int({ min: 15, max: 30 }),
          steals: faker.number.int({ min: 4, max: 12 }),
          blocks: faker.number.int({ min: 2, max: 8 }),
          turnovers: faker.number.int({ min: 8, max: 18 })
        }
      };
    }
    
    // Add player lists
    gameData.homePlayers = playersByTeam[homeTeamId]?.slice(0, 12).map(p => ({
      ...p,
      starter: p.role === 'starter',
      active: true
    })) || [];
    
    gameData.awayPlayers = playersByTeam[awayTeamId]?.slice(0, 12).map(p => ({
      ...p,
      starter: p.role === 'starter',
      active: true
    })) || [];
    
    batch.set(gameRef, gameData);
    
    // Create game events for played games (sample events)
    if (isPlayed) {
      for (let j = 0; j < 10; j++) {
        const eventRef = db.collection('games').doc(gameRef.id)
                          .collection('gameEvents').doc();
        
        const eventTypes = ['field_goal', 'three_pointer', 'free_throw', 'rebound', 'assist', 'steal', 'block', 'turnover'];
        const eventType = randomElement(eventTypes);
        const teamId = randomElement([homeTeamId, awayTeamId]);
        const teamPlayers = teamId === homeTeamId ? gameData.homePlayers : gameData.awayPlayers;
        const player = randomElement(teamPlayers);
        
        batch.set(eventRef, {
          eventId: eventRef.id,
          eventType,
          timestamp: FieldValue.serverTimestamp(),
          gameTime: {
            period: faker.number.int({ min: 1, max: 4 }),
            minutes: faker.number.int({ min: 0, max: 11 }),
            seconds: faker.number.int({ min: 0, max: 59 })
          },
          playerId: player.playerId,
          playerName: `${player.firstName} ${player.lastName}`,
          teamId,
          details: {
            shotType: eventType.includes('goal') || eventType.includes('pointer') ? 
              randomElement(['layup', 'dunk', 'jump_shot', 'hook_shot']) : null,
            shotMade: eventType.includes('goal') || eventType.includes('pointer') ? 
              faker.datatype.boolean() : null,
            points: eventType === 'three_pointer' ? 3 : (eventType === 'field_goal' ? 2 : 
              (eventType === 'free_throw' ? 1 : 0))
          },
          description: `${player.firstName} ${player.lastName} ${eventType.replace('_', ' ')}`,
          isHighlight: faker.datatype.boolean({ probability: 0.1 })
        });
      }
      
      // Create player stats for played games
      [...gameData.homePlayers, ...gameData.awayPlayers].forEach(player => {
        const statsRef = db.collection('games').doc(gameRef.id)
                          .collection('playerStats').doc(player.playerId);
        
        const points = faker.number.int({ min: 0, max: 35 });
        const fgMade = Math.floor(points / 2.2);
        const fgAttempted = Math.floor(fgMade * 2.2);
        
        batch.set(statsRef, {
          playerId: player.playerId,
          playerName: `${player.firstName} ${player.lastName}`,
          teamId: gameData.homePlayers.includes(player) ? homeTeamId : awayTeamId,
          jerseyNumber: player.jerseyNumber,
          starter: player.starter,
          minutesPlayed: player.starter ? 
            `${faker.number.int({ min: 25, max: 38 })}:${faker.number.int({ min: 10, max: 59 })}` :
            `${faker.number.int({ min: 8, max: 24 })}:${faker.number.int({ min: 10, max: 59 })}`,
          points,
          fieldGoalsMade: fgMade,
          fieldGoalsAttempted: fgAttempted,
          fieldGoalPercentage: fgAttempted > 0 ? fgMade / fgAttempted : 0,
          threePointersMade: faker.number.int({ min: 0, max: 5 }),
          threePointersAttempted: faker.number.int({ min: 0, max: 10 }),
          freeThrowsMade: faker.number.int({ min: 0, max: 8 }),
          freeThrowsAttempted: faker.number.int({ min: 0, max: 10 }),
          reboundsTotal: faker.number.int({ min: 0, max: 12 }),
          reboundsOffensive: faker.number.int({ min: 0, max: 4 }),
          reboundsDefensive: faker.number.int({ min: 0, max: 8 }),
          assists: faker.number.int({ min: 0, max: 12 }),
          steals: faker.number.int({ min: 0, max: 4 }),
          blocks: faker.number.int({ min: 0, max: 3 }),
          turnovers: faker.number.int({ min: 0, max: 5 }),
          personalFouls: faker.number.int({ min: 0, max: 5 }),
          technicalFouls: 0,
          flagrantFouls: 0,
          fouledOut: false,
          plusMinus: faker.number.int({ min: -20, max: 20 })
        });
      });
    }
  }
  
  // ============================================
  // 7. CREATE NOTIFICATIONS (sample for users)
  // ============================================
  console.log('🔔 Creating notifications...');
  
  userIds.slice(0, 10).forEach(userId => {
    const notifRef = db.collection('notifications').doc();
    
    batch.set(notifRef, {
      notificationId: notifRef.id,
      userId,
      type: randomElement(['game_reminder', 'stats_update', 'team_invite', 'achievement']),
      title: 'Game Starting Soon',
      body: `Don't miss today's exciting matchup!`,
      imageURL: faker.image.url(),
      relatedEntities: {
        gameId: randomElement(gameIds),
        teamId: randomElement(teamIds),
        playerId: null
      },
      channels: ['push', 'in_app'],
      priority: randomElement(['low', 'normal', 'high']),
      status: 'unread',
      sentAt: FieldValue.serverTimestamp(),
      readAt: null,
      expiresAt: Timestamp.fromDate(faker.date.future({ years: 0.1 })),
      actionType: 'navigate',
      actionData: {
        screen: 'game_detail',
        params: {
          gameId: randomElement(gameIds)
        }
      }
    });
  });
  
  // ============================================
  // EXECUTE BATCH WRITE
  // ============================================
  console.log('\n⏳ Writing to Firestore...');
  
  try {
    await batch.commit();
    console.log('✅ Database setup completed successfully!\n');
    
    // Print summary
    console.log('📊 Summary:');
    console.log(`   - ${userIds.length} users created`);
    console.log(`   - ${playerIds.length} players created`);
    console.log(`   - ${teamIds.length} teams created`);
    console.log(`   - ${gameIds.length} games created`);
    console.log(`   - ${venueIds.length} venues created`);
    console.log(`   - ${leagueIds.length} leagues created`);
    console.log(`   - Multiple game events and player stats created`);
    console.log(`   - Sample notifications created\n`);
    
    // Create composite indexes (these need to be created in Firebase Console)
    console.log('⚠️  Important: Create these composite indexes in Firebase Console:');
    console.log('   1. games: status + scheduledAt');
    console.log('   2. games: homeTeam.teamId + status');
    console.log('   3. games: awayTeam.teamId + status');
    console.log('   4. gameEvents: gameId + timestamp');
    console.log('   5. playerStats: playerId + points');
    console.log('   6. notifications: userId + status + sentAt');
    console.log('   7. players: currentTeams.teamId + isActive\n');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }
}

// ============================================
// CLEANUP FUNCTION (Optional)
// ============================================

async function cleanupDatabase() {
  console.log('🧹 Cleaning up database...\n');
  
  const collections = [
    'users', 'players', 'teams', 'games', 
    'leagues', 'notifications', 'schedules', 
    'venues', 'media', 'practices', 'injuries'
  ];
  
  for (const collectionName of collections) {
    console.log(`   Deleting ${collectionName}...`);
    const collectionRef = db.collection(collectionName);
    const snapshot = await collectionRef.get();
    
    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
  }
  
  console.log('\n✅ Database cleaned successfully!\n');
}

// ============================================
// MAIN EXECUTION
// ============================================

async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--cleanup')) {
    await cleanupDatabase();
  } else if (args.includes('--reset')) {
    await cleanupDatabase();
    await createSampleData();
  } else {
    await createSampleData();
  }
  
  process.exit(0);
}

// Run the script
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

// ============================================
// USAGE INSTRUCTIONS
// ============================================

/*
 * HOW TO USE THIS SCRIPT:
 * 
 * 1. Install dependencies:
 *    npm install firebase-admin @faker-js/faker dotenv
 * 
 * 2. Set up environment variables (.env file):
 *    FIREBASE_PROJECT_ID=your-project-id
 *    FIREBASE_CLIENT_EMAIL=your-client-email
 *    FIREBASE_PRIVATE_KEY=your-private-key
 * 
 * 3. Run the script:
 *    - Setup fresh data: npm run setup-db
 *    - Clean database: npm run setup-db -- --cleanup
 *    - Reset (clean + setup): npm run setup-db -- --reset
 * 
 * 4. Add to package.json scripts:
 *    "scripts": {
 *      "setup-db": "ts-node setup-database.ts",
 *      "clean-db": "ts-node setup-database.ts --cleanup",
 *      "reset-db": "ts-node setup-database.ts --reset"
 *    }
 * 
 * 5. After running, create the composite indexes listed in the console output
 *    in your Firebase Console under Firestore > Indexes
 */