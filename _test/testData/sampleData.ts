import { League } from '../../_archive/model_old/league';
import { Team } from '../../_archive/model_old/team';
import { Player } from '../../_archive/model_old/player';
import { Game } from '../../model/game';
import { GameEvent } from '../../model/gameEvent';
import {
  LeagueType, Position, SkillLevel, GameType, GameStatus,
  EventType, ShotType
} from '../../model/enums';

const currentTimestamp = new Date().toISOString();
const gameTimestamp = new Date('2025-01-20T19:00:00Z').toISOString();

// ============================================
// LEAGUE DATA
// ============================================
export const sampleLeague: League = {
  leagueId: 'league-001',
  name: 'Metropolitan Basketball Association',
  abbreviation: 'MBA',
  logoURL: 'https://example.com/mba-logo.png',
  type: LeagueType.RECREATIONAL,
  sport: 'basketball',
  level: 'adult',
  currentSeasonId: 'season-2025',
  seasonStartDate: new Date('2025-01-01').toISOString(),
  seasonEndDate: new Date('2025-04-30').toISOString(),
  registrationDeadline: new Date('2024-12-15').toISOString(),
  numberOfTeams: 12,
  numberOfDivisions: 2,
  playoffFormat: 'Top 4 teams from each division',
  gamesPerTeam: 20,
  gameSettings: {
    quarterLength: 12,
    shotClock: 24,
    overtimeLength: 5,
    timeoutsPerHalf: 3,
    foulsToBonus: 5,
    foulsToDisqualify: 6
  },
  standings: [],
  commissioner: 'John Smith',
  commissionerEmail: 'commissioner@mba-league.com',
  website: 'https://mba-league.com',
  createdAt: currentTimestamp,
  updatedAt: currentTimestamp,
  isActive: true
};

// ============================================
// TEAMS DATA
// ============================================
export const thunderbirds: Team = {
  teamId: 'team-001',
  name: 'Metro Thunderbirds',
  abbreviation: 'MTB',
  logoURL: 'https://example.com/thunderbirds-logo.png',
  colorPrimary: '#FF5722',
  colorSecondary: '#FFC107',
  league: 'league-001',
  division: 'Eastern',
  conference: 'Metro',
  foundedYear: 2018,
  city: 'New York',
  state: 'NY',
  country: 'USA',
  homeVenue: 'Metro Sports Arena',
  venueCapacity: 5000,
  managerName: 'Mike Johnson',
  managerEmail: 'mike.johnson@thunderbirds.com',
  managerPhone: '555-0100',
  roster: [],
  coaches: [
    {
      userId: 'user-coach-001',
      name: 'Tom Bradley',
      role: 'head_coach',
      email: 'tom.bradley@thunderbirds.com'
    },
    {
      userId: 'user-coach-002',
      name: 'Sarah Martinez',
      role: 'assistant_coach',
      email: 'sarah.martinez@thunderbirds.com'
    }
  ],
  currentSeason: {
    seasonId: 'season-2025',
    wins: 8,
    losses: 4,
    winPercentage: 0.667,
    homeRecord: '5-1',
    awayRecord: '3-3',
    streakType: 'W',
    streakCount: 3
  },
  createdAt: currentTimestamp,
  updatedAt: currentTimestamp,
  isActive: true,
  visibility: 'public'
};

export const hawks: Team = {
  teamId: 'team-002',
  name: 'City Hawks',
  abbreviation: 'CHK',
  logoURL: 'https://example.com/hawks-logo.png',
  colorPrimary: '#2196F3',
  colorSecondary: '#FFFFFF',
  league: 'league-001',
  division: 'Eastern',
  conference: 'Metro',
  foundedYear: 2016,
  city: 'Brooklyn',
  state: 'NY',
  country: 'USA',
  homeVenue: 'Downtown Basketball Center',
  venueCapacity: 4500,
  managerName: 'David Chen',
  managerEmail: 'david.chen@cityhawks.com',
  managerPhone: '555-0200',
  roster: [],
  coaches: [
    {
      userId: 'user-coach-003',
      name: 'Robert Williams',
      role: 'head_coach',
      email: 'robert.williams@cityhawks.com'
    }
  ],
  currentSeason: {
    seasonId: 'season-2025',
    wins: 7,
    losses: 5,
    winPercentage: 0.583,
    homeRecord: '4-2',
    awayRecord: '3-3',
    streakType: 'L',
    streakCount: 1
  },
  createdAt: currentTimestamp,
  updatedAt: currentTimestamp,
  isActive: true,
  visibility: 'public'
};

