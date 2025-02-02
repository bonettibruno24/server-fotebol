import { pgTable, uuid, text, boolean, timestamp, integer } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: text("username").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  email: text("email").unique().notNull(),
  specialCode: text("special_code"),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const tournaments = pgTable("tournaments", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  rules: text("rules"),
  createdBy: uuid("created_by").references(() => profiles.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const tournamentTeams = pgTable("tournament_teams", {
  id: uuid("id").primaryKey().defaultRandom(),
  tournamentId: uuid("tournament_id").references(() => tournaments.id, { onDelete: "cascade" }),
  teamName: text("team_name").notNull(),
  captainId: uuid("captain_id").references(() => profiles.id, { onDelete: "set null" }), // Capitão do time
  createdAt: timestamp("created_at").defaultNow(),
});

export const players = pgTable("players", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "cascade" }),
  teamId: uuid("team_id").references(() => tournamentTeams.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const matches = pgTable("matches", {
  id: uuid("id").primaryKey().defaultRandom(),
  tournamentId: uuid("tournament_id").references(() => tournaments.id, { onDelete: "cascade" }),
  teamA: uuid("team_a").references(() => tournamentTeams.id, { onDelete: "cascade" }),
  teamB: uuid("team_b").references(() => tournamentTeams.id, { onDelete: "cascade" }),
  matchDate: timestamp("match_date").notNull(),
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Tabela de resultados das partidas
export const matchResults = pgTable("match_results", {
  id: uuid("id").primaryKey().defaultRandom(),
  matchId: uuid("match_id").references(() => matches.id, { onDelete: "cascade" }),
  teamAScore: integer("team_a_score").notNull().default(0),
  teamBScore: integer("team_b_score").notNull().default(0),
  winner: uuid("winner").references(() => tournamentTeams.id, { onDelete: "set null" }), // Time vencedor
  createdAt: timestamp("created_at").defaultNow(),
});

// Regras de Segurança e RLS via SQL
export const enableRLS = sql`
  -- Enable RLS
  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
  ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
  ALTER TABLE tournament_teams ENABLE ROW LEVEL SECURITY;
  ALTER TABLE players ENABLE ROW LEVEL SECURITY;
  ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
  ALTER TABLE match_results ENABLE ROW LEVEL SECURITY;

  -- Profiles policies
  CREATE POLICY "Public profiles are viewable by everyone"
    ON profiles FOR SELECT
    USING (true);

  CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

  -- Tournaments policies
  CREATE POLICY "Tournaments are viewable by everyone"
    ON tournaments FOR SELECT
    USING (true);

  CREATE POLICY "Admin can create tournaments"
    ON tournaments FOR INSERT
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
      )
    );

  CREATE POLICY "Admin can update tournaments"
    ON tournaments FOR UPDATE
    USING (
      EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
      )
    );

  CREATE POLICY "Admin can delete tournaments"
    ON tournaments FOR DELETE
    USING (
      EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
      )
    );

  -- Tournament teams policies
  CREATE POLICY "Tournament teams are viewable by everyone"
    ON tournament_teams FOR SELECT
    USING (true);

  CREATE POLICY "Admin can manage tournament teams"
    ON tournament_teams FOR ALL
    USING (
      EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
      )
    );

  -- Players policies
  CREATE POLICY "Players can see their own data"
    ON players FOR SELECT
    USING (auth.uid() = user_id);

  CREATE POLICY "Players can join teams"
    ON players FOR INSERT
    WITH CHECK (EXISTS (
      SELECT 1 FROM profiles WHERE profiles.id = auth.uid()
    ));

  -- Matches policies
  CREATE POLICY "Matches are viewable by everyone"
    ON matches FOR SELECT
    USING (true);

  -- Match results policies
  CREATE POLICY "Admin can insert match results"
    ON match_results FOR INSERT
    WITH CHECK (EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    ));
`;