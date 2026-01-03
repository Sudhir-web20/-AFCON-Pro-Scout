
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { fetchAFCONPlayers } from './services/geminiService';
import { Player, LeagueCategory, GroundingSource } from './types';
import Header from './components/Header';
import PlayerCard from './components/PlayerCard';

const STORAGE_KEY = 'afcon_pro_scout_v2';

const ELITE_PLAYERS: Player[] = [
  { id: 'salah', name: 'Mohamed Salah', nationalTeam: 'Egypt', club: 'Liverpool', league: LeagueCategory.EUROPE, position: 'RW', age: 32, marketValue: '€55m', starPower: 5, description: 'Legendary winger and Egypt icon. Exceptional clinical finishing and pace.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Mohamed_Salah_2018.jpg/500px-Mohamed_Salah_2018.jpg', nationColor: '#CE1126' },
  { id: 'osimhen', name: 'Victor Osimhen', nationalTeam: 'Nigeria', club: 'Galatasaray', league: LeagueCategory.EUROPE, position: 'ST', age: 25, marketValue: '€75m', starPower: 5, description: 'Powerhouse striker. African Footballer of the Year known for explosive finishing.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Victor_Osimhen_2019.jpg/500px-Victor_Osimhen_2019.jpg', nationColor: '#008751' },
  { id: 'hakimi', name: 'Achraf Hakimi', nationalTeam: 'Morocco', club: 'PSG', league: LeagueCategory.EUROPE, position: 'RB', age: 26, marketValue: '€60m', starPower: 5, description: 'Dynamic full-back with world-class speed and offensive contribution.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Achraf_Hakimi_2018.jpg/500px-Achraf_Hakimi_2018.jpg', nationColor: '#C1272D' },
  { id: 'mane', name: 'Sadio Mane', nationalTeam: 'Senegal', club: 'Al-Nassr', league: LeagueCategory.SAUDI, position: 'LW', age: 32, marketValue: '€20m', starPower: 5, description: 'Senegal\'s greatest ever goalscorer. Versatile attacker with elite spatial awareness.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Sadio_Man%C3%A9_2018.jpg/500px-Sadio_Man%C3%A9_2018.jpg', nationColor: '#00853F' },
  { id: 'mahrez', name: 'Riyad Mahrez', nationalTeam: 'Algeria', club: 'Al-Ahli', league: LeagueCategory.SAUDI, position: 'RW', age: 33, marketValue: '€12m', starPower: 4, description: 'Master of the first touch. Technically gifted winger with a lethal left foot.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Riyad_Mahrez_2019.jpg/500px-Riyad_Mahrez_2019.jpg', nationColor: '#006233' },
  { id: 'kudus', name: 'Mohammed Kudus', nationalTeam: 'Ghana', club: 'West Ham', league: LeagueCategory.EUROPE, position: 'AM', age: 24, marketValue: '€50m', starPower: 4, description: 'Star of the Black Stars. Explosive dribbling and elite ball retention skills.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Mohammed_Kudus_2022.jpg/500px-Mohammed_Kudus_2022.jpg', nationColor: '#DA291C' },
  { id: 'onana', name: 'Andre Onana', nationalTeam: 'Cameroon', club: 'Man Utd', league: LeagueCategory.EUROPE, position: 'GK', age: 28, marketValue: '€35m', starPower: 4, description: 'Modern ball-playing goalkeeper. High-risk, high-reward distribution specialist.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Andr%C3%A9_Onana_2018.jpg/500px-Andr%C3%A9_Onana_2018.jpg', nationColor: '#007A5E' },
  { id: 'guirassy', name: 'Serhou Guirassy', nationalTeam: 'Guinea', club: 'Dortmund', league: LeagueCategory.EUROPE, position: 'ST', age: 28, marketValue: '€40m', starPower: 4, description: 'Clinical target man. Exceptional positioning and aerial threat in the box.', imageUrl: '', nationColor: '#CE1126' },
  { id: 'lookman', name: 'Ademola Lookman', nationalTeam: 'Nigeria', club: 'Atalanta', league: LeagueCategory.EUROPE, position: 'LW', age: 27, marketValue: '€40m', starPower: 4, description: 'Europa League Final hero. Intelligent movement and sharp finishing.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Ademola_Lookman_2017.jpg/500px-Ademola_Lookman_2017.jpg', nationColor: '#008751' },
  { id: 'tapsoba', name: 'Edmond Tapsoba', nationalTeam: 'Burkina Faso', club: 'Leverkusen', league: LeagueCategory.EUROPE, position: 'CB', age: 25, marketValue: '€45m', starPower: 4, description: 'Invincible defender. Calm on the ball with excellent defensive reading.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Edmond_Tapsoba_2022.jpg/500px-Edmond_Tapsoba_2022.jpg', nationColor: '#CE1126' },
  { id: 'mbeumo', name: 'Bryan Mbeumo', nationalTeam: 'Cameroon', club: 'Brentford', league: LeagueCategory.EUROPE, position: 'RW', age: 25, marketValue: '€40m', starPower: 3, description: 'Crucial attacker for Brentford. Excellent work rate and set-piece delivery.', imageUrl: '', nationColor: '#007A5E' },
  { id: 'kessie', name: 'Franck Kessie', nationalTeam: 'Ivory Coast', club: 'Al-Ahli', league: LeagueCategory.SAUDI, position: 'CM', age: 27, marketValue: '€18m', starPower: 4, description: ' midfield powerhouse. Strong, tireless, and reliable from the penalty spot.', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Franck_Kessi%C3%A9_2018.jpg/500px-Franck_Kessi%C3%A9_2018.jpg', nationColor: '#FF8200' },
];

const App: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<LeagueCategory | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Instant Boot: Merge static elite data with localStorage edits
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { players: savedPlayers, sources: savedSources } = JSON.parse(saved);
        // Merge strategy: Start with ELITE_PLAYERS, overwrite with saved edits if they exist
        const merged = ELITE_PLAYERS.map(elite => {
          const savedMatch = savedPlayers.find((s: Player) => s.id === elite.id);
          return savedMatch ? { ...elite, ...savedMatch } : elite;
        });
        
        // Add any players that were discovered by AI but aren't in Elite list
        const discovered = savedPlayers.filter((s: Player) => !ELITE_PLAYERS.some(e => e.id === s.id));
        
        setPlayers([...merged, ...discovered]);
        setSources(savedSources || []);
      } catch (e) {
        setPlayers(ELITE_PLAYERS);
      }
    } else {
      setPlayers(ELITE_PLAYERS);
    }
  }, []);

  // Persistence: Sync to localStorage
  useEffect(() => {
    if (players.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ players, sources }));
    }
  }, [players, sources]);

  const runAIScout = async () => {
    try {
      setLoading(true);
      const data = await fetchAFCONPlayers();
      if (data.players.length > 0) {
        // Only add new players found by AI, don't overwrite manual edits on existing ones
        setPlayers(prev => {
          const updated = [...prev];
          data.players.forEach(newP => {
            const exists = updated.find(u => u.name.toLowerCase() === newP.name.toLowerCase());
            if (!exists) updated.push(newP);
          });
          return updated;
        });
        setSources(data.sources);
      }
    } catch (error) {
      console.error("AI Scouting failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateImage = useCallback((id: string, newUrl: string) => {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, imageUrl: newUrl } : p));
  }, []);

  const filteredPlayers = useMemo(() => {
    return players.filter(p => {
      const matchesFilter = filter === 'ALL' || p.league === filter;
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           p.nationalTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           p.club.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [players, filter, searchTerm]);

  return (
    <div className="min-h-screen flex flex-col bg-[#050810]">
      <Header />

      <main className="flex-1 max-w-[1600px] mx-auto w-full px-4 sm:px-6 py-6">
        {/* Search and Filters */}
        <section className="mb-8 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          <div className="flex-1 relative max-w-2xl">
            <i className="fa-solid fa-bolt absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 animate-pulse" />
            <input 
              type="text" 
              placeholder="Instant search players, nations or clubs..." 
              className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all placeholder:text-slate-600 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex bg-slate-900/50 p-1.5 rounded-xl border border-white/5">
              {(['ALL', LeagueCategory.EUROPE, LeagueCategory.SAUDI] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    filter === cat 
                      ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]' 
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {cat === 'ALL' ? 'Global' : cat}
                </button>
              ))}
            </div>

            <button 
              onClick={runAIScout}
              disabled={loading}
              className="bg-slate-900/50 text-slate-400 hover:text-amber-500 px-5 py-3 rounded-xl border border-white/5 transition-all text-sm flex items-center gap-2 group disabled:opacity-50"
            >
              <i className={`fa-solid fa-satellite-dish ${loading ? 'animate-ping' : 'group-hover:animate-bounce'}`} />
              <span className="text-[10px] font-black uppercase tracking-widest">Discover New</span>
            </button>
          </div>
        </section>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 mb-6 px-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">
            Database Synced • {filteredPlayers.length} Elite Profiles Online
          </span>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {filteredPlayers.map(player => (
            <PlayerCard key={player.id} player={player} onUpdateImage={handleUpdateImage} />
          ))}
        </div>

        {/* Empty State */}
        {filteredPlayers.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-32 text-slate-800">
            <i className="fa-solid fa-magnifying-glass-location text-5xl mb-4 opacity-20" />
            <p className="text-sm font-black uppercase tracking-widest">No matching profiles found in database</p>
          </div>
        )}

        {/* Grounding Sources */}
        {sources.length > 0 && (
          <section className="mt-20 pt-8 border-t border-white/5">
            <h4 className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4">Live Discovery References</h4>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {sources.map((source, idx) => (
                <a 
                  key={idx} 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[10px] text-slate-600 hover:text-amber-500 transition-colors flex items-center gap-1.5"
                >
                  <i className="fa-solid fa-link text-[8px]" />
                  {source.title}
                </a>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="mt-auto border-t border-white/5 py-8 px-6 flex flex-col md:flex-row justify-between items-center bg-[#050810]/80 backdrop-blur-xl">
        <div className="text-[9px] font-black text-slate-700 uppercase tracking-[0.3em]">
          &copy; 2025 AFCON PRO SCOUT • HIGH PERSISTENCE CACHE v2.0
        </div>
        <div className="flex gap-6 text-[9px] font-black text-slate-700 uppercase tracking-widest">
          <span className="flex items-center gap-2 text-emerald-500/40">
            <i className="fa-solid fa-database" /> LOCAL STORAGE PERSISTENCE ACTIVE
          </span>
        </div>
      </footer>
    </div>
  );
};

export default App;