// ============================================
// PLAYERS DATA - THUNDERBIRDS
// ============================================
export const thunderbirdsPlayers: Player[] = [
  {
    playerId: 'player-tb-001',
    firstName: 'Marcus',
    lastName: 'Thompson',
    displayName: 'M-Thunder',
    jerseyNumber: '23',
    position: [Position.PG],
    height: 185,
    weight: 82,
    dateOfBirth: new Date('1995-03-15').toISOString(),
    photoURL: null,
    email: 'marcus.thompson@email.com',
    city: 'New York',
    state: 'NY',
    country: 'USA',
    yearsOfExperience: 5,
    skillLevel: SkillLevel.ADVANCED,
    dominantHand: 'right',
    currentTeams: [{
      teamId: 'team-001',
      role: 'starter',
      joinedAt: new Date('2023-01-01').toISOString()
    }],
    careerStats: {
      gamesPlayed: 120,
      totalPoints: 1680,
      totalRebounds: 480,
      totalAssists: 720,
      avgPointsPerGame: 14.0,
      avgReboundsPerGame: 4.0,
      avgAssistsPerGame: 6.0,
      fieldGoalPercentage: 0.455,
      threePointPercentage: 0.385,
      freeThrowPercentage: 0.850
    },
    createdAt: currentTimestamp,
    updatedAt: currentTimestamp,
    isActive: true,
    linkedUserId: null
  },
  {
    playerId: 'player-tb-002',
    firstName: 'James',
    lastName: 'Wilson',
    jerseyNumber: '11',
    position: [Position.SG],
    height: 190,
    weight: 88,
    yearsOfExperience: 3,
    skillLevel: SkillLevel.ADVANCED,
    dominantHand: 'right',
    currentTeams: [{
      teamId: 'team-001',
      role: 'starter',
      joinedAt: new Date('2023-06-01').toISOString()
    }],
    careerStats: {
      gamesPlayed: 80,
      totalPoints: 1360,
      totalRebounds: 320,
      totalAssists: 240,
      avgPointsPerGame: 17.0,
      avgReboundsPerGame: 4.0,
      avgAssistsPerGame: 3.0,
      fieldGoalPercentage: 0.475,
      threePointPercentage: 0.410,
      freeThrowPercentage: 0.880
    },
    country: 'USA',
    createdAt: currentTimestamp,
    updatedAt: currentTimestamp,
    isActive: true
  },
  {
    playerId: 'player-tb-003',
    firstName: 'Andre',
    lastName: 'Davis',
    jerseyNumber: '33',
    position: [Position.SF],
    height: 198,
    weight: 95,
    yearsOfExperience: 4,
    skillLevel: SkillLevel.INTERMEDIATE,
    dominantHand: 'left',
    currentTeams: [{
      teamId: 'team-001',
      role: 'starter',
      joinedAt: new Date('2024-01-01').toISOString()
    }],
    careerStats: {
      gamesPlayed: 100,
      totalPoints: 1200,
      totalRebounds: 600,
      totalAssists: 300,
      avgPointsPerGame: 12.0,
      avgReboundsPerGame: 6.0,
      avgAssistsPerGame: 3.0,
      fieldGoalPercentage: 0.465,
      threePointPercentage: 0.350,
      freeThrowPercentage: 0.750
    },
    country: 'USA',
    createdAt: currentTimestamp,
    updatedAt: currentTimestamp,
    isActive: true
  },
  {
    playerId: 'player-tb-004',
    firstName: 'Kevin',
    lastName: 'Brown',
    jerseyNumber: '21',
    position: [Position.PF],
    height: 203,
    weight: 102,
    yearsOfExperience: 6,
    skillLevel: SkillLevel.ADVANCED,
    dominantHand: 'right',
    currentTeams: [{
      teamId: 'team-001',
      role: 'starter',
      joinedAt: new Date('2022-09-01').toISOString()
    }],
    careerStats: {
      gamesPlayed: 150,
      totalPoints: 2100,
      totalRebounds: 1200,
      totalAssists: 450,
      avgPointsPerGame: 14.0,
      avgReboundsPerGame: 8.0,
      avgAssistsPerGame: 3.0,
      fieldGoalPercentage: 0.520,
      threePointPercentage: 0.320,
      freeThrowPercentage: 0.700
    },
    country: 'USA',
    createdAt: currentTimestamp,
    updatedAt: currentTimestamp,
    isActive: true
  },
  {
    playerId: 'player-tb-005',
    firstName: 'Michael',
    lastName: 'Johnson',
    jerseyNumber: '50',
    position: [Position.C],
    height: 210,
    weight: 110,
    yearsOfExperience: 7,
    skillLevel: SkillLevel.ADVANCED,
    dominantHand: 'right',
    currentTeams: [{
      teamId: 'team-001',
      role: 'starter',
      joinedAt: new Date('2022-01-01').toISOString()
    }],
    careerStats: {
      gamesPlayed: 180,
      totalPoints: 1980,
      totalRebounds: 1800,
      totalAssists: 360,
      avgPointsPerGame: 11.0,
      avgReboundsPerGame: 10.0,
      avgAssistsPerGame: 2.0,
      fieldGoalPercentage: 0.580,
      threePointPercentage: 0.000,
      freeThrowPercentage: 0.650
    },
    country: 'USA',
    createdAt: currentTimestamp,
    updatedAt: currentTimestamp,
    isActive: true
  },
  {
    playerId: 'player-tb-006',
    firstName: 'Tyler',
    lastName: 'Garcia',
    jerseyNumber: '7',
    position: [Position.PG, Position.SG],
    height: 183,
    weight: 78,
    yearsOfExperience: 2,
    skillLevel: SkillLevel.INTERMEDIATE,
    dominantHand: 'right',
    currentTeams: [{
      teamId: 'team-001',
      role: 'bench',
      joinedAt: new Date('2024-03-01').toISOString()
    }],
    careerStats: {
      gamesPlayed: 40,
      totalPoints: 320,
      totalRebounds: 80,
      totalAssists: 160,
      avgPointsPerGame: 8.0,
      avgReboundsPerGame: 2.0,
      avgAssistsPerGame: 4.0,
      fieldGoalPercentage: 0.420,
      threePointPercentage: 0.360,
      freeThrowPercentage: 0.800
    },
    country: 'USA',
    createdAt: currentTimestamp,
    updatedAt: currentTimestamp,
    isActive: true
  },
  {
    playerId: 'player-tb-007',
    firstName: 'Ryan',
    lastName: 'Martinez',
    jerseyNumber: '15',
    position: [Position.SF, Position.PF],
    height: 200,
    weight: 98,
    yearsOfExperience: 3,
    skillLevel: SkillLevel.INTERMEDIATE,
    dominantHand: 'right',
    currentTeams: [{
      teamId: 'team-001',
      role: 'bench',
      joinedAt: new Date('2023-11-01').toISOString()
    }],
    careerStats: {
      gamesPlayed: 60,
      totalPoints: 420,
      totalRebounds: 300,
      totalAssists: 120,
      avgPointsPerGame: 7.0,
      avgReboundsPerGame: 5.0,
      avgAssistsPerGame: 2.0,
      fieldGoalPercentage: 0.450,
      threePointPercentage: 0.330,
      freeThrowPercentage: 0.720
    },
    country: 'USA',
    createdAt: currentTimestamp,
    updatedAt: currentTimestamp,
    isActive: true
  },
  {
    playerId: 'player-tb-008',
    firstName: 'Brandon',
    lastName: 'Lee',
    jerseyNumber: '24',
    position: [Position.SG],
    height: 188,
    weight: 85,
    yearsOfExperience: 1,
    skillLevel: SkillLevel.BEGINNER,
    dominantHand: 'right',
    currentTeams: [{
      teamId: 'team-001',
      role: 'bench',
      joinedAt: new Date('2024-08-01').toISOString()
    }],
    careerStats: {
      gamesPlayed: 20,
      totalPoints: 100,
      totalRebounds: 40,
      totalAssists: 30,
      avgPointsPerGame: 5.0,
      avgReboundsPerGame: 2.0,
      avgAssistsPerGame: 1.5,
      fieldGoalPercentage: 0.380,
      threePointPercentage: 0.300,
      freeThrowPercentage: 0.700
    },
    country: 'USA',
    createdAt: currentTimestamp,
    updatedAt: currentTimestamp,
    isActive: true
  },
  {
    playerId: 'player-tb-009',
    firstName: 'Chris',
    lastName: 'Anderson',
    jerseyNumber: '44',
    position: [Position.PF, Position.C],
    height: 206,
    weight: 105,
    yearsOfExperience: 4,
    skillLevel: SkillLevel.INTERMEDIATE,
    dominantHand: 'left',
    currentTeams: [{
      teamId: 'team-001',
      role: 'bench',
      joinedAt: new Date('2023-05-01').toISOString()
    }],
    careerStats: {
      gamesPlayed: 80,
      totalPoints: 640,
      totalRebounds: 560,
      totalAssists: 160,
      avgPointsPerGame: 8.0,
      avgReboundsPerGame: 7.0,
      avgAssistsPerGame: 2.0,
      fieldGoalPercentage: 0.500,
      threePointPercentage: 0.250,
      freeThrowPercentage: 0.680
    },
    country: 'USA',
    createdAt: currentTimestamp,
    updatedAt: currentTimestamp,
    isActive: true
  },
  {
    playerId: 'player-tb-010',
    firstName: 'Derek',
    lastName: 'White',
    jerseyNumber: '3',
    position: [Position.PG],
    height: 180,
    weight: 75,
    yearsOfExperience: 2,
    skillLevel: SkillLevel.BEGINNER,
    dominantHand: 'right',
    currentTeams: [{
      teamId: 'team-001',
      role: 'reserve',
      joinedAt: new Date('2024-10-01').toISOString()
    }],
    careerStats: {
      gamesPlayed: 30,
      totalPoints: 120,
      totalRebounds: 60,
      totalAssists: 90,
      avgPointsPerGame: 4.0,
      avgReboundsPerGame: 2.0,
      avgAssistsPerGame: 3.0,
      fieldGoalPercentage: 0.400,
      threePointPercentage: 0.320,
      freeThrowPercentage: 0.750
    },
    country: 'USA',
    createdAt: currentTimestamp,
    updatedAt: currentTimestamp,
    isActive: true
  }
];

