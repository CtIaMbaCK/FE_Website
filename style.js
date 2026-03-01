const fs = require('fs');

let content = fs.readFileSync('src/app/(homepage)/register/page.tsx', 'utf8');

// Labels
content = content.replace(/className="text-gray-900 text-sm"/g, 'className="text-slate-800 font-semibold text-sm"');
content = content.replace(/className="text-sm font-medium text-gray-900"/g, 'className="text-base font-bold text-slate-800"');
content = content.replace(/className="text-sm font-medium text-gray-900 mb-3"/g, 'className="text-base font-bold text-slate-800 mb-3"');

// Inputs
content = content.replace(/className="mt-1\.5 h-10"/g, 'className="mt-2 h-12 bg-white/60 border-slate-200 focus-visible:bg-white focus-visible:border-[#008080]/50 focus-visible:ring-[#008080]/20 rounded-xl transition-all"');

// Textareas
content = content.replace(/className="mt-1\.5 text-sm resize-none"/g, 'className="mt-2 bg-white/60 border-slate-200 focus-visible:bg-white focus-visible:border-[#008080]/50 focus-visible:ring-[#008080]/20 rounded-xl transition-all text-sm resize-none"');

// Selects
content = content.replace(/className="mt-1\.5 w-full h-10 px-3 border border-gray-300 rounded-lg text-sm"/g, 'className="mt-2 w-full h-12 px-4 bg-white/60 border border-slate-200 focus:bg-white focus:border-[#008080]/50 focus:ring-4 focus:ring-[#008080]/10 rounded-xl transition-all text-sm outline-none"');

// Dividers
content = content.replace(/className="border-t border-gray-200 pt-4/g, 'className="border-t border-slate-200/60 pt-6 mt-6');

// Upload blocks
content = content.replace(/border-gray-300 rounded-lg cursor-pointer hover:border-teal-500 transition-colors/g, 'border-slate-300 bg-white/50 rounded-2xl cursor-pointer hover:border-[#008080]/50 hover:bg-white/80 transition-all group');
content = content.replace(/className="w-8 h-8 text-gray-400 mb-2"/g, 'className="w-10 h-10 text-slate-400 mb-3 group-hover:text-[#008080] group-hover:scale-110 transition-all duration-300"');
content = content.replace(/className="text-xs text-gray-500"/g, 'className="text-white bg-slate-400 font-semibold rounded px-2 py-0.5 mt-1"');
content = content.replace(/className="text-xs text-gray-400"/g, 'className="text-xs text-slate-500 mt-2 font-medium"');
content = content.replace(/object-cover rounded-lg border-2 border-gray-300/g, 'object-cover rounded-2xl border-2 border-white/60 shadow-md');

// Tags/Chips (Skills/Districts)
content = content.replace(/bg-teal-600 text-white border-teal-600/g, 'bg-gradient-to-r from-[#008080] to-[#00A79D] text-white border-transparent shadow-md transform scale-105');
content = content.replace(/bg-white text-gray-700 border-gray-300 hover:border-teal-500/g, 'bg-white/60 text-slate-600 border-slate-200 hover:border-[#008080]/50 hover:bg-white hover:text-[#008080] hover:shadow-sm');

// Remove border of district container
content = content.replace(/border border-gray-200 rounded-lg bg-gray-50/g, 'border border-slate-200/60 rounded-2xl bg-white/40 shadow-inner');

fs.writeFileSync('src/app/(homepage)/register/page.tsx', content);
console.log('Finished updating style classes.');
