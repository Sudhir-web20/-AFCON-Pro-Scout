
import React, { useState, useRef } from 'react';
import { Player, LeagueCategory } from '../types';

interface PlayerCardProps {
  player: Player;
  onUpdateImage: (id: string, url: string) => void;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, onUpdateImage }) => {
  const [imgError, setImgError] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(true); // Start with description as requested
  const [inputUrl, setInputUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const nationColor = player.nationColor || '#fbbf24';
  const isSaudi = player.league === LeagueCategory.SAUDI;
  
  const displayImg = !imgError && player.imageUrl && player.imageUrl.length > 5
    ? player.imageUrl 
    : null;

  const initials = player.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateImage(player.id, reader.result as string);
        setIsEditMode(false);
        setImgError(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      onUpdateImage(player.id, inputUrl.trim());
      setIsEditMode(false);
      setImgError(false);
      setInputUrl('');
    }
  };

  const toggleModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(!isModalOpen);
    setIsFlipped(true); // Reset to description side when opening
  };

  return (
    <>
      <div 
        onClick={toggleModal}
        className="group relative bg-[#0b0e1a] rounded-xl overflow-hidden border border-white/5 transition-all duration-500 hover:border-amber-500/40 hover:shadow-[0_0_40px_rgba(245,158,11,0.1)] flex flex-col h-[420px] cursor-pointer"
      >
        {/* League & Action Bar */}
        <div className="absolute top-2 left-2 right-2 z-40 flex justify-between items-center">
          <button 
            onClick={(e) => { e.stopPropagation(); setIsEditMode(!isEditMode); }}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-black/60 backdrop-blur-md text-white/40 hover:text-amber-400 border border-white/10 transition-colors"
            title="Update Player Photo"
          >
            <i className={`fa-solid ${isEditMode ? 'fa-xmark' : 'fa-camera'} text-xs`} />
          </button>
          <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest text-white backdrop-blur-md border border-white/10 ${isSaudi ? 'bg-emerald-600/80' : 'bg-blue-600/80'}`}>
            {player.league}
          </div>
        </div>

        {/* Visual Header */}
        <div className="relative h-[240px] w-full overflow-hidden bg-[#060912] flex items-center justify-center">
          {displayImg ? (
            <img 
              src={displayImg} 
              alt={player.name}
              onError={() => setImgError(true)}
              className={`w-full h-full object-cover object-top transition-all duration-1000 ${isEditMode ? 'blur-md' : 'group-hover:scale-110 group-hover:brightness-110'}`}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center relative bg-[#060912]">
              <div className="absolute inset-0 opacity-10 blur-3xl" style={{ background: `radial-gradient(circle, ${nationColor}, transparent)` }} />
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center mb-3 shadow-2xl bg-white/5 backdrop-blur-md">
                  <span className="text-3xl font-black" style={{ color: nationColor }}>{initials}</span>
                </div>
                <span className="text-[7px] font-black text-slate-500 uppercase tracking-[0.4em]">Elite Profile</span>
              </div>
            </div>
          )}
          
          {/* Shadow Mask */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e1a] via-transparent to-transparent opacity-95" />
          
          {/* Star Rating Overlay */}
          <div className="absolute bottom-3 right-3 flex flex-col items-end">
            <span className="text-[7px] font-black text-amber-500/50 uppercase tracking-widest mb-1">Star Power</span>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i} 
                  className={`h-0.5 w-4 rounded-full transition-all duration-500 ${i < player.starPower ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-white/10'}`} 
                />
              ))}
            </div>
          </div>
        </div>

        {/* Identity Info */}
        <div className="p-4 flex-1 flex flex-col justify-between relative z-10 bg-[#0b0e1a]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: nationColor }} />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">{player.nationalTeam}</span>
            </div>
            <h3 className="text-xl font-black text-white leading-tight uppercase group-hover:text-amber-500 transition-colors truncate">
              {player.name}
            </h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight mt-1 truncate">{player.club}</p>
          </div>

          <div className="pt-4 mt-2 border-t border-white/5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[7px] text-slate-600 uppercase font-black mb-0.5">Value</span>
              <span className="text-xs font-black text-emerald-400">{player.marketValue}</span>
            </div>
            <div className="text-right">
              <span className="text-[7px] text-slate-600 uppercase font-black mb-0.5">Position</span>
              <p className="text-[10px] font-black text-white uppercase">{player.position}</p>
            </div>
          </div>
        </div>

        {/* Edit Mode Interface (Local override) */}
        {isEditMode && (
          <div 
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-0 z-50 bg-[#0b0e1a]/95 backdrop-blur-md p-6 flex flex-col justify-center items-center text-center animate-in fade-in duration-300"
          >
            <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em] mb-6">Modify Asset</h4>
            <div className="w-full space-y-4">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 border-2 border-dashed border-white/10 rounded-xl hover:border-amber-500/50 hover:bg-amber-500/5 transition-all"
              >
                <i className="fa-solid fa-upload text-slate-600 mb-1" />
                <p className="text-[9px] font-black text-slate-600 uppercase">Upload</p>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              </button>
              <form onSubmit={handleUrlSubmit} className="space-y-2">
                <input 
                  type="text" 
                  placeholder="Image URL..." 
                  className="w-full bg-slate-900 border border-white/5 rounded-lg px-4 py-3 text-[10px] text-white focus:outline-none focus:border-amber-500/50"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                />
                <button type="submit" className="w-full bg-amber-500 text-slate-950 font-black text-[10px] uppercase py-3 rounded-lg hover:bg-amber-400 transition-colors">Apply</button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Full-Screen Flip Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300"
          onClick={toggleModal}
        >
          <div 
            className="relative w-full max-w-lg aspect-[3/4] perspective-1000"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={toggleModal}
              className="absolute -top-12 right-0 text-white/50 hover:text-white text-3xl"
            >
              <i className="fa-solid fa-xmark" />
            </button>

            {/* Flipped Card Container */}
            <div 
              className={`relative w-full h-full transition-transform duration-700 transform-style-3d cursor-pointer ${!isFlipped ? '' : 'rotate-y-180'}`}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              
              {/* Front Side (Player Identity) */}
              <div className="absolute inset-0 backface-hidden bg-[#0b0e1a] rounded-3xl border border-white/10 overflow-hidden shadow-2xl flex flex-col">
                 <div className="relative h-2/3 w-full bg-[#060912]">
                   {displayImg ? (
                     <img src={displayImg} className="w-full h-full object-cover object-top" alt={player.name} />
                   ) : (
                     <div className="w-full h-full flex flex-col items-center justify-center">
                        <span className="text-6xl font-black" style={{ color: nationColor }}>{initials}</span>
                     </div>
                   )}
                   <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e1a] via-transparent to-transparent" />
                 </div>
                 <div className="p-8 flex-1 flex flex-col justify-center">
                   <div className="flex items-center gap-3 mb-4">
                     <div className="w-4 h-4 rounded-full" style={{ backgroundColor: nationColor }} />
                     <span className="text-sm font-black text-slate-400 uppercase tracking-widest">{player.nationalTeam}</span>
                   </div>
                   <h2 className="text-4xl font-black text-white uppercase mb-2">{player.name}</h2>
                   <p className="text-amber-500 font-black text-lg uppercase tracking-tight">{player.club}</p>
                   <div className="mt-auto flex justify-between items-center text-slate-500">
                     <span className="text-xs font-bold uppercase tracking-widest">Click to view scout report</span>
                     <i className="fa-solid fa-arrow-rotate-right animate-pulse" />
                   </div>
                 </div>
              </div>

              {/* Back Side (Scout Description & Stats) */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#0b0e1a] rounded-3xl border border-amber-500/20 overflow-hidden shadow-2xl flex flex-col p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.3em]">Technical Report</span>
                    <h3 className="text-2xl font-black text-white uppercase">{player.name}</h3>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <i className="fa-solid fa-microchip text-amber-500 text-xl" />
                  </div>
                </div>

                <div className="flex-1 space-y-6">
                  <div>
                    <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Scout Summary</h4>
                    <p className="text-lg text-slate-200 leading-relaxed font-medium italic">"{player.description}"</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <span className="text-[8px] font-black text-slate-600 uppercase block mb-1">Market Value</span>
                      <span className="text-xl font-black text-emerald-400">{player.marketValue}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <span className="text-[8px] font-black text-slate-600 uppercase block mb-1">Star Power</span>
                      <div className="flex gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className={`h-1.5 flex-1 rounded-full ${i < player.starPower ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-white/10'}`} />
                        ))}
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <span className="text-[8px] font-black text-slate-600 uppercase block mb-1">Tactical Role</span>
                      <span className="text-sm font-black text-white uppercase">{player.position}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <span className="text-[8px] font-black text-slate-600 uppercase block mb-1">Age Profile</span>
                      <span className="text-sm font-black text-white uppercase">{player.age} Years</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                     <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Live Analysis Active</span>
                   </div>
                   <button className="text-[10px] font-black text-amber-500 uppercase hover:text-white transition-colors">
                     Back to Photo
                   </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </>
  );
};

export default PlayerCard;