// ============================================
// PLAYERS DATA - HAWKS
// ============================================
export const hawksPlayers: Player[] = [
  {
    playerId: 'player-hk-001',
    firstName: 'Anthony',
    lastName: 'Robinson',
    jerseyNumber: '1',
    position: [Position.PG],
    height: 187,
    weight: 84,
    yearsOfExperience: 6,
    skillLevel: SkillLevel.ADVANCED,
    dominantHand: 'right',
    currentTeams: [{
      teamId: 'team-002',
      role: 'starter',
      joinedAt: new Date('2022-06-01').toISOString()
    }],
    careerStats: {
      gamesPlayed: 140,
      totalPoints: 2240,
      totalRebounds: 560,
      totalAssists: 980,
      avgPointsPerGame: 16.0,
      avgReboundsPerGame: 4.0,
      avgAssistsPerGame: 7.0,
      fieldGoalPercentage: 0.470,
      threePointPercentage: 0.390,
      freeThrowPercentage: 0.870
    },
    country: 'USA',
    createdAt: currentTimestamp,
    updatedAt: currentTimestamp,
    isActive: true
  },
  {
    playerId: 'player-hk-002',
    firstName: 'Darius',
    lastName: 'Miller',
    jerseyNumber: '22',
    position: [Position.SG],
    height: 193,
    weight: 90,
    yearsOfExperience: 4,
    skillLevel: SkillLevel.ADVANCED,
    dominantHand: 'right',
    currentTeams: [{
      teamId: 'team-002',
      role: 'starter',
      joinedAt: new Date('2023-01-01').toISOString()
    }],
    careerStats: {
      gamesPlayed: 90,
      totalPoints: 1620,
      totalRebounds: 360,
      totalAssists: 270,
      avgPointsPerGame: 18.0,
      avgReboundsPerGame: 4.0,
      avgAssistsPerGame: 3.0,
      fieldGoalPercentage: 0.480,
      threePointPercentage: 0.420,
      freeThrowPercentage: 0.890
    },
    country: 'USA',
    createdAt: currentTimestamp,
    updatedAt: currentTimestamp,
    isActive: true
  },
  {
    playerId: 'player-hk-003',
    firstName: 'Jaylen',
    lastName: 'Green',
    jerseyNumber: '10',
    position: [Position.SF],
    height: 196,
    weight: 92,
    yearsOfExperience: 3,
    skillLevel: SkillLevel.INTERMEDIATE,
    dominantHand: 'right',
    currentTeams: [{
      teamId: 'team-002',
      role: 'starter',
      joinedAt: new Date('2023-08-01').toISOString()
    }],
    careerStats: {
      gamesPlayed: 70,
      totalPoints: 910,
      totalRebounds: 420,
      totalAssists: 210,
      avgPointsPerGame: 13.0,
      avgReboundsPerGame: 6.0,
      avgAssistsPerGame: 3.0,
      fieldGoalPercentage: 0.460,
      threePointPercentage: 0.370,
      freeThrowPercentage: 0.780
    },
    country: 'USA',
    createdAt: currentTimestamp,
    updatedAt: currentTimestamp,
    isActive: true
  },
  {
    playerId: 'player-hk-004',
    firstName: 'Xavier',
    lastName: 'Turner',
    jerseyNumber: '32',
    position: [Position.PF],
    height: 204,
    weight: 104,
    yearsOfExperience: 5,
    skillLevel: SkillLevel.ADVANCED,
    dominantHand: 'right',
    currentTeams: [{
      teamId: 'team-002',
      role: 'starter',
      joinedAt: new Date('2022-01-01').toISOString()
    }],
    careerStats: {
      gamesPlayed: 120,
      totalPoints: 1800,
      totalRebounds: 1080,
      totalAssists: 360,
      avgPointsPerGame: 15.0,
      avgReboundsPerGame: 9.0,
      avgAssistsPerGame: 3.0,
      fieldGoalPercentage: 0.530,
      threePointPercentage: 0.340,
      freeThrowPercentage: 0.720
    },
    country: 'USA',
    createdAt: currentTimestamp,
    updatedAt: currentTimestamp,
    isActive: true
  },
  {
    playerId: 'player-hk-005',
    firstName: 'Hassan',
    lastName: 'Adams',
    jerseyNumber: '55',
    position: [Position.C],
    height: 213,
    weight: 115,
    yearsOfExperience: 8,
    skillLevel: SkillLevel.ADVANCED,
    dominantHand: 'right',
    currentTeams: [{
      teamId: 'team-002',
      role: 'starter',
      joinedAt: new Date('2021-06-01').toISOString()
    }],
    careerStats: {
      gamesPlayed: 200,
      totalPoints: 2400,
      totalRebounds: 2200,
      totalAssists: 400,
      avgPointsPerGame: 12.0,
      avgReboundsPerGame: 11.0,
      avgAssistsPerGame: 2.0,
      fieldGoalPercentage: 0.600,
      threePointPercentage: 0.000,
      freeThrowPercentage: 0.680
    },
    country: 'USA',
    createdAt: currentTimestamp,
    updatedAt: currentTimestamp,
    isActive: true
  },
  {
    playerId: 'player-hk-006',
    firstName: 'Jordan',
    lastName: 'Clark',
    jerseyNumber: '8',
    position: [Position.PG, Position.SG],
    height: 185,
    weight: 80,
    yearsOfExperience: 2,
    skillLevel: SkillLevel.INTERMEDIATE,
    dominantHand: 'left',
    currentTeams: [{
      teamId: 'team-002',
      role: 'bench',
      joinedAt: new Date('2024-02-01').toISOString()
    }],
    careerStats: {
      gamesPlayed: 45,
      totalPoints: 405,
      totalRebounds: 90,
      totalAssists: 180,
      avgPointsPerGame: 9.0,
      avgReboundsPerGame: 2.0,
      avgAssistsPerGame: 4.0,
      fieldGoalPercentage: 0.440,
      threePointPercentage: 0.370,
      freeThrowPercentage: 0.820
    },
    country: 'USA',
    createdAt: currentTimestamp,
    updatedAt: currentTimestamp,
    isActive: true
  },
  {
    playerId: 'player-hk-007',
    firstName: 'Malik',
    lastName: 'Washington',
    jerseyNumber: '17',
    position: [Position.SF, Position.PF],
    height: 201,
    weight: 100,
    yearsOfExperience: 3,
    skillLevel: SkillLevel.INTERMEDIATE,
    dominantHand: 'right',
    currentTeams: [{
      teamId: 'team-002',
      role: 'bench',
      joinedAt: new Date('2023-09-01').toISOString()
    }],
    careerStats: {
      gamesPlayed: 65,
      totalPoints: 520,
      totalRebounds: 325,
      totalAssists: 130,
      avgPointsPerGame: 8.0,
      avgReboundsPerGame: 5.0,
      avgAssistsPerGame: 2.0,
      fieldGoalPercentage: 0.460,
      threePointPercentage: 0.340,
      freeThrowPercentage: 0.740
    },
    country: 'USA',
    createdAt: currentTimestamp,
    updatedAt: currentTimestamp,
    isActive: true
  },
  {
    playerId: 'player-hk-008',
    firstName: 'Isaiah',
    lastName: 'Scott',
    jerseyNumber: '25',
    position: [Position.SG],
    height: 190,
    weight: 86,
    yearsOfExperience: 1,
    skillLevel: SkillLevel.BEGINNER,
    dominantHand: 'right',
    currentTeams: [{
      teamId: 'team-002',
      role: 'bench',
      joinedAt: new Date('2024-07-01').toISOString()
    }],
    careerStats: {
      gamesPlayed: 25,
      totalPoints: 150,
      totalRebounds: 50,
      totalAssists: 38,
      avgPointsPerGame: 6.0,
      avgReboundsPerGame: 2.0,
      avgAssistsPerGame: 1.5,
      fieldGoalPercentage: 0.400,
      threePointPercentage: 0.320,
      freeThrowPercentage: 0.720
    },
    country: 'USA',
    createdAt: currentTimestamp,
    updatedAt: currentTimestamp,
    isActive: true
  },
  {
    playerId: 'player-hk-009',
    firstName: 'Dominic',
    lastName: 'Hall',
    jerseyNumber: '40',
    position: [Position.PF, Position.C],
    height: 208,
    weight: 108,
    yearsOfExperience: 5,
    skillLevel: SkillLevel.INTERMEDIATE,
    dominantHand: 'right',
    currentTeams: [{
      teamId: 'team-002',
      role: 'bench',
      joinedAt: new Date('2023-03-01').toISOString()
    }],
    careerStats: {
      gamesPlayed: 100,
      totalPoints: 900,
      totalRebounds: 700,
      totalAssists: 200,
      avgPointsPerGame: 9.0,
      avgReboundsPerGame: 7.0,
      avgAssistsPerGame: 2.0,
      fieldGoalPercentage: 0.520,
      threePointPercentage: 0.280,
      freeThrowPercentage: 0.700
    },
    country: 'USA',
    createdAt: currentTimestamp,
    updatedAt: currentTimestamp,
    isActive: true
  },
  {
    playerId: 'player-hk-010',
    firstName: 'Cameron',
    lastName: 'Young',
    jerseyNumber: '5',
    position: [Position.PG],
    height: 182,
    weight: 77,
    yearsOfExperience: 1,
    skillLevel: SkillLevel.BEGINNER,
    dominantHand: 'right',
    currentTeams: [{
      teamId: 'team-002',
      role: 'reserve',
      joinedAt: new Date('2024-09-01').toISOString()
    }],
    careerStats: {
      gamesPlayed: 15,
      totalPoints: 45,
      totalRebounds: 30,
      totalAssists: 45,
      avgPointsPerGame: 3.0,
      avgReboundsPerGame: 2.0,
      avgAssistsPerGame: 3.0,
      fieldGoalPercentage: 0.380,
      threePointPercentage: 0.300,
      freeThrowPercentage: 0.700
    },
    country: 'USA',
    createdAt: currentTimestamp,
    updatedAt: currentTimestamp,
    isActive: true
  }
];

// ============================================
// GAME DATA
// ============================================
export const sampleGame: Game = {
  gameId: 'game-001',
  gameType: GameType.REGULAR,
  homeTeam: {
    teamId: 'team-001',
    name: 'Metro Thunderbirds',
    logoURL: 'https://example.com/thunderbirds-logo.png',
    score: 0,
    timeouts: 7,
    fouls: 0
  },
  awayTeam: {
    teamId: 'team-002',
    name: 'City Hawks',
    logoURL: 'https://example.com/hawks-logo.png',
    score: 0,
    timeouts: 7,
    fouls: 0
  },
  scheduledAt: gameTimestamp,
  venue: 'Metro Sports Arena',
  venueAddress: '123 Sports Way, New York, NY 10001',
  status: GameStatus.SCHEDULED,
  currentPeriod: 1,
  currentTime: '12:00',
  isHalftime: false,
  isOvertime: false,
  officials: [
    { name: 'John Roberts', role: 'crew_chief' },
    { name: 'Mike Stevens', role: 'referee' },
    { name: 'Tom Anderson', role: 'umpire' }
  ],
  score: {
    home: 0,
    away: 0,
    quarterScores: {
      home: [],
      away: []
    }
  },
  homePlayers: thunderbirdsPlayers.slice(0, 8).map(p => ({
    playerId: p.playerId,
    firstName: p.firstName,
    lastName: p.lastName,
    jerseyNumber: parseInt(p.jerseyNumber),
    starter: thunderbirdsPlayers.indexOf(p) < 5,
    active: true
  })),
  awayPlayers: hawksPlayers.slice(0, 8).map(p => ({
    playerId: p.playerId,
    firstName: p.firstName,
    lastName: p.lastName,
    jerseyNumber: parseInt(p.jerseyNumber),
    starter: hawksPlayers.indexOf(p) < 5,
    active: true
  })),
  seasonId: 'season-2025',
  createdAt: currentTimestamp,
  updatedAt: currentTimestamp,
  completedAt: null,
  attendance: 3500
};

// ============================================
// GAME EVENTS - SIMULATED GAME
// ============================================
export const generateGameEvents = (): GameEvent[] => {
  const events: GameEvent[] = [];
  let homeScore = 0;
  let awayScore = 0;
  let eventId = 1;

  const periods = 4;
  const minutesPerPeriod = 12;

  for (let period = 1; period <= periods; period++) {
    // Period start event
    events.push({
      eventId: `event-${eventId++}`,
      eventType: EventType.PERIOD_START,
      timestamp: new Date(Date.parse(gameTimestamp) + (period - 1) * 12 * 60 * 1000).toISOString(),
      period: period,
      gameMinutes: 12,
      gameSeconds: 0,
      teamId: 'team-001',
      description: `Quarter ${period} has started`,
      homeScore,
      awayScore,
      isHighlight: false
    });

    // Generate events for this period
    const eventsPerPeriod = 30;
    for (let i = 0; i < eventsPerPeriod; i++) {
      const gameMinutes = Math.floor(Math.random() * 12);
      const gameSeconds = Math.floor(Math.random() * 60);
      const isHomeTeam = Math.random() < 0.5;
      const teamId = isHomeTeam ? 'team-001' : 'team-002';
      const players = isHomeTeam ? thunderbirdsPlayers : hawksPlayers;
      const randomPlayer = players[Math.floor(Math.random() * 5)]; // Use starters mostly

      // Randomly choose event type (weighted)
      const eventRandom = Math.random();
      let event: GameEvent;

      if (eventRandom < 0.35) {
        // Shot attempt (35%)
        const shotMade = Math.random() < 0.45;
        const is3Point = Math.random() < 0.35;
        const points = shotMade ? (is3Point ? 3 : 2) : 0;

        if (isHomeTeam && shotMade) homeScore += points;
        if (!isHomeTeam && shotMade) awayScore += points;

        const shotTypes = Object.values(ShotType);
        const shotType = is3Point ? ShotType.JUMP_SHOT : shotTypes[Math.floor(Math.random() * shotTypes.length)];

        event = {
          eventId: `event-${eventId++}`,
          eventType: shotMade ?
            (is3Point ? EventType.FG3_MADE : EventType.FG2_MADE) :
            (is3Point ? EventType.FG3_ATTEMPT : EventType.FG2_ATTEMPT),
          timestamp: new Date(Date.parse(gameTimestamp) + eventId * 1000).toISOString(),
          period,
          gameMinutes,
          gameSeconds,
          playerId: randomPlayer.playerId,
          playerName: `${randomPlayer.firstName} ${randomPlayer.lastName}`,
          teamId,
          description: shotMade ?
            `${randomPlayer.firstName} ${randomPlayer.lastName} makes ${is3Point ? '3-point' : '2-point'} ${shotType.replace('_', ' ')}` :
            `${randomPlayer.firstName} ${randomPlayer.lastName} misses ${is3Point ? '3-point' : '2-point'} ${shotType.replace('_', ' ')}`,
          locationX: Math.random() * 94,
          locationY: Math.random() * 50,
          shotType,
          shotDistance: is3Point ? 23 + Math.random() * 5 : Math.random() * 22,
          shotMade,
          points,
          homeScore,
          awayScore,
          isHighlight: shotMade && (is3Point || shotType === ShotType.DUNK)
        };

        // Add assist if made
        if (shotMade && Math.random() < 0.6) {
          const assistPlayer = players[Math.floor(Math.random() * 5)];
          if (assistPlayer.playerId !== randomPlayer.playerId) {
            event.assistPlayerId = assistPlayer.playerId;
            event.assistPlayerName = `${assistPlayer.firstName} ${assistPlayer.lastName}`;
            event.description += ` (assist: ${assistPlayer.firstName} ${assistPlayer.lastName})`;
          }
        }
      } else if (eventRandom < 0.50) {
        // Rebound (15%)
        const reboundType = Math.random() < 0.7 ? 'defensive' : 'offensive';
        event = {
          eventId: `event-${eventId++}`,
          eventType: reboundType === 'defensive' ? EventType.REBOUND_DEF : EventType.REBOUND_OFF,
          timestamp: new Date(Date.parse(gameTimestamp) + eventId * 1000).toISOString(),
          period,
          gameMinutes,
          gameSeconds,
          playerId: randomPlayer.playerId,
          playerName: `${randomPlayer.firstName} ${randomPlayer.lastName}`,
          teamId,
          description: `${randomPlayer.firstName} ${randomPlayer.lastName} grabs ${reboundType} rebound`,
          reboundType,
          contested: Math.random() < 0.3,
          homeScore,
          awayScore,
          isHighlight: false
        };
      } else if (eventRandom < 0.60) {
        // Free throw (10%)
        const ftMade = Math.random() < 0.75;
        if (isHomeTeam && ftMade) homeScore += 1;
        if (!isHomeTeam && ftMade) awayScore += 1;

        event = {
          eventId: `event-${eventId++}`,
          eventType: ftMade ? EventType.FT_MADE : EventType.FT_ATTEMPT,
          timestamp: new Date(Date.parse(gameTimestamp) + eventId * 1000).toISOString(),
          period,
          gameMinutes,
          gameSeconds,
          playerId: randomPlayer.playerId,
          playerName: `${randomPlayer.firstName} ${randomPlayer.lastName}`,
          teamId,
          description: ftMade ?
            `${randomPlayer.firstName} ${randomPlayer.lastName} makes free throw` :
            `${randomPlayer.firstName} ${randomPlayer.lastName} misses free throw`,
          shotType: ShotType.JUMP_SHOT,
          shotMade: ftMade,
          points: ftMade ? 1 : 0,
          homeScore,
          awayScore,
          isHighlight: false
        };
      } else if (eventRandom < 0.70) {
        // Turnover (10%)
        event = {
          eventId: `event-${eventId++}`,
          eventType: EventType.TURNOVER,
          timestamp: new Date(Date.parse(gameTimestamp) + eventId * 1000).toISOString(),
          period,
          gameMinutes,
          gameSeconds,
          playerId: randomPlayer.playerId,
          playerName: `${randomPlayer.firstName} ${randomPlayer.lastName}`,
          teamId,
          description: `Turnover by ${randomPlayer.firstName} ${randomPlayer.lastName}`,
          homeScore,
          awayScore,
          isHighlight: false
        };
      } else if (eventRandom < 0.80) {
        // Foul (10%)
        const foulTypes = ['personal', 'personal', 'personal', 'technical'] as const;
        const foulType = foulTypes[Math.floor(Math.random() * foulTypes.length)];
        const opponentPlayers = isHomeTeam ? hawksPlayers : thunderbirdsPlayers;
        const fouledPlayer = opponentPlayers[Math.floor(Math.random() * 5)];

        event = {
          eventId: `event-${eventId++}`,
          eventType: EventType.FOUL_DEFENSE,
          timestamp: new Date(Date.parse(gameTimestamp) + eventId * 1000).toISOString(),
          period,
          gameMinutes,
          gameSeconds,
          playerId: randomPlayer.playerId,
          playerName: `${randomPlayer.firstName} ${randomPlayer.lastName}`,
          teamId,
          description: `${foulType} foul on ${randomPlayer.firstName} ${randomPlayer.lastName}`,
          foulType,
          fouledPlayerId: fouledPlayer.playerId,
          fouledPlayerName: `${fouledPlayer.firstName} ${fouledPlayer.lastName}`,
          freeThrowsAwarded: foulType === 'technical' ? 1 : 0,
          homeScore,
          awayScore,
          isHighlight: false
        };
      } else if (eventRandom < 0.85) {
        // Steal (5%)
        event = {
          eventId: `event-${eventId++}`,
          eventType: EventType.STEAL,
          timestamp: new Date(Date.parse(gameTimestamp) + eventId * 1000).toISOString(),
          period,
          gameMinutes,
          gameSeconds,
          playerId: randomPlayer.playerId,
          playerName: `${randomPlayer.firstName} ${randomPlayer.lastName}`,
          teamId,
          description: `Steal by ${randomPlayer.firstName} ${randomPlayer.lastName}`,
          homeScore,
          awayScore,
          isHighlight: Math.random() < 0.3
        };
      } else if (eventRandom < 0.90) {
        // Block (5%)
        event = {
          eventId: `event-${eventId++}`,
          eventType: EventType.BLOCK,
          timestamp: new Date(Date.parse(gameTimestamp) + eventId * 1000).toISOString(),
          period,
          gameMinutes,
          gameSeconds,
          playerId: randomPlayer.playerId,
          playerName: `${randomPlayer.firstName} ${randomPlayer.lastName}`,
          teamId,
          description: `Block by ${randomPlayer.firstName} ${randomPlayer.lastName}`,
          homeScore,
          awayScore,
          isHighlight: Math.random() < 0.5
        };
      } else if (eventRandom < 0.95) {
        // Timeout (5%)
        event = {
          eventId: `event-${eventId++}`,
          eventType: Math.random() < 0.8 ? EventType.TIMEOUT_FULL : EventType.TIMEOUT_SHORT,
          timestamp: new Date(Date.parse(gameTimestamp) + eventId * 1000).toISOString(),
          period,
          gameMinutes,
          gameSeconds,
          teamId,
          description: `${isHomeTeam ? 'Thunderbirds' : 'Hawks'} timeout`,
          homeScore,
          awayScore,
          isHighlight: false
        };
      } else {
        // Substitution (5%)
        const playerIn = players[5 + Math.floor(Math.random() * 3)];
        const playerOut = players[Math.floor(Math.random() * 5)];

        event = {
          eventId: `event-${eventId++}`,
          eventType: EventType.SUBSTITUTION,
          timestamp: new Date(Date.parse(gameTimestamp) + eventId * 1000).toISOString(),
          period,
          gameMinutes,
          gameSeconds,
          teamId,
          description: `Substitution: ${playerIn.firstName} ${playerIn.lastName} in for ${playerOut.firstName} ${playerOut.lastName}`,
          playerInId: playerIn.playerId,
          playerInName: `${playerIn.firstName} ${playerIn.lastName}`,
          playerOutId: playerOut.playerId,
          playerOutName: `${playerOut.firstName} ${playerOut.lastName}`,
          homeScore,
          awayScore,
          isHighlight: false
        };
      }

      events.push(event);
    }

    // Period end event
    events.push({
      eventId: `event-${eventId++}`,
      eventType: EventType.PERIOD_END,
      timestamp: new Date(Date.parse(gameTimestamp) + period * 12 * 60 * 1000).toISOString(),
      period: period,
      gameMinutes: 0,
      gameSeconds: 0,
      teamId: 'team-001',
      description: `End of Quarter ${period}`,
      homeScore,
      awayScore,
      isHighlight: false
    });
  }

  return events;
};

// Generate the game events
export const gameEvents: GameEvent[] = generateGameEvents();

// Export everything as a single object for easy import
export const sampleData = {
  league: sampleLeague,
  teams: [thunderbirds, hawks],
  players: [...thunderbirdsPlayers, ...hawksPlayers],
  game: sampleGame,
  gameEvents
};

console.log(`Generated sample data with:
- 1 League
- 2 Teams
- ${sampleData.players.length} Players
- 1 Game
- ${gameEvents.length} Game Events`);